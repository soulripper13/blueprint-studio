/**
 * ============================================================================
 * EVENT HANDLERS MODULE
 * ============================================================================
 *
 * PURPOSE:
 * Centralizes all event listener setup and keyboard shortcut handling.
 * This module wires up all UI interactions and global keyboard shortcuts.
 *
 * EXPORTED FUNCTIONS:
 * - registerEventHandlerCallbacks(cb) - Register dependencies from app.js
 * - setupEventListeners() - Initialize all event listeners (called on app init)
 * - restartHomeAssistant() - Restart HA server
 * - insertUUID() - Insert UUID at cursor position
 *
 * REQUIRED CALLBACKS (from app.js):
 * - saveCurrentFile, openFile, closeTab, activateTab, nextTab, previousTab
 * - closeAllTabs, closeOtherTabs, closeTabsToRight
 * - performGlobalSearch, performGlobalReplace, showCommandPalette
 * - formatCode, toggleMarkdownPreview, toggleAISidebar, sendAIChatMessage
 * - promptNewFile, promptNewFolder, saveSettings, loadSettings
 * - toggleSelectionMode, toggleFavorite, renderFileTree, openSearchWidget
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding a new keyboard shortcut:
 *    - Add to the keydown event handler in setupEventListeners()
 *    - Follow the existing pattern: check platform (isMac), check modifiers
 *    - Call the appropriate callback or imported function
 *    - Example: if (e.key === 'n' && isMac && e.metaKey) { doSomething(); }
 *
 * 2. Adding a new button click handler:
 *    - Add to setupEventListeners() function
 *    - Use elements.yourButton?.addEventListener('click', handler)
 *    - Keep handlers simple - delegate complex logic to other modules
 *
 * 3. Adding a new modal/dialog handler:
 *    - Add listener in setupEventListeners()
 *    - Use callbacks.showModal() or callbacks.showConfirmDialog()
 *    - Handle result with async/await
 *
 * 4. Adding a callback dependency:
 *    - Add to callbacks object
 *    - Add to registerEventHandlerCallbacks registration in app.js
 *    - Use callbacks.yourFunction() in event handlers
 *
 * INTEGRATION POINTS:
 * - state.js: Access global state (state.editor, state.activeTab, etc.)
 * - elements: All DOM element references
 * - ui.js: Modal/toast/theme functions
 * - sidebar.js: Sidebar navigation
 * - search.js: In-editor search widget
 * - file-operations.js: YAML validation
 * - app.js: Provides most callbacks for file/tab/git operations
 *
 * ARCHITECTURE NOTES:
 * - This module is "passive" - it only sets up listeners, doesn't perform operations
 * - All complex logic should be in other modules (git-operations, file-operations, etc.)
 * - Event handlers should be lightweight and delegate to callbacks
 * - Keyboard shortcuts are platform-aware (Cmd on Mac, Ctrl on Windows/Linux)
 *
 * COMMON PATTERNS:
 * - if (!callbacks.someFunction) return; // Guard against missing callbacks
 * - e.preventDefault() before calling handler
 * - await callbacks.asyncFunction() for async operations
 * - Check state before acting (if (!state.activeTab) return;)
 *
 * ============================================================================
 */

import { state, elements } from './state.js';
import { API_BASE } from './constants.js';
import { fetchWithAuth } from './api.js';
import { 
    showToast, showGlobalLoading, hideGlobalLoading, showModal, 
    showConfirmDialog, hideModal, confirmModal, applyTheme, 
    setThemePreset, setTheme 
} from './ui.js';
import { isMobile, isTextFile } from './utils.js';
import { validateYaml } from './file-operations.js';
import { 
    switchSidebarView, hideSidebar, toggleSidebar, showSidebar 
} from './sidebar.js';
import {
    openSearchWidget, closeSearchWidget, updateSearchHighlights,
    updateMatchStatus, doFind, doReplace, doReplaceAll
} from './search.js';
import {
    showShortcuts, hideShortcuts, requestFeature, reportIssue
} from './dialogs.js';
import { 
    showQuickSwitcher, hideQuickSwitcher 
} from './quick-switcher.js';
import {
    toggleSelectionMode, deleteSelectedItems
} from './selection.js';
import {
    triggerUpload, downloadCurrentFile, handleFileUpload,
    triggerFolderUpload, downloadFolder, handleFolderUpload,
    processUploads, downloadFileByPath,
    downloadSelectedItems
} from './downloads-uploads.js';
import {
    gitStatus, isGitEnabled, gitInit
} from './git-operations.js';
import {
    gitPull, gitPush
} from './git.js';
import { 
    giteaStatus, giteaPull, giteaPush, showGiteaSettings, 
    giteaCommit, stageSelectedGiteaFiles, stageAllGiteaFiles, 
    unstageAllGiteaFiles, giteaAbort, giteaForcePush, giteaHardReset, 
    toggleGiteaFileSelection 
} from './gitea-integration.js';
import { showDiffModal, showGitHistory } from './git-diff.js';
import { showGitSettings } from './github-integration.js';
import { renderFileTree, debouncedRenderFileTree, handleFileDrop, cancelPendingSearch, collapseAllFolders } from './file-tree.js';
import { showAppSettings } from './settings-ui.js';
import { saveSettings, updateShowHiddenButton } from './settings.js';
import { hideContextMenu } from './context-menu.js';
import { updateToolbarState } from './toolbar.js';

let callbacks = {
    loadFiles: null,
    saveCurrentFile: null,
    saveAllFiles: null,
    formatCode: null,
    performGlobalReplace: null,
    performGlobalSearch: null,
    toggleMarkdownPreview: null,
    toggleAISidebar: null,
    sendAIChatMessage: null,
    promptNewFile: null,
    promptNewFolder: null,
    toggleGitGroup: null,
    stageSelectedFiles: null,
    stageAllFiles: null,
    unstageAllFiles: null,
    commitStagedFiles: null,
    toggleFileSelection: null,
    promptRename: null,
    promptMove: null,
    promptCopy: null,
    duplicateItem: null,
    promptDelete: null,
    closeTab: null,
    activateTab: null,
    nextTab: null,
    previousTab: null,
    showCommandPalette: null,
    restartHomeAssistant: null, // If we decide to keep it in app.js, otherwise we export it
    debouncedContentSearch: null,
    debouncedFilenameSearch: null,
    // Split view callbacks
    enableSplitView: null,
    disableSplitView: null,
    moveToPrimaryPane: null,
    moveToSecondaryPane: null,
    setActivePaneFromPosition: null,
    // Folder navigation callbacks
    navigateBack: null,
};

export function registerEventHandlerCallbacks(cb) {
    callbacks = { ...callbacks, ...cb };
}

/**
 * Updates split view button visibility based on split view state
 */
export function updateSplitViewButtons() {
    const btnSplitVertical = document.getElementById("btn-split-vertical");
    const btnSplitClose = document.getElementById("btn-split-close");

    // Check if split view feature is enabled in settings
    if (!state.enableSplitView) {
        // Hide all split view buttons if feature is disabled
        if (btnSplitVertical) btnSplitVertical.style.display = "none";
        if (btnSplitClose) btnSplitClose.style.display = "none";
        return;
    }

    // Hide all split buttons if less than 2 tabs are open

    // Need at least 2 tabs to enable split view
    if (state.openTabs.length < 2) {
        if (btnSplitVertical) btnSplitVertical.style.display = "none";
        if (btnSplitClose) btnSplitClose.style.display = "none";
        return;
    }

    if (state.splitView && state.splitView.enabled) {
        // Split is active - hide enable button, show close button
        if (btnSplitVertical) btnSplitVertical.style.display = "none";
        if (btnSplitClose) btnSplitClose.style.display = "inline-flex";
    } else {
        // Split is not active - show enable button, hide close button
        if (btnSplitVertical) btnSplitVertical.style.display = "inline-flex";
        if (btnSplitClose) btnSplitClose.style.display = "none";
    }
}

// Listen for split view setting changes from settings UI
window.addEventListener('splitViewSettingChanged', (e) => {
    updateSplitViewButtons();
});

export function insertUUID() {
    if (!state.editor || !state.editor.hasFocus()) return;
    
    // Generate UUID v4
    const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    state.editor.replaceSelection(uuid);
}

export async function restartHomeAssistant() {
    const confirmed = await showConfirmDialog({
        title: "Restart Home Assistant?",
        message: "Are you sure you want to restart Home Assistant? Blueprint Studio will be unavailable until the restart completes.",
        confirmText: "Restart",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        // Save current state before restart
        await saveSettings();

        try {
            const data = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "restart_home_assistant" }),
            });
            if (data.success) {
                showGlobalLoading("Restarting Home Assistant...");

                // Function to check if HA is back online
                const checkOnline = async () => {
                    try {
                        // Use fetchWithAuth to avoid "invalid authentication" warnings in logs
                        const data = await fetchWithAuth(`${API_BASE}?action=get_version`);
                        if (data) {
                            console.log("Blueprint Studio: Server is back online, reloading workspace in 2 seconds...");
                            // Add a tiny extra buffer to ensure everything is initialized
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                            return;
                        }
                    } catch (e) {
                        // Network error or auth error (still down/restarting), keep waiting
                    }
                    setTimeout(checkOnline, 2000);
                };
                
                // Start checking after 5 seconds
                setTimeout(checkOnline, 5000);
            } else {
                showToast("Failed to restart Home Assistant: " + (data.error || "Unknown error"), "error");
            }
        } catch (error) {
            showToast("Error initiating restart", "error");
            console.error(error);
        }
    }
}

export function initEventListeners() {
    // Activity Bar
    if (elements.activityExplorer) {
        elements.activityExplorer.addEventListener("click", () => switchSidebarView("explorer"));
    }
    if (elements.activitySearch) {
        elements.activitySearch.addEventListener("click", () => switchSidebarView("search"));
    }
    const btnCloseSidebarBar = document.getElementById("btn-close-sidebar-bar");
    if (btnCloseSidebarBar) {
        btnCloseSidebarBar.addEventListener("click", hideSidebar);
    }

    // Global Search Toolbar
    ['btnMatchCase', 'btnMatchWord', 'btnUseRegex'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                btn.classList.toggle("active");
                triggerGlobalSearch();
            });
        }
    });

    if (elements.btnToggleReplaceAll) {
        elements.btnToggleReplaceAll.addEventListener("click", () => {
            const isVisible = elements.globalReplaceContainer.style.display === "flex";
            elements.globalReplaceContainer.style.display = isVisible ? "none" : "flex";
            elements.btnToggleReplaceAll.classList.toggle("rotated", !isVisible);
        });
    }

    if (elements.btnTogglePatterns) {
        elements.btnTogglePatterns.addEventListener("click", () => {
            const isVisible = elements.globalPatternsContainer.style.display === "flex";
            elements.globalPatternsContainer.style.display = isVisible ? "none" : "flex";
        });
    }

    if (elements.globalSearchInput) {
        let debounceTimer;
        elements.globalSearchInput.addEventListener("input", (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => triggerGlobalSearch(), 500);
        });
    }

    if (elements.globalSearchInclude) {
        elements.globalSearchInclude.addEventListener("input", () => {
            if (state._patternTimer) clearTimeout(state._patternTimer);
            state._patternTimer = setTimeout(() => triggerGlobalSearch(), 800);
        });
    }

    if (elements.globalSearchExclude) {
        elements.globalSearchExclude.addEventListener("input", () => {
            if (state._patternTimer) clearTimeout(state._patternTimer);
            state._patternTimer = setTimeout(() => triggerGlobalSearch(), 800);
        });
    }

    if (elements.btnGlobalReplaceAll) {
        elements.btnGlobalReplaceAll.addEventListener("click", () => {
            if (callbacks.performGlobalReplace) callbacks.performGlobalReplace();
        });
    }

    const btnRefreshSearch = document.getElementById('btn-refresh-search');
    if (btnRefreshSearch) {
        btnRefreshSearch.addEventListener('click', () => {
            triggerGlobalSearch();
        });
    }

    const btnCollapseSearch = document.getElementById('btn-collapse-search');
    if (btnCollapseSearch) {
        btnCollapseSearch.addEventListener('click', () => {
            if (!elements.globalSearchResults) return;
            const lists = elements.globalSearchResults.querySelectorAll('.search-result-list');
            const arrows = elements.globalSearchResults.querySelectorAll('.search-result-file-header .arrow');
            const icon = btnCollapseSearch.querySelector('.material-icons');
            const isCollapsing = icon && icon.textContent.trim() === 'unfold_less';
            if (isCollapsing) {
                lists.forEach(list => list.classList.add('hidden'));
                arrows.forEach(arrow => arrow.classList.remove('rotated'));
                if (icon) icon.textContent = 'unfold_more';
                btnCollapseSearch.title = 'Expand All';
            } else {
                lists.forEach(list => list.classList.remove('hidden'));
                arrows.forEach(arrow => arrow.classList.add('rotated'));
                if (icon) icon.textContent = 'unfold_less';
                btnCollapseSearch.title = 'Collapse All';
            }
        });
    }

    function triggerGlobalSearch() {
        const query = elements.globalSearchInput.value;
        if (!query || query.length < 2) {
            if (elements.globalSearchResults) {
                elements.globalSearchResults.innerHTML = `
                    <div class="search-empty-state" style="padding: 40px 20px; text-align: center; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center;">
                        <span class="material-icons" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;">search</span>
                        <p style="margin: 0; font-size: 14px;">Type to search across all files</p>
                    </div>`;
            }
            return;
        }
        
        if (callbacks.performGlobalSearch) {
            callbacks.performGlobalSearch(query, {
                caseSensitive: elements.btnMatchCase?.classList.contains("active"),
                useRegex: elements.btnUseRegex?.classList.contains("active"),
                matchWord: elements.btnMatchWord?.classList.contains("active"),
                include: elements.globalSearchInclude.value,
                exclude: elements.globalSearchExclude.value
            });
        }
    }

    // Menu button (sidebar toggle)
    if (elements.btnMenu) {
      elements.btnMenu.addEventListener("click", toggleSidebar);
    }

    // Close sidebar button
    if (elements.btnCloseSidebar) {
      elements.btnCloseSidebar.addEventListener("click", hideSidebar);
    }

    // Sidebar overlay click
    if (elements.sidebarOverlay) {
      elements.sidebarOverlay.addEventListener("click", hideSidebar);
    }

    // Save buttons
    if (elements.btnSave) {
      elements.btnSave.addEventListener("click", () => {
        if (callbacks.saveCurrentFile) callbacks.saveCurrentFile();
      });
    }
    if (elements.btnSaveAll) {
      elements.btnSaveAll.addEventListener("click", () => {
        if (callbacks.saveAllFiles) callbacks.saveAllFiles();
      });
    }

    // Undo/Redo
    if (elements.btnUndo) {
      elements.btnUndo.addEventListener("click", () => {
        if (state.editor) {
          state.editor.undo();
          updateToolbarState();
        }
      });
    }
    if (elements.btnRedo) {
      elements.btnRedo.addEventListener("click", () => {
        if (state.editor) {
          state.editor.redo();
          updateToolbarState();
        }
      });
    }

    if (elements.btnFormat) {
        elements.btnFormat.addEventListener("click", () => {
            if (callbacks.formatCode) callbacks.formatCode();
        });
    }

    // Search
    if (elements.btnSearch) {
      elements.btnSearch.addEventListener("click", () => {
        if (state.editor) {
          openSearchWidget(false);
        }
      });
    }

    // Search Input Listener
    if (elements.searchFindInput) {
      elements.searchFindInput.addEventListener("input", (e) => {
        const query = e.target.value;
        if (state.editor) {
            updateSearchHighlights(query);
            updateMatchStatus(query);
        }
      });
    }

    // Support Modal
    if (elements.btnSupport) {
      elements.btnSupport.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.add("visible");
      });
    }

    if (elements.btnCloseSupport) {
      elements.btnCloseSupport.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
      });
    }
    
    // Support Modal Actions
    if (elements.btnSupportShortcuts) {
      elements.btnSupportShortcuts.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        showShortcuts();
      });
    }

    if (elements.btnSupportFeature) {
      elements.btnSupportFeature.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        requestFeature();
      });
    }

    if (elements.btnSupportIssue) {
      elements.btnSupportIssue.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        reportIssue();
      });
    }

    if (elements.btnGithubStar) {
        elements.btnGithubStar.addEventListener("click", async (e) => {
            if (isGitEnabled()) {
                e.preventDefault();
                try {
                    const res = await fetchWithAuth(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "github_star" }) });
                    if (res.success) {
                        showToast("Successfully starred the repository! Thank you!", "success");
                        elements.modalSupportOverlay.classList.remove("visible");
                    } else {
                        // Fallback to link if API fails
                        window.open(elements.btnGithubStar.href, '_blank');
                    }
                } catch (err) { window.open(elements.btnGithubStar.href, '_blank'); }
            }
        });
    }

    if (elements.btnGithubFollow) {
        elements.btnGithubFollow.addEventListener("click", async (e) => {
            if (isGitEnabled()) {
                e.preventDefault();
                try {
                    const res = await fetchWithAuth(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "github_follow" }) });
                    if (res.success) {
                        showToast("Now following soulripper13! Thank you!", "success");
                        elements.modalSupportOverlay.classList.remove("visible");
                    } else {
                        // Fallback to link if API fails
                        window.open(elements.btnGithubFollow.href, '_blank');
                    }
                } catch (err) { window.open(elements.btnGithubFollow.href, '_blank'); }
            }
        });
    }

    // Close support modal on outside click
    if (elements.modalSupportOverlay) {
        elements.modalSupportOverlay.addEventListener("click", (e) => {
            if (e.target === elements.modalSupportOverlay) {
                elements.modalSupportOverlay.classList.remove("visible");
            }
        });
    }

    if (elements.btnToggleSelect) {
      elements.btnToggleSelect.addEventListener("click", toggleSelectionMode);
    }

    // Collapse All Folders
    if (elements.btnCollapseAllFolders) {
      elements.btnCollapseAllFolders.addEventListener("click", () => {
        collapseAllFolders();
      });
    }

    // One Tab Mode toggle
    if (elements.btnOneTabMode) {
      elements.btnOneTabMode.addEventListener("click", () => {
        state.onTabMode = !state.onTabMode;
        elements.btnOneTabMode.classList.toggle("active", state.onTabMode);
        elements.btnOneTabMode.title = state.onTabMode
          ? "One Tab Mode: ON — only last opened file is kept (click to disable)"
          : "One Tab Mode: OFF — click to enable (auto-saves & closes other tabs on open)";
        saveSettings();
      });
      // Restore visual state on init
      elements.btnOneTabMode.classList.toggle("active", !!state.onTabMode);
    }

    if (elements.btnDownloadSelected) {
      elements.btnDownloadSelected.addEventListener("click", downloadSelectedItems);
    }

    if (elements.btnDeleteSelected) {
      elements.btnDeleteSelected.addEventListener("click", deleteSelectedItems);
    }

    if (elements.btnCancelSelection) {
      elements.btnCancelSelection.addEventListener("click", toggleSelectionMode);
    }

    // Refresh (Hard Refresh)
    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener("click", () => {
        if (callbacks.loadFiles) callbacks.loadFiles(true);
      });
    }

    // Folder Navigation: Back button
    const btnNavBack = document.getElementById("btn-nav-back");
    if (btnNavBack) {
      btnNavBack.addEventListener("click", () => {
        if (callbacks.navigateBack) callbacks.navigateBack();
      });
    }

    // Restart HA
    if (elements.btnRestartHa) {
      elements.btnRestartHa.addEventListener("click", restartHomeAssistant);
    }

    // App Settings
    if (elements.btnAppSettings) {
      elements.btnAppSettings.addEventListener("click", showAppSettings);
    }

    if (elements.btnMarkdownPreview) {
      elements.btnMarkdownPreview.addEventListener("click", () => {
        if (callbacks.toggleMarkdownPreview) callbacks.toggleMarkdownPreview();
      });
    }

    // Split View buttons
    // Split View: Toggle vertical split
    const btnSplitVertical = document.getElementById("btn-split-vertical");
    if (btnSplitVertical) {
      btnSplitVertical.addEventListener("click", () => {
        if (callbacks.enableSplitView) {
          callbacks.enableSplitView('vertical');
          updateSplitViewButtons();
        }
      });
    }

    // Split View: Close split
    const btnSplitClose = document.getElementById("btn-split-close");
    if (btnSplitClose) {
      btnSplitClose.addEventListener("click", () => {
        if (callbacks.disableSplitView) {
          callbacks.disableSplitView();
          updateSplitViewButtons();
        }
      });
    }

    // AI Studio button
    const btnAI = document.getElementById("btn-ai-studio");
    if (btnAI) {
      btnAI.addEventListener("click", () => {
        if (callbacks.toggleAISidebar) callbacks.toggleAISidebar();
      });
    }

    const btnCloseAI = document.getElementById("btn-close-ai");
    if (btnCloseAI) {
      btnCloseAI.addEventListener("click", () => {
        if (callbacks.toggleAISidebar) callbacks.toggleAISidebar();
      });
    }

    const btnAISend = document.getElementById("btn-ai-send");
    if (btnAISend) {
      btnAISend.addEventListener("click", () => {
        if (callbacks.sendAIChatMessage) callbacks.sendAIChatMessage();
      });
    }

    const aiInput = document.getElementById("ai-chat-input");
    if (aiInput) {
      aiInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (callbacks.sendAIChatMessage) callbacks.sendAIChatMessage();
        }
      });
    }

    // Validate YAML
    if (elements.btnValidate) {
      elements.btnValidate.addEventListener("click", async () => {
        if (state.activeTab) {
          const result = await validateYaml(state.activeTab.content);
          if (result.valid) {
            showToast("YAML is valid!", "success");
          } else {
            showToast("YAML error detected.", "error", 0, { // Use duration 0 to keep toast visible until action
              text: "View Details",
              callback: async () => {
                // Display the full error in a modal
                await showModal({
                  title: "YAML Validation Error",
                  message: `<div style="background: var(--bg-tertiary); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; max-height: 300px; overflow-y: auto;">${result.error}</div>`,
                  confirmText: "Close",
                  isDanger: true // Indicate error
                });
              }
            });
          }
        } else {
          showToast("No file open", "warning");
        }
      });
    }

    // Breadcrumb copy button
    if (elements.breadcrumbCopy) {
      elements.breadcrumbCopy.addEventListener("click", () => {
        const path = elements.filePath?.textContent;
        if (path) {
          navigator.clipboard.writeText(path).then(() => {
            // Visual feedback
            elements.breadcrumbCopy.classList.add("copied");
            const icon = elements.breadcrumbCopy.querySelector(".material-icons");
            if (icon) {
              const originalIcon = icon.textContent;
              icon.textContent = "check";
              setTimeout(() => {
                icon.textContent = originalIcon;
                elements.breadcrumbCopy.classList.remove("copied");
              }, 2000);
            }
            showToast("Path copied to clipboard", "success");
          }).catch(() => {
            showToast("Failed to copy path", "error");
          });
        } else {
          showToast("No file open", "warning");
        }
      });
    }

    // Shortcuts overlay close button
    if (elements.shortcutsClose) {
      elements.shortcutsClose.addEventListener("click", hideShortcuts);
    }

    // Close shortcuts on overlay click
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.addEventListener("click", (e) => {
        if (e.target === elements.shortcutsOverlay) {
          hideShortcuts();
        }
      });
    }

    // New File/Folder buttons
    if (elements.btnNewFile) {
      elements.btnNewFile.addEventListener("click", () => {
        if (callbacks.promptNewFile) callbacks.promptNewFile();
      });
    }
    if (elements.btnNewFolder) {
      elements.btnNewFolder.addEventListener("click", () => {
        if (callbacks.promptNewFolder) callbacks.promptNewFolder();
      });
    }
    if (elements.btnNewFileSidebar) {
      elements.btnNewFileSidebar.addEventListener("click", () => {
        if (callbacks.promptNewFile) callbacks.promptNewFile();
      });
    }
    if (elements.btnNewFolderSidebar) {
      elements.btnNewFolderSidebar.addEventListener("click", () => {
        if (callbacks.promptNewFolder) callbacks.promptNewFolder();
      });
    }

    // Upload/Download buttons
    if (elements.btnUpload) {
      elements.btnUpload.addEventListener("click", triggerUpload);
    }
    if (elements.btnDownload) {
      elements.btnDownload.addEventListener("click", downloadCurrentFile);
    }
    if (elements.fileUploadInput) {
      elements.fileUploadInput.addEventListener("change", handleFileUpload);
    }
    if (elements.btnUploadFolder) {
      elements.btnUploadFolder.addEventListener("click", triggerFolderUpload);
    }
    if (elements.btnDownloadFolder) {
      elements.btnDownloadFolder.addEventListener("click", () => {
        if (state.currentFolderPath) {
          downloadFolder(state.currentFolderPath);
        } else {
          showToast("Select a folder first", "warning");
        }
      });
    }
    if (elements.folderUploadInput) {
      elements.folderUploadInput.addEventListener("change", handleFolderUpload);
    }

    // Git buttons
    if (elements.btnGitStatus) {
      elements.btnGitStatus.addEventListener("click", () => gitStatus(true));
    }
    if (elements.btnGitHistory) {
      elements.btnGitHistory.addEventListener("click", () => showGitHistory());
    }
    if (elements.btnGitPull) {
      elements.btnGitPull.addEventListener("click", gitPull);
    }
    if (elements.btnGitPush) {
      elements.btnGitPush.addEventListener("click", gitPush);
    }

    // Git Settings button
    if (elements.btnGitSettings) {
      elements.btnGitSettings.addEventListener("click", showGitSettings);
    }

    // Git panel buttons
    if (elements.btnGitRefresh) {
      elements.btnGitRefresh.addEventListener("click", () => gitStatus(true));
    }
    if (elements.btnGitHelp) {
      elements.btnGitHelp.addEventListener("click", () => {
        showModal({
          title: "Git for Beginners",
          message: `
            <div style="line-height: 1.6;">
              <p>Git helps you track changes and sync them with GitHub. Here is the typical workflow:</p>
              <br>
              <p><b>1. Stage (Prepare):</b> Select the files you've changed and click "Stage". This is like putting items into a box before shipping.</p>
              <br>
              <p><b>2. Commit (Save Checkpoint):</b> Give your prepared changes a name (message) and click "Commit". This saves a "checkpoint" of your work on your local device.</p>
              <br>
              <p><b>3. Push (Upload):</b> Click the "↑" arrow or "Git Push" to upload your saved checkpoints to GitHub.</p>
              <br>
              <p><b>4. Pull (Download):</b> Click the "↓" arrow or "Git Pull" to download any new changes from GitHub to your device.</p>
            </div>
          `,
          confirmText: "Got it!"
        });
      });
    }
    if (elements.btnGitCollapse) {
      elements.btnGitCollapse.addEventListener("click", () => {
        const panel = document.getElementById("git-panel");
        if (panel) {
          panel.classList.toggle("collapsed");
          const isCollapsed = panel.classList.contains("collapsed");
          state.gitPanelCollapsed = isCollapsed;
          saveSettings();
          const icon = elements.btnGitCollapse.querySelector(".material-icons");
          if (icon) {
            icon.textContent = isCollapsed ? "expand_more" : "expand_less";
            elements.btnGitCollapse.title = isCollapsed ? "Expand Git Panel" : "Collapse Git Panel";
          }
        }
      });
    }
    if (elements.btnFileTreeCollapse) {
      elements.btnFileTreeCollapse.addEventListener("click", () => {
        const fileTree = document.getElementById("file-tree");
        const resizeHandle = document.getElementById("sftp-resize-handle");
        const sftpPanel = document.getElementById("sftp-panel");
        const sftpPanelBody = document.getElementById("sftp-panel-body");
        state.fileTreeCollapsed = !state.fileTreeCollapsed;
        const icon = elements.btnFileTreeCollapse.querySelector(".material-icons");
        if (state.fileTreeCollapsed) {
          if (fileTree) fileTree.style.display = "none";
          if (resizeHandle) resizeHandle.style.display = "none";
          // SFTP panel fills remaining space
          if (sftpPanel) sftpPanel.style.flex = "1";
          if (sftpPanelBody && !state.sftpPanelCollapsed) {
            sftpPanelBody.style.height = "auto";
            sftpPanelBody.style.flex = "1";
          }
          if (icon) icon.textContent = "expand_more";
          elements.btnFileTreeCollapse.title = "Expand file tree";
        } else {
          if (fileTree) fileTree.style.display = "";
          if (resizeHandle && !state.sftpPanelCollapsed) resizeHandle.style.display = "";
          // Restore SFTP panel fixed height
          if (sftpPanel) sftpPanel.style.flex = "";
          if (sftpPanelBody) {
            sftpPanelBody.style.flex = "";
            sftpPanelBody.style.height = `${state.sftpPanelHeight || 300}px`;
          }
          if (icon) icon.textContent = "expand_less";
          elements.btnFileTreeCollapse.title = "Collapse file tree";
        }
        saveSettings();
      });
    }
    if (elements.btnStageSelected) {
      elements.btnStageSelected.addEventListener("click", () => {
        if (callbacks.stageSelectedFiles) callbacks.stageSelectedFiles();
      });
    }
    if (elements.btnStageAll) {
      elements.btnStageAll.addEventListener("click", () => {
        if (callbacks.stageAllFiles) callbacks.stageAllFiles();
      });
    }
    if (elements.btnUnstageAll) {
      elements.btnUnstageAll.addEventListener("click", () => {
        if (callbacks.unstageAllFiles) callbacks.unstageAllFiles();
      });
    }
    if (elements.btnCommitStaged) {
      elements.btnCommitStaged.addEventListener("click", () => {
        if (callbacks.commitStagedFiles) callbacks.commitStagedFiles();
      });
    }

    // Gitea buttons
    if (elements.btnGiteaStatus) {
      elements.btnGiteaStatus.addEventListener("click", () => giteaStatus(true));
    }
    if (elements.btnGiteaHistory) {
      elements.btnGiteaHistory.addEventListener("click", () => showGitHistory());
    }
    if (elements.btnGiteaPull) {
      elements.btnGiteaPull.addEventListener("click", giteaPull);
    }
    if (elements.btnGiteaPush) {
      elements.btnGiteaPush.addEventListener("click", giteaPush);
    }
    if (elements.btnGiteaSettings) {
      elements.btnGiteaSettings.addEventListener("click", showGiteaSettings);
    }
    if (elements.btnGiteaRefresh) {
      elements.btnGiteaRefresh.addEventListener("click", () => giteaStatus(true));
    }
    if (elements.btnGiteaHelp) {
      elements.btnGiteaHelp.addEventListener("click", () => {
        showModal({
          title: "Gitea Integration",
          message: "Manage your Gitea repository directly from Blueprint Studio. Push, pull, and commit changes just like with GitHub.",
          confirmText: "Close"
        });
      });
    }
    if (elements.btnGiteaCollapse) {
      elements.btnGiteaCollapse.addEventListener("click", () => {
        const panel = document.getElementById("gitea-panel");
        if (panel) {
          panel.classList.toggle("collapsed");
          const isCollapsed = panel.classList.contains("collapsed");
          state.giteaPanelCollapsed = isCollapsed;
          saveSettings();
          const icon = elements.btnGiteaCollapse.querySelector(".material-icons");
          if (icon) {
            icon.textContent = isCollapsed ? "expand_more" : "expand_less";
            elements.btnGiteaCollapse.title = isCollapsed ? "Expand Gitea Panel" : "Collapse Gitea Panel";
          }
        }
      });
    }
    if (elements.btnGiteaStageSelected) {
      elements.btnGiteaStageSelected.addEventListener("click", stageSelectedGiteaFiles);
    }
    if (elements.btnGiteaStageAll) {
      elements.btnGiteaStageAll.addEventListener("click", stageAllGiteaFiles);
    }
    if (elements.btnGiteaUnstageAll) {
      elements.btnGiteaUnstageAll.addEventListener("click", unstageAllGiteaFiles);
    }
    if (elements.btnGiteaCommitStaged) {
      elements.btnGiteaCommitStaged.addEventListener("click", giteaCommit);
    }

    // Git panel header sync indicators (delegation)
    const gitPanelActions = document.getElementById("git-panel-actions");
    if (gitPanelActions) {
      gitPanelActions.addEventListener("click", (e) => {
        const target = e.target.closest(".git-sync-indicator");
        if (target) {
          if (target.id === "btn-git-push-sync") {
            gitPush();
          } else if (target.id === "btn-git-pull-sync") {
            gitPull();
          }
        }
      });
    }

    // Gitea panel header sync indicators (delegation)
    const giteaPanelActions = document.getElementById("gitea-panel-actions");
    if (giteaPanelActions) {
      giteaPanelActions.addEventListener("click", (e) => {
        const target = e.target.closest(".git-sync-indicator");
        if (target) {
          if (target.id === "btn-gitea-push-sync") {
            giteaPush();
          } else if (target.id === "btn-gitea-pull-sync") {
            giteaPull();
          }
        }
      });
    }

    // Git panel event delegation for dynamically created elements
    const gitFilesContainer = document.getElementById("git-files-container");
    if (gitFilesContainer) {
      // Touch event tracking for mobile gestures
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTouchScroll = false;

      // Click event delegation for group headers AND new empty state buttons
      gitFilesContainer.addEventListener("click", (e) => {
        // Handle git file group header clicks (toggle collapse)
        const groupHeader = e.target.closest(".git-file-group-header");
        if (groupHeader && !isTouchScroll) {
          const groupElement = groupHeader.closest(".git-file-group");
          if (groupElement) {
            const groupKey = groupElement.getAttribute("data-group");
            if (callbacks.toggleGitGroup) callbacks.toggleGitGroup(groupKey, 'git');
          }
        }

        // Handle Diff Button
        const diffBtn = e.target.closest(".btn-git-diff");
        if (diffBtn) {
            const path = diffBtn.dataset.path;
            showDiffModal(path);
            return;
        }

        // Handle empty state buttons
        const target = e.target.closest('button'); // Get the button itself if clicked on icon/span inside
        if (target) {
          if (target.id === "btn-git-pull-empty-state") {
            gitPull();
          } else if (target.id === "btn-git-refresh-empty-state") {
            gitStatus(true);
          } else if (target.id === "btn-git-init-panel") {
            gitInit();
          } else if (target.id === "btn-git-connect-panel") {
            showGitSettings();
          }
          return;
        }

        // Handle file row click (toggle checkbox)
        const fileItem = e.target.closest(".git-file-item");
        if (fileItem && !e.target.classList.contains("git-file-checkbox")) {
            const checkbox = fileItem.querySelector(".git-file-checkbox");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                const path = checkbox.getAttribute("data-file-path");
                if (path) {
                    if (callbacks.toggleFileSelection) callbacks.toggleFileSelection(path);
                }
            }
        }
      });

      // Touch start event for detecting scroll vs tap
      gitFilesContainer.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isTouchScroll = false;
      }, { passive: true });

      // Touch move event for detecting scroll
      gitFilesContainer.addEventListener("touchmove", (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = Math.abs(touchY - touchStartY);

        // If user moved more than 10px, consider it a scroll
        if (deltaY > 10) {
          isTouchScroll = true;
        }
      }, { passive: true });

      // Touch end event for tap gestures
      gitFilesContainer.addEventListener("touchend", (e) => {
        const touchDuration = Date.now() - touchStartTime;

        // If it was a quick tap (not a scroll), handle as click
        if (!isTouchScroll && touchDuration < 300) {
          const groupHeader = e.target.closest(".git-file-group-header");
          if (groupHeader) {
            e.preventDefault(); // Prevent double-firing with click event
            const groupElement = groupHeader.closest(".git-file-group");
            if (groupElement) {
              const groupKey = groupElement.getAttribute("data-group");
              if (callbacks.toggleGitGroup) callbacks.toggleGitGroup(groupKey, 'git');
            }
          }
        }
      });

      // Change event delegation for checkboxes
      gitFilesContainer.addEventListener("change", (e) => {
        // Handle checkbox changes for file selection
        if (e.target.classList.contains("git-file-checkbox")) {
          const filePath = e.target.getAttribute("data-file-path");
          if (filePath) {
            if (callbacks.toggleFileSelection) callbacks.toggleFileSelection(filePath);
          }
        }
      });
    }

    // Gitea panel event delegation
    const giteaFilesContainer = document.getElementById("gitea-files-container");
    if (giteaFilesContainer) {
      giteaFilesContainer.addEventListener("click", (e) => {
        // Handle gitea file group header clicks (toggle collapse)
        const groupHeader = e.target.closest(".git-file-group-header");
        if (groupHeader) {
          const groupElement = groupHeader.closest(".git-file-group");
          if (groupElement) {
            const groupKey = groupElement.getAttribute("data-group");
            if (callbacks.toggleGitGroup) callbacks.toggleGitGroup(groupKey, 'gitea');
          }
          return;
        }

        // Handle Diff Button
        const diffBtn = e.target.closest(".btn-git-diff");
        if (diffBtn) {
            const path = diffBtn.dataset.path;
            showDiffModal(path);
            return;
        }

        // Handle empty state buttons
        const target = e.target.closest('button');
        if (target) {
          if (target.id === "btn-gitea-pull-empty-state") {
            giteaPull();
          } else if (target.id === "btn-gitea-refresh-empty-state") {
            giteaStatus(true);
          } else if (target.id === "btn-gitea-init-panel") {
            gitInit();
          } else if (target.id === "btn-gitea-connect-panel") {
            showGiteaSettings();
          } else if (target.id === "btn-gitea-abort") {
            giteaAbort();
          } else if (target.id === "btn-gitea-force-push") {
            giteaForcePush();
          } else if (target.id === "btn-gitea-hard-reset") {
            giteaHardReset();
          }
          return;
        }

        // Handle file row click (toggle checkbox)
        const fileItem = e.target.closest(".git-file-item");
        if (fileItem && !e.target.classList.contains("gitea-file-checkbox")) {
            const checkbox = fileItem.querySelector(".gitea-file-checkbox");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                const path = checkbox.getAttribute("data-file-path");
                if (path) {
                    toggleGiteaFileSelection(path);
                }
            }
        }
      });

      // Change event delegation for checkboxes
      giteaFilesContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("gitea-file-checkbox")) {
          const path = e.target.getAttribute("data-file-path");
          if (path) {
            toggleGiteaFileSelection(path);
          }
        }
      });
    }

    // Toggle Collapse/Expand all
    if (elements.btnToggleAll) {
      elements.btnToggleAll.addEventListener("click", () => {
        if (state.expandedFolders.size > 0) {
          // Collapse all
          state.expandedFolders.clear();
        } else {
          // Expand all
          function expandAll(tree) {
            for (const key of Object.keys(tree)) {
              if (!key.startsWith("_")) {
                if (tree[key]._path) {
                  state.expandedFolders.add(tree[key]._path);
                }
                expandAll(tree[key]);
              }
            }
          }
          expandAll(state.fileTree);
        }
        renderFileTree(); // This will also call updateToggleAllButton
      });
    }

    // Show/Hide hidden folders toggle
    if (elements.btnShowHidden) {
      elements.btnShowHidden.addEventListener("click", () => {
        state.showHidden = !state.showHidden;
        saveSettings();
        updateShowHiddenButton();
        if (callbacks.loadFiles) callbacks.loadFiles(true);
      });
    }

    // File search
    if (elements.fileSearch) {
      elements.fileSearch.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;

        // If cleared, immediately reset to folder navigation view
        if (!state.searchQuery.trim()) {
          cancelPendingSearch(); // Cancel any in-flight debounced search
          state.contentSearchResults = null;
          renderFileTree();
          return;
        }

        // In lazy loading mode, always use recursive search
        if (state.lazyLoadingEnabled) {
          if (state.contentSearchEnabled) {
            // Search file content across all files
            if (callbacks.debouncedContentSearch) callbacks.debouncedContentSearch();
          } else {
            // Search filenames across all files
            if (callbacks.debouncedFilenameSearch) callbacks.debouncedFilenameSearch();
          }
        } else {
          // Old tree mode - use local filtering
          if (state.contentSearchEnabled) {
            if (callbacks.debouncedContentSearch) callbacks.debouncedContentSearch();
          } else {
            debouncedRenderFileTree();
          }
        }
      });
    }
    
    // Content Search Toggle
    if (elements.btnContentSearch) {
        // Update UI to match current state (from settings)
        if (state.contentSearchEnabled) {
            elements.btnContentSearch.style.background = "var(--accent-color)";
            elements.btnContentSearch.style.color = "white";
            elements.btnContentSearch.style.borderColor = "var(--accent-color)";
            elements.fileSearch.placeholder = "Search all files...";
        }

        elements.btnContentSearch.addEventListener("click", () => {
            state.contentSearchEnabled = !state.contentSearchEnabled;

            // UI Toggle
            if (state.contentSearchEnabled) {
                elements.btnContentSearch.style.background = "var(--accent-color)";
                elements.btnContentSearch.style.color = "white";
                elements.btnContentSearch.style.borderColor = "var(--accent-color)";
                elements.fileSearch.placeholder = "Search all files...";
                // Re-run search with content mode
                if (state.searchQuery && callbacks.debouncedContentSearch) {
                    callbacks.debouncedContentSearch();
                }
            } else {
                elements.btnContentSearch.style.background = "var(--bg-tertiary)";
                elements.btnContentSearch.style.color = "var(--text-secondary)";
                elements.btnContentSearch.style.borderColor = "var(--border-color)";
                elements.fileSearch.placeholder = "Search all files...";
                // Re-run search with filename mode (or clear if lazy loading disabled)
                if (state.searchQuery) {
                    if (state.lazyLoadingEnabled && callbacks.debouncedFilenameSearch) {
                        callbacks.debouncedFilenameSearch();
                    } else {
                        state.contentSearchResults = null;
                        renderFileTree();
                    }
                } else {
                    state.contentSearchResults = null;
                    renderFileTree();
                }
            }
        });
    }

    // Welcome screen actions
    if (elements.btnWelcomeNewFile) {
      elements.btnWelcomeNewFile.addEventListener("click", () => {
        if (callbacks.promptNewFile) callbacks.promptNewFile();
      });
    }
    if (elements.btnWelcomeUploadFile) {
      elements.btnWelcomeUploadFile.addEventListener("click", triggerUpload);
    }

    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        elements.themeMenu.classList.toggle("visible");
      });
    }

    // Theme menu items
    document.querySelectorAll(".theme-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const theme = item.dataset.theme;
        if (theme === 'auto') {
            setTheme('auto');
        } else {
            // Use preset setter to ensure correct preset + theme mode sync
            setThemePreset(theme);
        }
        elements.themeMenu.classList.remove("visible");
      });
    });

    // Close theme menu on outside click
    document.addEventListener("click", () => {
      if (elements.themeMenu) {
        elements.themeMenu.classList.remove("visible");
      }
    });

    // Modal events
    if (elements.modalClose) {
      elements.modalClose.addEventListener("click", hideModal);
    }
    if (elements.modalCancel) {
      elements.modalCancel.addEventListener("click", hideModal);
    }
    if (elements.modalConfirm) {
      elements.modalConfirm.addEventListener("click", confirmModal);
    }
    if (elements.modalOverlay) {
      elements.modalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.modalOverlay) {
          hideModal();
        }
      });
    }
    if (elements.modalInput) {
      elements.modalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          confirmModal();
        } else if (e.key === "Escape") {
          hideModal();
        }
      });
    }

    // File Context menu items
    if (elements.contextMenu) {
        elements.contextMenu.querySelectorAll(".context-menu-item").forEach(item => {
          item.addEventListener("click", async () => {
            const action = item.dataset.action;
            const target = state.contextMenuTarget;
            hideContextMenu();
    
            if (!target) return;
    
            switch (action) {
          case "new_file":
            {
              const targetPath = target.isFolder ? target.path : target.path.split("/").slice(0, -1).join("/");
              state.currentFolderPath = targetPath;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
              if (callbacks.promptNewFile) await callbacks.promptNewFile(targetPath);
            }
            break;
          case "new_folder":
            {
              const targetPath = target.isFolder ? target.path : target.path.split("/").slice(0, -1).join("/");
              state.currentFolderPath = targetPath;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
              if (callbacks.promptNewFolder) await callbacks.promptNewFolder(targetPath);
            }
            break;
          case "rename":
            if (callbacks.promptRename) await callbacks.promptRename(target.path, target.isFolder);
            break;
          case "move":
            if (callbacks.promptMove) await callbacks.promptMove(target.path, target.isFolder);
            break;
          case "copy":
            if (callbacks.promptCopy) await callbacks.promptCopy(target.path, target.isFolder);
            break;
          case "duplicate":
            if (callbacks.duplicateItem) await callbacks.duplicateItem(target.path, target.isFolder);
            break;
          case "download":
            if (target.isFolder) {
              await downloadFolder(target.path);
            } else {
              await downloadFileByPath(target.path);
            }
            break;
          case "delete":
            if (callbacks.promptDelete) await callbacks.promptDelete(target.path, target.isFolder);
            break;
        }
      });
    });
    }

    // Tab Context Menu Items
    if (elements.tabContextMenu) {
        elements.tabContextMenu.querySelectorAll(".context-menu-item").forEach(item => {
            item.addEventListener("click", () => {
                const action = item.dataset.action;
                const tab = state.tabContextMenuTarget;
                const tabIndex = state.tabContextMenuTargetIndex;
                hideContextMenu();

                if (!tab) return;

                if (action === "close_others") {
                    const tabsToClose = state.openTabs.filter(t => t !== tab);
                    // Close sequentially to handle confirmations if needed
                    tabsToClose.forEach(t => {
                        if (callbacks.closeTab) callbacks.closeTab(t);
                    });
                } else if (action === "close_saved") {
                    const tabsToClose = state.openTabs.filter(t => !t.modified && t !== tab);
                    tabsToClose.forEach(t => {
                        if (callbacks.closeTab) callbacks.closeTab(t);
                    });
                } else if (action === "copy_path") {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(tab.path);
                        showToast("Path copied to clipboard", "success");
                    }
                } else if (action === "move_to_left") {
                    if (callbacks.moveToPrimaryPane && typeof tabIndex === 'number') {
                        callbacks.moveToPrimaryPane(tabIndex);
                    }
                } else if (action === "move_to_right") {
                    if (callbacks.moveToSecondaryPane && typeof tabIndex === 'number') {
                        callbacks.moveToSecondaryPane(tabIndex);
                    }
                } else if (action === "open_to_right") {
                    if (callbacks.enableSplitView && callbacks.moveToSecondaryPane && typeof tabIndex === 'number') {
                        callbacks.enableSplitView('vertical');
                        callbacks.moveToSecondaryPane(tabIndex);
                    }
                } else if (action === "open_below") {
                    if (callbacks.enableSplitView && callbacks.moveToSecondaryPane && typeof tabIndex === 'number') {
                        callbacks.enableSplitView('horizontal');
                        callbacks.moveToSecondaryPane(tabIndex);
                    }
                }
            });
        });
    }

    // Hide context menu on outside click
    document.addEventListener("click", hideContextMenu);

    // Keyboard shortcuts - using capture phase to intercept before browser
    window.addEventListener("keydown", (e) => {

      // Ctrl + Shift + ] - Next Tab (all platforms, including macOS)
      // Check both e.key and e.code for better compatibility
      const isNextTabShortcut =
        (e.key === "]" || e.key === "}" || e.code === "BracketRight") &&
        e.ctrlKey && e.shiftKey && !e.metaKey;

      if (isNextTabShortcut) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (callbacks.nextTab) callbacks.nextTab();
        return false;
      }

      // Ctrl + Shift + [ - Previous Tab (all platforms, including macOS)
      // Check both e.key and e.code for better compatibility
      const isPrevTabShortcut =
        (e.key === "[" || e.key === "{" || e.code === "BracketLeft") &&
        e.ctrlKey && e.shiftKey && !e.metaKey;

      if (isPrevTabShortcut) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (callbacks.previousTab) callbacks.previousTab();
        return false;
      }

      // Alt/Option + W - Close Tab
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key.toLowerCase() === "w" || e.code === "KeyW")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (callbacks.closeTab && state.activeTab) {
            callbacks.closeTab(state.activeTab);
        }
        return false;
      }

      // Ctrl/Cmd + 1 - Focus Primary Pane (Split View)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === "1" || e.code === "Digit1")) {
        if (state.enableSplitView && state.splitView && state.splitView.enabled) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (callbacks.setActivePaneFromPosition) {
            callbacks.setActivePaneFromPosition('primary');
            if (state.primaryEditor) state.primaryEditor.focus();
          }
          return false;
        }
      }

      // Ctrl/Cmd + 2 - Focus Secondary Pane (Split View)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === "2" || e.code === "Digit2")) {
        if (state.enableSplitView && state.splitView && state.splitView.enabled) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (callbacks.setActivePaneFromPosition) {
            callbacks.setActivePaneFromPosition('secondary');
            if (state.secondaryEditor) state.secondaryEditor.focus();
          }
          return false;
        }
      }

      // Ctrl/Cmd + E - Quick Switcher
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        showQuickSwitcher();
      }

      // Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        // Check if inside CodeMirror FIRST, let its extraKeys handle it
        const activeElement = document.activeElement;
        const isEditor = activeElement && (activeElement.classList.contains("CodeMirror-code") || activeElement.closest('.CodeMirror'));

        if (!isEditor) {
          // Not in editor, handle it here
          e.preventDefault();

          if (e.shiftKey) {
            // Cmd+Shift+S: Save All Files
            if (callbacks.saveAllFiles) callbacks.saveAllFiles();
          } else {
            // Cmd+S: Save Current File
            if (callbacks.saveCurrentFile) callbacks.saveCurrentFile();
          }
        }
        // If in editor, don't preventDefault - let CodeMirror's extraKeys handle it
      }

      // Shift + Alt + F - Format Code
      if (e.shiftKey && e.altKey && (e.key === "f" || e.key === "F")) {
          e.preventDefault();
          if (callbacks.formatCode) callbacks.formatCode();
      }

      // Ctrl/Cmd + B - Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }

      // Ctrl/Cmd + Shift + U - Generate UUID
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        insertUUID();
      }

      // Ctrl/Cmd + Shift + F - Global Search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        switchSidebarView("search");
        if (elements.globalSearchInput) {
            elements.globalSearchInput.focus();
            elements.globalSearchInput.select();
        }
      }

      // Ctrl/Cmd + K - Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        if (callbacks.showCommandPalette) {
          callbacks.showCommandPalette();
        }
        return false;
      }

      // Ctrl/Cmd + F - Find (but not Shift+F which is global search)
      if ((e.ctrlKey || e.metaKey) && e.key === "f" && !e.shiftKey) {
        e.preventDefault();
        openSearchWidget(false);
      }

      // Ctrl/Cmd + H - Replace
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        openSearchWidget(true);
      }

      // Ctrl/Cmd + 1 - Focus Primary Pane
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        if (state.splitView && state.splitView.enabled) {
          e.preventDefault();
          if (callbacks.setActivePaneFromPosition) {
            callbacks.setActivePaneFromPosition('primary');
          }
          if (state.primaryEditor) {
            state.primaryEditor.focus();
          }
        }
      }

      // Ctrl/Cmd + 2 - Focus Secondary Pane
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        if (state.splitView && state.splitView.enabled) {
          e.preventDefault();
          if (callbacks.setActivePaneFromPosition) {
            callbacks.setActivePaneFromPosition('secondary');
          }
          if (state.secondaryEditor) {
            state.secondaryEditor.focus();
          }
        }
      }

      // F1 - Show Keyboard Shortcuts
      if (e.key === "F1") {
        e.preventDefault();
        showShortcuts();
      }

      // Escape - close sidebar on mobile, hide modals/menus
      if (e.key === "Escape") {
        if (elements.shortcutsOverlay.classList.contains("visible")) {
          hideShortcuts();
        } else if (elements.searchWidget && elements.searchWidget.classList.contains("visible")) {
          closeSearchWidget();
        } else if (elements.quickSwitcherOverlay && elements.quickSwitcherOverlay.classList.contains("visible")) {
          hideQuickSwitcher();
        } else if (elements.modalOverlay.classList.contains("visible")) {
          hideModal();
        } else if (elements.contextMenu.classList.contains("visible")) {
          hideContextMenu();
        } else if (elements.themeMenu.classList.contains("visible")) {
          elements.themeMenu.classList.remove("visible");
        } else if (isMobile() && state.sidebarVisible) {
          hideSidebar();
        }
      }
    }, true);

    // Search Widget Events
    if (elements.searchWidget) {
      elements.searchToggle.addEventListener("click", () => {
        elements.searchWidget.classList.toggle("replace-mode");
        if (elements.searchWidget.classList.contains("replace-mode")) {
            elements.searchReplaceRow.style.display = "flex";
            elements.searchReplaceInput.focus();
        } else {
            elements.searchReplaceRow.style.display = "none";
            elements.searchFindInput.focus();
        }
      });

      elements.searchFindInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doFind(e.shiftKey); // Shift+Enter = Prev
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeSearchWidget();
        }
      });

      elements.searchReplaceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.ctrlKey || e.altKey) {
                doReplaceAll();
            } else {
                doReplace();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeSearchWidget();
        }
      });

      elements.searchNext.addEventListener("click", () => doFind(false));
      elements.searchPrev.addEventListener("click", () => doFind(true));
      elements.searchClose.addEventListener("click", closeSearchWidget);
      elements.searchReplaceBtn.addEventListener("click", doReplace);
      elements.searchReplaceAllBtn.addEventListener("click", doReplaceAll);

      // Match Case (Exact Match) toggle
      if (elements.searchCaseSensitiveBtn) {
        elements.searchCaseSensitiveBtn.addEventListener("click", () => {
          state.searchCaseSensitive = !state.searchCaseSensitive;
          elements.searchCaseSensitiveBtn.classList.toggle("active", state.searchCaseSensitive);
          const query = elements.searchFindInput.value;
          if (query) { updateSearchHighlights(query); updateMatchStatus(query); }
        });
      }

      // Match Whole Word toggle
      if (elements.searchWholeWordBtn) {
        elements.searchWholeWordBtn.addEventListener("click", () => {
          state.searchWholeWord = !state.searchWholeWord;
          elements.searchWholeWordBtn.classList.toggle("active", state.searchWholeWord);
          const query = elements.searchFindInput.value;
          if (query) { updateSearchHighlights(query); updateMatchStatus(query); }
        });
      }

      // Use Regular Expression toggle
      if (elements.searchUseRegexBtn) {
        elements.searchUseRegexBtn.addEventListener("click", () => {
          state.searchUseRegex = !state.searchUseRegex;
          elements.searchUseRegexBtn.classList.toggle("active", state.searchUseRegex);
          const query = elements.searchFindInput.value;
          if (query) { updateSearchHighlights(query); updateMatchStatus(query); }
        });
      }
    }

    // Quick Switcher Events - handled in quick-switcher.js module
    // (Event handlers moved to module)

    // File Tree Drag & Drop (Root)
    if (elements.fileTree) {
      // Background click handler to deselect items/folders
      elements.fileTree.addEventListener("click", (e) => {
          // Only if clicking the background (not a tree item)
          if (e.target === elements.fileTree) {
              state.currentFolderPath = null;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
          }
      });

      elements.fileTree.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        elements.fileTree.classList.add("drag-over-root");
      });

      elements.fileTree.addEventListener("dragleave", (e) => {
        // Only remove if leaving the tree entirely
        if (e.relatedTarget && !elements.fileTree.contains(e.relatedTarget)) {
             elements.fileTree.classList.remove("drag-over-root");
        }
      });

      elements.fileTree.addEventListener("drop", async (e) => {
        e.preventDefault();
        elements.fileTree.classList.remove("drag-over-root");
        
        // Check for external files
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processUploads(e.dataTransfer.files, null); // Upload to root
            return;
        }

        const sourcePath = e.dataTransfer.getData("text/plain");
        // Target is null (root)
        if (sourcePath) {
            await handleFileDrop(sourcePath, null);
        }
      });
    }

    // Window resize
    window.addEventListener("resize", () => {
      const wasMobile = state.isMobile;
      state.isMobile = isMobile();

      if (wasMobile !== state.isMobile) {
        if (state.isMobile) {
          hideSidebar();
        } else {
          showSidebar();
        }
      }

      // Refresh editor
      if (state.editor) {
        setTimeout(() => state.editor.refresh(), 100);
      }
    });

    // Before unload warning
    window.addEventListener("beforeunload", (e) => {
      if (state.openTabs.some((t) => t.modified)) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    // Orientation change (mobile)
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        if (state.editor) {
          state.editor.refresh();
        }
      }, 300);
    });

    // System theme change (for auto mode)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (state.theme === "auto") {
        applyTheme();
      }
    });

    // Visibility change - refresh editor when page/tab becomes visible
    // This is crucial for iframe-based panels in Home Assistant
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.editor) {
        setTimeout(() => state.editor.refresh(), 50);
        setTimeout(() => state.editor.refresh(), 150);
        setTimeout(() => state.editor.refresh(), 300);
      }
    });

    // Also handle focus on the window (helps with HA mobile apps)
    window.addEventListener("focus", () => {
      if (state.editor) {
        setTimeout(() => state.editor.refresh(), 50);
        setTimeout(() => state.editor.refresh(), 150);
      }
    });
}
