import { t } from './translations.js';
/** GIT-DIFF.JS | Purpose: * Visualizes git diffs and commit history. Shows file changes, commit details, */
import { state, elements, gitState } from './state.js';
import { fetchWithAuth } from './api.js';
import { eventBus } from './event-bus.js';
import { API_BASE } from './constants.js';
import {
  showGlobalLoading,
  hideGlobalLoading,
  showToast,
  showModal,
  resetModalToDefault
} from './ui.js';
import { getEditorMode, ensureDiffLibrariesLoaded } from './utils.js';
import { isGitEnabled } from './git-operations.js';

const ACTIVE_DIFF_CHUNK_CLASS = "CodeMirror-merge-active-chunk";
const MAX_ACTIVE_DIFF_HIGHLIGHT_LINES = 80;

function getMergeViewChunks(mergeView) {
  const chunks = mergeView.leftChunks?.() || mergeView.rightChunks?.() || [];
  return chunks.filter(chunk => (
    chunk.origFrom !== chunk.origTo ||
    chunk.editFrom !== chunk.editTo
  ));
}

function getChunkDisplayLine(cm, from, to) {
  const firstLine = cm.firstLine();
  const lastLine = cm.lastLine();
  const targetLine = from === to ? Math.max(firstLine, from - 1) : from;
  return Math.max(firstLine, Math.min(targetLine, lastLine));
}

function centerEditorOnLine(cm, line) {
  if (!cm) return;

  const safeLine = Math.max(cm.firstLine(), Math.min(line, cm.lastLine()));
  const scrollInfo = cm.getScrollInfo();
  const coords = cm.charCoords({ line: safeLine, ch: 0 }, "local");
  const targetTop = Math.max(0, coords.top - Math.floor(scrollInfo.clientHeight * 0.35));

  cm.scrollTo(null, targetTop);
}

function setupDiffNavigation(mergeView) {
  const previousButton = document.getElementById("diff-nav-prev");
  const nextButton = document.getElementById("diff-nav-next");
  const countLabel = document.getElementById("diff-nav-count");
  const editor = mergeView.editor();
  const leftOriginal = mergeView.leftOriginal?.();
  const rightOriginal = mergeView.rightOriginal?.();
  const chunks = getMergeViewChunks(mergeView);
  let activeIndex = chunks.length ? 0 : -1;
  let activeLineHandles = [];
  let isActive = true;
  let pendingFrame = null;

  function clearActiveChunk() {
    activeLineHandles.forEach(({ cm, handle }) => {
      cm.removeLineClass(handle, "background", ACTIVE_DIFF_CHUNK_CLASS);
    });
    activeLineHandles = [];
  }

  function markChunkInEditor(cm, from, to) {
    if (!cm) return;

    const firstLine = cm.firstLine();
    const lastLine = cm.lastLine();
    const start = getChunkDisplayLine(cm, from, to);
    const end = from === to
      ? start + 1
      : Math.max(start + 1, Math.min(to, lastLine + 1));

    const highlightedEnd = Math.min(end, start + MAX_ACTIVE_DIFF_HIGHLIGHT_LINES);

    cm.operation(() => {
      for (let line = start; line < highlightedEnd && line <= lastLine; line++) {
        const handle = cm.getLineHandle(Math.max(firstLine, line));
        if (handle) {
          cm.addLineClass(handle, "background", ACTIVE_DIFF_CHUNK_CLASS);
          activeLineHandles.push({ cm, handle });
        }
      }
    });
  }

  function updateCountLabel() {
    if (!countLabel) return;

    if (!chunks.length) {
      countLabel.textContent = "No differences";
      return;
    }

    const plural = chunks.length === 1 ? "difference" : "differences";
    countLabel.textContent = `${activeIndex + 1} / ${chunks.length} ${plural}`;
  }

  function updateButtonState() {
    const disabled = chunks.length === 0;
    if (previousButton) previousButton.disabled = disabled;
    if (nextButton) nextButton.disabled = disabled;
  }

  function jumpToChunk(index) {
    if (!chunks.length) return;

    activeIndex = (index + chunks.length) % chunks.length;
    const chunk = chunks[activeIndex];
    const editLine = getChunkDisplayLine(editor, chunk.editFrom, chunk.editTo);
    const originalLine = getChunkDisplayLine(leftOriginal || rightOriginal || editor, chunk.origFrom, chunk.origTo);

    clearActiveChunk();
    markChunkInEditor(editor, chunk.editFrom, chunk.editTo);
    markChunkInEditor(leftOriginal, chunk.origFrom, chunk.origTo);
    markChunkInEditor(rightOriginal, chunk.origFrom, chunk.origTo);
    updateCountLabel();

    if (pendingFrame) {
      cancelAnimationFrame(pendingFrame);
    }

    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = null;
      if (!isActive) return;

      centerEditorOnLine(editor, editLine);
      centerEditorOnLine(leftOriginal, originalLine);
      centerEditorOnLine(rightOriginal, originalLine);
    });
  }

  previousButton?.addEventListener("click", () => jumpToChunk(activeIndex - 1));
  nextButton?.addEventListener("click", () => jumpToChunk(activeIndex + 1));

  updateCountLabel();
  updateButtonState();

  if (chunks.length) {
    jumpToChunk(activeIndex);
  }

  return {
    cleanup() {
      isActive = false;
      if (pendingFrame) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }
      clearActiveChunk();
    }
  };
}

/**
 * Show diff modal for a file
 * Compares HEAD version with current version
 */
export async function showDiffModal(path) {
  try {
    await ensureDiffLibrariesLoaded();
    showGlobalLoading(`Calculating diff for ${path}...`);

    // 1. Get HEAD content (Old)
    const headData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_show", path: path }),
    });

    let oldContent = "";
    if (headData.success) {
      oldContent = headData.content;
    }

    // 2. Get Current Content (New)
    let newContent = "";
    const tab = state.openTabs.find(t => t.path === path);
    if (tab) {
      newContent = tab.content;
    } else {
      // Import on demand to avoid circular dependency
      const { loadFile } = await import('./app.js');
      const diskData = await loadFile(path);
      newContent = diskData.content;
    }

    hideGlobalLoading();

    // 3. Setup Modal
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    resetModalToDefault();
    modal.style.maxWidth = "95vw";
    modal.style.width = "95vw";
    modal.style.height = "85vh";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";

    modalTitle.textContent = `Diff: ${path}`;
    modalFooter.style.display = "none";

    // Use flex column for body to let MergeView fill it
    modalBody.innerHTML = `
      <div class="diff-viewer-toolbar">
        <div class="diff-viewer-summary">
          <span class="material-icons">difference</span>
          <span id="diff-nav-count">No differences</span>
        </div>
        <div class="diff-viewer-actions" aria-label="Diff navigation">
          <button id="diff-nav-prev" class="diff-nav-btn" type="button" title="Previous difference" aria-label="Previous difference">
            <span class="material-icons">keyboard_arrow_up</span>
          </button>
          <button id="diff-nav-next" class="diff-nav-btn" type="button" title="Next difference" aria-label="Next difference">
            <span class="material-icons">keyboard_arrow_down</span>
          </button>
        </div>
      </div>
      <div id="diff-view" class="diff-viewer-container"></div>
    `;
    modalBody.style.padding = "0";
    modalBody.style.flex = "1";
    modalBody.style.display = "flex";
    modalBody.style.flexDirection = "column";
    modalBody.style.overflow = "hidden"; // Let CodeMirror handle scroll

    modalOverlay.classList.add("visible");

    // 4. Initialize CodeMirror Merge View
    const target = document.getElementById("diff-view");
    const mode = getEditorMode(path);

    // Old on Left (origLeft), New on Right (value/main)
    const mergeView = CodeMirror.MergeView(target, {
      value: newContent,
      origLeft: oldContent,
      lineNumbers: true,
      mode: mode,
      theme: state.theme === "light" ? "default" : "material-darker",
      highlightDifferences: true,
      connect: "align",
      collapseIdentical: false,
      readOnly: true,
      revertButtons: false
    });
    const diffNavigation = setupDiffNavigation(mergeView);

    // Cleanup handler
    let isClosed = false;
    let unsubscribeHideModal = null;
    const closeHandler = () => {
      if (isClosed) return;
      isClosed = true;
      diffNavigation.cleanup();
      modalOverlay.classList.remove("visible");
      modalOverlay.removeEventListener("click", overlayClickHandler);
      if (unsubscribeHideModal) unsubscribeHideModal();
      // Clean up modal styles
      resetModalToDefault();
      modal.style.width = "";
      modal.style.height = "";
      modal.style.display = "";
      modal.style.flexDirection = "";
      modalBody.style.padding = "";
      modalBody.style.flex = "";
      modalBody.style.display = "";
      modalBody.style.flexDirection = "";
      modalBody.style.overflow = "";
    };

    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) closeHandler();
    };
    modalOverlay.addEventListener("click", overlayClickHandler);
    document.getElementById("modal-close").onclick = closeHandler;
    unsubscribeHideModal = eventBus.on("ui:hide-modal", closeHandler);

  } catch (error) {
    hideGlobalLoading();
    showToast(t("toast.diff_failed", { error: error.message }), "error");
  }
}

/**
 * Show git commit history
 */
export async function showGitHistory() {
  if (!isGitEnabled()) {
    showToast(t("toast.git_integration_is_not_enabled"), "error");
    return;
  }

  if (!gitState.isInitialized) {
    showToast(t("toast.git_integration_is_not_initial"), "error");
    return;
  }

  try {
    showGlobalLoading("Fetching history...");
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_log", count: 30 }),
    });
    hideGlobalLoading();

    if (data.success) {
      if (data.commits.length === 0) {
        showToast(t("toast.no_commits_found_in_this_repos"), "success");
        return;
      }

      const commitListHtml = data.commits.map(commit => {
        const date = new Date(commit.timestamp * 1000).toLocaleString();
        return `
          <div class="git-history-item" data-hash="${commit.hash}" style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 600; color: var(--accent-color); font-family: monospace;">${commit.hash.substring(0, 7)}</span>
              <span style="font-size: 11px; color: var(--text-muted);">${date}</span>
            </div>
            <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">${commit.message}</div>
            <div style="font-size: 12px; color: var(--text-secondary); opacity: 0.8;">by ${commit.author}</div>
          </div>
        `;
      }).join("");

      // Show commit history modal
      const historyPromise = showModal({
        title: "Commit History",
        message: `
          <div style="max-height: 60vh; overflow-y: auto; margin: -16px; background: var(--bg-primary);">
            ${commitListHtml}
          </div>
        `,
        confirmText: "Close",
        onConfirm: () => {}
      });

      // Make modal wider (responsive for mobile)
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.maxWidth = "min(900px, 95vw)";
        modal.style.width = "min(900px, 95vw)";
      }

      // Add click listeners to history items
      setTimeout(() => {
        const items = document.querySelectorAll(".git-history-item");
        items.forEach(item => {
          item.addEventListener("click", () => {
            const hash = item.getAttribute("data-hash");
            const commit = data.commits.find(c => c.hash === hash);
            showGitCommitDiff(commit);
          });
          item.addEventListener("mouseenter", () => item.style.background = "var(--bg-tertiary)");
          item.addEventListener("mouseleave", () => item.style.background = "transparent");
        });
      }, 100);

    } else {
      showToast(t("toast.fetch_history_failed", { error: data.message }), "error");
    }
  } catch (e) {
    hideGlobalLoading();
    showToast(t("toast.fetch_history_error", { error: e.message }), "error");
  }
}

/**
 * Show diff for a specific commit
 */
export async function showGitCommitDiff(commit) {
  try {
    showGlobalLoading(`Loading diff for ${commit.hash.substring(0, 7)}...`);
    const data = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_diff_commit", hash: commit.hash }),
    });
    hideGlobalLoading();

    if (data.success) {
      // We'll reuse the modal but with a large diff view
      const date = new Date(commit.timestamp * 1000).toLocaleString();

      // Format diff with some basic coloring
      const lines = data.diff.split("\n");
      const coloredDiff = lines.map(line => {
        let color = "inherit";
        if (line.startsWith("+") && !line.startsWith("+++")) color = "var(--success-color)";
        else if (line.startsWith("-") && !line.startsWith("---")) color = "var(--error-color)";
        else if (line.startsWith("@@")) color = "var(--accent-color)";

        return `<div style="color: ${color}; white-space: pre-wrap; font-family: monospace; font-size: 12px; line-height: 1.4;">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
      }).join("");

      // Show commit diff modal
      const diffPromise = showModal({
        title: `Commit: ${commit.hash.substring(0, 7)}`,
        message: `
          <div style="display: flex; flex-direction: column; height: 70vh;">
            <div style="padding-bottom: 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 12px;">
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${commit.message}</div>
              <div style="font-size: 12px; color: var(--text-secondary);">
                <strong>Author:</strong> ${commit.author} | <strong>Date:</strong> ${date}
              </div>
            </div>
            <div style="flex: 1; overflow: auto; background: var(--bg-primary); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color);">
              ${coloredDiff || '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No changes to display in this commit</div>'}
            </div>
          </div>
        `,
        confirmText: "Back to History"
      });

      // Make modal wider (responsive for mobile)
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.maxWidth = "min(900px, 95vw)";
        modal.style.width = "min(900px, 95vw)";
      }

      // Wait for user to close the modal
      const result = await diffPromise;

      // Only navigate back to history if user clicked "Back to History" button
      // (not if they clicked Cancel/Close which returns null)
      if (result !== null) {
        await showGitHistory();
      }

    } else {
      showToast(t("toast.fetch_diff_failed", { error: data.message }), "error");
    }
  } catch (e) {
    hideGlobalLoading();
    showToast(t("toast.fetch_diff_error", { error: e.message }), "error");
  }
}
