/** TABS.JS | Purpose: * Handles tab bar rendering, tab navigation, and tab-related UI operations. */
import { state, elements } from './state.js';
import { getFileIcon, getEditorMode, isTextFile, enableLongPressContextMenu } from './utils.js';
import { eventBus } from './event-bus.js';
import { API_BASE, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, AUDIO_EXTENSIONS } from './constants.js';
import { fetchWithAuth } from './api.js';
import { 
    getPaneForTab, 
    updatePaneActiveState,
    enableSplitView,
    disableSplitView,
    updatePaneSizes,
    initSplitResize
} from './split-view.js';
import { cleanupMarkdownPreview } from './asset-preview.js';
import { 
    getTerminalContainer, 
    initTerminal, 
    fitTerminal,
    toggleTerminal as toggleTerminalImpl,
    setTerminalMode
} from './terminal.js';
import {
    createEditor,
    createSecondaryEditor,
    handleEditorChange,
    createLinter,
    detectIndentation
} from './editor.js';
import {
    applyEditorSettings,
    applyTheme,
    applyLayoutSettings,
    applyCustomSyntaxColors,
    resetModalToDefault
} from './ui.js';
import { applyMinimapState } from './minimap.js';
import {
    updateToolbarState
} from './toolbar.js';
import {
    updateStatusBar
} from './status-bar.js';
import {
    saveSettings as saveSettingsImpl
} from './settings.js';
import {
    isSftpPath as isSftpPathImpl,
    parseSftpPath as parseSftpPathImpl,
    openSftpFile as openSftpFileImpl
} from './sftp.js';

/**
 * Pause all playing <video> and <audio> elements in the asset preview containers.
 * Called when closing or switching away from a media tab.
 */
function stopActiveMedia() {
  const containers = [elements.assetPreview, document.getElementById('secondary-asset-preview')];
  for (const container of containers) {
    if (!container) continue;
    container.querySelectorAll('video, audio').forEach(el => {
      el.pause();
      el.removeAttribute('src');
      el.load(); // release media resources
    });
  }
}

/**
 * Renders the tab bar UI
 * Shows tabs separately for each pane when split view is enabled
 * Optimized with DocumentFragment for better performance
 */
export function renderTabs() {
  const primaryContainer = document.getElementById('primary-tabs-container');
  const secondaryContainer = document.getElementById('secondary-tabs-container');

  if (!primaryContainer) return;

  // Clear both containers
  primaryContainer.innerHTML = "";
  if (secondaryContainer) {
    secondaryContainer.innerHTML = "";
  }

  if (state.splitView && state.splitView.enabled) {
    // Split view mode - render tabs separately for each pane

    // Use DocumentFragment for batch DOM insertion (performance optimization)
    const primaryFragment = document.createDocumentFragment();
    const secondaryFragment = document.createDocumentFragment();

    // Render primary pane tabs
    state.splitView.primaryTabs.forEach((tabIndex) => {
      if (tabIndex >= 0 && tabIndex < state.openTabs.length) {
        const tab = state.openTabs[tabIndex];
        const isActive = tab === state.splitView.primaryActiveTab;
        const tabEl = createTabElement(tab, tabIndex, isActive, 'primary');
        primaryFragment.appendChild(tabEl);
      }
    });
    primaryContainer.appendChild(primaryFragment); // Single DOM operation

    // Render secondary pane tabs
    if (secondaryContainer) {
      state.splitView.secondaryTabs.forEach((tabIndex) => {
        if (tabIndex >= 0 && tabIndex < state.openTabs.length) {
          const tab = state.openTabs[tabIndex];
          const isActive = tab === state.splitView.secondaryActiveTab;
          const tabEl = createTabElement(tab, tabIndex, isActive, 'secondary');
          secondaryFragment.appendChild(tabEl);
        }
      });
      secondaryContainer.appendChild(secondaryFragment); // Single DOM operation
    }
  } else {
    // Normal single pane mode - render all tabs in primary container
    // Use DocumentFragment for batch DOM insertion (performance optimization)
    const fragment = document.createDocumentFragment();
    state.openTabs.forEach((tab, tabIndex) => {
      const isActive = tab === state.activeTab;
      const tabEl = createTabElement(tab, tabIndex, isActive, null);
      fragment.appendChild(tabEl);
    });
    primaryContainer.appendChild(fragment); // Single DOM operation instead of N operations
  }
}

/**
 * Creates a tab element
 */
function createTabElement(tab, tabIndex, isActive, pane) {
  const tabEl = document.createElement("div");
  tabEl.className = `tab ${isActive ? "active" : ""}`;
  tabEl.setAttribute('data-tab-index', tabIndex);
  tabEl.setAttribute('draggable', 'true');

  if (pane) {
    tabEl.setAttribute('data-pane', pane);
  }

  let icon;
  if (tab.isTerminal) {
    icon = { icon: "terminal", class: "default" };
  } else {
    icon = getFileIcon(tab.path);
  }
  
  const fileName = tab.path.split("/").pop();

  tabEl.innerHTML = `
    <span class="tab-icon material-icons" style="color: var(--icon-${icon.class})">${icon.icon}</span>
    <span class="tab-name">${fileName}</span>
    ${tab.modified ? '<div class="tab-modified"></div>' : ""}
    <div class="tab-close"><span class="material-icons">close</span></div>
  `;

  tabEl.addEventListener("click", (e) => {
    if (!e.target.closest(".tab-close")) {
      // Set active pane if split view is enabled
      if (state.splitView && state.splitView.enabled && pane) {
        eventBus.emit('ui:set-active-pane', { pane });
      }
      eventBus.emit('tab:activate', { tab });
      renderTabs();
      eventBus.emit('ui:refresh-tree');
    }
  });

  // Drag-drop handlers (wrapped to pass the original event)
  tabEl.addEventListener('dragstart', (e) => eventBus.emit('tab:drag-start', e));
  tabEl.addEventListener('dragover', (e) => eventBus.emit('tab:drag-over', e));
  tabEl.addEventListener('drop', (e) => eventBus.emit('tab:drop', e));
  tabEl.addEventListener('dragend', (e) => eventBus.emit('tab:drag-end', e));

  tabEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    eventBus.emit('tab:context-menu', { x: e.clientX, y: e.clientY, tab, tabIndex });
  });

  enableLongPressContextMenu(tabEl);

  const closeBtn = tabEl.querySelector(".tab-close");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    eventBus.emit('tab:close', { tab, pane });
  });

  return tabEl;
}

/**
 * Finds a tab by path
 */
export function findTabByPath(path) {
  return state.openTabs.find((t) => t.path === path);
}

/**
 * Gets the index of a tab
 */
export function getTabIndex(tab) {
  return state.openTabs.indexOf(tab);
}

/**
 * Gets the next tab after closing current one
 */
export function getNextTab(closingTab) {
  const index = getTabIndex(closingTab);
  if (state.openTabs.length > 1) {
    const newIndex = Math.min(index, state.openTabs.length - 2); // -2 because we're about to remove one
    return state.openTabs[newIndex === index ? newIndex + 1 : newIndex];
  }
  return null;
}

/**
 * Checks if any tabs have unsaved changes
 */
export function hasUnsavedTabs() {
  return state.openTabs.some(tab => tab.modified);
}

/**
 * Gets all modified tabs
 */
export function getModifiedTabs() {
  return state.openTabs.filter(tab => tab.modified);
}

/**
 * Closes all tabs
 */
export async function closeAllTabs(force = false) {
  if (!force && hasUnsavedTabs()) {
    const modifiedCount = getModifiedTabs().length;
    if (!confirm(`${modifiedCount} tab(s) have unsaved changes. Close all anyway?`)) {
      return false;
    }
  }

  // Revoke all blob URLs
  state.openTabs.forEach(tab => {
    if (tab._blobUrl) {
      URL.revokeObjectURL(tab._blobUrl);
    }
  });

  state.openTabs = [];
  state.activeTab = null;

  if (state.splitView && state.splitView.enabled) {
    disableSplitView();
  }

  // Clear editor and show welcome screen
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
  if (elements.breadcrumb) {
    elements.breadcrumb.innerHTML = "";
  }

  renderTabs();
  eventBus.emit('ui:refresh-tree');

  return true;
}

/**
 * Closes tabs other than the specified tab
 */
export async function closeOtherTabs(keepTab, force = false) {
  const otherTabs = state.openTabs.filter(t => t !== keepTab);
  const modifiedOthers = otherTabs.filter(t => t.modified);

  if (!force && modifiedOthers.length > 0) {
    if (!confirm(`${modifiedOthers.length} other tab(s) have unsaved changes. Close them anyway?`)) {
      return false;
    }
  }

  // Revoke blob URLs for tabs being closed
  otherTabs.forEach(tab => {
    if (tab._blobUrl) {
      URL.revokeObjectURL(tab._blobUrl);
    }
  });

  state.openTabs = [keepTab];

  if (state.splitView && state.splitView.enabled) {
    disableSplitView();
  }

  if (state.activeTab !== keepTab) {
    eventBus.emit('tab:activate', { tab: keepTab });
  }

  renderTabs();
  eventBus.emit('ui:refresh-tree');

  return true;
}

/**
 * Closes tabs to the right of the specified tab
 */
export async function closeTabsToRight(tab, force = false) {
  const index = getTabIndex(tab);
  if (index === -1 || index === state.openTabs.length - 1) return true;

  const tabsToClose = state.openTabs.slice(index + 1);
  const modifiedTabs = tabsToClose.filter(t => t.modified);

  if (!force && modifiedTabs.length > 0) {
    if (!confirm(`${modifiedTabs.length} tab(s) to the right have unsaved changes. Close them anyway?`)) {
      return false;
    }
  }

  // Revoke blob URLs
  tabsToClose.forEach(t => {
    if (t._blobUrl) {
      URL.revokeObjectURL(t._blobUrl);
    }
  });

  state.openTabs = state.openTabs.slice(0, index + 1);

  if (state.splitView && state.splitView.enabled && state.openTabs.length <= 1) {
    disableSplitView();
  }

  // If active tab was closed, activate the last remaining tab
  if (!state.openTabs.includes(state.activeTab)) {
    eventBus.emit('tab:activate', { tab: state.openTabs[state.openTabs.length - 1] });
  }

  renderTabs();
  eventBus.emit('ui:refresh-tree');

  return true;
}

/**
 * Moves to next tab (with split view support)
 */
export function nextTab() {
  if (state.openTabs.length === 0) return;

  // Get available tabs based on split view state
  let availableTabs;
  if (state.splitView && state.splitView.enabled) {
    const activePane = state.splitView.activePane;
    const tabIndices = activePane === 'primary'
      ? state.splitView.primaryTabs
      : state.splitView.secondaryTabs;
    availableTabs = tabIndices.map(idx => state.openTabs[idx]).filter(t => t);
  } else {
    availableTabs = state.openTabs;
  }

  if (availableTabs.length <= 1) return; // No other tab to switch to

  const currentIndex = availableTabs.indexOf(state.activeTab);
  if (currentIndex === -1) {
    // Active tab not in available tabs, activate first available
    eventBus.emit('tab:activate', { tab: availableTabs[0] });
  } else {
    // Move to next tab (wrap around)
    const nextIndex = (currentIndex + 1) % availableTabs.length;
    eventBus.emit('tab:activate', { tab: availableTabs[nextIndex] });
  }

  renderTabs();
  eventBus.emit('ui:refresh-tree');
}

/**
 * Moves to previous tab (with split view support)
 */
export function previousTab() {
  if (state.openTabs.length === 0) return;

  // Get available tabs based on split view state
  let availableTabs;
  if (state.splitView && state.splitView.enabled) {
    const activePane = state.splitView.activePane;
    const tabIndices = activePane === 'primary'
      ? state.splitView.primaryTabs
      : state.splitView.secondaryTabs;
    availableTabs = tabIndices.map(idx => state.openTabs[idx]).filter(t => t);
  } else {
    availableTabs = state.openTabs;
  }

  if (availableTabs.length <= 1) return; // No other tab to switch to

  const currentIndex = availableTabs.indexOf(state.activeTab);
  if (currentIndex === -1) {
    // Active tab not in available tabs, activate last available
    eventBus.emit('tab:activate', { tab: availableTabs[availableTabs.length - 1] });
  } else {
    // Move to previous tab (wrap around)
    const prevIndex = (currentIndex - 1 + availableTabs.length) % availableTabs.length;
    eventBus.emit('tab:activate', { tab: availableTabs[prevIndex] });
  }

  renderTabs();
  eventBus.emit('ui:refresh-tree');
}

// Event Listeners
eventBus.on("ui:refresh-tabs", () => {
  renderTabs();
});

/**
 * Activates a tab, restoring its state into the editor
 */
export function activateTab(tab, skipSave = false) {
    // Hide welcome screen
    if (elements.welcomeScreen) {
      elements.welcomeScreen.style.display = "none";
    }

    // Detach terminal if leaving terminal tab
    if (state.activeTab && state.activeTab.isTerminal && tab !== state.activeTab) {
        setTerminalMode('panel');
        toggleTerminalImpl(false);
    }

    // Stop media playback when switching away from video/audio tab
    if (state.activeTab && (state.activeTab.isVideo || state.activeTab.isAudio) && tab !== state.activeTab) {
        stopActiveMedia();
    }

    // Determine which pane this tab should be in
    const tabIndex = state.openTabs.indexOf(tab);
    let pane = null;
    
    let currentEditor = state.editor; 
    if (state.splitView && state.splitView.enabled && state.activeTab) {
        const activeIdx = state.openTabs.indexOf(state.activeTab);
        if (activeIdx !== -1) {
            const activePane = getPaneForTab(activeIdx);
            if (activePane === 'primary') currentEditor = state.primaryEditor;
            else if (activePane === 'secondary') currentEditor = state.secondaryEditor;
        }
    }

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

    // Save current tab state before switching
    if (!skipSave && state.activeTab && currentEditor && !state.activeTab.isBinary && !state.activeTab.isTerminal) {
      state.activeTab.content = currentEditor.getValue();
      state.activeTab.history = currentEditor.getHistory();
      state.activeTab.cursor = currentEditor.getCursor();
      state.activeTab.scroll = currentEditor.getScrollInfo();
    }

    state.activeTab = tab;

    // Update minimap visibility for the newly active tab
    applyMinimapState(state.primaryEditor, state.secondaryEditor, state.showMinimap, tab);

    // Handle Binary Preview
    if (tab.isBinary) {
        if (targetEditor) {
            targetEditor.getWrapperElement().style.display = "none";
        }
        const previewContainer = (pane === 'secondary') ?
          document.getElementById('secondary-asset-preview') :
          elements.assetPreview;
        if (previewContainer) {
            previewContainer.classList.add("visible");
        }
    } else if (tab.isTerminal) {
        // Handle Terminal Tab
        if (targetEditor) {
            targetEditor.getWrapperElement().style.display = "none";
        }
        const previewContainer = (pane === 'secondary') ?
          document.getElementById('secondary-asset-preview') :
          elements.assetPreview;
          
        if (previewContainer) {
            if (!getTerminalContainer()) {
                previewContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-secondary)"><span class="material-icons loading-spinner" style="font-size:24px;margin-right:8px">sync</span> Loading Terminal...</div>';
                previewContainer.classList.add("visible");
                
                initTerminal().then(() => {
                    if (state.activeTab === tab) {
                        previewContainer.innerHTML = '';
                        previewContainer.appendChild(getTerminalContainer());
                        setTerminalMode('tab');
                        fitTerminal();
                    }
                });
            } else {
                previewContainer.innerHTML = ''; 
                previewContainer.classList.add("visible");
                const terminal = getTerminalContainer();
                if (terminal) {
                    previewContainer.appendChild(terminal);
                }
                setTerminalMode('tab');
                fitTerminal();
            }
        }
    } else {
        // Handle Text Editor
        const previewContainer = (pane === 'secondary') ?
          document.getElementById('secondary-asset-preview') :
          elements.assetPreview;
        if (previewContainer) {
            previewContainer.classList.remove("visible");
            if (!previewContainer.contains(getTerminalContainer())) {
                 previewContainer.innerHTML = "";
            }
        }

        if (!targetEditor) {
          if (pane === 'secondary') {
            createSecondaryEditor();
            targetEditor = state.secondaryEditor;
          } else {
            createEditor();
            targetEditor = state.primaryEditor;
          }
          state.editor = targetEditor;
          applyEditorSettings(); 
          updateToolbarState();
        }

        if (targetEditor) {
          if (pane === 'primary' || !pane) {
            const wrapperDiv = document.getElementById('codemirror-wrapper');
            if (wrapperDiv) wrapperDiv.style.display = "block";
          } else if (pane === 'secondary') {
            const wrapperDiv = document.getElementById('codemirror-wrapper-secondary');
            if (wrapperDiv) wrapperDiv.style.display = "block";
          }

          targetEditor.getWrapperElement().style.display = "block";

          const mode = getEditorMode(tab.path);
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

          const fileName = tab.path;
          const fileExt = fileName.match(/\.(\w+)$/i)?.[1]?.toLowerCase();
          const lintableTypes = ['yaml', 'yml', 'json', 'py', 'js'];

          if (lintableTypes.includes(fileExt)) {
            targetEditor.setOption("lint", { getAnnotations: createLinter(fileName), async: true });
          } else {
            targetEditor.setOption("lint", false);
          }

          const hasIndentedContent = tab.content && tab.content.split('\n').length > 2 && /^\s+/m.test(tab.content);
          const indent = hasIndentedContent
            ? detectIndentation(tab.content)
            : { tabs: state.indentWithTabs || false, size: state.tabSize || 2 };

          targetEditor.setOption("indentWithTabs", indent.tabs);
          targetEditor.setOption("indentUnit", indent.size);
          targetEditor.setOption("tabSize", indent.size);
          // Keep state in sync so settings panel and status bar agree
          state.tabSize = indent.size;
          state.indentWithTabs = indent.tabs;

          targetEditor.off("change", handleEditorChange);
          targetEditor.setValue(tab.content);
          targetEditor.on("change", () => handleEditorChange(targetEditor));

          if (tab.history) targetEditor.setHistory(tab.history);
          else targetEditor.clearHistory();

          if (tab.cursor) targetEditor.setCursor(tab.cursor);
          if (tab.scroll) targetEditor.scrollTo(tab.scroll.left, tab.scroll.top);

          targetEditor.refresh();
          targetEditor.focus();
        }
    }

    eventBus.emit('ui:refresh-tree');
    updateToolbarState();
    updateStatusBar();

    if (elements.groupMarkdown) {
        elements.groupMarkdown.style.display = tab.path.endsWith(".md") ? "flex" : "none";
        
        if (tab.path.endsWith(".md")) {
            // Restore button state from persisted state
            elements.btnMarkdownPreview?.classList.toggle("active", state.markdownPreviewActive);
        } else {
            // Only clean up UI (listeners/containers) when switching away from markdown
            // We don't reset the global 'markdownPreviewActive' state here so it 
            // persists when switching back to another markdown file.
            cleanupMarkdownPreview(false);
        }
    }

    eventBus.emit('tab:activated', { tab });
    const folderOfTab = tab.path.split("/").slice(0, -1).join("/");
    if (state.treeCollapsableMode) {
        state.currentFolderPath = folderOfTab;
    } else {
        state.currentNavigationPath = folderOfTab;
    }
    saveSettingsImpl();
}

/**
 * Closes a tab, managing state and ensuring at least one tab stays active if possible
 */
export async function closeTab(data, force = false) {
    const tab = (data && data.tab) ? data.tab : data;
    const pane = (data && data.pane) ? data.pane : null;

    // Handle closing the Markdown Live Preview tab specifically
    if (state.markdownPreviewActive && pane === 'secondary' && tab === state.activeTab) {
        eventBus.emit('ui:toggle-markdown-preview', false);
        return;
    }

    // Handle closing the Blueprint Form tab — close the form, keep the file open
    if (state.blueprintFormActive && pane === 'secondary') {
        const { closeBlueprintForm } = await import('./blueprint-form.js?v=' + (window.__BS_VERSION__ || '0'));
        closeBlueprintForm();
        return;
    }

    if (!force && tab.modified) {
      if (!confirm(`File ${tab.path.split("/").pop()} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    // Stop media playback before removing the tab
    if (tab.isVideo || tab.isAudio) {
      stopActiveMedia();
    }

    if (tab._blobUrl) {
      URL.revokeObjectURL(tab._blobUrl);
    }

    // Revoke streaming blob URL (SFTP media)
    if (tab.blobUrl) {
      URL.revokeObjectURL(tab.blobUrl);
    }

    const index = state.openTabs.indexOf(tab);
    if (index === -1) return;

    // Handle Split View state cleanup
    if (state.splitView && state.splitView.enabled) {
      state.splitView.primaryTabs = state.splitView.primaryTabs.filter(i => i !== index).map(i => i > index ? i - 1 : i);
      state.splitView.secondaryTabs = state.splitView.secondaryTabs.filter(i => i !== index).map(i => i > index ? i - 1 : i);
      
      if (state.splitView.primaryActiveTab === tab) state.splitView.primaryActiveTab = null;
      if (state.splitView.secondaryActiveTab === tab) state.splitView.secondaryActiveTab = null;
    }

    state.openTabs.splice(index, 1);

    // Auto-close split view if only 1 tab remains
    if (state.splitView && state.splitView.enabled && state.openTabs.length <= 1) {
      disableSplitView();
    }

    if (state.activeTab === tab) {
      // If closing a markdown file, we should reset the preview state entirely
      cleanupMarkdownPreview(tab.path.endsWith(".md"));
      
      if (state.openTabs.length > 0) {
        const nextIndex = Math.min(index, state.openTabs.length - 1);
        activateTab(state.openTabs[nextIndex]);
      } else {
        state.activeTab = null;
        applyMinimapState(state.primaryEditor, state.secondaryEditor, state.showMinimap, null);
        if (state.editor) state.editor.getWrapperElement().style.display = "none";
        if (state.secondaryEditor) state.secondaryEditor.getWrapperElement().style.display = "none";
        if (elements.welcomeScreen) elements.welcomeScreen.style.display = "flex";
        if (elements.assetPreview) elements.assetPreview.classList.remove("visible");
        if (elements.breadcrumb) elements.breadcrumb.innerHTML = "";
        if (elements.groupMarkdown) elements.groupMarkdown.style.display = "none";
      }
    }

    renderTabs();
    eventBus.emit('ui:refresh-tree');
    updateToolbarState();
    eventBus.emit('ui:update-split-buttons');
    saveSettingsImpl();
}

/**
 * Restores tabs from saved workspace state
 */
export async function restoreOpenTabs() {
    if (!state.rememberWorkspace) {
      if (elements.welcomeScreen) elements.welcomeScreen.style.display = "flex";
      return;
    }

    // CRITICAL: Ensure primary editor exists BEFORE restoring any tabs
    if (!state.primaryEditor) {
      createEditor();
    }

    if (!state._savedOpenTabs || state._savedOpenTabs.length === 0) {
      // No tabs to restore - show welcome screen
      if (state.primaryEditor) {
        state.primaryEditor.setValue("");
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
      if (isSftpPathImpl(tabState.path)) {
        const { connId, remotePath } = parseSftpPathImpl(tabState.path);
        const connExists = state.sftpConnections.some(c => c.id === connId);
        if (connExists) {
          try {
            await openSftpFileImpl(connId, remotePath, true);
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
      } else if (tabState.path.startsWith("terminal://")) {
        const tab = {
          path: tabState.path,
          name: "Terminal",
          isTerminal: true,
          modified: false,
          isBinary: false
        };
        state.openTabs.push(tab);
        toggleTerminalImpl(false);
      } else {
        const fileExists = state.files.some(f => f.path === tabState.path);
        if (fileExists) {
          const tabResults = await Promise.all(eventBus.emit('file:open', { path: tabState.path, forceReload: false, noActivate: true }));
          // Note: eventBus.emit returns array of results
          const tabObj = Array.isArray(tabResults) ? tabResults[0] : tabResults;
          
          if (tabObj) {
            tabObj.cursor = tabState.cursor || null;
            tabObj.scroll = tabState.scroll || null;

            if (tabState.modified && tabState.content) {
              tabObj.modified = true;
              tabObj.content = tabState.content;
              if (tabState.originalContent) {
                tabObj.originalContent = tabState.originalContent;
              }

              if (state.editor && state.activeTab === tabObj) {
                state.editor.setValue(tabObj.content);
              }
            }
          }
        } else {
          try {
            const dataResults = await Promise.all(eventBus.emit('file:load', { path: tabState.path }));
            const dataObj = Array.isArray(dataResults) ? dataResults[0] : dataResults;
            
            if (dataObj && (dataObj.content !== undefined || dataObj.is_binary)) {
              console.log("   ✅ Loaded from server directly:", tabState.path);
              const ext = tabState.path.split(".").pop().toLowerCase();
              const isImage = IMAGE_EXTENSIONS.has(ext);
              const isPdf = ext === "pdf";
              const isVideo = VIDEO_EXTENSIONS.has(ext);
              const isAudio = AUDIO_EXTENSIONS.has(ext);
              const isBinary = dataObj.is_binary || !isTextFile(tabState.path);

              const tab = {
                path: tabState.path,
                content: dataObj.content,
                originalContent: dataObj.content,
                mtime: dataObj.mtime,
                modified: false,
                history: null,
                cursor: tabState.cursor || null,
                scroll: tabState.scroll || null,
                isBinary: isBinary,
                isImage: isImage,
                isPdf: isPdf,
                isVideo: isVideo,
                isAudio: isAudio,
                mimeType: dataObj.mime_type
              };

              state.openTabs.push(tab);

              if (tabState.modified && tabState.content) {
                tab.modified = true;
                tab.content = tabState.content;
                if (tabState.originalContent) {
                  tab.originalContent = tabState.originalContent;
                }
              }
            } else {
              console.warn("[Tabs] file:load returned invalid data for", tabState.path, dataObj);
            }
          } catch (err) {
            console.error("[Tabs] Failed to load from server:", tabState.path, err);
          }
        }
      }
    }

    if (state._savedActiveTabPath) {
      const activeTab = state.openTabs.find(t => t.path === state._savedActiveTabPath);
      if (activeTab) {
        activateTab(activeTab);
        renderTabs();
      } else {
        if (state.openTabs.length > 0) {
          activateTab(state.openTabs[0]);
          renderTabs();
        }
      }
    } else if (state.openTabs.length > 0) {
      activateTab(state.openTabs[0]);
      renderTabs();
    }

    if (state.openTabs.length === 0) {
      if (state.primaryEditor) {
        state.primaryEditor.setValue("");
        const wrapperDiv = document.getElementById('codemirror-wrapper');
        if (wrapperDiv) wrapperDiv.style.display = "none";
      }
      if (elements.welcomeScreen) elements.welcomeScreen.style.display = "flex";
      return;
    }

    if (state.splitView && state.splitView.enabled) {
      if (!state.secondaryEditor) {
        createSecondaryEditor();
      }

      const splitContainer = document.getElementById('split-container');
      const primaryPane = document.getElementById('primary-pane');
      const secondaryPane = document.getElementById('secondary-pane');
      const resizeHandle = document.getElementById('split-resize-handle');
      if (splitContainer) splitContainer.className = `split-container ${state.splitView.orientation}`;
      if (primaryPane) {
        primaryPane.style.display = 'flex';
        primaryPane.style.flex = `0 0 ${state.splitView.primaryPaneSize}%`;
      }
      if (secondaryPane) {
        secondaryPane.style.display = 'flex';
        secondaryPane.style.flex = `0 0 ${100 - state.splitView.primaryPaneSize}%`;
      }
      if (resizeHandle) resizeHandle.style.display = 'block';

      enableSplitView(state.splitView.orientation, true);

      if (state._savedPrimaryActiveTabPath) {
        const primaryTab = state.openTabs.find(t => t.path === state._savedPrimaryActiveTabPath);
        if (primaryTab) {
          state.splitView.primaryActiveTab = primaryTab;
          if (state.primaryEditor) {
            state.primaryEditor.setValue(primaryTab.content || primaryTab.originalContent || "");
            const mode = getEditorMode(primaryTab.path);
            if (mode) state.primaryEditor.setOption('mode', mode);
            if (primaryTab.cursor) state.primaryEditor.setCursor(primaryTab.cursor);
            if (primaryTab.scroll) state.primaryEditor.scrollTo(primaryTab.scroll.left, primaryTab.scroll.top);
            state.primaryEditor.refresh();
          }
        }
      }

      if (state._savedSecondaryActiveTabPath) {
        const secondaryTab = state.openTabs.find(t => t.path === state._savedSecondaryActiveTabPath);
        if (secondaryTab) {
          state.splitView.secondaryActiveTab = secondaryTab;
          if (state.secondaryEditor) {
            state.secondaryEditor.setValue(secondaryTab.content || secondaryTab.originalContent || "");
            const mode = getEditorMode(secondaryTab.path);
            if (mode) state.secondaryEditor.setOption('mode', mode);
            if (secondaryTab.cursor) state.secondaryEditor.setCursor(secondaryTab.cursor);
            if (secondaryTab.scroll) state.secondaryEditor.scrollTo(secondaryTab.scroll.left, secondaryTab.scroll.top);
            state.secondaryEditor.refresh();
          }
        }
      }

      if (state.splitView.primaryPaneSize) {
        updatePaneSizes(state.splitView.primaryPaneSize);
      }

      // Re-initialize handle if needed (can be handled by split-view.js initSplitResize)
      initSplitResize();

      renderTabs();
      updatePaneActiveState();

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

      if (state.primaryEditor) {
        const primaryWrapper = state.primaryEditor.getWrapperElement();
        if (primaryWrapper) primaryWrapper.style.display = 'block';
      }
      if (state.secondaryEditor) {
        const secondaryWrapper = state.secondaryEditor.getWrapperElement();
        if (secondaryWrapper) secondaryWrapper.style.display = 'block';
      }
    }

    delete state._savedOpenTabs;
    delete state._savedActiveTabPath;
    delete state._savedPrimaryActiveTabPath;
    delete state._savedSecondaryActiveTabPath;
}
