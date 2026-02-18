/**
 * ============================================================================
 * FILE EXPLORER MODULE
 * ============================================================================
 *
 * PURPOSE: File system loading and hierarchical tree building. Loads all
 * files/folders from the server and constructs the nested file tree structure
 * for rendering in the sidebar.
 *
 * EXPORTED FUNCTIONS:
 * - loadFiles(force) - Load all files/folders from server
 * - buildFileTree(items) - Build hierarchical tree from flat list
 * - renderFileTree() - Render tree to DOM
 * - toggleFolder(path) - Expand/collapse folder
 *
 * HOW TO ADD FEATURES:
 * 1. Add virtual folders: Group files by type (scripts, automations, etc.)
 * 2. Add file sorting: Sort by name, date, size, type
 * 3. Add folder pinning: Pin important folders to top
 * 4. Add lazy loading: Only load visible folders
 * 5. Add tree search/filter: Filter visible items in tree
 *
 * INTEGRATION POINTS:
 * - state.js: Uses files, folders, fileTree, expandedFolders, showHidden
 * - api.js: fetchWithAuth for loading items
 * - file-tree.js: Calls renderFileTree after loading
 * - ui.js: showToast, showGlobalLoading
 * - utils.js: getFileIcon, formatBytes
 *
 * COMMON PATTERNS:
 * ```javascript
 * // Load files from server
 * await loadFiles(force = true); // Force refresh
 *
 * // Build tree structure
 * const tree = buildFileTree(flatItems);
 * // Result: { folder1: { _files: [...], subfolder: {...} }, _files: [...] }
 *
 * // Toggle folder
 * toggleFolder('automations'); // Expands/collapses automations folder
 * ```
 *
 * ARCHITECTURE NOTES:
 * - Tree structure: Nested objects with special _files and _path properties
 * - Flat to tree conversion: Splits paths and builds nested structure
 * - Rendering: Recursive function renderTreeLevel() for nested display
 * - State: expandedFolders Set tracks which folders are open
 * ============================================================================
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
