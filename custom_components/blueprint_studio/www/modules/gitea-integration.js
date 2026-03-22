/** GITEA-INTEGRATION.JS | Purpose: * Handles Gitea self-hosted Git service operations: repository creation, */

import { state, elements, giteaState } from './state.js';
import { fetchWithAuth } from './api.js';
import { eventBus } from './event-bus.js';
import { API_BASE } from './constants.js';
import { showToast, showGlobalLoading, hideGlobalLoading, resetModalToDefault, showConfirmDialog, showModal } from './ui.js';
import { formatBytes } from './utils.js';
import { t } from './translations.js';
import {
  gitStatus,
  gitStage,
  gitUnstage,
  gitGetRemotes,
  gitCleanLocks,
  gitGetConflictFiles
} from './git-operations.js';
import {
  updateGiteaPanel as updateGiteaPanelUI,
  renderGiteaFiles as renderGiteaFilesImpl,
  toggleGiteaFileSelection as toggleGiteaFileSelectionImpl,
  stageSelectedGiteaFiles as stageSelectedGiteaFilesImpl,
  stageAllGiteaFiles as stageAllGiteaFilesImpl,
  unstageAllGiteaFiles as unstageAllGiteaFilesImpl
} from './gitea-ui.js';
import { setButtonLoading } from './ui.js';

// ============================================
// Gitea Repository Initialization
// ============================================

export async function giteaInit(skipConfirm = false) {
  if (!skipConfirm) {
    const confirmed = await showConfirmDialog({
      title: t("modal.new_folder_title"),
      message: t("modal.new_folder_hint"),
      confirmText: t("modal.confirm_button"),
      cancelText: t("modal.cancel_button")
    });

    if (!confirmed) return false;
  }

  try {
    showToast(t("toast.git_init_success"), "success");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_init" }),
    });

    if (data.success) {
      showToast(t("toast.git_init_success"), "success");
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),
      });
      giteaState.isInitialized = true;
      await giteaStatus();
      return true;
    } else {
      showToast(t("toast.git_init_failed") + ": " + (data.message || "Unknown error"), "error");
    }
  } catch (error) {
    showToast(t("toast.git_init_failed") + ": " + error.message, "error");
  }
  return false;
}

// ============================================
// Gitea Push Operation
// ============================================

export async function giteaPush() {
  try {
    setButtonLoading(elements.btnGiteaPush, true);
    showToast(t("toast.git_push_started"), "info");

    const pushData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_push_only" }),
    });

    if (pushData.success) {
      setButtonLoading(elements.btnGiteaPush, false);
      showToast(t("toast.git_push_success"), "success");
      await giteaStatus();
      return;
    }

    const errorMessage = pushData.message || pushData.error || "Unknown error";

    if (errorMessage.includes("uncommitted changes")) {
      setButtonLoading(elements.btnGiteaPush, false);
      const commitMessage = await showModal({
        title: t("sidebar.commit"),
        placeholder: "Commit message",
        value: "Update configuration via Blueprint Studio",
        hint: errorMessage,
      });

      if (!commitMessage) return;

      setButtonLoading(elements.btnGiteaPush, true);
      showToast(t("toast.git_commit_started"), "info");

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "gitea_push",
          commit_message: commitMessage,
        }),
      });

      setButtonLoading(elements.btnGiteaPush, false);

      if (data.success) {
        showToast(t("toast.git_push_success"), "success");
        await giteaStatus();
      } else {
        showToast(t("toast.gitea_push_failed", { error: data.message || data.error }), "error");
      }
    } else if (errorMessage.includes("No commits to push")) {
      setButtonLoading(elements.btnGiteaPush, false);
      showToast(t("toast.gitea_no_commits"), "warning");
    } else {
      setButtonLoading(elements.btnGiteaPush, false);
      showToast(t("toast.gitea_push_failed", { error: errorMessage }), "error");
    }
  } catch (error) {
    setButtonLoading(elements.btnGiteaPush, false);
    showToast(t("toast.gitea_push_failed", { error: error.message }), "error");
  }
}

// ============================================
// Gitea Pull Operation
// ============================================

export async function giteaPull() {
  const confirmed = await showConfirmDialog({
    title: t("sidebar.gitea_changes"),
    message: t("gitea.pull_confirm"),
    confirmText: t("toolbar.upload"),
    cancelText: t("modal.cancel_button")
  });

  if (!confirmed) return;

  try {
    setButtonLoading(elements.btnGiteaPull, true);
    showToast(t("toast.git_pull_started"), "info");

    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_pull" }),
    });

    setButtonLoading(elements.btnGiteaPull, false);

    if (data.success) {
      showToast(t("toast.git_pull_success"), "success");
      eventBus.emit('ui:reload-files');
      await giteaStatus();
      if (state.activeTab) {
        eventBus.emit('file:open', { path: state.activeTab.path, forceReload: true });
      }
    }
  } catch (error) {
    setButtonLoading(elements.btnGiteaPull, false);
    showToast(t("toast.gitea_pull_failed", { error: error.message }), "error");
  }
}

// ============================================
// Gitea Commit Operation
// ============================================

export async function giteaCommit() {
  const stagedCount = giteaState.files.staged.length;
  if (stagedCount === 0) return;

  let defaultMessage = "Update via Blueprint Studio";
  if (stagedCount === 1) {
    const filename = giteaState.files.staged[0].split("/").pop();
    defaultMessage = `Update ${filename}`;
  } else if (stagedCount > 1) {
    const filename = giteaState.files.staged[0].split("/").pop();
    defaultMessage = `Update ${filename} and ${stagedCount - 1} others`;
  }

  const commitMessage = await showModal({
    title: t("sidebar.commit"),
    placeholder: "Commit message",
    value: defaultMessage,
    hint: `Committing ${stagedCount} staged file(s)`,
  });

  if (!commitMessage) return;

  try {
    showToast(t("toast.git_commit_started"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_commit", commit_message: commitMessage }),
    });

    if (data.success) {
      showToast(t("toast.git_commit_success"), "success");
      await giteaStatus();
    }
  } catch (error) {
    showToast(t("toast.gitea_commit_failed", { error: error.message }), "error");
  }
}

// ============================================
// Gitea Stage/Unstage Operations
// ============================================

export async function giteaStage(files) {
  // Reuse gitStage but refresh gitea status
  await gitStage(files);
  await giteaStatus();
}

export async function giteaUnstage(files) {
  await gitUnstage(files);
  await giteaStatus();
}

// ============================================
// Gitea File Selection
// ============================================

export function toggleGiteaFileSelection(file) {
  return toggleGiteaFileSelectionImpl(file);
}

export async function stageSelectedGiteaFiles() {
  return await stageSelectedGiteaFilesImpl();
}

export async function stageAllGiteaFiles() {
  return await stageAllGiteaFilesImpl();
}

export async function unstageAllGiteaFiles() {
  return await unstageAllGiteaFilesImpl();
}

// ============================================
// Gitea Abort Operation
// ============================================

export async function giteaAbort() {
  const confirmed = await showConfirmDialog({
    title: t("gitea.abort_title"),
    message: t("gitea.abort_message"),
    confirmText: t("gitea.abort_confirm"),
    cancelText: t("modal.cancel_button"),
    isDanger: true
  });

  if (confirmed) {
    try {
      showGlobalLoading(t("modal.confirm") + "...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_abort" }),
      });
      hideGlobalLoading();
      if (data.success) {
        showToast(t("toast.gitea_abort_success"), "success");
        await giteaStatus();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast(t("toast.gitea_abort_failed", { error: error.message }), "error");
    }
  }
}

// ============================================
// Gitea Force Push Operation
// ============================================

export async function giteaForcePush() {
  const confirmed = await showConfirmDialog({
    title: t("gitea.force_push_title"),
    message: t("gitea.force_push_message"),
    confirmText: t("sidebar.commit"),
    cancelText: t("modal.cancel_button"),
    isDanger: true
  });

  if (confirmed) {
    try {
      showGlobalLoading(t("modal.confirm") + "...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_force_push", remote: "gitea" }),
      });
      hideGlobalLoading();
      if (data.success) {
        showToast(t("toast.git_push_success"), "success");
        await giteaStatus();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast(t("toast.gitea_push_failed", { error: error.message }), "error");
    }
  }
}

// ============================================
// Gitea Hard Reset Operation
// ============================================

export async function giteaHardReset() {
  const confirmed = await showConfirmDialog({
    title: t("gitea.hard_reset_title"),
    message: t("gitea.hard_reset_message"),
    confirmText: t("toolbar.refresh"),
    cancelText: t("modal.cancel_button"),
    isDanger: true
  });

  if (confirmed) {
    try {
      showGlobalLoading(t("modal.confirm") + "...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_hard_reset", remote: "gitea", branch: giteaState.currentBranch }),
      });
      hideGlobalLoading();
      if (data.success) {
        showToast(t("toast.git_reset_success"), "success");
        eventBus.emit('ui:reload-files');
        await giteaStatus();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast(t("toast.gitea_error", { error: error.message }), "error");
    }
  }
}

// ============================================
// Gitea Settings Modal
// ============================================

export async function showGiteaSettings() {
  // Get current remotes
  const remotes = await gitGetRemotes();
  const giteaRemote = remotes["gitea"] || "";

  // Get saved credentials
  const credentialsData = await fetchWithAuth(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "gitea_get_credentials" }),
  });

  const savedUsername = credentialsData.has_credentials ? credentialsData.username : "";
  const hasCredentials = credentialsData.has_credentials;

  // Get saved Gitea server URL from localStorage
  const savedGiteaUrl = localStorage.getItem("giteaServerUrl") || "";

  const modalOverlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalFooter = document.querySelector(".modal-footer");

  modalTitle.textContent = "Gitea " + t("toolbar.settings");

  let remotesHtml = "";
  if (Object.keys(remotes).length > 0) {
    remotesHtml = `<div class="git-settings-section"><div class="git-settings-label">${t("gitea.remotes_title")}</div>`;
    for (const [name, url] of Object.entries(remotes)) {
      remotesHtml += `
        <div class="git-remote-item">
          <div style="flex: 1; min-width: 0;">
              <span class="git-remote-name">${name}</span>
              <span class="git-remote-url">${url}</span>
          </div>
          <button class="btn-icon-only remove-remote-btn" data-remote-name="${name}" title="${t("gitea.remove_remote_title")}" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px;">
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
        <span>${t("gitea.logged_in_as", { username: savedUsername })}</span>
      </div>
      <button id="btn-gitea-signout" style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.15s;">
        <span class="material-icons">logout</span>
        <span>${t("toast.git_signout")}</span>
      </button>
    `;
  }

  modalBody.innerHTML = `
    <div class="git-settings-content">
      ${remotesHtml}

      <div class="git-settings-section">
        <div class="git-settings-label">${t("gitea.repo_url")}</div>
        <input type="text" class="git-settings-input" id="gitea-repo-url"
               placeholder="https://gitea.example.com/user/repo.git"
               value="${giteaRemote}"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        <div class="git-settings-buttons">
          <button class="btn-primary" id="btn-save-gitea-remote" style="width: 100%;">${t("modal.confirm_button")}</button>
        </div>
      </div>

      <div class="git-settings-section">
        <div class="git-settings-label">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; color: #fa8e14;">emoji_food_beverage</span>
          ${t("gitea.auth_title")}
        </div>

        ${credentialsStatusHtml}

        <input type="text" class="git-settings-input" id="gitea-username"
               placeholder="${t("gitea.username")}"
               value="${savedUsername}"
               autocomplete="username" autocorrect="off" autocapitalize="off" spellcheck="false"
               style="margin-bottom: 8px;" />
        <input type="password" class="git-settings-input" id="gitea-token"
               placeholder="${hasCredentials ? t("gitea.token_update") : t("gitea.token_placeholder")}"
               autocomplete="off"
               style="margin-bottom: 12px;" />

        <div class="git-settings-buttons">
          <button class="btn-secondary" id="btn-test-gitea-connection">${t("modal.confirm")}</button>
          <button class="btn-primary" id="btn-save-gitea-credentials">${t("modal.confirm_button")}</button>
        </div>
      </div>

      <div class="git-settings-section">
        <div class="git-settings-label">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px; color: #fa8e14;">add_box</span>
          ${t("modal.new_folder_title")}
        </div>
        <input type="text" class="git-settings-input" id="gitea-new-repo-name"
               placeholder="${t("sidebar.explorer")}"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
               style="margin-bottom: 8px;" />
        <input type="text" class="git-settings-input" id="gitea-new-repo-description"
               placeholder="${t("sidebar.search")}"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
               style="margin-bottom: 8px;" />
        <input type="text" class="git-settings-input" id="gitea-server-url"
               placeholder="${t("gitea.server_url")}"
               value="${savedGiteaUrl}"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
               style="margin-bottom: 8px;" />
        <div class="git-settings-checkbox" style="margin-bottom: 12px;">
          <input type="checkbox" id="gitea-repo-private" checked>
          <label for="gitea-repo-private">${t("gitea.private_repo")}</label>
        </div>
        <button class="btn-primary" id="btn-create-gitea-repo" style="width: 100%;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">add</span>
          ${t("modal.confirm_button")}
        </button>
      </div>

      <div class="git-settings-section">
        <div class="git-settings-label">${t("settings.advanced.experimental")}</div>
        <button class="btn-secondary" id="btn-clean-git-locks" style="width: 100%;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">delete_sweep</span>
          ${t("gitea.clean_locks")}
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add("visible");

  // Set wider modal for Gitea Settings (responsive on mobile via CSS)
  modal.style.maxWidth = "650px";

  // Hide default modal buttons
  if (modalFooter) {
    modalFooter.style.display = "none";
  }

  // Function to clean up and close the Gitea Settings modal
  const closeGiteaSettings = () => {
    modalOverlay.classList.remove("visible");
    resetModalToDefault();
    modalOverlay.removeEventListener("click", overlayClickHandler);
  };

  // Overlay click handler (defined separately so we can remove it)
  const overlayClickHandler = (e) => {
    if (e.target === modalOverlay) {
      closeGiteaSettings();
    }
  };
  modalOverlay.addEventListener("click", overlayClickHandler);
  document.getElementById("modal-close").onclick = closeGiteaSettings;

  // Add event listeners for delete remote buttons
  const removeRemoteBtns = modalBody.querySelectorAll('.remove-remote-btn');
  removeRemoteBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const remoteName = e.currentTarget.dataset.remoteName;
      const confirmed = await showConfirmDialog({
        title: t("gitea.remove_remote_title"),
        message: t("gitea.remove_remote_message", { name: remoteName }),
        confirmText: t("modal.delete_button"),
        cancelText: t("modal.cancel_button"),
        isDanger: true
      });

      if (confirmed) {
        try {
          const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "gitea_remove_remote", name: remoteName }),
          });

          if (data.success) {
            showToast(data.message, "success");
            // Refresh settings modal
            setTimeout(() => showGiteaSettings(), 300);
          } else {
            showToast(t("gitea.remove_remote_failed", { error: data.message }), "error");
          }
        } catch (error) {
          showToast(t("gitea.remove_remote_error", { error: error.message }), "error");
        }
      }
    });
  });

  document.getElementById("btn-save-gitea-remote")?.addEventListener("click", async () => {
    const url = document.getElementById("gitea-repo-url").value;
    if (!url) return showToast(t("toast.gitea_url_required"), "error");

    const result = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_add_remote", url: url }),
    });
    if (result.success) {
      showToast(t("toast.git_remote_saved"), "success");

      // Extract and save the base server URL from the repo URL
      try {
        const urlObj = new URL(url);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
        localStorage.setItem("giteaServerUrl", baseUrl);
      } catch (e) {
        // If URL parsing fails, ignore it
      }
    }
    else showToast(t("toast.gitea_error", { error: result.error }), "error");
  });

  document.getElementById("btn-save-gitea-credentials")?.addEventListener("click", async () => {
    const username = document.getElementById("gitea-username").value;
    const token = document.getElementById("gitea-token").value;
    if (!username) return showToast(t("gitea.username") + " " + t("toast.validation_error"), "error");
    if (!token && !hasCredentials) return showToast(t("gitea.token_placeholder") + " " + t("toast.validation_error"), "error");

    const result = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_set_credentials", username, token }),
    });
    if (result.success) {
      showToast(t("toast.git_creds_saved"), "success");
      closeGiteaSettings();
    } else {
      showToast(t("toast.gitea_error", { error: result.message }), "error");
    }
  });

  document.getElementById("btn-gitea-signout")?.addEventListener("click", async () => {
    await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_clear_credentials" }),
    });
    showToast(t("toast.git_signout"), "success");
    closeGiteaSettings();
  });

  document.getElementById("btn-test-gitea-connection")?.addEventListener("click", async () => {
    const result = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_test_connection" }),
    });
    if (result.success) showToast(t("toast.git_conn_success"), "success");
    else showToast(t("toast.git_conn_failed") + ": " + result.error, "error");
  });

  document.getElementById("btn-create-gitea-repo")?.addEventListener("click", async () => {
    const repoName = document.getElementById("gitea-new-repo-name")?.value.trim();
    const description = document.getElementById("gitea-new-repo-description")?.value.trim();
    const giteaUrl = document.getElementById("gitea-server-url")?.value.trim();
    const isPrivate = document.getElementById("gitea-repo-private")?.checked;

    if (!repoName) {
      showToast(t("toast.file_name_required"), "error");
      return;
    }

    if (!giteaUrl) {
      showToast(t("toast.gitea_url_required"), "error");
      return;
    }

    const result = await giteaCreateRepo(repoName, description, isPrivate, giteaUrl);

    if (result && result.success) {
      // Save the Gitea server URL for future use
      localStorage.setItem("giteaServerUrl", giteaUrl);

      // Clear the form
      document.getElementById("gitea-new-repo-name").value = "";
      document.getElementById("gitea-new-repo-description").value = "";

      // Refresh the modal to show the new remote
      setTimeout(() => {
        closeGiteaSettings();
        showGiteaSettings();
      }, 2000);
    }
  });

  document.getElementById("btn-clean-git-locks")?.addEventListener("click", async () => {
    await gitCleanLocks();
  });
}

// ============================================
// Gitea Repository Creation
// ============================================

export async function giteaCreateRepo(repoName, description, isPrivate, giteaUrl) {
  try {
    if (!giteaUrl) {
      showToast(t("toast.gitea_url_required"), "error");
      return null;
    }

    showToast(t("toast.gitea_creating_repo"), "info");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "gitea_create_repo",
        repo_name: repoName,
        description: description,
        is_private: isPrivate,
        gitea_url: giteaUrl
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
// Gitea Status Check
// ============================================

export async function giteaStatus(shouldFetch = false, silent = false) {
  if (!state.giteaIntegrationEnabled) return;

  try {
    if (!silent) {
      if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.add("pulsing");
    }

    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "gitea_status",
        fetch: shouldFetch
      }),
    });

    if (!silent) {
      if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.remove("pulsing");
    }

    if (data.success) {
      // Store previous change list string to check for meaningful changes
      const currentChangesList = JSON.stringify(data.files);
      const hasMeaningfulChange = state._lastGiteaChanges && state._lastGiteaChanges !== currentChangesList;
      state._lastGiteaChanges = currentChangesList;

      giteaState.isInitialized = data.is_initialized;
      giteaState.hasRemote = data.has_remote;
      giteaState.currentBranch = data.current_branch || "unknown";
      giteaState.localBranches = data.local_branches || [];
      giteaState.remoteBranches = data.remote_branches || [];
      giteaState.ahead = data.ahead || 0;
      giteaState.behind = data.behind || 0;
      giteaState.status = data.status || "";

      giteaState.files = data.files || {
        modified: [],
        added: [],
        deleted: [],
        untracked: [],
        staged: [],
        unstaged: []
      };

      giteaState.totalChanges = [
        ...giteaState.files.modified,
        ...giteaState.files.added,
        ...giteaState.files.deleted,
        ...giteaState.files.untracked
      ].length;

      // If git is in a conflict state, fetch the actual unmerged file list
      const statusLower = giteaState.status.toLowerCase();
      const isConflicted = statusLower.includes("rebasing") || statusLower.includes("merging") ||
        statusLower.includes("unmerged") || statusLower.includes("conflict");
      if (isConflicted) {
        giteaState.conflictFiles = await gitGetConflictFiles();
      } else {
        giteaState.conflictFiles = [];
      }

      eventBus.emit('git:refresh');

      if (!silent) {
        if (data.has_changes) {
          showToast(t("toast.gitea_changes_detected", { count: giteaState.totalChanges }), "success");
        } else {
          showToast(t("toast.gitea_tree_clean"), "success");
        }
      }
    }
  } catch (error) {
    if (!silent) {
      if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.remove("pulsing");
      showToast(t("toast.gitea_error", { error: error.message }), "error");
    }
  }
}

// ============================================
// Gitea Panel UI Update
// ============================================

export function updateGiteaPanel() {
  return updateGiteaPanelUI();
}

// ============================================
// Gitea Files Rendering
// ============================================

export function renderGiteaFiles(container) {
  return renderGiteaFilesImpl(container);
}

/**
 * Refresh Gitea panel labels with translated strings
 */
export function refreshGiteaPanelStrings() {
  const panel = document.getElementById("gitea-panel");
  if (!panel) return;

  const title = panel.querySelector(".panel-title-text");
  if (title) title.textContent = t("sidebar.gitea_changes");

  const emptyState = panel.querySelector(".git-empty-state p");
  if (emptyState) emptyState.textContent = t("sidebar.no_changes");

  const btnStageSelected = document.getElementById("btn-gitea-stage-selected");
  if (btnStageSelected) btnStageSelected.textContent = t("sidebar.stage");

  const btnStageAll = document.getElementById("btn-gitea-stage-all");
  if (btnStageAll) btnStageAll.textContent = t("sidebar.stage_all");

  const btnUnstageAll = document.getElementById("btn-gitea-unstage-all");
  if (btnUnstageAll) btnUnstageAll.textContent = t("sidebar.unstage");

  const btnCommit = document.getElementById("btn-gitea-commit-staged");
  if (btnCommit) btnCommit.textContent = t("sidebar.commit");
}

