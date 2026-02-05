/**
 * Tab and File Editing management for Blueprint Studio
 */
import { state, elements } from './state.js';
import { API_BASE, MAX_RECENT_FILES } from './constants.js';
import { fetchWithAuth } from './api.js';
import { showToast, showModal, hideGlobalLoading } from './ui.js';
import { isTextFile, getFileIcon, formatBytes } from './utils.js';

// We'll need these to be registered from main.js to avoid circular dependencies
let callbacks = {
    renderFileTree: null,
    updateToolbarState: null,
    updateStatusBar: null,
    updateBreadcrumb: null,
    createEditor: null,
    checkGitStatusIfEnabled: null
};

export function registerTabCallbacks(cb) {
    callbacks = { ...callbacks, ...cb };
}

export async function loadFile(path) {
    try {
      const data = await fetchWithAuth(
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}&_t=${Date.now()}`
      );
      return data;
    } catch (error) {
      showToast("Failed to load file: " + error.message, "error");
      throw error;
    }
}

export async function openFile(path, forceReload = false, noActivate = false) {
    if (!isTextFile(path)) {
      // ... binary handling ...
      return;
    }

    let tab = state.openTabs.find((t) => t.path === path);

    if (tab && forceReload) {
        if (state.activeTab === tab && state.editor) {
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
        } catch (e) { console.error(e); }
    } else if (!tab) {
      try {
        const data = await loadFile(path);
        tab = {
          path, content: data.content, originalContent: data.content,
          mtime: data.mtime, modified: false,
          history: null, cursor: null, scroll: null,
        };
        state.openTabs.push(tab);
        
        state.recentFiles = state.recentFiles.filter(p => p !== path);
        state.recentFiles.unshift(path);
        const limit = state.recentFilesLimit || MAX_RECENT_FILES;
        if (state.recentFiles.length > limit) state.recentFiles.pop();
      } catch (error) { return; }
    }

    if (noActivate) return tab;

    activateTab(tab, forceReload);
    renderTabs();
    if (callbacks.renderFileTree) callbacks.renderFileTree();
}

export function activateTab(tab, skipSave = false) {
    if (elements.welcomeScreen) elements.welcomeScreen.style.display = "none";

    if (!skipSave && state.activeTab && state.editor) {
      state.activeTab.content = state.editor.getValue();
      state.activeTab.history = state.editor.getHistory();
      state.activeTab.cursor = state.editor.getCursor();
      state.activeTab.scroll = state.editor.getScrollInfo();
    }

    state.activeTab = tab;

    if (!state.editor && callbacks.createEditor) {
      callbacks.createEditor();
    }

    if (state.editor) {
        // ... set mode, content, etc ...
        state.editor.setValue(tab.content);
        state.editor.refresh();
        state.editor.focus();
    }

    if (callbacks.updateToolbarState) callbacks.updateToolbarState();
    if (callbacks.updateStatusBar) callbacks.updateStatusBar();
    if (callbacks.updateBreadcrumb) callbacks.updateBreadcrumb(tab.path);

    state.currentFolderPath = tab.path.split("/").slice(0, -1).join("/");
}

export function renderTabs() {
    if (!elements.tabsContainer) return;
    elements.tabsContainer.innerHTML = "";

    state.openTabs.forEach((tab) => {
      const tabEl = document.createElement("div");
      tabEl.className = `tab ${state.activeTab === tab ? "active" : ""}`;
      // ... tab inner HTML ...
      elements.tabsContainer.appendChild(tabEl);
    });
}

export async function saveFile(path, content) {
    try {
      const response = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "write_file", path, content }),
      });
      
      if (response.success && response.mtime) {
          const tab = state.openTabs.find(t => t.path === path);
          if (tab) tab.mtime = response.mtime;
      }

      showToast(`Saved ${path.split("/").pop()}`, "success");
      if (callbacks.checkGitStatusIfEnabled) await callbacks.checkGitStatusIfEnabled();
      return true;
    } catch (error) {
      showToast("Failed to save: " + error.message, "error");
      return false;
    }
}
