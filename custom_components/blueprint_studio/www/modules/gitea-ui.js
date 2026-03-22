/** GITEA-UI.JS | Purpose: * Handles all UI rendering and user interactions for the Gitea integration */
import { state, elements, giteaState } from './state.js';
import { t } from './translations.js';
import { showToast, setButtonLoading } from './ui.js';
import { isTextFile } from './utils.js';
import {
  giteaStage,
  giteaUnstage,
  giteaAbort,
  giteaForcePush,
  giteaHardReset,
  giteaStatus
} from './gitea-integration.js';

/**
 * Updates the Gitea panel UI with current status
 * Shows warnings, sync indicators, and file lists
 */
export function updateGiteaPanel() {
  const panel = document.getElementById("gitea-panel");
  if (!panel) return;

  if (!state.giteaIntegrationEnabled) {
    panel.classList.remove("visible");
    panel.style.display = "none";
    return;
  }

  const container = document.getElementById("gitea-files-container");
  const badge = document.getElementById("gitea-changes-count");
  const commitBtn = document.getElementById("btn-gitea-commit-staged");
  const actions = panel.querySelector(".git-panel-actions");

  if (!container || !badge || !commitBtn || !actions) return;

  if (badge) badge.textContent = giteaState.totalChanges;

  // Branch chip in panel title
  const titleText = panel.querySelector(".panel-title-text");
  if (titleText && giteaState.isInitialized && giteaState.currentBranch && giteaState.currentBranch !== "unknown") {
    const existing = panel.querySelector(".git-branch-chip");
    if (existing) existing.remove();
    const chip = document.createElement("span");
    chip.className = "git-branch-chip";
    chip.title = `Current branch: ${giteaState.currentBranch}`;
    chip.style.cssText = "display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:10px;margin-left:6px;color:var(--text-secondary);cursor:pointer;vertical-align:middle;";
    chip.innerHTML = `<span class="material-icons" style="font-size:11px;">account_tree</span>${giteaState.currentBranch}`;
    chip.addEventListener("click", () => { import('./git-operations.js').then(m => m.showBranchManager()); });
    titleText.after(chip);
  } else if (titleText && (!giteaState.isInitialized || giteaState.currentBranch === "unknown")) {
    const existing = panel.querySelector(".git-branch-chip");
    if (existing) existing.remove();
  }

  // Sync indicators
  const oldIndicators = actions.querySelectorAll(".git-sync-indicator");
  oldIndicators.forEach(i => i.remove());

  if (giteaState.isInitialized && giteaState.hasRemote) {
    if (giteaState.ahead > 0) {
      const pushBtn = document.createElement("button");
      pushBtn.className = "git-panel-btn git-sync-indicator";
      pushBtn.id = "btn-gitea-push-sync";
      pushBtn.title = `${giteaState.ahead} commits to push`;
      pushBtn.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: var(--success-color);">arrow_upward</span>
        <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--success-color);">${giteaState.ahead}</span>
      `;
      actions.insertBefore(pushBtn, actions.firstChild);
    }
    if (giteaState.behind > 0) {
      const pullBtn = document.createElement("button");
      pullBtn.className = "git-panel-btn git-sync-indicator";
      pullBtn.id = "btn-gitea-pull-sync";
      pullBtn.title = `${giteaState.behind} commits to pull`;
      pullBtn.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: var(--warning-color);">arrow_downward</span>
        <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--warning-color);">${giteaState.behind}</span>
      `;
      actions.insertBefore(pullBtn, actions.firstChild);
    }
  }

  // Stuck Operation Detection + Conflict Resolution UI
  let stuckWarningHtml = "";
  const isConflicted = typeof giteaState.status === "string" && giteaState.status && (
    giteaState.status.toLowerCase().includes("rebasing") ||
    giteaState.status.toLowerCase().includes("merging") ||
    giteaState.status.toLowerCase().includes("unmerged") ||
    giteaState.status.toLowerCase().includes("conflict")
  );
  if (isConflicted) {
    const conflictFiles = giteaState.conflictFiles || [];

    const conflictRows = conflictFiles.map(f => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color);">
        <span style="font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;" title="${f}">${f.split("/").pop()}</span>
        <div style="display: flex; gap: 4px; flex-shrink: 0;">
          <button class="btn-conflict-ours" data-path="${f}" style="padding: 3px 8px; font-size: 11px; background: var(--success-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Ours</button>
          <button class="btn-conflict-theirs" data-path="${f}" style="padding: 3px 8px; font-size: 11px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Theirs</button>
        </div>
      </div>
    `).join("");

    stuckWarningHtml = `
      <div id="conflict-resolution-panel-gitea" style="margin: 8px; padding: 12px; background: rgba(244, 67, 54, 0.1); border: 1px solid var(--error-color); border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--error-color); font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">error_outline</span>
          <span>Merge Conflicts</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Resolve each conflict by choosing your version (Ours) or the incoming version (Theirs), then commit.</p>
        ${conflictRows ? `<div style="margin-bottom: 10px;">${conflictRows}</div>` : ""}
        <button id="btn-gitea-abort" style="width: 100%; padding: 6px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Abort & Reset Gitea Sync
        </button>
      </div>
    `;
  }

  // Diverged Sync Detection
  let divergedWarningHtml = "";
  if (giteaState.ahead > 0 && giteaState.behind > 0) {
    divergedWarningHtml = `
      <div style="margin: 8px; padding: 12px; background: rgba(156, 39, 176, 0.1); border: 1px solid #9c27b0; border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #9c27b0; font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">sync_problem</span>
          <span>Gitea Sync Conflict</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local and Gitea versions have diverged.</p>
        <div style="display: flex; gap: 8px;">
          <button id="btn-gitea-force-push" style="flex: 1; padding: 6px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
            Force Push
          </button>
          <button id="btn-gitea-hard-reset" style="flex: 1; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 11px;">
            Hard Reset
          </button>
        </div>
      </div>
    `;
  }

  // Toggle visibility state based on content availability logic same as git
  if (giteaState.totalChanges > 0 || giteaState.ahead > 0 || giteaState.behind > 0 || !giteaState.isInitialized || !giteaState.hasRemote || stuckWarningHtml || divergedWarningHtml) {
    panel.classList.add("visible");
    panel.style.display = "flex";
  } else {
    panel.classList.add("visible");
    panel.style.display = "flex";
  }

  // Apply saved collapse state
  if (state.giteaPanelCollapsed) {
    panel.classList.add("collapsed");
    const icon = elements.btnGiteaCollapse?.querySelector(".material-icons");
    if (icon) {
      icon.textContent = "expand_more";
      elements.btnGiteaCollapse.title = "Expand Gitea Panel";
    }
  } else {
    panel.classList.remove("collapsed");
    const icon = elements.btnGiteaCollapse?.querySelector(".material-icons");
    if (icon) {
      icon.textContent = "expand_less";
      elements.btnGiteaCollapse.title = "Collapse Gitea Panel";
    }
  }

  if (!giteaState.isInitialized) {
    container.innerHTML = `
      <div class="git-empty-state">
        <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px; color: #fa8e14;">source</span>
        <p style="margin: 0 0 10px 0; font-weight: 500;">Gitea Not Initialized</p>
        <button class="btn-primary" id="btn-gitea-init-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #fa8e14; color: white;">
          <span class="material-icons" style="font-size: 18px;">play_circle</span> Initialize Repo
        </button>
      </div>
    `;
    if (commitBtn) commitBtn.disabled = true;
    return;
  }

  if (!giteaState.hasRemote) {
    if (giteaState.totalChanges === 0) {
      container.innerHTML = `
        <div class="git-empty-state">
          <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px; color: #fa8e14;">link_off</span>
          <p style="margin: 0 0 10px 0; font-weight: 500;">No Gitea Remote</p>
          <button class="btn-primary" id="btn-gitea-connect-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #fa8e14; color: white;">
            <span class="material-icons">link</span> Connect to Gitea
          </button>
        </div>
      `;
      if (commitBtn) commitBtn.disabled = true;
      return;
    }
  }

  if (giteaState.totalChanges > 0 || stuckWarningHtml || divergedWarningHtml) {
    container.innerHTML = stuckWarningHtml + divergedWarningHtml;
    if (giteaState.totalChanges > 0) {
      renderGiteaFiles(container);
    }

    // Add event listeners for warning buttons
    const btnAbort = document.getElementById("btn-gitea-abort");
    if (btnAbort && giteaAbort) {
      btnAbort.addEventListener("click", giteaAbort);
    }

    const btnForcePush = document.getElementById("btn-gitea-force-push");
    if (btnForcePush && giteaForcePush) {
      btnForcePush.addEventListener("click", giteaForcePush);
    }

    const btnHardReset = document.getElementById("btn-gitea-hard-reset");
    if (btnHardReset && giteaHardReset) {
      btnHardReset.addEventListener("click", giteaHardReset);
    }
  } else {
    container.innerHTML = `
      <div class="git-empty-state">
        <span class="material-icons" style="color: #fa8e14; font-size: 48px; opacity: 0.5;">check_circle</span>
        <p>No changes detected</p>
        <div class="git-empty-state-actions" style="display: flex; gap: 8px; margin-top: 12px; justify-content: center;">
          <button class="btn-secondary" id="btn-gitea-pull-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
            <span class="material-icons" style="font-size: 16px;">cloud_download</span> Pull
          </button>
          <button class="btn-secondary" id="btn-gitea-refresh-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
            <span class="material-icons" style="font-size: 16px;">refresh</span> Refresh
          </button>
        </div>
      </div>
    `;
  }

  if (commitBtn) commitBtn.disabled = giteaState.files.staged.length === 0;
}

/**
 * Renders Gitea files in the panel
 * Groups files by status: staged, modified, added, deleted, untracked
 */
export function renderGiteaFiles(container) {
  const groups = [
    { key: "staged", title: t("sidebar.staged"), files: giteaState.files.staged, icon: "inventory_2", color: "success" },
    { key: "modified", title: t("sidebar.modified"), files: giteaState.files.modified.filter(f => !giteaState.files.staged.includes(f)), icon: "edit", color: "modified" },
    { key: "added", title: t("sidebar.added"), files: giteaState.files.added.filter(f => !giteaState.files.staged.includes(f)), icon: "add_circle", color: "added" },
    { key: "deleted", title: t("sidebar.deleted"), files: giteaState.files.deleted.filter(f => !giteaState.files.staged.includes(f)), icon: "delete", color: "deleted" },
    { key: "untracked", title: t("sidebar.untracked"), files: giteaState.files.untracked, icon: "help_outline", color: "untracked" }
  ];

  let html = "";

  for (const group of groups) {
    if (group.files.length === 0) continue;

    const isCollapsed = giteaState.collapsedGroups.has(group.key);
    const collapsedClass = isCollapsed ? ' collapsed' : '';

    html += `
      <div class="git-file-group${collapsedClass}" data-group="${group.key}">
        <div class="git-file-group-header">
          <span class="git-file-group-icon material-icons ${group.color}" style="font-size: 18px;">${group.icon}</span>
          <span>${group.title}</span>
          <span class="git-file-group-count">(${group.files.length})</span>
          <span class="material-icons git-file-group-chevron">chevron_right</span>
        </div>
        <div class="git-file-list">
    `;

    for (const file of group.files) {
      const isStaged = giteaState.files.staged.includes(file);
      const checked = giteaState.selectedFiles.has(file) ? 'checked' : '';

      let diffButton = "";
      if ((group.key === "modified" || group.key === "staged") && isTextFile && isTextFile(file)) {
        diffButton = `
          <button class="btn-icon-only btn-git-diff" data-path="${file}" title="View Diff" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); margin-left: auto; padding: 4px;">
            <span class="material-icons" style="font-size: 16px;">difference</span>
          </button>
        `;
      }

      html += `
        <div class="git-file-item" data-file="${file}">
          <input type="checkbox" class="gitea-file-checkbox" ${checked} data-file-path="${file}" />
          <span class="git-file-name" title="${file}" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file}</span>
          ${diffButton}
          ${isStaged ? `<span class="git-file-status staged" style="margin-left: 4px; background: var(--success-color); color: var(--bg-primary);">${t("sidebar.staged")}</span>` : ''}
        </div>
      `;
    }
    html += `</div></div>`;
  }
  container.insertAdjacentHTML('beforeend', html);
}

/**
 * Toggle Gitea file selection
 */
export function toggleGiteaFileSelection(file) {
  if (giteaState.selectedFiles.has(file)) {
    giteaState.selectedFiles.delete(file);
  } else {
    giteaState.selectedFiles.add(file);
  }
}

/**
 * Stage selected Gitea files
 */
export async function stageSelectedGiteaFiles() {
  // Robust fallback: if Set is empty, check DOM for checked checkboxes
  if (giteaState.selectedFiles.size === 0) {
    if (showToast) {
      showToast(t("toast.no_files_selected"), "warning");
    }
    return;
  }

  if (giteaStage) {
    await giteaStage(Array.from(giteaState.selectedFiles));
  }
  giteaState.selectedFiles.clear();
}

/**
 * Stage all unstaged Gitea files
 */
export async function stageAllGiteaFiles() {
  const unstagedFiles = [
    ...giteaState.files.modified.filter(f => !giteaState.files.staged.includes(f)),
    ...giteaState.files.added.filter(f => !giteaState.files.staged.includes(f)),
    ...giteaState.files.deleted.filter(f => !giteaState.files.staged.includes(f)),
    ...giteaState.files.untracked
  ];

  if (unstagedFiles.length > 0 && giteaStage) {
    await giteaStage(unstagedFiles);
  }
}

/**
 * Unstage all staged Gitea files
 */
export async function unstageAllGiteaFiles() {
  if (giteaState.files.staged.length > 0 && giteaUnstage) {
    await giteaUnstage(giteaState.files.staged);
  }
}

