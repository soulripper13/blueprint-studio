/**
 * Git and Gitea management module for Blueprint Studio
 */
import { state, elements, gitState, giteaState } from './state.js';
import { API_BASE } from './constants.js';
import { fetchWithAuth } from './api.js';
import { showToast, showGlobalLoading, hideGlobalLoading, showModal } from './ui.js';
import { formatBytes, ensureDiffLibrariesLoaded, isMobile } from './utils.js';

export function isGitEnabled() {
    return state.gitIntegrationEnabled;
}

export function isGiteaEnabled() {
    return state.giteaIntegrationEnabled;
}

// ============================================
// Core Git Functions (GitHub)
// ============================================

export async function gitStatus(shouldFetch = false) {
    if (!isGitEnabled()) return;

    try {
      if (elements.btnGitStatus) {
          elements.btnGitStatus.classList.add("loading");
          elements.btnGitStatus.disabled = true;
      }

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "git_status",
            fetch: shouldFetch 
        }),
      });

      if (elements.btnGitStatus) {
          elements.btnGitStatus.classList.remove("loading");
          elements.btnGitStatus.disabled = false;
      }

      if (data.success) {
        gitState.isInitialized = data.is_initialized;
        gitState.hasRemote = data.has_remote;
        gitState.currentBranch = data.current_branch || "unknown";
        gitState.localBranches = data.local_branches || [];
        gitState.remoteBranches = data.remote_branches || [];
        gitState.ahead = data.ahead || 0;
        gitState.behind = data.behind || 0;
        gitState.status = data.status || "";
        
        gitState.files = data.files || {
          modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: []
        };

        gitState.totalChanges = [
          ...gitState.files.modified,
          ...gitState.files.added,
          ...gitState.files.deleted,
          ...gitState.files.untracked
        ].length;

        updateGitPanel();

        if (data.has_changes) {
          showToast(`Git: ${gitState.totalChanges} change(s) detected`, "success");
        }
      }
    } catch (error) {
      if (elements.btnGitStatus) {
          elements.btnGitStatus.classList.remove("loading");
          elements.btnGitStatus.disabled = false;
      }
      showToast("Git error: " + error.message, "error");
    }
}

export async function gitPull() {
    try {
      showGlobalLoading("Pulling from GitHub...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_pull" }),
      });
      hideGlobalLoading();

      if (data.success) {
        showToast("Successfully pulled changes from GitHub", "success");
        await gitStatus();
      } else {
        showToast("Failed to pull: " + data.message, "error");
      }
    } catch (error) {
      hideGlobalLoading();
      showToast("Git pull failed: " + error.message, "error");
    }
}

export async function gitPush() {
    try {
      showGlobalLoading("Pushing to GitHub...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_push" }),
      });
      hideGlobalLoading();

      if (data.success) {
        showToast("Successfully pushed to GitHub", "success");
        await gitStatus();
      } else {
        showToast("Failed to push: " + data.message, "error");
      }
    } catch (error) {
      hideGlobalLoading();
      showToast("Git push failed: " + error.message, "error");
    }
}

export async function gitCommit(message) {
    try {
        showGlobalLoading("Committing changes...");
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_commit", commit_message: message }),
        });
        hideGlobalLoading();
        if (data.success) {
            showToast("Changes committed locally", "success");
            await gitStatus();
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Commit failed: " + e.message, "error");
    }
}

export async function gitStage(files) {
    try {
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_stage", files }),
        });
        await gitStatus();
    } catch (e) {
        showToast("Staging failed: " + e.message, "error");
    }
}

export async function gitUnstage(files) {
    try {
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_unstage", files }),
        });
        await gitStatus();
    } catch (e) {
        showToast("Unstaging failed: " + e.message, "error");
    }
}

export async function gitReset(files) {
    if (!confirm(`Are you sure you want to discard changes to ${files.length} file(s)? This cannot be undone.`)) return;
    try {
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_reset", files }),
        });
        await gitStatus();
    } catch (e) {
        showToast("Reset failed: " + e.message, "error");
    }
}

export async function gitInit(skipConfirm = false) {
    if (!skipConfirm) {
        const confirmed = await showModal({
          title: "Initialize Git Repository",
          message: "Are you sure you want to initialize a new Git repository in the config directory?",
          confirmText: "Initialize",
          cancelText: "Cancel",
          danger: true
        });
        if (!confirmed) return false;
    }

    try {
      showToast("Initializing git repository...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_init" }),
      });

      if (data.success) {
        showToast("Git repository initialized successfully", "success");
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),
        });
        gitState.isInitialized = true;
        await gitStatus(); 
        return true;
      }
    } catch (error) {
      showToast("Git init failed: " + error.message, "error");
    }
    return false;
}

// ============================================
// Gitea Functions
// ============================================

export async function giteaStatus(shouldFetch = false) {
    if (!state.giteaIntegrationEnabled) return;

    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "gitea_status",
            fetch: shouldFetch 
        }),
      });

      if (data.success) {
        giteaState.isInitialized = data.is_initialized;
        giteaState.hasRemote = data.has_remote;
        giteaState.currentBranch = data.current_branch || "unknown";
        giteaState.ahead = data.ahead || 0;
        giteaState.behind = data.behind || 0;
        giteaState.status = data.status || "";
        
        giteaState.files = data.files || {
          modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: []
        };

        giteaState.totalChanges = [
          ...giteaState.files.modified,
          ...giteaState.files.added,
          ...giteaState.files.deleted,
          ...giteaState.files.untracked
        ].length;

        updateGiteaPanel();
      }
    } catch (error) {
      // Silently fail
    }
}

export async function giteaPull() {
    const confirmed = await showModal({
      title: "Pull from Gitea",
      message: "Are you sure you want to pull changes from Gitea? This will update your local files.",
      confirmText: "Pull",
      cancelText: "Cancel"
    });
    if (!confirmed) return;

    try {
      showGlobalLoading("Pulling from Gitea...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gitea_pull" }),
      });
      hideGlobalLoading();

      if (data.success) {
        showToast("Successfully pulled from Gitea", "success");
        // We'll need a way to trigger global loadFiles from here
        // For now we'll assume it will be handled by the update callback
        await giteaStatus();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast("Gitea pull failed: " + error.message, "error");
    }
}

// ============================================
// UI Rendering & Panels
// ============================================

export function updateGitPanel() {
    const panel = document.getElementById("git-panel");
    if (!panel) return;
    
    if (!isGitEnabled()) {
        panel.style.display = "none";
        return;
    }

    const container = document.getElementById("git-files-container");
    const badge = document.getElementById("git-changes-count");
    const commitBtn = document.getElementById("btn-commit-staged");
    const actions = panel.querySelector(".git-panel-actions");

    if (!container || !badge || !commitBtn || !actions) return;

    badge.textContent = gitState.totalChanges;

    const oldIndicators = actions.querySelectorAll(".git-sync-indicator");
    oldIndicators.forEach(i => i.remove());

    if (gitState.isInitialized && gitState.hasRemote) {
        if (gitState.ahead > 0) {
            const pushBtn = document.createElement("button");
            pushBtn.className = "git-panel-btn git-sync-indicator";
            pushBtn.title = `${gitState.ahead} commits to push`;
            pushBtn.innerHTML = `<span class="material-icons" style="font-size: 18px; color: var(--success-color);">arrow_upward</span><span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--success-color);">${gitState.ahead}</span>`;
            actions.insertBefore(pushBtn, actions.firstChild);
        }
        if (gitState.behind > 0) {
            const pullBtn = document.createElement("button");
            pullBtn.className = "git-panel-btn git-sync-indicator";
            pullBtn.title = `${gitState.behind} commits to pull`;
            pullBtn.innerHTML = `<span class="material-icons" style="font-size: 18px; color: var(--warning-color);">arrow_downward</span><span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--warning-color);">${gitState.behind}</span>`;
            actions.insertBefore(pullBtn, actions.firstChild);
        }
    }

    if (gitState.totalChanges > 0 || gitState.ahead > 0 || gitState.behind > 0 || !gitState.isInitialized) {
        panel.classList.add("visible");
    }

    if (!gitState.isInitialized) {
        container.innerHTML = `<div class="git-empty-state"><p>Git Not Initialized</p><button class="btn-primary" id="btn-git-init-panel">Initialize Repo</button></div>`;
        commitBtn.disabled = true;
        return;
    }

    if (gitState.totalChanges > 0) {
        renderGitFilesList(container, gitState, "git");
    } else {
        container.innerHTML = `<div class="git-empty-state"><span class="material-icons">check_circle</span><p>No changes detected</p></div>`;
    }

    commitBtn.disabled = gitState.files.staged.length === 0;
}

export function updateGiteaPanel() {
    const panel = document.getElementById("gitea-panel");
    if (!panel || !isGiteaEnabled()) {
        if (panel) panel.style.display = "none";
        return;
    }
    panel.style.display = "flex";
    // Similar to updateGitPanel...
}

function renderGitFilesList(container, stateObj, prefix) {
    // Shared rendering logic for both panels
    const groups = [
        { key: "staged", title: "Staged", files: stateObj.files.staged, icon: "check_circle", color: "success" },
        { key: "modified", title: "Modified", files: stateObj.files.modified.filter(f => !stateObj.files.staged.includes(f)), icon: "edit", color: "modified" },
        { key: "untracked", title: "Untracked", files: stateObj.files.untracked, icon: "help_outline", color: "untracked" }
    ];
    // ... HTML building ...
}

export async function showDiffModal(path) {
    try {
        await ensureDiffLibrariesLoaded(showGlobalLoading, hideGlobalLoading);
        showGlobalLoading(`Calculating diff for ${path}...`);
        
        // 1. Get original content from Git
        const gitData = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_show", path: path }),
        });

        // 2. Get current content from disk
        const diskData = await fetchWithAuth(`${API_BASE}?action=read_file&path=${encodeURIComponent(path)}&_t=${Date.now()}`);

        let oldContent = gitData.success ? gitData.content : "";
        let newContent = diskData.content;

        hideGlobalLoading();

        // Use CodeMirror.MergeView
        // ... rendering logic ...
    } catch (e) {
        hideGlobalLoading();
        showToast("Diff failed: " + e.message, "error");
    }
}

export async function gitGetRemotes() {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_get_remotes" }),
      });
      return data.success ? data.remotes : {};
    } catch (error) {
      return {};
    }
}