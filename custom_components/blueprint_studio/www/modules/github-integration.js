/** GITHUB-INTEGRATION.JS | Purpose: * Handles GitHub-specific operations: OAuth authentication, repository creation, */

import { state, elements, gitState } from './state.js';
import { fetchWithAuth } from './api.js';
import { API_BASE } from './constants.js';
import { showToast, showGlobalLoading, hideGlobalLoading, resetModalToDefault, showConfirmDialog, showModal } from './ui.js';
import { buildFileTree } from './file-tree.js';
import { formatBytes, isTextFile } from './utils.js';
import { t } from './translations.js';
import {
  gitStatus,
  gitSetCredentials,
  gitInit,
  gitGetRemotes,
  gitCleanLocks
} from './git-operations.js';

// ============================================
// Module-level Variables
// ============================================

// GitHub OAuth device flow polling timer
let activePollTimer = null;

// ============================================
// GitHub Remote Operations
// ============================================

export async function gitAddRemote(name, url) {
  try {
    showToast(t("toast.git_push_started"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_add_remote", name, url }),
    });

    if (data.success) {
      showToast(data.message, "success");
      return true;
    }
  } catch (error) {
    showToast(t("toast.gitea_error", { error: error.message }), "error");
    return false;
  }
}

// ============================================
// GitHub Repository Creation
// ============================================

export async function githubCreateRepo(repoName, description, isPrivate) {
  try {
    showToast(t("toast.github_creating_repo"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "github_create_repo",
        repo_name: repoName,
        description: description,
        is_private: isPrivate
      }),
    });

    if (data.success) {
      showToast(data.message, "success");

      // Show link to new repo
      if (data.html_url) {
        setTimeout(() => {
          showToast(
            t("gitea.view_repo", { url: data.html_url }),
            "success",
            10000  // Show for 10 seconds
          );
        }, 2000);
      }

      return data;
    } else {
      showToast(t("toast.gitea_create_repo_failed", { error: data.message || "Unknown error" }), "error");
      return null;
    }
  } catch (error) {
    showToast(t("toast.gitea_create_repo_failed", { error: error.message }), "error");
    return null;
  }
}

// ============================================
// Branch Management
// ============================================

export async function repairBranchMismatch() {
  const confirmed = await showConfirmDialog({
    title: "Repair Branch Mismatch",
    message: `
      <p>This will perform the following actions:</p>
      <ul style="margin: 10px 0 10px 20px; font-size: 13px;">
        <li>Rename your local <b>master</b> branch to <b>main</b></li>
        <li>Synchronize histories with GitHub</li>
        <li>Set up <b>main</b> as your primary tracking branch</li>
      </ul>
      <p>This is recommended for better compatibility with GitHub.</p>
    `,
    confirmText: "Repair Now",
    cancelText: "Not Now"
  });

  if (!confirmed) return;

  try {
    showGlobalLoading("Repairing branch structure...");

    // 1. Abort any stuck rebase first
    await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_abort" }),
    });

    // 2. Rename branch
    await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),
    });

    // 3. Merge unrelated histories from origin/main
    await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_merge_unrelated", remote: "origin", branch: "main" }),
    });

    hideGlobalLoading();
    showToast(t("toast.github_repair_success"), "success");
    await gitStatus(true);
  } catch (e) {
    hideGlobalLoading();
    showToast(t("toast.github_repair_failed", { error: e.message }), "error");
  }
}

// ============================================
// Connection Testing
// ============================================

export async function gitTestConnection() {
  try {
    showToast(t("toast.git_pull_started"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_test_connection" }),
    });

    if (data.success) {
      showToast(t("toast.git_conn_success"), "success");
      return true;
    } else {
      showToast(t("toast.git_conn_failed") + ": " + (data.error || "Unknown error"), "error");
      return false;
    }
  } catch (error) {
    showToast(t("toast.git_conn_failed") + ": " + error.message, "error");
    return false;
  }
}

// ============================================
// Credential Management
// ============================================

export async function gitClearCredentials() {
  try {
    showToast(t("toast.git_signout"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_clear_credentials" }),
    });

    if (data.success) {
      showToast(t("toast.git_signout"), "success");
      return true;
    } else {
      showToast(t("toast.gitea_error", { error: data.error || "Unknown error" }), "error");
      return false;
    }
  } catch (error) {
    showToast(t("toast.gitea_error", { error: error.message }), "error");
    return false;
  }
}

// ============================================
// GitHub OAuth Device Flow
// ============================================

export async function githubDeviceFlowStart(clientId) {
  try {
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "github_device_flow_start", client_id: clientId }),
    });

    if (data.success) {
      return {
        success: true,
        deviceCode: data.device_code,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
        expiresIn: data.expires_in,
        interval: data.interval
      };
    }
    return { success: false, error: data.message || "Unknown error" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function githubDeviceFlowPoll(clientId, deviceCode) {
  try {
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "github_device_flow_poll",
        client_id: clientId,
        device_code: deviceCode
      }),
    });

    return data;
  } catch (error) {
    return { success: false, status: "error", message: error.message };
  }
}

export async function showGithubDeviceFlowLogin() {
  return new Promise(async (resolve) => {
    // Ensure any previous polling timer is stopped before starting a new one
    if (activePollTimer) {
      clearInterval(activePollTimer);
      activePollTimer = null;
    }
    // Shared Blueprint Studio OAuth Client ID
    const SHARED_CLIENT_ID = "Ov23liKHRfvPI4p0eN2f";

    const customClientId = localStorage.getItem("githubOAuthClientId") || "";
    const finalClientId = customClientId || SHARED_CLIENT_ID;

    showToast(t("toast.github_login_started"), "success");
    const flowData = await githubDeviceFlowStart(finalClientId);

    if (!flowData.success) {
      showToast(t("toast.gitea_error", { error: flowData.error || "Unknown error" }), "error");
      resolve(false);
      return;
    }

    // Show device code modal
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = t("gitea.auth_title");

    modalBody.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="margin-bottom: 20px;">
          <span class="material-icons" style="font-size: 48px; color: #4caf50;">verified_user</span>
        </div>
        <h3>${t("gitea.auth_title")}</h3>
        <p>${t("auth.step1")}</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <a href="${flowData.verificationUri}" target="_blank" style="color: #2196f3; font-size: 18px; text-decoration: none;">
            ${flowData.verificationUri}
          </a>
        </div>
        <p>${t("auth.step6")}</p>
        <div style="background: #2196f3; color: white; padding: 20px; border-radius: 8px; margin: 15px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
          ${flowData.userCode}
        </div>
        <div id="device-flow-status" style="margin-top: 20px; color: #666;">
          <span class="material-icons" style="animation: spin 1s linear infinite;">sync</span>
          <p>${t("toast.github_waiting")}</p>
        </div>
        <button class="btn-primary" id="btn-check-auth-now" style="width: 100%; padding: 10px; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px;">
            <span class="material-icons">refresh</span>
            ${t("modal.confirm")}
        </button>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "500px";

    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Function to clean up and close
    const closeDeviceFlow = (result) => {
      if (activePollTimer) {
        clearTimeout(activePollTimer);
        activePollTimer = null;
      }
      modalOverlay.classList.remove("visible");
      resetModalToDefault();
      modalOverlay.removeEventListener("click", overlayClickHandler);
      resolve(result);
    };

    // Start polling
    let pollInterval = (flowData.interval || 5) * 1000;
    if (pollInterval < 5000) pollInterval = 5000; // Safety minimum
    const maxPolls = Math.floor(flowData.expiresIn / (pollInterval / 1000)) || 180; // Default ~15 mins
    let pollCount = 0;

    const pollLoop = async () => {
      pollCount++;

      if (pollCount > maxPolls) {
        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
          statusDiv.innerHTML = `
            <span class="material-icons" style="color: #f44336;">error</span>
            <p style="color: #f44336;">Login expired. Please try again.</p>
          `;
        }
        showToast(t("toast.github_login_expired"), "error");
        setTimeout(() => closeDeviceFlow(false), 2000);
        return;
      }

      const result = await githubDeviceFlowPoll(finalClientId, flowData.deviceCode);

      if (result.success && result.status === "authorized") {
        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
          statusDiv.innerHTML = `
            <span class="material-icons" style="color: #4caf50;">check_circle</span>
            <p style="color: #4caf50;">${t("toast.git_conn_success")}</p>
          `;
        }
        showToast(t("toast.git_conn_success"), "success");
        setTimeout(() => closeDeviceFlow(true), 2000);
      } else if (result.status === "expired") {
        showToast(t("toast.github_login_expired"), "error");
        setTimeout(() => closeDeviceFlow(false), 1000);
      } else if (result.status === "denied") {
        showToast(t("toast.github_login_denied"), "error");
        setTimeout(() => closeDeviceFlow(false), 1000);
      } else {
        // Pending or slow_down
        if (result.status === "slow_down") {
          // Increase interval by 5 seconds if asked to slow down
          pollInterval += 5000;
        }
        // Continue polling
        activePollTimer = setTimeout(pollLoop, pollInterval);
      }
    };

    // Start the loop
    activePollTimer = setTimeout(pollLoop, pollInterval);

    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeDeviceFlow(false);
      }
    };

    // Delay adding listener to prevent immediate closing from bubbling events
    setTimeout(() => {
      modalOverlay.addEventListener("click", overlayClickHandler);
    }, 300);

    const btnCheckAuthNow = document.getElementById("btn-check-auth-now");
    if (btnCheckAuthNow) {
      btnCheckAuthNow.addEventListener("click", async () => {
        // Stop auto-poll to prevent race conditions/rate limiting
        if (activePollTimer) {
          clearTimeout(activePollTimer);
          activePollTimer = null;
        }

        btnCheckAuthNow.disabled = true;
        const btnTextSpan = btnCheckAuthNow.querySelector('span:not(.material-icons)');
        if (btnTextSpan) btnTextSpan.textContent = "Checking...";
        const btnIcon = btnCheckAuthNow.querySelector('.material-icons');
        if (btnIcon) btnIcon.classList.add('spinning');

        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
          statusDiv.querySelector('p').textContent = "Checking status...";
        }

        const result = await githubDeviceFlowPoll(finalClientId, flowData.deviceCode);

        if (btnIcon) btnIcon.classList.remove('spinning');

                if (result.success && result.status === "authorized") {
                  const statusDiv = document.getElementById("device-flow-status");
                  if (statusDiv) {
                    statusDiv.innerHTML = `
                      <span class="material-icons" style="color: #4caf50;">check_circle</span>
                      <p style="color: #4caf50;">${t("toast.git_conn_success")}</p>
                    `;
                  }
                  showToast(t("toast.git_conn_success"), "success");
                  setTimeout(() => closeDeviceFlow(true), 2000);
                } else if (result.status === "pending") {
                  if (statusDiv) statusDiv.querySelector('p').textContent = t("toast.github_waiting");
                  showToast(t("toast.github_waiting"), "info", 3000);
                } else if (result.status === "slow_down") {
                  if (statusDiv) statusDiv.querySelector('p').textContent = t("toast.github_slow_down");
                  showToast(t("toast.github_slow_down"), "warning", 3000);
                } else if (result.status === "expired") {
                  showToast(t("toast.github_login_expired"), "error");
                  setTimeout(() => closeDeviceFlow(false), 1000);
                } else if (result.status === "denied") {
                  showToast(t("toast.github_login_denied"), "error");
                  setTimeout(() => closeDeviceFlow(false), 1000);
                } else {
                  showToast(t("toast.gitea_error", { error: result.message || "Unknown error" }), "error");
                }
        btnCheckAuthNow.disabled = false;
        if (btnTextSpan) btnTextSpan.textContent = "Check Now";
      });
    }
  });
}

// ============================================
// Git Exclusions Management
// ============================================

export async function showGitExclusions() {
  return new Promise(async (resolve) => {
    showGlobalLoading("Loading file list...");

    try {
      const items = await fetchWithAuth(`${API_BASE}?action=list_git_files`);

      // Build tree structure
      const tree = buildFileTree(items);

      // Create a map for quick size lookup
      const sizeMap = new Map();
      items.forEach(item => {
        sizeMap.set(item.path, { size: item.size || 0, type: item.type });
      });

      // 2. Fetch current .gitignore content
      let gitignoreContent = "";
      try {
        const response = await fetchWithAuth(`${API_BASE}?action=read_file&path=.gitignore&_t=${Date.now()}`);
        if (response.success) {
          gitignoreContent = response.content;
        }
      } catch (e) {
        // It's okay if .gitignore doesn't exist yet
      }

      hideGlobalLoading();

      // 3. Parse .gitignore to find what's currently ignored
      const ignoredLines = new Set(
        gitignoreContent.split("\n")
          .map(line => line.trim())
          .filter(line => line && !line.startsWith("#"))
      );

      // Default ignores if .gitignore is empty/new
      if (ignoredLines.size === 0) {
        ["__pycache__", ".cloud", ".storage", "deps", ".ha_run.lock"].forEach(item => ignoredLines.add(item));
      }

      // 4. Create Modal Content
      const modalOverlay = document.getElementById("modal-overlay");
      const modal = document.getElementById("modal");
      const modalTitle = document.getElementById("modal-title");
      const modalBody = document.getElementById("modal-body");
      const modalFooter = document.querySelector(".modal-footer");

      modalTitle.textContent = "Manage Git Exclusions";

      // Helper: match a single path segment or full path against a gitignore pattern
      function matchesGlob(pattern, filePath) {
        const fileName = filePath.split("/").pop();
        // *.ext  or  *name  or  prefix*  — single-segment wildcard
        if (pattern.startsWith("*") && !pattern.includes("/")) {
          const suffix = pattern.slice(1); // e.g. ".db"
          return fileName.endsWith(suffix);
        }
        if (pattern.endsWith("*") && !pattern.includes("/")) {
          const prefix = pattern.slice(0, -1);
          return fileName.startsWith(prefix);
        }
        // **/*.ext — matches any depth
        if (pattern.startsWith("**/")) {
          const sub = pattern.slice(3);
          return matchesGlob(sub, filePath);
        }
        return false;
      }

      // Helper to check if a path or any of its parents are ignored
      function isPathIgnored(path) {
        for (const line of ignoredLines) {
          // Exact match (with or without trailing slash)
          const stripped = line.replace(/\/$/, "");
          if (stripped === path || stripped + "/" === path) return true;

          // Glob pattern match
          if (line.includes("*") && matchesGlob(line, path)) return true;

          // Parent directory match
          if (!line.includes("*")) {
            if (path.startsWith(stripped + "/")) return true;
          }
        }
        return false;
      }

      // Helper to render tree recursively
      function renderExclusionTreeHtml(treeNode, depth = 0) {
        let html = "";

        const folders = Object.keys(treeNode)
          .filter(k => !k.startsWith("_"))
          .sort();
        const files = (treeNode._files || []).sort((a, b) => a.name.localeCompare(b.name));

        // Render folders
        folders.forEach(folderName => {
          const folderData = treeNode[folderName];
          const folderPath = folderData._path;

          const isIgnored = isPathIgnored(folderPath);
          const isChecked = !isIgnored;
          const isDisabled = folderPath === ".git";
          const forcedState = folderPath === ".git" ? "" : (isChecked ? "checked" : "");

          const itemSize = sizeMap.get(folderPath)?.size || 0;
          const paddingLeft = 4 + (depth * 20);

          // Note: We put the click handler on the header div
          html += `
            <div class="exclusion-folder-group">
              <div class="exclusion-folder-header" style="display: flex; align-items: center; padding: 8px 12px; padding-left: ${paddingLeft}px; border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary); cursor: pointer;">
                <span class="material-icons exclusion-chevron" style="margin-right: 4px; font-size: 20px; color: var(--text-secondary); transition: transform 0.2s;">chevron_right</span>
                <label style="display: flex; align-items: center; flex: 1; cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; pointer-events: none;">
                  <input type="checkbox" class="exclusion-checkbox" data-path="${folderPath}" data-type="folder" ${forcedState} ${isDisabled ? 'disabled' : ''} style="margin-right: 12px; width: 16px; height: 16px; pointer-events: auto;">
                  <span class="material-icons" style="margin-right: 8px; font-size: 20px; color: var(--icon-folder);">folder</span>
                  <span style="font-size: 14px; flex: 1;">${folderName}</span>
                  <span style="font-size: 12px; color: var(--text-secondary); margin-right: 8px;">${formatBytes(itemSize)}</span>
                  ${isIgnored ? '<span style="font-size: 10px; padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary);">Ignored</span>' : ''}
                </label>
              </div>
              <div class="exclusion-children" style="display: none;">
                ${renderExclusionTreeHtml(folderData, depth + 1)}
              </div>
            </div>
          `;
        });

        // Render files
        files.forEach(file => {
          const isIgnored = isPathIgnored(file.path);
          const isChecked = !isIgnored;
          const isDisabled = file.path === ".gitignore";
          const forcedState = isDisabled ? "checked" : (isChecked ? "checked" : "");

          const itemSize = sizeMap.get(file.path)?.size || 0;
          const isLarge = itemSize > 100 * 1024 * 1024;
          const paddingLeft = 4 + (depth * 20) + 24;

          html += `
            <label style="display: flex; align-items: center; padding: 8px 12px; padding-left: ${paddingLeft}px; border-bottom: 1px solid var(--border-color); cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; background: var(--bg-tertiary);">
              <input type="checkbox" class="exclusion-checkbox" data-path="${file.path}" data-type="file" data-size="${itemSize}" ${forcedState} ${isDisabled ? 'disabled' : ''} style="margin-right: 12px; width: 16px; height: 16px;">
              <span class="material-icons" style="margin-right: 8px; font-size: 20px; color: var(--text-secondary);">insert_drive_file</span>
              <span style="font-size: 14px; flex: 1; ${isLarge ? 'color: var(--error-color); font-weight: bold;' : ''}">${file.name}</span>
              <span style="font-size: 12px; color: ${isLarge ? 'var(--error-color)' : 'var(--text-secondary)'}; margin-right: 8px;">${formatBytes(itemSize)}</span>
              ${isIgnored ? '<span style="font-size: 10px; padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary);">Ignored</span>' : ''}
            </label>
          `;
        });

        return html;
      }

      // Clear body
      modalBody.innerHTML = '';

      // Info Header
      const infoHeader = document.createElement('div');
      infoHeader.innerHTML = `
        <div class="git-settings-info" style="margin-bottom: 16px; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span class="material-icons">info</span>
                <div>
                    <div style="font-weight: 500;">Check items to PUSH to GitHub</div>
                    <div style="font-size: 12px;">Unchecked items will be added to .gitignore</div>
                </div>
            </div>
            <label style="display: flex; align-items: center; cursor: pointer; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px;">
                <input type="checkbox" id="git-exclude-select-all" style="margin-right: 6px;">
                <span style="font-size: 12px; font-weight: 500;">Select All</span>
            </label>
          </div>
          <div id="git-total-size" style="margin-top: 12px; padding: 8px; background: var(--bg-primary); border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-weight: 500;">
            <span>Total Selected Size:</span>
            <span id="git-total-size-value">Calculating...</span>
          </div>
        </div>
      `;
      modalBody.appendChild(infoHeader);

      // Handle Select All
      infoHeader.addEventListener("change", (e) => {
        if (e.target.id === "git-exclude-select-all") {
          const isChecked = e.target.checked;
          const allCheckboxes = container.querySelectorAll(".exclusion-checkbox");
          allCheckboxes.forEach(cb => {
            if (!cb.disabled) {
              cb.checked = isChecked;
            }
          });
          updateTotalSize();
        }
      });

      // List Container
      const container = document.createElement('div');
      container.className = 'git-exclusion-list';
      container.style.maxHeight = '50vh';
      container.style.overflowY = 'auto';
      container.style.border = '1px solid var(--border-color)';
      container.style.borderRadius = '4px';

      container.innerHTML = renderExclusionTreeHtml(tree);
      modalBody.appendChild(container);

      // Reset modal buttons
      modalFooter.style.display = "flex";
      const btnCancel = document.getElementById("modal-cancel");
      const btnConfirm = document.getElementById("modal-confirm");

      btnConfirm.textContent = "Save Changes";
      btnConfirm.className = "modal-btn primary";

      modalOverlay.classList.add("visible");
      // make modal wider
      modal.style.maxWidth = "600px";

      // Function to recalculate total size
      const updateTotalSize = () => {
        let totalSize = 0;
        let hasLargeFile = false;
        const checkboxes = modalBody.querySelectorAll(".exclusion-checkbox[data-type='file']");

        checkboxes.forEach(cb => {
          if (cb.checked) {
            const size = parseInt(cb.dataset.size || 0);
            totalSize += size;
            if (size > 100 * 1024 * 1024) hasLargeFile = true;
          }
        });

        const sizeDisplay = document.getElementById("git-total-size-value");
        const sizeContainer = document.getElementById("git-total-size");

        if (sizeDisplay && sizeContainer) {
          sizeDisplay.textContent = formatBytes(totalSize);

          // Warn if total > 100MB (soft limit warning) or single file > 100MB (hard limit)
          if (hasLargeFile) {
            sizeContainer.style.color = "var(--error-color)";
            sizeDisplay.textContent += " (⚠️ File > 100MB detected!)";
          } else if (totalSize > 100 * 1024 * 1024) {
            sizeContainer.style.color = "var(--warning-color)";
            sizeDisplay.textContent += " (⚠️ Large push)";
          } else {
            sizeContainer.style.color = "var(--success-color)";
          }
        }
      };

      // Initial calculation
      updateTotalSize();

      // Handle events (Toggle collapse + Cascading Checkboxes)
      container.addEventListener("click", (e) => {
        // Handle Collapse/Expand (Header click)
        const header = e.target.closest(".exclusion-folder-header");
        if (header) {
          // Don't toggle if clicking the checkbox directly
          if (e.target.classList.contains("exclusion-checkbox")) return;

          const group = header.parentElement; // .exclusion-folder-group
          const children = group.querySelector(".exclusion-children");
          const chevron = header.querySelector(".exclusion-chevron");

          if (children) {
            const isHidden = children.style.display === "none";
            children.style.display = isHidden ? "block" : "none";
            if (chevron) chevron.style.transform = isHidden ? "rotate(90deg)" : "";
          }
          return;
        }
      });

      container.addEventListener("change", (e) => {
        // Handle Cascading Checkboxes
        if (e.target.classList.contains("exclusion-checkbox")) {
          const isChecked = e.target.checked;
          const target = e.target;

          // 1. Cascade DOWN (Parent -> Children)
          if (target.dataset.type === "folder") {
            const group = target.closest(".exclusion-folder-group");
            if (group) {
              const childrenContainer = group.querySelector(".exclusion-children");
              if (childrenContainer) {
                const childCheckboxes = childrenContainer.querySelectorAll(".exclusion-checkbox");
                childCheckboxes.forEach(cb => {
                  if (!cb.disabled) {
                    cb.checked = isChecked;
                  }
                });
              }
            }
          }

          // 2. Bubble UP (Child -> Parent)
          let current = target;
          while (current) {
            // Find immediate parent group container
            const childrenContainer = current.closest(".exclusion-children");
            if (!childrenContainer) break;

            const parentGroup = childrenContainer.parentElement; // .exclusion-folder-group
            if (!parentGroup) break;

            const parentHeader = parentGroup.querySelector(".exclusion-folder-header");
            const parentCheckbox = parentHeader ? parentHeader.querySelector(".exclusion-checkbox") : null;

            if (parentCheckbox && !parentCheckbox.disabled) {
              // Check if ANY descendant is checked
              const allDescendants = childrenContainer.querySelectorAll(".exclusion-checkbox");
              let anyChecked = false;
              for (let i = 0; i < allDescendants.length; i++) {
                if (allDescendants[i].checked) {
                  anyChecked = true;
                  break;
                }
              }
              parentCheckbox.checked = anyChecked;
            }

            current = parentGroup; // Continue up
          }

          updateTotalSize();
        }
      });

      // Handle Save
      const saveHandler = async () => {
        const checkboxes = modalBody.querySelectorAll(".exclusion-checkbox");
        const rawIgnoreList = new Set();
        const itemsToInclude = new Set();

        checkboxes.forEach(cb => {
          if (!cb.disabled) {
            if (!cb.checked) {
              rawIgnoreList.add(cb.dataset.path);
            } else {
              itemsToInclude.add(cb.dataset.path);
            }
          }
        });

        // Optimization: Filter out redundant paths from ignore list
        // If a parent folder is ignored, we don't need to list its children
        const sortedIgnoreList = Array.from(rawIgnoreList).sort();
        const optimizedIgnoreList = [];

        // Collect existing glob patterns so we don't add redundant explicit paths
        const existingGlobs = Array.from(ignoredLines).filter(l => l.includes("*"));

        for (const path of sortedIgnoreList) {
          let covered = false;
          // Already covered by a parent path being ignored
          for (const existing of optimizedIgnoreList) {
            if (path.startsWith(existing + "/") || path === existing) {
              covered = true;
              break;
            }
          }
          // Already covered by an existing glob pattern in .gitignore
          if (!covered) {
            for (const glob of existingGlobs) {
              if (matchesGlob(glob, path)) {
                covered = true;
                break;
              }
            }
          }
          if (!covered) {
            optimizedIgnoreList.push(path);
          }
        }

        // Update .gitignore logic
        let newContentLines = gitignoreContent.split("\n").filter(line => {
          const trimmed = line.trim();
          // Keep comments and empty lines
          if (!trimmed || trimmed.startsWith("#")) return true;

          // Always preserve glob/wildcard patterns
          if (trimmed.includes("*")) return true;

          // Clean the line from trailing slashes for comparison
          const path = trimmed.replace(/\/$/, "");

          // 1. Remove if specifically included now (and not a glob)
          if (itemsToInclude.has(path)) return false;

          // 2. Remove if already covered by an optimized ignore path
          for (const optimized of optimizedIgnoreList) {
            if (path.startsWith(optimized + "/") || path === optimized) {
              return false;
            }
          }

          return true;
        });

        // Append new optimized exclusions
        if (optimizedIgnoreList.length > 0) {
          // Find if our section already exists
          const sectionHeader = "# Exclusions via Blueprint Studio";
          if (!newContentLines.includes(sectionHeader)) {
            newContentLines.push("");
            newContentLines.push(sectionHeader);
          }

          optimizedIgnoreList.forEach(path => {
            // Determine if it's a folder to add trailing slash
            const isFolder = items.find(item => item.path === path && item.type === "folder");
            const entry = isFolder ? `${path}/` : path;

            if (!newContentLines.includes(entry)) {
              newContentLines.push(entry);
            }
          });
        }

        const newContent = newContentLines.join("\n").trim() + "\n";

        showGlobalLoading("Saving .gitignore...");
        const response = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "write_file", path: ".gitignore", content: newContent }),
        });

        if (response.success) {
          if (optimizedIgnoreList.length > 0) {
            showGlobalLoading("Updating git index...");
            try {
              await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "git_stop_tracking",
                  files: optimizedIgnoreList
                }),
              });
            } catch (e) {
              console.error("Failed to stop tracking files:", e);
            }
          }

          hideGlobalLoading();
          modalOverlay.classList.remove("visible");
          await gitStatus();
          cleanup(true);
        } else {
          hideGlobalLoading();
        }
      };

      const cancelHandler = () => {
        modalOverlay.classList.remove("visible");
        cleanup(false);
      };

      const cleanup = (result) => {
        btnConfirm.removeEventListener("click", saveHandler);
        btnCancel.removeEventListener("click", cancelHandler);
        container.removeEventListener("change", updateTotalSize);
        resetModalToDefault();
        modal.style.maxWidth = "";
        resolve(result);
      };

      btnConfirm.addEventListener("click", saveHandler);
      btnCancel.addEventListener("click", cancelHandler);

    } catch (error) {
      hideGlobalLoading();
      showToast(t("toast.load_file_list_failed", { error: error.message }), "error");
      resolve(false);
    }
  });
}

// ============================================
// Git Settings Dialog
// ============================================

export async function showGitSettings() {
  // Get current remotes
  const remotes = await gitGetRemotes();

  // Get saved credentials
  const credentialsData = await fetchWithAuth(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "git_get_credentials" }),
  });

  const savedUsername = credentialsData.has_credentials ? credentialsData.username : "";
  const hasCredentials = credentialsData.has_credentials;

  // Check if OAuth Client ID is saved
  const savedClientId = localStorage.getItem("githubOAuthClientId") || "";
  const hasOAuthSetup = savedClientId.length > 0;

  // Create modal content
  const modalOverlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalFooter = document.querySelector(".modal-footer");

  modalTitle.textContent = "Git " + t("toolbar.settings");

  let remotesHtml = "";
  if (Object.keys(remotes).length > 0) {
    remotesHtml = `<div class="git-settings-section"><div class="git-settings-label">Current Remotes</div>`;
    for (const [name, url] of Object.entries(remotes)) {
      remotesHtml += `
        <div class="git-remote-item">
          <div style="flex: 1; min-width: 0;">
              <span class="git-remote-name">${name}</span>
              <span class="git-remote-url">${url}</span>
          </div>
          <button class="btn-icon-only remove-remote-btn" data-remote-name="${name}" title="Remove Remote" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px;">
              <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
      `;
    }
    remotesHtml += '</div>';
  }

  let credentialsStatusHtml = "";
  if (hasCredentials) {
    credentialsStatusHtml = `
      <div class="git-settings-info" style="color: #4caf50; margin-bottom: 12px;">
        <span class="material-icons">check_circle</span>
        <span>You are logged in as <strong>${savedUsername}</strong></span>
      </div>
      <button id="btn-github-signout" style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.15s;">
        <span class="material-icons">logout</span>
        <span>${t("toast.git_signout")}</span>
      </button>
    `;
  }

  modalBody.innerHTML = `
    <div class="git-settings-content">
      ${remotesHtml}

      ${hasCredentials ? `
      <div class="git-settings-section" style="background: var(--primary-background-color); padding: 16px; border-radius: 8px; border: 2px dashed #2196f3;">
        <div class="git-settings-label" style="color: #1976d2; font-weight: 600;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 4px;">add_circle</span>
          Quick Start: Create New GitHub Repository
        </div>
        <div class="git-settings-info" style="margin-bottom: 12px; color: #f0f7ff;">
          Create a new repository on GitHub and automatically connect it to Blueprint Studio.
        </div>
        <button class="btn-primary" id="btn-create-github-repo" style="width: 100%; padding: 12px; font-size: 15px;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">rocket_launch</span>
          Create New GitHub Repository
        </button>
      </div>

      <div style="display: flex; align-items: center; text-align: center; margin: 20px 0; color: #666;">
        <div style="flex-grow: 1; border-bottom: 1px solid #ddd;"></div>
        <span style="flex-shrink: 0; padding: 0 10px; background: var(--primary-background-color);">OR Connect Existing Repo</span>
        <div style="flex-grow: 1; border-bottom: 1px solid #ddd;"></div>
      </div>
      ` : ''}

      <div class="git-settings-section">
        <div class="git-settings-label">Repository URL</div>
        <input type="text" class="git-settings-input" id="git-repo-url"
               placeholder="https://github.com/username/repo.git"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <div class="git-settings-buttons">
          <button class="btn-secondary" id="btn-git-init-modal">Init Repo</button>
          <button class="btn-primary" id="btn-save-git-remote">Save Remote</button>
        </div>
      </div>

      <div class="git-settings-section">
        <div class="git-settings-label">
          <svg height="20" width="20" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 8px; fill: currentColor;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          GitHub Authentication
        </div>

        ${credentialsStatusHtml}

        ${!hasCredentials ? `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <div style="color: white; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <span class="material-icons">verified_user</span>
              Recommended: OAuth Login
            </div>
            <div style="color: rgba(255,255,255,0.9); font-size: 13px; margin-bottom: 12px;">
              Secure authentication via GitHub OAuth - no tokens to manage!
            </div>
            <button class="btn-primary" id="btn-github-device-login" style="width: 100%; padding: 12px; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; background: white; color: #667eea; font-weight: 600;">
              <svg height="20" width="20" viewBox="0 0 16 16" style="fill: #667eea;">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span>Login with GitHub</span>
            </button>
          </div>

          <div style="text-align: center; margin: 24px 0; position: relative;">
            <div style="border-top: 1px solid var(--border-color);"></div>
            <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--modal-bg); padding: 0 12px; font-size: 12px; color: var(--text-secondary); font-weight: 600;">OR USE PERSONAL ACCESS TOKEN</span>
          </div>
        ` : ''}

        ${hasCredentials ? `
          <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
            <div class="git-settings-label">Update Credentials</div>
          </div>
        ` : ''}

        <input type="text" class="git-settings-input" id="git-username"
               placeholder="GitHub username"
               value="${savedUsername}"
               autocomplete="username" autocorrect="off" autocapitalize="off" spellcheck="false"
               style="margin-bottom: 8px;" />
        <input type="password" class="git-settings-input" id="git-token"
               placeholder="${hasCredentials ? 'Enter new token to update (leave blank to keep current)' : 'Personal Access Token'}"
               autocomplete="off"
               style="margin-bottom: 12px;" />

        <label for="git-remember-me" style="display: flex; align-items: center; padding: 12px; background: var(--bg-tertiary); border-radius: 6px; cursor: pointer; margin-bottom: 12px; transition: background 0.15s;">
          <input type="checkbox" id="git-remember-me" ${hasCredentials ? 'checked' : ''} style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-color);" />
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Remember me</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Keep me logged in after restart</div>
          </div>
        </label>

        <div class="git-settings-info" style="margin-bottom: 16px;">
          <span class="material-icons">info</span>
          <div>
            <div style="font-weight: 500; margin-bottom: 4px;">Create a Personal Access Token:</div>
            <a href="https://github.com/settings/tokens/new" target="_blank" style="color: var(--accent-color); text-decoration: none;">github.com/settings/tokens/new ↗</a>
            <div style="margin-top: 4px; font-size: 12px;">Required scope: <code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 3px;">repo</code></div>
          </div>
        </div>

        <div class="git-settings-buttons">
          <button class="btn-secondary" id="btn-test-git-connection">Test Connection</button>
          <button class="btn-primary" id="btn-save-git-credentials">${hasCredentials ? 'Update' : 'Save'} Credentials</button>
        </div>
      </div>

      <div class="git-settings-section">
        <div class="git-settings-label">Troubleshooting</div>
        <div class="git-settings-info">
          <span class="material-icons">build</span>
          <span>If Git operations fail with "index.lock" errors, click below to clean lock files.</span>
        </div>
        <button class="btn-secondary" id="btn-clean-git-locks" style="width: 100%;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">delete_sweep</span>
          Clean Git Lock Files
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add("visible");

  // Set wider modal for Git Settings (responsive on mobile via CSS)
  modal.style.maxWidth = "650px";

  // Hide default modal buttons
  if (modalFooter) {
    modalFooter.style.display = "none";
  }

  // Function to clean up and close the Git Settings modal
  const closeGitSettings = () => {
    modalOverlay.classList.remove("visible");

    // Reset modal to default state (don't try to restore saved state)
    resetModalToDefault();

    // Remove this specific overlay click handler
    modalOverlay.removeEventListener("click", overlayClickHandler);
  };

  // Overlay click handler (defined separately so we can remove it)
  const overlayClickHandler = (e) => {
    if (e.target === modalOverlay) {
      closeGitSettings();
    }
  };

  // Attach overlay click handler
  modalOverlay.addEventListener("click", overlayClickHandler);

  // Attach event handlers for Git Settings modal buttons (use once to prevent duplicates)
  const btnGitInitModal = document.getElementById("btn-git-init-modal");
  const btnSaveGitRemote = document.getElementById("btn-save-git-remote");
  const btnCreateGithubRepo = document.getElementById("btn-create-github-repo");
  const btnGithubDeviceLogin = document.getElementById("btn-github-device-login");
  const btnGithubSignout = document.getElementById("btn-github-signout");
  const btnTestGitConnection = document.getElementById("btn-test-git-connection");
  const btnSaveGitCredentials = document.getElementById("btn-save-git-credentials");
  const btnCleanGitLocks = document.getElementById("btn-clean-git-locks");

  if (btnGitInitModal) {
    btnGitInitModal.addEventListener("click", gitInit, { once: true });
  }
  if (btnSaveGitRemote) {
    btnSaveGitRemote.addEventListener("click", async () => {
      await saveGitRemote();
      closeGitSettings();
    }, { once: true });
  }
  if (btnGithubDeviceLogin) {
    btnGithubDeviceLogin.addEventListener("click", async () => {
      closeGitSettings();  // Close Git Settings first
      await showGithubDeviceFlowLogin();
    }, { once: true });
  }
  if (btnGithubSignout) {
    btnGithubSignout.addEventListener("click", async () => {
      const confirmed = await showConfirmDialog({
        title: "Sign Out from GitHub",
        message: "Are you sure you want to sign out?<br><br>Your saved credentials will be removed and you'll need to login again to use GitHub features.",
        confirmText: "Sign Out",
        cancelText: "Cancel",
        isDanger: true
      });

      if (confirmed) {
        await gitClearCredentials();
        closeGitSettings();
        // Reopen settings to show updated state
        setTimeout(() => showGitSettings(), 300);
      }
    }, { once: true });
  }
  if (btnTestGitConnection) {
    btnTestGitConnection.addEventListener("click", testGitConnection, { once: true });
  }
  if (btnSaveGitCredentials) {
    btnSaveGitCredentials.addEventListener("click", async () => {
      await saveGitCredentials();
      closeGitSettings();
    }, { once: true });
  }
  if (btnCleanGitLocks) {
    btnCleanGitLocks.addEventListener("click", async () => {
      showToast(t("toast.cleaning_git_lock_files"), "info");
      const success = await gitCleanLocks();
      if (success) {
        showToast(t("toast.git_lock_files_cleaned_success"), "success");
      } else {
        showToast(t("toast.no_lock_files_found_or_failed_"), "warning");
      }
    }, { once: true });
  }
  if (btnCreateGithubRepo) {
    btnCreateGithubRepo.addEventListener("click", async () => {
      await showCreateGithubRepoDialog();
    }, { once: true });
  }

  // Attach event handlers for Remove Remote buttons
  const removeRemoteBtns = modalBody.querySelectorAll('.remove-remote-btn');
  removeRemoteBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const remoteName = e.currentTarget.dataset.remoteName;
      const confirmed = await showConfirmDialog({
        title: "Remove Remote",
        message: `Are you sure you want to remove the remote '${remoteName}'?`,
        confirmText: "Remove",
        cancelText: "Cancel",
        isDanger: true
      });

      if (confirmed) {
        try {
          const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_remove_remote", name: remoteName }),
          });

          if (data.success) {
            showToast(data.message, "success");
            // Refresh settings modal
            setTimeout(() => showGitSettings(), 300);
          } else {
            showToast(t("toast.remove_remote_failed", { error: data.message }), "error");
          }
        } catch (error) {
          showToast(t("toast.remove_remote_error", { error: error.message }), "error");
        }
      }
    });
  });

  // Mobile optimization: prevent iOS zoom on input focus
  if (state.isMobile && state.isMobile()) {
    const inputs = modalBody.querySelectorAll('.git-settings-input');
    inputs.forEach(input => {
      // Ensure font-size is 16px on mobile to prevent zoom
      input.style.fontSize = '16px';
    });
  }
}

// ============================================
// Create GitHub Repository Dialog
// ============================================

export async function showCreateGithubRepoDialog() {
  return new Promise(async (resolve) => {
    // Check if logged in
    const credentialsData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_get_credentials" }),
    });

    if (!credentialsData.has_credentials) {
      showToast(t("toast.please_login_with_github_first"), "error");
      resolve(false);
      return;
    }

    // Create modal content
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = "GitHub " + t("toolbar.new_file");

    modalBody.innerHTML = `
      <div class="git-settings-content">
        <div class="git-settings-section">
          <div class="git-settings-label">Repository Name *</div>
          <input type="text" class="git-settings-input" id="new-repo-name"
                 placeholder="home-assistant-config"
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="git-settings-info" style="font-size: 12px; margin-top: 4px;">
            Will be created as: ${credentialsData.username}/<span id="repo-name-preview">repository-name</span>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Description (Optional)</div>
          <input type="text" class="git-settings-input" id="new-repo-description"
                 placeholder="My Home Assistant configuration"
                 autocomplete="off" />
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Visibility</div>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px;">
            <input type="radio" name="repo-visibility" value="private" checked style="margin-right: 8px;">
            <div>
              <div style="font-weight: 500;">Private (Recommended)</div>
              <div style="font-size: 12px; color: #666;">Only you can see this repository</div>
            </div>
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px;">
            <input type="radio" name="repo-visibility" value="public" style="margin-right: 8px;">
            <div>
              <div style="font-weight: 500;">Public</div>
              <div style="font-size: 12px; color: #666;">Anyone can see this repository</div>
            </div>
          </label>
        </div>

        <div class="git-settings-buttons">
          <button class="btn-secondary" id="btn-cancel-create-repo">${t("modal.cancel_button")}</button>
          <button class="btn-primary" id="btn-confirm-create-repo">
            <span class="material-icons" style="vertical-align: middle; margin-right: 4px; font-size: 18px;">add</span>
            ${t("modal.confirm_button")}
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "500px";

    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Cleanup function
    const closeDialog = (result) => {
      modalOverlay.classList.remove("visible");
      resetModalToDefault();
      modalOverlay.removeEventListener("click", overlayClickHandler);
      resolve(result);
    };

    // Overlay click handler
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeDialog(false);
      }
    };
    modalOverlay.addEventListener("click", overlayClickHandler);

    // Update preview as user types
    const repoNameInput = document.getElementById("new-repo-name");
    const repoNamePreview = document.getElementById("repo-name-preview");
    if (repoNameInput && repoNamePreview) {
      repoNameInput.addEventListener("input", () => {
        repoNamePreview.textContent = repoNameInput.value || "repository-name";
      });
    }

    // Cancel button
    document.getElementById("btn-cancel-create-repo").addEventListener("click", () => {
      closeDialog(false);
    }, { once: true });

    // Create button
    document.getElementById("btn-confirm-create-repo").addEventListener("click", async () => {
      const repoName = repoNameInput.value.trim();
      const description = document.getElementById("new-repo-description").value.trim();
      const isPrivate = document.querySelector('input[name="repo-visibility"]:checked').value === "private";

      if (!repoName) {
        showToast(t("toast.repository_name_is_required"), "error");
        return;
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(repoName)) {
        showToast(t("toast.repository_name_can_only_conta"), "error");
        return;
      }

      closeDialog(true);

      showToast(t("toast.creating_repository"), "info");
      await githubCreateRepo(repoName, description, isPrivate);
      await gitStatus();

    }, { once: true });
  });
}

// ============================================
// UI Helper Functions (called from showGitSettings)
// ============================================

export async function saveGitRemote() {
  const url = document.getElementById("git-repo-url")?.value;
  if (!url) {
    showToast(t("toast.please_enter_a_repository_url"), "error");
    return;
  }

  const success = await gitAddRemote("origin", url);
  if (success) {
    // Refresh settings modal to show updated remotes
    setTimeout(() => showGitSettings(), 500);
  }
}

export async function saveGitCredentials() {
  const username = document.getElementById("git-username")?.value;
  const token = document.getElementById("git-token")?.value;
  const rememberMe = document.getElementById("git-remember-me")?.checked ?? true;

  if (!username || !token) {
    showToast(t("toast.please_enter_both_username_and"), "error");
    return;
  }

  await gitSetCredentials(username, token, rememberMe);
}

export async function testGitConnection() {
  await gitTestConnection();
}
