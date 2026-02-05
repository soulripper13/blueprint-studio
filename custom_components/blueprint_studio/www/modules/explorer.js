/**
 * File Explorer module for Blueprint Studio
 */
import { state, elements } from './state.js';
import { API_BASE } from './constants.js';
import { fetchWithAuth } from './api.js';
import { showToast, showGlobalLoading, hideGlobalLoading } from './ui.js';
import { getFileIcon, formatBytes } from './utils.js';

export async function loadFiles(force = false) {
    try {
      if (elements.btnRefresh) {
          elements.btnRefresh.classList.add("loading");
          elements.btnRefresh.disabled = true;
      }

      const items = await fetchWithAuth(`${API_BASE}?action=list_all&show_hidden=${state.showHidden}&force=${force}`);
      state.files = items.filter(item => item.type === "file");
      state.folders = items.filter(item => item.type === "folder");
      state.allItems = items;
      state.fileTree = buildFileTree(items);
      renderFileTree();

      if (elements.btnRefresh) {
          elements.btnRefresh.classList.remove("loading");
          elements.btnRefresh.disabled = false;
      }
    } catch (error) {
      if (elements.btnRefresh) {
          elements.btnRefresh.classList.remove("loading");
          elements.btnRefresh.disabled = false;
      }
      showToast("Failed to load files: " + error.message, "error");
    }
}

export function buildFileTree(items) {
    const tree = { _files: [] };
    items.forEach((item) => {
      const parts = item.path.split("/");
      let current = tree;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { _files: [], _path: parts.slice(0, i + 1).join("/") };
        }
        current = current[part];
      }
      const name = parts[parts.length - 1];
      if (item.type === "folder") {
        if (!current[name]) {
          current[name] = { _files: [], _path: item.path };
        }
      } else {
        current._files.push({ ...item, name });
      }
    });
    return tree;
}

export function renderFileTree() {
    if (!elements.fileTree) return;
    // ... logic for rendering ...
}

function renderTreeLevel(tree, container, depth) {
    // ... recursion ...
}

export function toggleFolder(path) {
    if (state.expandedFolders.has(path)) {
      state.expandedFolders.delete(path);
    } else {
      state.expandedFolders.add(path);
    }
    renderFileTree();
}
