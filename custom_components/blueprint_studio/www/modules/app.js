/**
 * ============================================================================
 * APPLICATION ENTRY POINT (APP.JS)
 * ============================================================================
 *
 * PURPOSE: Main application coordination layer. Imports all modules, registers
 * callbacks between modules, provides core functions (loadFiles, openFile, saveFile),
 * and re-exports all functionality for use in index.html.
 *
 * EXPORTED FUNCTIONS:
 * Core File Operations:
 * - loadFiles(force) - Load file tree from server
 * - openFile(path, forceReload, noActivate) - Open file in tab
 * - loadFile(path) - Load file content from server
 * - saveFile(path, content) - Save file to server
 * - saveCurrentFile(isAutoSave) - Save active file
 * - closeTab(tab, force) - Close tab
 * - activateTab(tab, skipSave) - Switch to tab
 *
 * Tab Operations:
 * - renderTabs() - Render tab bar
 * - nextTab(), previousTab() - Navigate tabs
 * - closeAllTabs(), closeOtherTabs(), closeTabsToRight() - Bulk tab operations
 *
 * Editor Operations:
 * - createEditor() - Initialize CodeMirror
 * - handleEditorChange() - Handle editor content changes
 * - detectIndentation(content) - Auto-detect indentation
 *
 * File Tree:
 * - buildFileTree(items) - Build tree from flat list
 * - renderFileTree() - Render tree to DOM
 * - toggleFolder(path) - Expand/collapse folder
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding a new module:
 *    - Import module at top of app.js
 *    - Register callbacks: registerModuleCallbacks({ function1, function2 })
 *    - Export functions if they need to be called from HTML
 *    - Wire up event handlers in event-handlers.js
 *
 * 2. Adding cross-module functionality:
 *    - Define function in appropriate module (e.g., file-operations.js)
 *    - Import in app.js: import { newFunction } from './module.js'
 *    - Re-export: export const newFunction = newFunctionImpl;
 *    - Register as callback: registerOtherModuleCallbacks({ newFunction })
 *
 * 3. Adding core application state:
 *    - Add to state.js
 *    - Initialize in loadSettings() in settings.js
 *    - Save in saveSettings() in settings.js
 *    - Use throughout app via state object
 *
 * 4. Adding global functions accessible from HTML:
 *    - Define function in app.js or appropriate module
 *    - Export from app.js
 *    - Function will be available via module import in index.html
 *
 * INTEGRATION POINTS:
 * - index.html: Imports app.js as ES module
 * - initialization.js: Calls init() to start app
 * - All modules: Coordinated through callback registration
 * - state.js: Central state management
 * - api.js: Server communication
 *
 * CALLBACK REGISTRATION PATTERN:
 * Each module registers callbacks it needs:
 * ```javascript
 * registerModuleCallbacks({
 *   functionFromApp,
 *   functionFromOtherModule,
 *   anotherFunction
 * });
 * ```
 *
 * RE-EXPORT PATTERN:
 * Functions from modules are re-exported for global access:
 * ```javascript
 * import { funcImpl } from './module.js';
 * export const func = funcImpl;
 * ```
 *
 * ARCHITECTURE NOTES:
 * - This file is the "glue" that connects all modules
 * - Keeps modules decoupled via callback pattern
 * - Provides core functions: loadFiles, openFile, saveFile, activateTab
 * - Handles tab lifecycle and workspace state
 * - Coordinates initialization via initialization.js
 * - All modules communicate through callbacks, not direct imports
 *
 * INITIALIZATION FLOW:
 * 1. index.html loads app.js as ES module
 * 2. app.js imports all modules
 * 3. initialization.js calls init()
 * 4. init() loads settings, files, initializes UI
 * 5. Event handlers registered
 * 6. Workspace restored (open tabs, etc.)
 * 7. App ready for user interaction
 *
 * ============================================================================
 * Blueprint Studio v2.2.0
 * A modern, feature-rich file editor for Home Assistant
 * https://github.com/katoaroosultan/blueprint-studio
 * ============================================================================
 */

import {
  API_BASE,
  MOBILE_BREAKPOINT,
  STORAGE_KEY,
  MAX_RECENT_FILES,
  MAX_FILE_SIZE,
  TEXT_FILE_WARNING_SIZE,
  THEME_PRESETS,
  ACCENT_COLORS,
  HA_SCHEMA,
  TEXT_FILE_EXTENSIONS
} from './constants.js';

import { 
  fetchWithAuth, 
  initWebSocketSubscription,
  registerUpdateCallbacks 
} from './api.js';

import {
  HA_ENTITIES,
  loadEntities,
  homeAssistantHint,
  getYamlContext,
  defineHAYamlMode,
  defineShowWhitespaceMode
} from './ha-autocomplete.js';

import { 
  state, 
  elements, 
  gitState, 
  giteaState 
} from './state.js';

import {
  initElements,
  showToast,
  showGlobalLoading,
  hideGlobalLoading,
  showModal,
  getEffectiveTheme,
  applyTheme,
  applyCustomSyntaxColors,
  applyEditorSettings,
  applyLayoutSettings,
  setThemePreset,
  setAccentColor,
  setTheme,
  registerUICallbacks,
  resetModalToDefault,
  showConfirmDialog,
  hideModal,
  confirmModal
} from './ui.js';

import {
  isTextFile,
  isMobile,
  getFileIcon,
  getEditorMode,
  getLanguageName,
  formatBytes,
  loadScript,
  ensureDiffLibrariesLoaded
} from './utils.js';

// Import refactored modules
import {
  reportIssue as reportIssueImpl,
  requestFeature as requestFeatureImpl,
  showShortcuts as showShortcutsImpl,
  hideShortcuts as hideShortcutsImpl
} from './dialogs.js';

import {
  updateStatusBar as updateStatusBarImpl,
  registerStatusBarCallbacks,
  initStatusBarEvents
} from './status-bar.js';

import {
  updateToolbarState as updateToolbarStateImpl
} from './toolbar.js';

import {
  showContextMenu as showContextMenuImpl,
  showTabContextMenu as showTabContextMenuImpl,
  hideContextMenu as hideContextMenuImpl
} from './context-menu.js';

import {
  updateSearchHighlights as updateSearchHighlightsImpl,
  updateMatchStatus as updateMatchStatusImpl,
  openSearchWidget as openSearchWidgetImpl,
  closeSearchWidget as closeSearchWidgetImpl,
  doFind as doFindImpl,
  doReplace as doReplaceImpl,
  doReplaceAll as doReplaceAllImpl
} from './search.js';

import {
  showQuickSwitcher as showQuickSwitcherImpl,
  hideQuickSwitcher as hideQuickSwitcherImpl,
  updateQuickSwitcherResults as updateQuickSwitcherResultsImpl,
  initQuickSwitcherEvents,
  registerQuickSwitcherCallbacks
} from './quick-switcher.js';

import {
  showSidebar as showSidebarImpl,
  hideSidebar as hideSidebarImpl,
  switchSidebarView as switchSidebarViewImpl,
  toggleSidebar as toggleSidebarImpl
} from './sidebar.js';

// Import simple utility modules
import {
  isFavorite as isFavoriteImpl,
  toggleFavorite as toggleFavoriteImpl,
  renderFavoritesPanel as renderFavoritesPanelImpl,
  registerFavoritesCallbacks
} from './favorites.js';

import {
  renderRecentFilesPanel as renderRecentFilesPanelImpl,
  registerRecentFilesCallbacks
} from './recent-files.js';

import {
  updateBreadcrumb as updateBreadcrumbImpl,
  expandFolderInTree as expandFolderInTreeImpl
} from './breadcrumb.js';

import {
  initResizeHandle as initResizeHandleImpl,
  registerResizeCallbacks
} from './resize.js';

import {
  autoSaveTimer,
  triggerAutoSave,
  clearAutoSaveTimer,
  saveAllFiles as saveAllFilesImpl,
  registerAutoSaveCallbacks
} from './autosave.js';

import {
  registerSplitViewCallbacks,
  enableSplitView,
  disableSplitView,
  setActivePaneFromPosition,
  moveToPrimaryPane,
  moveToSecondaryPane,
  getPaneForTab,
  getActivePaneEditor,
  updatePaneSizes,
  initSplitResize,
  handleTabDragStart,
  handleTabDragOver,
  handleTabDrop,
  handleTabDragEnd,
  updatePaneActiveState
} from './split-view.js';

import {
  gitStatusPollingInterval as pollingInterval,
  checkFileUpdates as checkFileUpdatesImpl,
  startGitStatusPolling as startGitStatusPollingImpl,
  stopGitStatusPolling as stopGitStatusPollingImpl,
  registerPollingCallbacks
} from './polling.js';

import {
  downloadCurrentFile as downloadCurrentFileImpl,
  downloadFileByPath as downloadFileByPathImpl,
  downloadContent as downloadContentImpl,
  downloadFolder as downloadFolderImpl,
  downloadSelectedItems as downloadSelectedItemsImpl,
  triggerUpload as triggerUploadImpl,
  processUploads as processUploadsImpl,
  handleFileUpload as handleFileUploadImpl,
  readFileAsText as readFileAsTextImpl,
  readFileAsBase64 as readFileAsBase64Impl,
  uploadFile as uploadFileImpl,
  triggerFolderUpload as triggerFolderUploadImpl,
  handleFolderUpload as handleFolderUploadImpl,
  registerDownloadsUploadsCallbacks
} from './downloads-uploads.js';

import {
  loadSettings as loadSettingsImpl,
  saveSettings as saveSettingsImpl,
  updateShowHiddenButton as updateShowHiddenButtonImpl,
  registerSettingsCallbacks
} from './settings.js';

import {
  isSftpPath as isSftpPathImpl,
  parseSftpPath as parseSftpPathImpl,
  saveSftpFile as saveSftpFileImpl,
  renderSftpPanel as renderSftpPanelImpl,
  applySftpVisibility as applySftpVisibilityImpl,
  registerSftpCallbacks,
  initSftpPanelButtons,
  connectToServer as connectToServerImpl,
  navigateSftp as navigateSftpImpl,
  openSftpFile as openSftpFileImpl,
  showAddConnectionDialog as showAddConnectionDialogImpl,
  showEditConnectionDialog as showEditConnectionDialogImpl,
  deleteConnection as deleteConnectionImpl
} from './sftp.js';

import {
  showAppSettings as showAppSettingsImpl,
  registerSettingsUICallbacks
} from './settings-ui.js';

import {
  toggleSelectionMode as toggleSelectionModeImpl,
  handleSelectionChange as handleSelectionChangeImpl,
  updateSelectionCount as updateSelectionCountImpl,
  deleteSelectedItems as deleteSelectedItemsImpl,
  registerSelectionCallbacks
} from './selection.js';

import {
  createFile as createFileImpl,
  createFolder as createFolderImpl,
  deleteItem as deleteItemImpl,
  copyItem as copyItemImpl,
  renameItem as renameItemImpl,
  formatCode as formatCodeImpl,
  validateYaml as validateYamlImpl,
  registerFileOperationsCallbacks
} from './file-operations.js';

import {
  fileTreeRenderTimer,
  debouncedRenderFileTree as debouncedRenderFileTreeImpl,
  buildFileTree as buildFileTreeImpl,
  renderFileTree as renderFileTreeImpl,
  renderTreeLevel as renderTreeLevelImpl,
  handleFileDropMulti as handleFileDropMultiImpl,
  handleFileDrop as handleFileDropImpl,
  folderMatchesSearch as folderMatchesSearchImpl,
  createTreeItem as createTreeItemImpl,
  handleDragStart as handleDragStartImpl,
  handleDragOver as handleDragOverImpl,
  handleDragLeave as handleDragLeaveImpl,
  handleDrop as handleDropImpl,
  toggleFolder as toggleFolderImpl,
  updateToggleAllButton as updateToggleAllButtonImpl,
  debouncedContentSearch as debouncedContentSearchImpl,
  debouncedFilenameSearch as debouncedFilenameSearchImpl,
  performContentSearch as performContentSearchImpl,
  registerFileTreeCallbacks
} from './file-tree.js';

import {
  showDiffModal as showDiffModalImpl,
  showGitHistory as showGitHistoryImpl,
  showGitCommitDiff as showGitCommitDiffImpl,
  registerGitDiffCallbacks
} from './git-diff.js';

import {
  registerGitOperationsCallbacks,
  isGitEnabled as isGitEnabledImpl,
  checkGitStatusIfEnabled as checkGitStatusIfEnabledImpl,
  gitStatus as gitStatusImpl,
  gitInit as gitInitImpl,
  abortGitOperation as abortGitOperationImpl,
  forcePush as forcePushImpl,
  hardReset as hardResetImpl,
  deleteRemoteBranch as deleteRemoteBranchImpl,
  gitGetRemotes as gitGetRemotesImpl,
  gitSetCredentials as gitSetCredentialsImpl,
  gitStage as gitStageImpl,
  handleGitLockAndRetry as handleGitLockAndRetryImpl,
  gitCleanLocks as gitCleanLocksImpl,
  gitRepairIndex as gitRepairIndexImpl,
  gitUnstage as gitUnstageImpl,
  gitReset as gitResetImpl,
  gitCommit as gitCommitImpl,
  gitPull as gitPullImpl,
  gitPush as gitPushImpl
} from './git-operations.js';

import {
  registerGithubIntegrationCallbacks,
  gitAddRemote as gitAddRemoteImpl,
  githubCreateRepo as githubCreateRepoImpl,
  repairBranchMismatch as repairBranchMismatchImpl,
  gitTestConnection as gitTestConnectionImpl,
  gitClearCredentials as gitClearCredentialsImpl,
  githubDeviceFlowStart as githubDeviceFlowStartImpl,
  githubDeviceFlowPoll as githubDeviceFlowPollImpl,
  showGithubDeviceFlowLogin as showGithubDeviceFlowLoginImpl,
  showGitExclusions as showGitExclusionsImpl,
  showGitSettings as showGitSettingsImpl,
  showCreateGithubRepoDialog as showCreateGithubRepoDialogImpl,
  saveGitRemote as saveGitRemoteImpl,
  saveGitCredentials as saveGitCredentialsImpl,
  testGitConnection as testGitConnectionImpl
} from './github-integration.js';

import {
  registerGiteaIntegrationCallbacks,
  giteaInit as giteaInitImpl,
  giteaStatus as giteaStatusImpl,
  giteaPush as giteaPushImpl,
  giteaPull as giteaPullImpl,
  giteaCommit as giteaCommitImpl,
  giteaStage as giteaStageImpl,
  giteaUnstage as giteaUnstageImpl,
  giteaAbort as giteaAbortImpl,
  giteaForcePush as giteaForcePushImpl,
  giteaHardReset as giteaHardResetImpl,
  toggleGiteaFileSelection as toggleGiteaFileSelectionImpl,
  stageSelectedGiteaFiles as stageSelectedGiteaFilesImpl,
  stageAllGiteaFiles as stageAllGiteaFilesImpl,
  unstageAllGiteaFiles as unstageAllGiteaFilesImpl,
  updateGiteaPanel as updateGiteaPanelImpl,
  renderGiteaFiles as renderGiteaFilesImpl,
  showGiteaSettings as showGiteaSettingsImpl,
  giteaCreateRepo as giteaCreateRepoImpl
} from './gitea-integration.js';

import {
  registerInitializationCallbacks
} from './initialization.js';

import {
  registerEventHandlerCallbacks,
  restartHomeAssistant as restartHomeAssistantImpl,
  insertUUID,
  updateSplitViewButtons
} from './event-handlers.js';

import {
  registerGitUICallbacks,
  updateGitPanel as updateGitPanelImpl,
  renderGitFiles as renderGitFilesImpl,
  toggleGitGroup as toggleGitGroupImpl,
  toggleFileSelection as toggleFileSelectionImpl,
  stageSelectedFiles as stageSelectedFilesImpl,
  stageAllFiles as stageAllFilesImpl,
  unstageAllFiles as unstageAllFilesImpl,
  commitStagedFiles as commitStagedFilesImpl,
  applyVersionControlVisibility as applyVersionControlVisibilityImpl
} from './git-ui.js';

import {
  registerTabsCallbacks,
  renderTabs as renderTabsImpl,
  closeAllTabs as closeAllTabsImpl,
  closeOtherTabs as closeOtherTabsImpl,
  closeTabsToRight as closeTabsToRightImpl,
  nextTab as nextTabImpl,
  previousTab as previousTabImpl
} from './tabs.js';

import {
  registerEditorCallbacks,
  createEditor as createEditorImpl,
  createSecondaryEditor as createSecondaryEditorImpl,
  destroySecondaryEditor as destroySecondaryEditorImpl,
  yamlLinter as yamlLinterImpl,
  detectIndentation as detectIndentationImpl,
  handleEditorChange as handleEditorChangeImpl,
  selectNextOccurrence as selectNextOccurrenceImpl
} from './editor.js';

import {
  registerAssetPreviewCallbacks,
  renderAssetPreview as renderAssetPreviewImpl,
  toggleMarkdownPreview as toggleMarkdownPreviewImpl
} from './asset-preview.js';

import {
  registerAICallbacks,
  updateAIVisibility as updateAIVisibilityImpl,
  toggleAISidebar as toggleAISidebarImpl,
  formatAiResponse as formatAiResponseImpl,
  copyToClipboard as copyToClipboardImpl,
  sendAIChatMessage as sendAIChatMessageImpl
} from './ai-ui.js';

import {
  registerCommandPaletteCallbacks,
  showCommandPalette as showCommandPaletteImpl
} from './command-palette.js';

import {
  registerGlobalSearchCallbacks,
  performGlobalSearch as performGlobalSearchImpl,
  performGlobalReplace as performGlobalReplaceImpl,
  initGlobalSearchHandlers
} from './global-search.js';

import {
  registerFileOperationsUICallbacks,
  showInputModal as showInputModalImpl,
  promptNewFile as promptNewFileImpl,
  promptNewFolder as promptNewFolderImpl,
  promptRename as promptRenameImpl,
  promptCopy as promptCopyImpl,
  promptMove as promptMoveImpl,
  duplicateItem as duplicateItemImpl,
  promptDelete as promptDeleteImpl
} from './file-operations-ui.js';

  // ============================================
  // State Management
  // ============================================

  // Workspace save timer reference (for cursor/scroll position)
export let workspaceSaveTimer = null;

  // ============================================
  // Utility Functions
  // ============================================

  // Debounced file tree rendering to prevent UI lag

  // ============================================
  // File Tree Construction
  // ============================================




  // ============================================
  // API Functions
  // ============================================

export async function getAuthToken() {
    try {
      if (window.parent) {
        let auth = null;
        if (window.parent.hassConnection) {
            const result = await window.parent.hassConnection;
            auth = result.auth || (result.accessToken ? result : null);
        } else if (window.parent.hass && window.parent.hass.auth) {
            auth = window.parent.hass.auth;
        }
        
        if (auth) {
            if (auth.expired) {
                await auth.refreshAccessToken();
            }
            return auth.accessToken;
        }
      }
    } catch (e) {
      console.error("Failed to get auth token", e);
    }
    return null;
}

export async function loadFiles(force = false) {
    try {
      if (elements.btnRefresh) {
          elements.btnRefresh.classList.add("loading");
          elements.btnRefresh.disabled = true;
      }

      // LAZY LOADING: Only load root directory initially
      if (state.lazyLoadingEnabled) {
        // Remember current navigation path if forcing refresh (e.g., toggling hidden files)
        const preservedPath = force ? state.currentNavigationPath : null;

        const result = await fetchWithAuth(`${API_BASE}?action=list_directory&path=&show_hidden=${state.showHidden}`);

        if (result.error) {
          throw new Error(result.error);
        }

        // Clear loaded directories cache if forcing refresh
        if (force) {
          state.loadedDirectories.clear();
          // Don't reset navigation - we'll restore it below
        }

        // Cache root directory contents
        state.loadedDirectories.set("", {
          folders: result.folders || [],
          files: result.files || []
        });

        // Build initial file tree (just root level)
        state.fileTree = {};
        result.folders.forEach(folder => {
          state.fileTree[folder.name] = {
            _path: folder.path,
            _childCount: folder.childCount || 0
          };
        });
        state.fileTree._files = result.files || [];

        // Store flat lists for backward compatibility
        state.folders = result.folders || [];
        state.files = result.files || [];
        state.allItems = [...result.folders, ...result.files];

        // Initialize navigation if first load
        if (!state.currentNavigationPath && state.currentNavigationPath !== "") {
          state.currentNavigationPath = "";
        }

        // If we preserved a path (force refresh while in subfolder), reload that folder
        if (preservedPath && preservedPath !== "") {
          state.currentNavigationPath = preservedPath;
          // Reload the current folder to get updated contents with new hidden files setting
          try {
            const currentResult = await fetchWithAuth(
              `${API_BASE}?action=list_directory&path=${encodeURIComponent(preservedPath)}&show_hidden=${state.showHidden}`
            );
            if (!currentResult.error) {
              state.loadedDirectories.set(preservedPath, {
                folders: currentResult.folders || [],
                files: currentResult.files || []
              });
            }
          } catch (e) {
            console.warn("Failed to reload preserved path:", e);
            // Fall back to root if reload fails
            state.currentNavigationPath = "";
            state.navigationHistory = [];
          }
        }

        renderFileTree();
        setFileTreeLoading(false);
        setButtonLoading(elements.btnRefresh, false);
        return;
      }

      // FALLBACK: Old behavior (load all recursively)
      // If we are changing showHidden, we MUST force a refresh to bypass backend cache
      const shouldForce = force || state._lastShowHidden !== state.showHidden;
      state._lastShowHidden = state.showHidden;

      const items = await fetchWithAuth(`${API_BASE}?action=list_all&show_hidden=${state.showHidden}&force=${shouldForce}`);
      state.files = items.filter(item => item.type === "file");
      state.folders = items.filter(item => item.type === "folder");
      state.allItems = items;
      state.fileTree = buildFileTree(items);
      renderFileTree();

      setFileTreeLoading(false);
      setButtonLoading(elements.btnRefresh, false);
    } catch (error) {
      setFileTreeLoading(false);
      setButtonLoading(elements.btnRefresh, false);

      // 🛡️ AUTO-RECOVERY: If we get HTTP 500, automatically retry with force=true to reinitialize backend cache
      if (error.message && error.message.includes("500") && !force) {
        console.warn("HTTP 500 detected - Attempting auto-recovery with cache reinit...");
        showToast("Recovering from server error...", "warning");

        // Wait a moment before retry
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          // Retry with force=true to clear backend cache
          const items = await fetchWithAuth(`${API_BASE}?action=list_all&show_hidden=${state.showHidden}&force=true`);
          state.files = items.filter(item => item.type === "file");
          state.folders = items.filter(item => item.type === "folder");
          state.allItems = items;
          state.fileTree = buildFileTree(items);
          renderFileTree();

          showToast("✓ Recovered successfully - files loaded", "success");
          console.log("Auto-recovery successful!");
          return; // Success!
        } catch (retryError) {
          console.error("Auto-recovery failed:", retryError);

          // Backend is completely dead - need manual intervention
          if (retryError.message && retryError.message.includes("500")) {
            console.error("🚨 CRITICAL: Backend is non-responsive even with force=true");
            showToast(
              "⚠️ Backend Crashed - Restart Required\n\n" +
              "The Blueprint Studio backend has crashed and cannot recover.\n\n" +
              "To fix:\n" +
              "Settings → System → Restart Home Assistant\n\n" +
              "(Note: Integration reload won't fix this - full restart needed)\n\n" +
              "After restart, check logs for the root cause:\n" +
              "Settings → System → Logs → Search 'blueprint_studio'",
              "error",
              20000 // Show for 20 seconds
            );
          } else {
            showToast("Failed to load files: " + retryError.message + " - Please refresh manually", "error");
          }
          return;
        }
      }

      showToast("Failed to load files: " + error.message, "error");
    }
  }

export async function loadFile(path) {
    try {
      // Large File Protection
      const fileInfo = state.files.find(f => f.path === path);
      const isText = isTextFile(path);

      // CRITICAL SAFETY CHECK: Block files over 500MB to prevent out-of-memory crashes
      // This applies to ALL file types (text, binary, images, databases, etc.)
      if (fileInfo && fileInfo.size > MAX_FILE_SIZE) {
          showToast(
              `Cannot open ${path.split("/").pop()}: File is ${formatBytes(fileInfo.size)} (max ${formatBytes(MAX_FILE_SIZE)}). This file is too large and would crash the browser.`,
              "error",
              8000
          );
          throw new Error(`File too large: ${formatBytes(fileInfo.size)}`);
      }

      // We only enforce the 2MB warning for TEXT files that would be loaded into the editor.
      // Images and PDFs are handled as binary previews and are generally safe to load at larger sizes.
      if (isText && fileInfo && fileInfo.size > TEXT_FILE_WARNING_SIZE) {
          const confirmed = await showConfirmDialog({
              title: "Large File Detected",
              message: `This text file is <b>${formatBytes(fileInfo.size)}</b>. Opening it in the editor may cause the browser to freeze.<br><br>Do you want to download it instead?`,
              confirmText: "Download",
              cancelText: "Open Anyway (Risky)"
          });

          if (confirmed) {
              downloadFileByPath(path);
              // Return dummy content to prevent editor from loading empty state
              return { content: "", mtime: 0 };
          }
      }

      const data = await fetchWithAuth(
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}&_t=${Date.now()}`
      );
      // loadFile must now return the full data object, not just data.content
      return data; // returns {content: ..., is_base64: ...}
    } catch (error) {
      showToast("Failed to load file: " + error.message, "error");
      throw error;
    }
  }

export async function saveFile(path, content) {
    // SFTP files are saved via the SFTP module
    if (isSftpPathImpl(path)) {
      const tab = state.openTabs.find(t => t.path === path);
      if (tab) return await saveSftpFileImpl(tab, content);
      return false;
    }

    try {
      const response = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "write_file", path, content }),
      });
      
      // Update tab mtime if successful
      if (response.success && response.mtime) {
          const tab = state.openTabs.find(t => t.path === path);
          if (tab) tab.mtime = response.mtime;
      }

      // Refresh files to get updated size (including current file's new size)
      await loadFiles();
      // Find the file to get its size
      const fileEntry = state.files.find(f => f.path === path);
      const fileSize = fileEntry && typeof fileEntry.size === 'number' ? ` (${formatBytes(fileEntry.size)})` : '';
      showToast(`Saved ${path.split("/").pop()}${fileSize}`, "success");

      // Auto-refresh git status after saving to show changes immediately
      await checkGitStatusIfEnabled();

      return true;
    } catch (error) {
      showToast("Failed to save: " + error.message, "error");
      return false;
    }
  }


  // ============================================
  // GitHub Integration Functions
  // ============================================




















// Git Operations (wrapped from git-operations.js)
export async function gitStage(files) {
  return await gitStageImpl(files);
}

export async function handleGitLockAndRetry(files) {
  return await handleGitLockAndRetryImpl(files);
}

export async function gitCleanLocks() {
  return await gitCleanLocksImpl();
}

export async function gitRepairIndex() {
  return await gitRepairIndexImpl();
}

export async function gitUnstage(files) {
  return await gitUnstageImpl(files);
}

export async function gitReset(files) {
  return await gitResetImpl(files);
}

export async function gitCommit(commitMessage) {
  return await gitCommitImpl(commitMessage);
}

export async function gitPull() {
  return await gitPullImpl();
}

export async function gitPush() {
  return await gitPushImpl();
}

  // Update Git Panel UI
export function updateGitPanel() {
  return updateGitPanelImpl();
}

  // Render git files in the panel
export function renderGitFiles(container) {
  return renderGitFilesImpl(container);
}

  // ============================================
  // Gitea Integration Functions
  // ============================================


  // Toggle git file group collapse
export function toggleGitGroup(groupKey, panelType = 'git') {
  return toggleGitGroupImpl(groupKey, panelType);
}

  // Toggle file selection
export function toggleFileSelection(file) {
  return toggleFileSelectionImpl(file);
}

  // Stage selected files
export async function stageSelectedFiles() {
  return await stageSelectedFilesImpl();
}

  // Stage all unstaged files
export async function stageAllFiles() {
  return await stageAllFilesImpl();
}

  // Unstage all staged files
export async function unstageAllFiles() {
  return await unstageAllFilesImpl();
}

  // Commit staged files
export async function commitStagedFiles() {
  return await commitStagedFilesImpl();
}

  // ============================================
  // App Settings
  // ============================================

  // Show App Settings modal
export async function showAppSettings() {
  return await showAppSettingsImpl();
}

  // Show Git Exclusions modal


export function applyVersionControlVisibility() {
  return applyVersionControlVisibilityImpl();
}

// AI UI functions (wrapped from ai-ui.js)
export function updateAIVisibility() {
  return updateAIVisibilityImpl();
}

export function toggleAISidebar() {
  return toggleAISidebarImpl();
}

export function formatAiResponse(text) {
  return formatAiResponseImpl(text);
}

export function copyToClipboard(text) {
  return copyToClipboardImpl(text);
}

export async function sendAIChatMessage() {
  return await sendAIChatMessageImpl();
}


  // ============================================
  // Git Settings
  // ============================================

  // Show Git Settings modal

// Command Palette function (wrapped from command-palette.js)
export function showCommandPalette() {
  return showCommandPaletteImpl();
}

// ============================================
// Global Search (Sidebar) - wrapped from global-search.js
// ============================================

export async function performGlobalSearch(query, options = {}) {
  return await performGlobalSearchImpl(query, options);
}

export async function performGlobalReplace() {
  return await performGlobalReplaceImpl();
}

  // Save git remote


  // ============================================
  // File Operations UI
  // ============================================

// File Operations UI (wrapped from file-operations-ui.js)
export function showInputModal(options) {
  return showInputModalImpl(options);
}

export async function promptNewFile(initialPath = null) {
  return await promptNewFileImpl(initialPath);
}

export async function promptNewFolder(initialPath = null) {
  return await promptNewFolderImpl(initialPath);
}

export async function promptRename(path, isFolder) {
  return await promptRenameImpl(path, isFolder);
}

export async function promptCopy(path, isFolder) {
  return await promptCopyImpl(path, isFolder);
}

export async function promptMove(path, isFolder) {
  return await promptMoveImpl(path, isFolder);
}

export async function duplicateItem(path, isFolder) {
  return await duplicateItemImpl(path, isFolder);
}

export async function promptDelete(path, isFolder) {
  return await promptDeleteImpl(path, isFolder);
}

  // ============================================
  // File Tree Rendering
  // ============================================
  // Content Search (Sidebar) - wrapped from file-tree.js
  // ============================================

export const debouncedContentSearch = debouncedContentSearchImpl;
export const debouncedFilenameSearch = debouncedFilenameSearchImpl;
export const performContentSearch = performContentSearchImpl;

  // Tab Management
  // ============================================

export async function openFile(path, forceReload = false, noActivate = false) {
    const filename = path.split("/").pop();
    const ext = filename.split(".").pop().toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext);
    const isPdf = ext === "pdf";
    const isVideo = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "m4v"].includes(ext);
    const isBinary = !isTextFile(path);

    // If it's a binary file that's not an image, PDF, or video, just download it
    if (isBinary && !isImage && !isPdf && !isVideo) {
      downloadFileByPath(path);
      return;
    }

    let tab = state.openTabs.find((t) => t.path === path);

    // ONE TAB MODE: auto-save & close all other tabs before opening a new file
    if (state.onTabMode && !tab) {
      const tabsToClose = state.openTabs.slice(); // copy array before mutating
      for (const t of tabsToClose) {
        if (t.modified && t.content !== undefined && !t.isBinary) {
          // Auto-save silently (no toast, no YAML validation)
          try {
            await fetchWithAuth(API_BASE, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "write_file", path: t.path, content: t.content }),
            });
          } catch (e) {
            console.warn("One Tab Mode: could not auto-save", t.path, e);
          }
        }
        if (t._blobUrl) URL.revokeObjectURL(t._blobUrl);
      }
      state.openTabs = [];
      state.activeTab = null;
    }

    if (tab && forceReload) {
        // If this is the active tab, preserve cursor/scroll from editor before reload
        if (state.activeTab === tab && state.editor && !tab.isBinary) {
            tab.cursor = state.editor.getCursor();
            tab.scroll = state.editor.getScrollInfo();
        }

        try {
            const data = await loadFile(path);
            tab.content = data.content;
            tab.originalContent = data.content;
            tab.mtime = data.mtime;
            tab.modified = false;
            tab.history = null; 
        } catch (e) {
            console.error("Failed to reload file content", e);
        }
    } else if (!tab) {
      try {
        const data = await loadFile(path);
        const content = data.content;

        tab = {
          path,
          content,
          originalContent: content,
          mtime: data.mtime,
          modified: false,
          history: null,
          cursor: null,
          scroll: null,
          isBinary: isBinary,
          isImage: isImage,
          isPdf: isPdf,
          isVideo: isVideo,
          mimeType: data.mime_type
        };
        state.openTabs.push(tab);
      } catch (error) {
        showToast(`Failed to open ${filename}: ${error.message}`, "error");
        return;
      }
    }

    // Update recent files
    state.recentFiles = state.recentFiles.filter(p => p !== path); // Remove if already exists
    state.recentFiles.unshift(path); // Add to the beginning
    const limit = state.recentFilesLimit || MAX_RECENT_FILES;
    if (state.recentFiles.length > limit) {
      state.recentFiles.pop(); // Trim to max size
    }

    if (noActivate) return tab;

    activateTab(tab, forceReload);
    renderTabs();
    renderFileTree();
    updateSplitViewButtons();
    saveSettingsImpl(); // To save recent files
  }

export function activateTab(tab, skipSave = false) {
    // Hide welcome screen
    if (elements.welcomeScreen) {
      elements.welcomeScreen.style.display = "none";
    }

    // Determine which pane this tab should be in
    const tabIndex = state.openTabs.indexOf(tab);
    let pane = null;
    let targetEditor = state.editor;

    if (state.splitView && state.splitView.enabled && tabIndex !== -1) {
      pane = getPaneForTab(tabIndex);
      if (pane === 'primary') {
        targetEditor = state.primaryEditor;
        state.splitView.primaryActiveTab = tab;
        state.splitView.activePane = 'primary';
      } else if (pane === 'secondary') {
        targetEditor = state.secondaryEditor;
        state.splitView.secondaryActiveTab = tab;
        state.splitView.activePane = 'secondary';
      } else {
        // Tab not assigned to any pane yet, assign to active pane
        if (state.splitView.activePane === 'secondary' && state.secondaryEditor) {
          targetEditor = state.secondaryEditor;
          pane = 'secondary';
          if (!state.splitView.secondaryTabs.includes(tabIndex)) {
            state.splitView.secondaryTabs.push(tabIndex);
          }
          state.splitView.secondaryActiveTab = tab;
        } else {
          targetEditor = state.primaryEditor;
          pane = 'primary';
          if (!state.splitView.primaryTabs.includes(tabIndex)) {
            state.splitView.primaryTabs.push(tabIndex);
          }
          state.splitView.primaryActiveTab = tab;
        }
      }
      state.editor = targetEditor;
      updatePaneActiveState();
    }

    // Save current tab state before switching (only for text files)
    if (!skipSave && state.activeTab && targetEditor && !state.activeTab.isBinary) {
      state.activeTab.content = targetEditor.getValue();
      state.activeTab.history = targetEditor.getHistory();
      state.activeTab.cursor = targetEditor.getCursor();
      state.activeTab.scroll = targetEditor.getScrollInfo();
    }

    state.activeTab = tab;

    // Handle Binary Preview
    if (tab.isBinary) {
        if (targetEditor) {
            targetEditor.getWrapperElement().style.display = "none";
        }
        // Use appropriate preview container based on pane
        const previewContainer = (pane === 'secondary') ?
          document.getElementById('secondary-asset-preview') :
          elements.assetPreview;
        if (previewContainer) {
            previewContainer.classList.add("visible");
            renderAssetPreview(tab, previewContainer);
        }
    } else {
        // Handle Text Editor
        // Hide preview in appropriate pane
        const previewContainer = (pane === 'secondary') ?
          document.getElementById('secondary-asset-preview') :
          elements.assetPreview;
        if (previewContainer) {
            previewContainer.classList.remove("visible");
            previewContainer.innerHTML = "";
        }

        // Create editor if it doesn't exist
        if (!targetEditor) {
          if (pane === 'secondary') {
            createSecondaryEditor();
            targetEditor = state.secondaryEditor;
          } else {
            createEditor();
            targetEditor = state.primaryEditor;
          }
          state.editor = targetEditor;
          applyEditorSettings(); // Ensure theme/font are applied to new instance
          // Update toolbar immediately after editor creation
          updateToolbarState();
        }

        if (targetEditor) {
          // Show the custom wrapper div (contains CodeMirror)
          if (pane === 'primary' || !pane) {
            const wrapperDiv = document.getElementById('codemirror-wrapper');
            if (wrapperDiv) {
              wrapperDiv.style.display = "block";
            }
          } else if (pane === 'secondary') {
            const wrapperDiv = document.getElementById('codemirror-wrapper-secondary');
            if (wrapperDiv) {
              wrapperDiv.style.display = "block";
            }
          }

          targetEditor.getWrapperElement().style.display = "block";

          // Update editor content and settings
          const mode = getEditorMode(tab.path);

          // Try to set the mode, fall back to yaml if ha-yaml fails
          try {
            targetEditor.setOption("mode", mode);
          } catch (error) {
            console.error("Error setting editor mode:", error);
            if (mode === "ha-yaml") {
              targetEditor.setOption("mode", "yaml");
            }
          }

          const isReadOnly = tab.path.endsWith(".gitignore") || tab.path.endsWith(".lock");
          targetEditor.setOption("readOnly", isReadOnly);
          targetEditor.setOption("lint", (mode === "ha-yaml" || mode === "yaml") ? { getAnnotations: yamlLinter, async: true } : false);

          // Dynamic Indent Detection - only for files with meaningful indentation
          // Skip detection for empty/small files to respect user preference
          const hasIndentedContent = tab.content && tab.content.split('\n').length > 2 && /^\s+/m.test(tab.content);
          const indent = hasIndentedContent
            ? detectIndentation(tab.content)
            : { tabs: state.indentWithTabs || false, size: state.tabSize || 2 };

          targetEditor.setOption("indentWithTabs", indent.tabs);
          targetEditor.setOption("indentUnit", indent.size);
          targetEditor.setOption("tabSize", indent.size);

          // Set content without triggering change event
          targetEditor.off("change", handleEditorChange);
          targetEditor.setValue(tab.content);
          targetEditor.on("change", () => handleEditorChange(targetEditor));

          // Restore history if available
          if (tab.history) {
            targetEditor.setHistory(tab.history);
          } else {
            targetEditor.clearHistory();
          }

          // Restore cursor and scroll position
          if (tab.cursor) {
            targetEditor.setCursor(tab.cursor);
          }
          if (tab.scroll) {
            targetEditor.scrollTo(tab.scroll.left, tab.scroll.top);
          }

          // Refresh and focus
          targetEditor.refresh();
          targetEditor.focus();
        }
    }

    debouncedRenderFileTree();
    updateToolbarState();
    updateStatusBar();

    // Show/hide Markdown group
    if (elements.groupMarkdown) {
        elements.groupMarkdown.style.display = tab.path.endsWith(".md") ? "flex" : "none";
        elements.btnMarkdownPreview?.classList.remove("active");
    }

    if (elements.filePath) {
      elements.filePath.textContent = tab.path;
    }

    // Update breadcrumb navigation
    updateBreadcrumb(tab.path);

    // Update current folder path
    state.currentFolderPath = tab.path.split("/").slice(0, -1).join("/");

    // Save state after switching
    saveSettingsImpl();
  }

// Wrapper for asset preview module function
function renderAssetPreview(tab, container = null) {
  return renderAssetPreviewImpl(tab, container);
}

// Markdown Preview - wrapped from asset-preview.js
export const toggleMarkdownPreview = toggleMarkdownPreviewImpl;

// Wrapper for editor module function
export function detectIndentation(content) {
  return detectIndentationImpl(content);
}

  // ============================================
  // Breadcrumb Navigation
  // ============================================

// Re-export breadcrumb module functions
export const updateBreadcrumb = updateBreadcrumbImpl;
export const expandFolderInTree = expandFolderInTreeImpl;

// Re-export sidebar module functions
export const showSidebar = showSidebarImpl;
export const hideSidebar = hideSidebarImpl;
export const switchSidebarView = switchSidebarViewImpl;
export const toggleSidebar = toggleSidebarImpl;

// Re-export split view module functions
export {
  enableSplitView,
  disableSplitView,
  setActivePaneFromPosition,
  moveToPrimaryPane,
  moveToSecondaryPane,
  getPaneForTab,
  getActivePaneEditor,
  updatePaneSizes,
  initSplitResize,
  updatePaneActiveState
};

// ============================================
// LOADING STATE FUNCTIONS
// ============================================

export function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
        button.classList.add("loading");
        button.disabled = true;
    } else {
        button.classList.remove("loading");
        button.disabled = false;
    }
}

export function setFileTreeLoading(isLoading) {
    if (elements.fileTree) {
        if (isLoading) {
            elements.fileTree.classList.add("loading");
            // Show skeletons
            elements.fileTree.innerHTML = `
                <div class="skeleton file-skeleton"></div>
                <div class="skeleton file-skeleton" style="width: 70%;"></div>
                <div class="skeleton file-skeleton" style="width: 85%;"></div>
                <div class="skeleton file-skeleton" style="width: 60%;"></div>
                <div class="skeleton file-skeleton" style="width: 90%;"></div>
            `;
        } else {
            elements.fileTree.classList.remove("loading");
        }
    }
}

// ============================================

// Wrapper for editor module function
export function handleEditorChange() {
  return handleEditorChangeImpl();
}

// Wrapper for editor module function
export function selectNextOccurrence(cm) {
  return selectNextOccurrenceImpl(cm);
}


// Wrapper for editor module function
export function createEditor() {
  const editor = createEditorImpl();
  // Ensure state references are set correctly
  if (!state.primaryEditor) {
    state.primaryEditor = editor;
  }
  if (!state.editor) {
    state.editor = editor;
  }
  return editor;
}

export function createSecondaryEditor() {
  return createSecondaryEditorImpl();
}

export function destroySecondaryEditor() {
  return destroySecondaryEditorImpl();
}

// Wrapper for editor module function
export function yamlLinter(content, updateLinting) {
  return yamlLinterImpl(content, updateLinting);
}

export function renderTabs() {
  return renderTabsImpl();
}

// Tab Operations
export async function closeAllTabs(force = false) {
  return await closeAllTabsImpl(force);
}

export async function closeOtherTabs(keepTab, force = false) {
  return await closeOtherTabsImpl(keepTab, force);
}

export async function closeTabsToRight(tab, force = false) {
  return await closeTabsToRightImpl(tab, force);
}

export function nextTab() {
  return nextTabImpl();
}

export function previousTab() {
  return previousTabImpl();
}

export function closeTab(tab, force = false) {
    if (tab.modified && !force) {
      if (!confirm(`${tab.path.split("/").pop()} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    const index = state.openTabs.indexOf(tab);
    
    // Revoke blob URL if it exists (for PDFs)
    if (tab._blobUrl) {
        URL.revokeObjectURL(tab._blobUrl);
    }

    state.openTabs.splice(index, 1);

    // Auto-close split view if only 1 tab remains
    if (state.splitView && state.splitView.enabled && state.openTabs.length <= 1) {
      disableSplitView();
    }

    if (state.activeTab === tab) {
      if (state.openTabs.length > 0) {
        const newIndex = Math.min(index, state.openTabs.length - 1);
        activateTab(state.openTabs[newIndex]);
      } else {
        state.activeTab = null;
        // Clear the editor but don't remove it
        if (state.editor) {
          state.editor.setValue("");
          // Hide the editor wrapper to show welcome screen
          state.editor.getWrapperElement().style.display = "none";
        }
        if (elements.welcomeScreen) {
          elements.welcomeScreen.style.display = "flex";
        }
        if (elements.assetPreview) {
          elements.assetPreview.classList.remove("visible");
          elements.assetPreview.innerHTML = "";
        }
        if (elements.filePath) {
          elements.filePath.textContent = "";
        }
        // Clear breadcrumb
        if (elements.breadcrumb) {
          elements.breadcrumb.innerHTML = "";
        }
      }
    }

    renderTabs();
    renderFileTree();
    updateToolbarState();
    updateSplitViewButtons();
    saveSettingsImpl();  // Save open tabs state
  }

  // ============================================
  // File Operations
  // ============================================

export async function saveCurrentFile(isAutoSave = false) {
    // Safety check: if this is an auto-save call but feature is disabled, abort.
    // We check explicitly for boolean true because button clicks pass an Event object.
    const reallyAutoSave = isAutoSave === true;
    
    if (reallyAutoSave && !state.autoSave) return;

    if (!state.activeTab) return;

    const tab = state.activeTab;
    
    // Prevent saving read-only files
    if (tab.path.endsWith(".gitignore") || tab.path.endsWith(".lock")) {
      if (!reallyAutoSave) {
        showToast("This file is read-only and cannot be saved manually.", "warning");
      }
      return;
    }

    const content = tab.content;
    const isYaml = tab.path.endsWith(".yaml") || tab.path.endsWith(".yml");

    // 1. Validate if it's a YAML file (skip validation for auto-save)
    if (isYaml && !reallyAutoSave) {
      const validationResult = await validateYaml(content);
      if (!validationResult.valid) {
        const confirmed = await showConfirmDialog({
          title: "YAML Validation Error",
          message: `The file contains an error and may not work with Home Assistant.<br><br><div style="background: var(--bg-tertiary); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${validationResult.error}</div>`,
          confirmText: "Save Anyway",
          cancelText: "Cancel",
          isDanger: true
        });

        if (!confirmed) {
          showToast("Save cancelled due to validation errors.", "warning");
          return; // Abort save
        }
      }
    }

    // 2. Proceed with saving
    if (!reallyAutoSave) {
      setButtonLoading(elements.btnSave, true);
    }

    const success = await saveFile(tab.path, content);

    if (!reallyAutoSave) {
      setButtonLoading(elements.btnSave, false);
    }

    if (success) {
      tab.originalContent = content;
      tab.modified = false;
      renderTabs();
      renderFileTree();
      updateToolbarState();

      // Save settings to persist the cleared modified state
      saveSettings();

      if (reallyAutoSave) {
        // Show subtle auto-save indicator
        showToast(`Auto-saved ${tab.path.split("/").pop()}`, "info", 1500);
      }
    }
  }

// Re-export dialogs module functions
export const reportIssue = reportIssueImpl;
export const requestFeature = requestFeatureImpl;
export const showShortcuts = showShortcutsImpl;
export const hideShortcuts = hideShortcutsImpl;

// Re-export context-menu module functions
export const showContextMenu = showContextMenuImpl;
export const showTabContextMenu = showTabContextMenuImpl;
export const hideContextMenu = hideContextMenuImpl;

// Re-export search module functions
export const updateSearchHighlights = updateSearchHighlightsImpl;
export const updateMatchStatus = updateMatchStatusImpl;
export const openSearchWidget = openSearchWidgetImpl;
export const closeSearchWidget = closeSearchWidgetImpl;
export const doFind = doFindImpl;
export const doReplace = doReplaceImpl;
export const doReplaceAll = doReplaceAllImpl;

// Re-export quick-switcher module functions
export const showQuickSwitcher = showQuickSwitcherImpl;
export const hideQuickSwitcher = hideQuickSwitcherImpl;
export const updateQuickSwitcherResults = updateQuickSwitcherResultsImpl;

// Re-export favorites module functions
export const isFavorite = isFavoriteImpl;
export const toggleFavorite = toggleFavoriteImpl;
export const renderFavoritesPanel = renderFavoritesPanelImpl;

// Re-export recent-files module functions
export const renderRecentFilesPanel = renderRecentFilesPanelImpl;

// Re-export autosave module functions
export { autoSaveTimer };
export const saveAllFiles = saveAllFilesImpl;

// Re-export polling module functions
export const gitStatusPollingInterval = pollingInterval;
export const checkFileUpdates = checkFileUpdatesImpl;
export const startGitStatusPolling = startGitStatusPollingImpl;
export const stopGitStatusPolling = stopGitStatusPollingImpl;

// Re-export downloads-uploads module functions
export const downloadCurrentFile = downloadCurrentFileImpl;
export const downloadFileByPath = downloadFileByPathImpl;
export const downloadContent = downloadContentImpl;
export const downloadFolder = downloadFolderImpl;
export const downloadSelectedItems = downloadSelectedItemsImpl;
export const triggerUpload = triggerUploadImpl;
export const processUploads = processUploadsImpl;
export const handleFileUpload = handleFileUploadImpl;
export const readFileAsText = readFileAsTextImpl;
export const readFileAsBase64 = readFileAsBase64Impl;
export const uploadFile = uploadFileImpl;
export const triggerFolderUpload = triggerFolderUploadImpl;
export const handleFolderUpload = handleFolderUploadImpl;

// Re-export settings module functions
export const loadSettings = loadSettingsImpl;
export const saveSettings = saveSettingsImpl;

// Re-export SFTP module functions
export const isSftpPath = isSftpPathImpl;
export const parseSftpPath = parseSftpPathImpl;
export const saveSftpFile = saveSftpFileImpl;
export const renderSftpPanel = renderSftpPanelImpl;
export const applySftpVisibility = applySftpVisibilityImpl;
export const connectToServer = connectToServerImpl;
export const navigateSftp = navigateSftpImpl;
export const openSftpFile = openSftpFileImpl;
export const showAddConnectionDialog = showAddConnectionDialogImpl;
export const showEditConnectionDialog = showEditConnectionDialogImpl;
export const deleteConnection = deleteConnectionImpl;
export const updateShowHiddenButton = updateShowHiddenButtonImpl;

// Re-export selection module functions
export const toggleSelectionMode = toggleSelectionModeImpl;
export const handleSelectionChange = handleSelectionChangeImpl;
export const updateSelectionCount = updateSelectionCountImpl;
export const deleteSelectedItems = deleteSelectedItemsImpl;

// Re-export file-operations module functions
export const createFile = createFileImpl;
export const createFolder = createFolderImpl;
export const deleteItem = deleteItemImpl;
export const copyItem = copyItemImpl;
export const renameItem = renameItemImpl;
export const formatCode = formatCodeImpl;
export const validateYaml = validateYamlImpl;

// Re-export file-tree module functions
export { fileTreeRenderTimer };
export const debouncedRenderFileTree = debouncedRenderFileTreeImpl;
export const buildFileTree = buildFileTreeImpl;
export const renderFileTree = renderFileTreeImpl;
export const renderTreeLevel = renderTreeLevelImpl;
export const handleFileDropMulti = handleFileDropMultiImpl;
export const handleFileDrop = handleFileDropImpl;
export const folderMatchesSearch = folderMatchesSearchImpl;
export const createTreeItem = createTreeItemImpl;
export const handleDragStart = handleDragStartImpl;
export const handleDragOver = handleDragOverImpl;
export const handleDragLeave = handleDragLeaveImpl;
export const handleDrop = handleDropImpl;
export const toggleFolder = toggleFolderImpl;
export const updateToggleAllButton = updateToggleAllButtonImpl;

// Re-export git-diff module functions
export const showDiffModal = showDiffModalImpl;
export const showGitHistory = showGitHistoryImpl;
export const showGitCommitDiff = showGitCommitDiffImpl;

// Re-export git-operations module functions
export const isGitEnabled = isGitEnabledImpl;
export const checkGitStatusIfEnabled = checkGitStatusIfEnabledImpl;
export const gitStatus = gitStatusImpl;
export const gitInit = gitInitImpl;
export const abortGitOperation = abortGitOperationImpl;
export const forcePush = forcePushImpl;
export const hardReset = hardResetImpl;
export const deleteRemoteBranch = deleteRemoteBranchImpl;
export const gitGetRemotes = gitGetRemotesImpl;
export const gitSetCredentials = gitSetCredentialsImpl;

// Re-export github-integration module functions
export const gitAddRemote = gitAddRemoteImpl;
export const githubCreateRepo = githubCreateRepoImpl;
export const repairBranchMismatch = repairBranchMismatchImpl;
export const gitTestConnection = gitTestConnectionImpl;
export const gitClearCredentials = gitClearCredentialsImpl;
export const githubDeviceFlowStart = githubDeviceFlowStartImpl;
export const githubDeviceFlowPoll = githubDeviceFlowPollImpl;
export const showGithubDeviceFlowLogin = showGithubDeviceFlowLoginImpl;
export const showGitExclusions = showGitExclusionsImpl;
export const showGitSettings = showGitSettingsImpl;
export const showCreateGithubRepoDialog = showCreateGithubRepoDialogImpl;
export const saveGitRemote = saveGitRemoteImpl;
export const saveGitCredentials = saveGitCredentialsImpl;
export const testGitConnection = testGitConnectionImpl;

// Re-export gitea-integration module functions
export const giteaInit = giteaInitImpl;
export const giteaStatus = giteaStatusImpl;
export const giteaPush = giteaPushImpl;
export const giteaPull = giteaPullImpl;
export const giteaCommit = giteaCommitImpl;
export const giteaStage = giteaStageImpl;
export const giteaUnstage = giteaUnstageImpl;
export const giteaAbort = giteaAbortImpl;
export const giteaForcePush = giteaForcePushImpl;
export const giteaHardReset = giteaHardResetImpl;
export const toggleGiteaFileSelection = toggleGiteaFileSelectionImpl;
export const stageSelectedGiteaFiles = stageSelectedGiteaFilesImpl;
export const stageAllGiteaFiles = stageAllGiteaFilesImpl;
export const unstageAllGiteaFiles = unstageAllGiteaFilesImpl;
export const updateGiteaPanel = updateGiteaPanelImpl;
export const renderGiteaFiles = renderGiteaFilesImpl;
export const showGiteaSettings = showGiteaSettingsImpl;
export const giteaCreateRepo = giteaCreateRepoImpl;

  // ============================================
  // UI Updates
  // ============================================

// Re-export toolbar module functions
export const updateToolbarState = updateToolbarStateImpl;

// Re-export status-bar module functions
export const updateStatusBar = updateStatusBarImpl;


  // ============================================
  // Resize Handle
  // ============================================

// Re-export resize module functions
export const initResizeHandle = initResizeHandleImpl;

  // ============================================
  // Event Listeners
  // ============================================

// Export restartHomeAssistant re-exported from event-handlers
export const restartHomeAssistant = restartHomeAssistantImpl;

registerEventHandlerCallbacks({
  loadFiles,
  saveCurrentFile,
  saveAllFiles,
  formatCode,
  performGlobalReplace,
  performGlobalSearch,
  toggleMarkdownPreview,
  toggleAISidebar,
  sendAIChatMessage,
  promptNewFile: (path) => promptNewFile(path),
  promptNewFolder: (path) => promptNewFolder(path),
  toggleGitGroup,
  stageSelectedFiles,
  stageAllFiles,
  unstageAllFiles,
  commitStagedFiles,
  toggleFileSelection,
  promptRename,
  promptMove,
  promptCopy,
  duplicateItem,
  promptDelete,
  closeTab,
  activateTab,
  nextTab: nextTabImpl,
  previousTab: previousTabImpl,
  showCommandPalette,
  debouncedContentSearch,
  debouncedFilenameSearch,
  // Split view callbacks
  enableSplitView,
  disableSplitView,
  moveToPrimaryPane,
  moveToSecondaryPane,
  setActivePaneFromPosition
});

  // ============================================
  // Initialization
  // ============================================

export async function restoreOpenTabs() {
    // CRITICAL: Ensure primary editor exists BEFORE restoring any tabs
    if (!state.primaryEditor) {
      createEditor();
    }

    if (!state._savedOpenTabs || state._savedOpenTabs.length === 0) {
      // No tabs to restore - show welcome screen
      if (state.primaryEditor) {
        state.primaryEditor.setValue("");
        // Hide the custom wrapper div (contains CodeMirror)
        const wrapperDiv = document.getElementById('codemirror-wrapper');
        if (wrapperDiv) {
          wrapperDiv.style.display = "none";
        }
      }
      if (elements.welcomeScreen) {
        elements.welcomeScreen.style.display = "flex";
      }
      if (elements.assetPreview) {
        elements.assetPreview.classList.remove("visible");
        elements.assetPreview.innerHTML = "";
      }
      return;
    }

    // Restore tabs
    for (const tabState of state._savedOpenTabs) {
      // Handle SFTP paths differently (they're not in state.files)
      if (isSftpPathImpl(tabState.path)) {
        const { connId, remotePath } = parseSftpPathImpl(tabState.path);
        // Only restore if the connection still exists
        const connExists = state.sftpConnections.some(c => c.id === connId);
        if (connExists) {
          try {
            await openSftpFileImpl(connId, remotePath);
            const tab = state.openTabs.find(t => t.path === tabState.path);
            if (tab) {
              tab.cursor = tabState.cursor || null;
              tab.scroll = tabState.scroll || null;
              if (tabState.modified && tabState.content) {
                tab.modified = true;
                tab.content = tabState.content;
                if (tabState.originalContent) {
                  tab.originalContent = tabState.originalContent;
                }
                if (state.editor && state.activeTab === tab) {
                  state.editor.setValue(tab.content);
                }
              }
            }
          } catch (err) {
            console.warn(`Failed to restore SFTP tab ${tabState.path}:`, err);
          }
        }
      } else {
        // Local file - check if it exists
        const fileExists = state.files.some(f => f.path === tabState.path);
        if (fileExists) {
          const tab = await openFile(tabState.path, false, true);
          if (tab) {
            tab.cursor = tabState.cursor || null;
            tab.scroll = tabState.scroll || null;

            // Restore modified state and content if it was modified before
            if (tabState.modified && tabState.content) {
              tab.modified = true;
              tab.content = tabState.content;
              if (tabState.originalContent) {
                tab.originalContent = tabState.originalContent;
              }

              // Update editor if this is the active tab
              if (state.editor && state.activeTab === tab) {
                state.editor.setValue(tab.content);
              }
            }
          }
        }
      }
    }

    // Restore active tab
    if (state._savedActiveTabPath) {
      const activeTab = state.openTabs.find(t => t.path === state._savedActiveTabPath);
      if (activeTab) {
        activateTab(activeTab);
        renderTabs();
        renderFileTree();
      }
    }

    // Restore split view if it was enabled
    if (state.splitView && state.splitView.enabled) {
      // Ensure both editors exist
      if (!state.secondaryEditor) {
        createSecondaryEditor();
      }

      // Explicitly show split view DOM elements (in case split-view.js is cached)
      const splitContainer = document.getElementById('split-container');
      const primaryPane = document.getElementById('primary-pane');
      const secondaryPane = document.getElementById('secondary-pane');
      const resizeHandle = document.getElementById('split-resize-handle');
      if (splitContainer) {
        splitContainer.className = `split-container ${state.splitView.orientation}`;
      }
      if (primaryPane) {
        primaryPane.style.display = 'flex';
        primaryPane.style.flex = `0 0 ${state.splitView.primaryPaneSize}%`;
      }
      if (secondaryPane) {
        secondaryPane.style.display = 'flex';
        secondaryPane.style.flex = `0 0 ${100 - state.splitView.primaryPaneSize}%`;
      }
      if (resizeHandle) {
        resizeHandle.style.display = 'block';
      }

      // Enable split view without initializing tab distribution (we'll use saved arrays)
      enableSplitView(state.splitView.orientation, true);

      // Restore primary pane active tab and content
      if (state._savedPrimaryActiveTabPath) {
        const primaryTab = state.openTabs.find(t => t.path === state._savedPrimaryActiveTabPath);
        if (primaryTab) {
          state.splitView.primaryActiveTab = primaryTab;

          // Load content into primary editor
          if (state.primaryEditor) {
            state.primaryEditor.setValue(primaryTab.content || primaryTab.originalContent || "");

            // Set mode
            const ext = primaryTab.path.split('.').pop().toLowerCase();
            const modeMap = {
              'yaml': 'ha-yaml', 'yml': 'ha-yaml', 'js': 'javascript',
              'json': 'application/json', 'py': 'python', 'html': 'htmlmixed',
              'css': 'css', 'xml': 'xml', 'md': 'markdown',
            };
            const mode = modeMap[ext] || null;
            if (mode) state.primaryEditor.setOption('mode', mode);

            if (primaryTab.cursor) state.primaryEditor.setCursor(primaryTab.cursor);
            if (primaryTab.scroll) state.primaryEditor.scrollTo(primaryTab.scroll.left, primaryTab.scroll.top);
            state.primaryEditor.refresh();
          }
        }
      }

      // Restore secondary pane active tab and content
      if (state._savedSecondaryActiveTabPath) {
        const secondaryTab = state.openTabs.find(t => t.path === state._savedSecondaryActiveTabPath);
        if (secondaryTab) {
          state.splitView.secondaryActiveTab = secondaryTab;

          // Load content into secondary editor
          if (state.secondaryEditor) {
            state.secondaryEditor.setValue(secondaryTab.content || secondaryTab.originalContent || "");

            // Set mode
            const ext = secondaryTab.path.split('.').pop().toLowerCase();
            const modeMap = {
              'yaml': 'ha-yaml', 'yml': 'ha-yaml', 'js': 'javascript',
              'json': 'application/json', 'py': 'python', 'html': 'htmlmixed',
              'css': 'css', 'xml': 'xml', 'md': 'markdown',
            };
            const mode = modeMap[ext] || null;
            if (mode) state.secondaryEditor.setOption('mode', mode);

            if (secondaryTab.cursor) state.secondaryEditor.setCursor(secondaryTab.cursor);
            if (secondaryTab.scroll) state.secondaryEditor.scrollTo(secondaryTab.scroll.left, secondaryTab.scroll.top);
            state.secondaryEditor.refresh();
          }
        }
      }

      // Restore pane sizes
      if (state.splitView.primaryPaneSize) {
        updatePaneSizes(state.splitView.primaryPaneSize);
      }

      // Initialize resize handle manually (since split-view.js is cached)
      const handle = document.getElementById('split-resize-handle');
      if (handle) {
        let isResizing = false;
        let startPos = 0;
        let startPrimarySize = 0;

        // Remove any existing listeners
        const newHandle = handle.cloneNode(true);
        handle.parentNode.replaceChild(newHandle, handle);

        newHandle.addEventListener('mousedown', (e) => {
          isResizing = true;
          startPos = state.splitView.orientation === 'vertical' ? e.clientX : e.clientY;
          startPrimarySize = state.splitView.primaryPaneSize;
          document.body.style.cursor = state.splitView.orientation === 'vertical' ? 'col-resize' : 'row-resize';
          document.body.style.userSelect = 'none';
          e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
          if (!isResizing) return;

          const container = document.getElementById('split-container');
          if (!container) return;

          const containerRect = container.getBoundingClientRect();
          let newSize;

          if (state.splitView.orientation === 'vertical') {
            const delta = e.clientX - startPos;
            const deltaPercent = (delta / containerRect.width) * 100;
            newSize = Math.max(20, Math.min(80, startPrimarySize + deltaPercent));
          } else {
            const delta = e.clientY - startPos;
            const deltaPercent = (delta / containerRect.height) * 100;
            newSize = Math.max(20, Math.min(80, startPrimarySize + deltaPercent));
          }

          updatePaneSizes(newSize);
        });

        document.addEventListener('mouseup', () => {
          if (!isResizing) return;
          isResizing = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';

          if (state.primaryEditor) state.primaryEditor.refresh();
          if (state.secondaryEditor) state.secondaryEditor.refresh();
          saveSettings();
        });
      }

      renderTabs();
      updatePaneActiveState();

      // Activate the tab in the active pane to ensure content is visible
      if (state.splitView.activePane === 'primary' && state.splitView.primaryActiveTab) {
        state.editor = state.primaryEditor;
        if (state.primaryEditor) {
          state.primaryEditor.focus();
          state.primaryEditor.refresh();
        }
      } else if (state.splitView.activePane === 'secondary' && state.splitView.secondaryActiveTab) {
        state.editor = state.secondaryEditor;
        if (state.secondaryEditor) {
          state.secondaryEditor.focus();
          state.secondaryEditor.refresh();
        }
      }

      // Make sure both editor wrappers are visible
      if (state.primaryEditor) {
        const primaryWrapper = state.primaryEditor.getWrapperElement();
        if (primaryWrapper) {
          primaryWrapper.style.display = 'block';
        }
      }
      if (state.secondaryEditor) {
        const secondaryWrapper = state.secondaryEditor.getWrapperElement();
        if (secondaryWrapper) {
          secondaryWrapper.style.display = 'block';
        }
      }
    }

    // Clear saved state
    delete state._savedOpenTabs;
    delete state._savedActiveTabPath;
    delete state._savedPrimaryActiveTabPath;
    delete state._savedSecondaryActiveTabPath;
  }


// Register callbacks for initialization module
registerInitializationCallbacks({
  loadFiles,
  openFile,
  saveFile,
  saveCurrentFile,
  renderTabs,
  renderFileTree,
  closeTab,
  loadFile,
  gitStage,
  gitUnstage,
  setButtonLoading,
  restoreOpenTabs,
  copyToClipboard,
  applyVersionControlVisibility,
  updateAIVisibility,
  applySftpVisibility,
  renderSftpPanel,
  updateGitPanel,
  updateToolbarState,
  updateStatusBar,
  updateSplitViewButtons,
  isTextFile,
  toggleSelectionMode,
  processUploads,
  renderRecentFilesPanel,
  renderFavoritesPanel,
  handleSelectionChange,
  showContextMenu,
  toggleFavorite,
  hideSidebar,
  showDiffModal,
  gitCleanLocks
});

registerGitUICallbacks({
  isGitEnabled,
  gitStatus,
  gitStage,
  gitUnstage,
  gitCommit,
  saveSettings,
  showToast,
  showModal,
  showConfirmDialog,
  repairBranchMismatch,
  abortGitOperation,
  deleteRemoteBranch,
  forcePush,
  hardReset,
  setButtonLoading
});

registerTabsCallbacks({
  activateTab,
  closeTab,
  renderFileTree,
  showTabContextMenu,
  setActivePaneFromPosition,
  handleTabDragStart,
  handleTabDragOver,
  handleTabDrop,
  handleTabDragEnd
});

// Register split view module callbacks
registerSplitViewCallbacks({
  createEditor: createEditorImpl,
  createSecondaryEditor: createSecondaryEditorImpl,
  destroySecondaryEditor: destroySecondaryEditorImpl,
  activateTab,
  renderTabs,
  saveSettings: saveSettingsImpl,
  renderFileTree
});

// Register editor module callbacks
registerEditorCallbacks({
  saveCurrentFile,
  openSearchWidget,
  showCommandPalette,
  openFile,
  closeTab,
  nextTab,
  previousTab,
  updateToolbarState,
  updateStatusBar,
  renderTabs,
  renderFileTree,
  triggerAutoSave,
  applyEditorSettings,
  applyCustomSyntaxColors,
  saveSettings: saveSettingsImpl,
  getWorkspaceSaveTimer: () => workspaceSaveTimer,
  setWorkspaceSaveTimer: (timer) => { workspaceSaveTimer = timer; },
  updatePaneActiveState
});

// Register asset preview module callbacks
registerAssetPreviewCallbacks({
  openFile,
  closeTab,
  downloadContent
});

// Register AI UI module callbacks
registerAICallbacks({
  showToast,
  fetchWithAuth,
  getApiBase: () => API_BASE
});

// Register command palette module callbacks
registerCommandPaletteCallbacks({
  saveFile,
  saveAllFiles,
  showQuickSwitcher,
  promptNewFile,
  promptNewFolder,
  insertUUID,
  gitStatus,
  gitPush,
  gitPull,
  showGitHistory,
  validateYaml,
  restartHomeAssistant,
  toggleSidebar,
  showShortcuts,
  showAppSettings,
  reportIssue,
  requestFeature,
  fetchWithAuth,
  getApiBase: () => API_BASE,
  showToast,
  copyToClipboard,
  downloadFileByPath,
  saveSettings: saveSettingsImpl,
  setTheme,
  closeTab
});

// Register global search module callbacks
registerGlobalSearchCallbacks({
  fetchWithAuth,
  getApiBase: () => API_BASE,
  showConfirmDialog,
  showGlobalLoading,
  hideGlobalLoading,
  showToast,
  loadFiles,
  openFile,
  copyToClipboard
});

// Initialize global search handlers (window.blueprintStudio)
initGlobalSearchHandlers();

// Register file operations UI module callbacks
registerFileOperationsUICallbacks({
  resetModalToDefault,
  showToast,
  showModal,
  showConfirmDialog,
  createFile,
  createFolder,
  renameItem,
  copyItem,
  deleteItem
});

// Register git operations module callbacks
registerGitOperationsCallbacks({
  commitStagedFiles,
  checkGitStatusIfEnabled,
  setButtonLoading,
  gitStatus
});

// Register SFTP module callbacks
registerSftpCallbacks({
  fetchWithAuth,
  API_BASE,
  showToast,
  openTab: (tab) => {
    state.openTabs.push(tab);
    activateTab(tab);
    renderTabs();
  },
  saveSettings: saveSettingsImpl,
});

// Wire up SFTP panel static buttons
initSftpPanelButtons();

// Initial render of SFTP panel (visibility applied later after settings load)
renderSftpPanelImpl();

