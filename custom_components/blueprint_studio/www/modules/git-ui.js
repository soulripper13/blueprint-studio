/** GIT-UI.JS | Purpose: * Handles all UI rendering and user interactions for the Git integration panel. */
import { state, elements, gitState, giteaState } from './state.js';
import { isTextFile } from './utils.js';
import { t } from './translations.js';
import { eventBus } from './event-bus.js';
import { saveSettings } from './settings.js';
import {
  showToast,
  showModal,
  showConfirmDialog,
  setButtonLoading
} from './ui.js';

import {
  isGitEnabled,
  gitStatus,
  gitStage,
  gitUnstage,
  gitCommit,
  abortGitOperation,
  deleteRemoteBranch,
  forcePush,
  hardReset,
  gitRepairIndex
} from './git-operations.js';

/**
 * Updates the Git panel UI with current status
 * Shows warnings, sync indicators, and file lists
 */
export function updateGitPanel() {
  const panel = document.getElementById("git-panel");
  if (!panel) return;

  // Do not update or show if git is disabled
  if (!isGitEnabled || !isGitEnabled()) {
    panel.classList.remove("visible");
    panel.style.display = "none";
    return;
  }

  const container = document.getElementById("git-files-container");
  const badge = document.getElementById("git-changes-count");
  const commitBtn = document.getElementById("btn-commit-staged");
  const actions = panel.querySelector(".git-panel-actions");

  if (!container || !badge || !commitBtn || !actions) return;

  // Update badge
  badge.textContent = gitState.totalChanges;

  // Update branch indicator in panel title
  const titleText = panel.querySelector(".panel-title-text");
  if (titleText && gitState.isInitialized && gitState.currentBranch && gitState.currentBranch !== "unknown") {
    // Remove any existing branch chip to avoid duplicates
    const existing = panel.querySelector(".git-branch-chip");
    if (existing) existing.remove();
    const chip = document.createElement("span");
    chip.className = "git-branch-chip";
    chip.title = `Current branch: ${gitState.currentBranch}`;
    chip.style.cssText = "display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:10px;margin-left:6px;color:var(--text-secondary);cursor:pointer;vertical-align:middle;";
    chip.innerHTML = `<span class="material-icons" style="font-size:11px;">account_tree</span>${gitState.currentBranch}`;
    chip.addEventListener("click", () => { import('./git-operations.js').then(m => m.showBranchManager()); });
    titleText.after(chip);
  } else if (titleText && (!gitState.isInitialized || gitState.currentBranch === "unknown")) {
    const existing = panel.querySelector(".git-branch-chip");
    if (existing) existing.remove();
  }

  // Remove any existing sync indicators to prevent duplicates
  const oldIndicators = actions.querySelectorAll(".git-sync-indicator");
  oldIndicators.forEach(i => i.remove());

  // Add ahead/behind indicators
  if (gitState.isInitialized && gitState.hasRemote) {
    if (gitState.ahead > 0) {
      const pushBtn = document.createElement("button");
      pushBtn.className = "git-panel-btn git-sync-indicator";
      pushBtn.id = "btn-git-push-sync";
      pushBtn.title = t("sidebar.ahead_push", {count: gitState.ahead});
      pushBtn.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: var(--success-color);">arrow_upward</span>
        <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--success-color);">${gitState.ahead}</span>
      `;
      actions.insertBefore(pushBtn, actions.firstChild);
    }
    if (gitState.behind > 0) {
      const pullBtn = document.createElement("button");
      pullBtn.className = "git-panel-btn git-sync-indicator";
      pullBtn.id = "btn-git-pull-sync";
      pullBtn.title = t("sidebar.behind_pull", {count: gitState.behind});
      pullBtn.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: var(--warning-color);">arrow_downward</span>
        <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--warning-color);">${gitState.behind}</span>
      `;
      actions.insertBefore(pullBtn, actions.firstChild);
    }
  }

  // Show panel if not initialized or no remote, to guide user
  if (!gitState.isInitialized || !gitState.hasRemote) {
    panel.classList.add("visible");
  } else if (gitState.totalChanges > 0 || gitState.ahead > 0 || gitState.behind > 0) {
    panel.classList.add("visible");
  }

  // Apply saved collapse state
  if (state.gitPanelCollapsed) {
    panel.classList.add("collapsed");
    const icon = elements.btnGitCollapse?.querySelector(".material-icons");
    if (icon) {
      icon.textContent = "expand_more";
      elements.btnGitCollapse.title = "Expand Git Panel";
    }
  } else {
    panel.classList.remove("collapsed");
    const icon = elements.btnGitCollapse?.querySelector(".material-icons");
    if (icon) {
      icon.textContent = "expand_less";
      elements.btnGitCollapse.title = "Collapse Git Panel";
    }
  }

  if (!gitState.isInitialized) {
    container.innerHTML = `
      <div class="git-empty-state">
        <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px;">source</span>
        <p style="margin: 0 0 10px 0; font-weight: 500;">Git Not Initialized</p>
        <p style="font-size: 12px; margin-bottom: 15px; max-width: 200px; color: var(--text-secondary);">Start tracking changes by initializing a repository.</p>
        <button class="btn-primary" id="btn-git-init-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="font-size: 18px;">play_circle</span> Initialize Repo
        </button>
      </div>
    `;
    commitBtn.disabled = true;
    return;
  }

  // Branch Mismatch Detection (master vs main)
  let branchWarningHtml = "";
  const onOldBranch = gitState.currentBranch === "master" || gitState.currentBranch === "HEAD" || gitState.currentBranch === "unknown";
  const masterExists = gitState.localBranches.includes("master");

  if (onOldBranch && masterExists && gitState.hasRemote) {
    branchWarningHtml = `
      <div style="margin: 8px; padding: 12px; background: rgba(255, 152, 0, 0.1); border: 1px solid var(--warning-color); border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--warning-color); font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">warning</span>
          <span>Branch Mismatch</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local branch is <b>master</b>, but modern GitHub repos use <b>main</b>. This can cause sync errors.</p>
        <button id="btn-repair-branch" style="width: 100%; padding: 6px; background: var(--warning-color); color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Repair: Move to main
        </button>
      </div>
    `;
  }

  // Remote Cleanup Detection (Delete remote master if local is main)
  let remoteCleanupHtml = "";
  if (gitState.currentBranch === "main" && gitState.remoteBranches.includes("master")) {
    remoteCleanupHtml = `
      <div style="margin: 8px; padding: 12px; background: rgba(33, 150, 243, 0.1); border: 1px solid var(--accent-color); border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--accent-color); font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">cleaning_services</span>
          <span>Clean up GitHub</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local branch is <b>main</b>, but an old <b>master</b> branch still exists on GitHub.</p>
        <button id="btn-delete-remote-master" style="width: 100%; padding: 6px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Delete GitHub "master"
        </button>
      </div>
    `;
  }

  // Diverged Sync Detection
  let divergedWarningHtml = "";
  if (gitState.ahead > 0 && gitState.behind > 0) {
    divergedWarningHtml = `
      <div style="margin: 8px; padding: 12px; background: rgba(156, 39, 176, 0.1); border: 1px solid #9c27b0; border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #9c27b0; font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">sync_problem</span>
          <span>Sync Conflict</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local and GitHub versions have diverged. A normal sync is not possible.</p>
        <div style="display: flex; gap: 8px;">
          <button id="btn-force-push" style="flex: 1; padding: 6px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
            Force Push
          </button>
          <button id="btn-hard-reset" style="flex: 1; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 11px;">
            Hard Reset
          </button>
        </div>
      </div>
    `;
  }

  // Rebase/Merge Stuck Detection + Conflict Resolution UI
  let stuckWarningHtml = "";
  const isConflicted = typeof gitState.status === "string" && gitState.status && (
    gitState.status.toLowerCase().includes("rebasing") ||
    gitState.status.toLowerCase().includes("merging") ||
    gitState.status.toLowerCase().includes("unmerged") ||
    gitState.status.toLowerCase().includes("conflict")
  );
  if (isConflicted) {
    const conflictFiles = gitState.conflictFiles || [];

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
      <div id="conflict-resolution-panel" style="margin: 8px; padding: 12px; background: rgba(244, 67, 54, 0.1); border: 1px solid var(--error-color); border-radius: 6px; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--error-color); font-weight: 600;">
          <span class="material-icons" style="font-size: 18px;">error_outline</span>
          <span>Merge Conflicts</span>
        </div>
        <p style="margin-bottom: 10px; color: var(--text-secondary);">Resolve each conflict by choosing your version (Ours) or the incoming version (Theirs), then commit.</p>
        ${conflictRows ? `<div style="margin-bottom: 10px;">${conflictRows}</div>` : ""}
        <button id="btn-abort-git" style="width: 100%; padding: 6px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Abort & Reset Sync
        </button>
      </div>
    `;
  }

  if (!gitState.hasRemote) {
    // If there are changes, we show them, but maybe add a warning?
    // Or for simplicity, if no remote, we guide them to connect first/alongside.
    // Actually, let's allow local commits without remote.
    // But if there are NO changes, show the Connect prompt.
    if (gitState.totalChanges === 0) {
      container.innerHTML = `
        <div class="git-empty-state">
          <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px;">link_off</span>
          <p style="margin: 0 0 10px 0; font-weight: 500;">No Remote Configured</p>
          <p style="font-size: 12px; margin-bottom: 15px; max-width: 200px; color: var(--text-secondary);">Connect to GitHub to push your changes to the cloud.</p>
          <button class="btn-primary" id="btn-git-connect-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" style="fill: white;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
            Connect to GitHub
          </button>
        </div>
      `;
      commitBtn.disabled = true;
      return;
    }
  }

  if (gitState.totalChanges > 0 || branchWarningHtml || stuckWarningHtml || remoteCleanupHtml || divergedWarningHtml) {
    container.innerHTML = stuckWarningHtml + branchWarningHtml + divergedWarningHtml + remoteCleanupHtml;
    if (gitState.totalChanges > 0) {
      renderGitFiles(container);
    }

    // Add event listeners for new buttons
    const btnRepair = document.getElementById("btn-repair-branch");
    if (btnRepair && gitRepairIndex) {
      btnRepair.addEventListener("click", gitRepairIndex);
    }

    const btnAbort = document.getElementById("btn-abort-git");
    if (btnAbort && abortGitOperation) {
      btnAbort.addEventListener("click", abortGitOperation);
    }

    const btnDeleteRemote = document.getElementById("btn-delete-remote-master");
    if (btnDeleteRemote && deleteRemoteBranch) {
      btnDeleteRemote.addEventListener("click", () => deleteRemoteBranch("master"));
    }

    const btnForcePush = document.getElementById("btn-force-push");
    if (btnForcePush && forcePush) {
      btnForcePush.addEventListener("click", forcePush);
    }

    const btnHardReset = document.getElementById("btn-hard-reset");
    if (btnHardReset && hardReset) {
      btnHardReset.addEventListener("click", hardReset);
    }
  } else {
    container.innerHTML = `
      <div class="git-empty-state">
        <span class="material-icons">check_circle</span>
        <p>No changes detected</p>
        <div class="git-empty-state-actions" style="display: flex; gap: 8px; margin-top: 12px; justify-content: center;">
          <button class="btn-secondary" id="btn-git-pull-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
            <span class="material-icons" style="font-size: 16px;">cloud_download</span>
            Pull
          </button>
          <button class="btn-secondary" id="btn-git-refresh-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
            <span class="material-icons" style="font-size: 16px;">refresh</span>
            Refresh
          </button>
        </div>
      </div>
    `;
  }

  // Enable/disable commit button based on staged files
  commitBtn.disabled = gitState.files.staged.length === 0;
}

/**
 * Renders git files in the panel
 * Groups files by status: staged, modified, added, deleted, untracked
 */
export function renderGitFiles(container) {
  // Note: We don't clear the container here anymore,
  // because it might contain branch/stuck warnings.
  // Instead, we build the file list HTML and append it.

  const groups = [
    {
      key: "staged",
      title: "Staged Changes",
      files: gitState.files.staged,
      icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M10.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm1.43.75a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.001 4.001 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32z"></path></svg>',
      color: "success"
    },
    {
      key: "modified",
      title: "Modified",
      files: gitState.files.modified.filter(f => !gitState.files.staged.includes(f)),
      icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.5 2.75v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H2.75a.25.25 0 0 0-.25.25Zm1.75 6.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75ZM5 5.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 5.25Z"></path></svg>',
      color: "modified"
    },
    {
      key: "added",
      title: "Added",
      files: gitState.files.added.filter(f => !gitState.files.staged.includes(f)),
      icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20" fill="#51cf66"><path d="M13.25 2.5H2.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4Z"></path></svg>',
      color: "added"
    },
    {
      key: "deleted",
      title: "Deleted",
      files: gitState.files.deleted.filter(f => !gitState.files.staged.includes(f)),
      icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20" fill="#ff6b6b"><path d="M13.25 2.5H2.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1Zm8.5 7.25a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75Z"></path></svg>',
      color: "deleted"
    },
    {
      key: "untracked",
      title: "Untracked",
      files: gitState.files.untracked,
      icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path></svg>',
      color: "untracked"
    }
  ];

  let html = "";

  for (const group of groups) {
    if (group.files.length === 0) continue;

    const isCollapsed = gitState.collapsedGroups.has(group.key);
    const collapsedClass = isCollapsed ? ' collapsed' : '';

    html += `
      <div class="git-file-group${collapsedClass}" data-group="${group.key}">
        <div class="git-file-group-header">
          <span class="git-file-group-icon ${group.color}">${group.icon}</span>
          <span>${group.title}</span>
          <span class="git-file-group-count">(${group.files.length})</span>
          <span class="material-icons git-file-group-chevron">chevron_right</span>
        </div>
        <div class="git-file-list">
    `;

    for (const file of group.files) {
      const isStaged = gitState.files.staged.includes(file);
      const isUnstaged = gitState.files.unstaged.includes(file);
      const checked = gitState.selectedFiles.has(file) ? 'checked' : '';

      let diffButton = "";
      // Show diff for Modified or Staged files (not Added/Deleted/Untracked which have no history)
      if ((group.key === "modified" || group.key === "staged") && isTextFile(file)) {
        diffButton = `
          <button class="btn-icon-only btn-git-diff" data-path="${file}" title="View Diff" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); margin-left: auto; padding: 4px;">
            <span class="material-icons" style="font-size: 16px;">difference</span>
          </button>
        `;
      }

      html += `
        <div class="git-file-item" data-file="${file}">
          <input type="checkbox" class="git-file-checkbox" ${checked} data-file-path="${file}" />
          <span class="git-file-icon ${group.color}">${group.icon}</span>
          <span class="git-file-name" title="${file}" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file}</span>
          ${diffButton}
          ${isStaged ? '<span class="git-file-status staged" style="margin-left: 4px;">Staged</span>' : ''}
          ${isUnstaged && !isStaged ? '<span class="git-file-status unstaged" style="margin-left: 4px;">Unstaged</span>' : ''}
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  }

  container.insertAdjacentHTML('beforeend', html);
}

/**
 * Toggle git file group collapse
 */
export function toggleGitGroup(groupKey, panelType = 'git') {
  const containerId = panelType === 'gitea' ? 'gitea-files-container' : 'git-files-container';
  const container = document.getElementById(containerId);
  if (!container) return;

  const group = container.querySelector(`.git-file-group[data-group="${groupKey}"]`);
  if (group) {
    group.classList.toggle("collapsed");

    // Save collapsed state to the appropriate state object
    const stateObj = panelType === 'gitea' ? giteaState : gitState;
    if (group.classList.contains("collapsed")) {
      stateObj.collapsedGroups.add(groupKey);
    } else {
      stateObj.collapsedGroups.delete(groupKey);
    }

    // Persist to localStorage
    saveSettings();
  }
}

/**
 * Toggle file selection
 */
export function toggleFileSelection(file) {
  if (gitState.selectedFiles.has(file)) {
    gitState.selectedFiles.delete(file);
  } else {
    gitState.selectedFiles.add(file);
  }
}

/**
 * Stage selected files
 */
export async function stageSelectedFiles() {
  // Robust fallback: if Set is empty, check DOM for checked checkboxes
  if (gitState.selectedFiles.size === 0) {
    if (showToast) {
      showToast(t("toast.no_files_selected"), "warning");
    }
    return;
  }

  if (gitStage) {
    await gitStage(Array.from(gitState.selectedFiles));
  }
  gitState.selectedFiles.clear(); // Clear selection after staging
}

/**
 * Stage all unstaged files
 */
export async function stageAllFiles() {
  const unstagedFiles = [
    ...gitState.files.modified.filter(f => !gitState.files.staged.includes(f)),
    ...gitState.files.added.filter(f => !gitState.files.staged.includes(f)),
    ...gitState.files.deleted.filter(f => !gitState.files.staged.includes(f)),
    ...gitState.files.untracked
  ];

  if (unstagedFiles.length > 0 && gitStage) {
    await gitStage(unstagedFiles);
  }
}

/**
 * Unstage all staged files
 */
export async function unstageAllFiles() {
  if (gitState.files.staged.length > 0 && gitUnstage) {
    await gitUnstage(gitState.files.staged);
  }
}

/**
 * Commit staged files
 */
export async function commitStagedFiles() {
  const stagedCount = gitState.files.staged.length;
  if (stagedCount === 0) return;

  // Generate a smart default commit message
  let defaultMessage = "Update via Blueprint Studio";
  if (stagedCount === 1) {
    const filename = gitState.files.staged[0].split("/").pop();
    defaultMessage = `Update ${filename}`;
  } else if (stagedCount > 1) {
    const filename = gitState.files.staged[0].split("/").pop();
    defaultMessage = `Update ${filename} and ${stagedCount - 1} others`;
  }

  if (!showModal) return;

  const commitMessage = await showModal({
    title: "Commit Changes",
    placeholder: "Commit message",
    value: defaultMessage,
    hint: `Committing ${stagedCount} staged file(s)`,
  });

  if (!commitMessage) {
    return;
  }

  if (gitCommit) {
    await gitCommit(commitMessage);
  }
}

/**
 * Apply version control visibility
 * Shows/hides Git and Gitea UI elements based on integration enabled state
 */
export function applyVersionControlVisibility() {
  const gitEnabled = state.gitIntegrationEnabled;
  const giteaEnabled = state.giteaIntegrationEnabled;

  // Git Elements
  const gitElements = [
    document.getElementById("btn-git-pull"),
    document.getElementById("btn-git-push"),
    document.getElementById("btn-git-status"),
    document.getElementById("btn-git-settings"),
    document.getElementById("git-panel")
  ];

  gitElements.forEach(el => {
    if (el) el.style.display = gitEnabled ? "flex" : "none";
  });

  if (!gitEnabled) {
    document.getElementById("git-panel")?.classList.remove("visible");
  }

  // Gitea Elements
  const giteaElements = [
    document.getElementById("btn-gitea-pull"),
    document.getElementById("btn-gitea-push"),
    document.getElementById("btn-gitea-status"),
    document.getElementById("btn-gitea-settings"),
    document.getElementById("gitea-panel")
  ];

  giteaElements.forEach(el => {
    if (el) el.style.display = giteaEnabled ? "flex" : "none";
  });

  if (!giteaEnabled) {
    document.getElementById("gitea-panel")?.classList.remove("visible");
  }

  // Also handle toolbar groups
  const gitToolbarGroup = document.querySelector(".git-toolbar-group");
  if (gitToolbarGroup) gitToolbarGroup.style.display = gitEnabled ? "flex" : "none";

  const giteaToolbarGroup = document.getElementById("gitea-toolbar-group");
  if (giteaToolbarGroup) giteaToolbarGroup.style.display = giteaEnabled ? "flex" : "none";
}

/**
 * Refresh Git panel labels with translated strings
 */
export function refreshGitPanelStrings() {
  const panel = document.getElementById("git-panel");
  if (!panel) return;

  const title = panel.querySelector(".panel-title-text");
  if (title) title.textContent = t("sidebar.git_changes");

  const emptyState = panel.querySelector(".git-empty-state p");
  if (emptyState) emptyState.textContent = t("sidebar.no_changes");

  const btnStageSelected = document.getElementById("btn-stage-selected");
  if (btnStageSelected) btnStageSelected.textContent = t("sidebar.stage");

  const btnStageAll = document.getElementById("btn-stage-all");
  if (btnStageAll) btnStageAll.textContent = t("sidebar.stage_all");

  const btnUnstageAll = document.getElementById("btn-unstage-all");
  if (btnUnstageAll) btnUnstageAll.textContent = t("sidebar.unstage");

  const btnCommit = document.getElementById("btn-commit-staged");
  if (btnCommit) btnCommit.textContent = t("sidebar.commit");
  
  // Update group headers if rendered
  const stagedHeader = panel.querySelector('.git-file-group[data-group="staged"] .git-file-group-header span:not(.git-file-group-count)');
  if (stagedHeader) stagedHeader.textContent = t("sidebar.staged");
  
  const modifiedHeader = panel.querySelector('.git-file-group[data-group="modified"] .git-file-group-header span:not(.git-file-group-count)');
  if (modifiedHeader) modifiedHeader.textContent = t("sidebar.modified");
  
  const untrackedHeader = panel.querySelector('.git-file-group[data-group="untracked"] .git-file-group-header span:not(.git-file-group-count)');
  if (untrackedHeader) untrackedHeader.textContent = t("sidebar.untracked");
  
  const deletedHeader = panel.querySelector('.git-file-group[data-group="deleted"] .git-file-group-header span:not(.git-file-group-count)');
  if (deletedHeader) deletedHeader.textContent = t("sidebar.deleted");
}

