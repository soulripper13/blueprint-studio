/**
 * ============================================================================
 * FILE TREE MODULE
 * ============================================================================
 *
 * PURPOSE:
 * Handles file tree rendering, folder expansion/collapse, drag & drop,
 * content search filtering, and all file tree UI interactions. This is the
 * main navigation component for browsing files and folders.
 *
 * EXPORTED FUNCTIONS:
 * Tree Rendering:
 * - renderFileTree() - Render the entire file tree
 * - debouncedRenderFileTree() - Debounced tree rendering (50ms)
 * - buildFileTree(items) - Build tree structure from flat file list
 * - renderTreeLevel(tree, container, depth) - Recursively render tree levels
 *
 * Content Search:
 * - debouncedContentSearch() - Debounced content search (500ms)
 * - performContentSearch() - Search file contents and filter tree
 *
 * File Operations:
 * - createTreeItem(item, depth) - Create file/folder tree item element
 * - toggleFolder(path) - Expand/collapse folder
 * - updateToggleAllButton() - Update expand/collapse all button
 * - folderMatchesSearch(folder) - Check if folder contains search matches
 *
 * Drag & Drop:
 * - setupFileDrop() - Initialize file drop zone
 * - handleFileDrop(e) - Handle file drop event
 * - handleDragStart(e) - Handle drag start
 * - handleDragOver(e) - Handle drag over
 * - handleDragLeave(e) - Handle drag leave
 * - handleDrop(e) - Handle drop
 *
 * REQUIRED CALLBACKS (from app.js):
 * - toggleFavorite: Toggle file favorite status
 * - renderRecentFilesPanel: Render recent files
 * - renderFavoritesPanel: Render favorites
 * - handleSelectionChange: Handle file selection change
 * - showContextMenu: Show context menu
 * - openFile: Open file
 * - hideSidebar: Hide sidebar
 * - showDiffModal: Show diff modal
 * - loadFiles: Reload file list
 * - checkGitStatusIfEnabled: Refresh git status
 * - toggleSelectionMode: Toggle selection mode
 * - processUploads: Process file uploads
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding new file tree item decorations:
 *    - Modify createTreeItem() function
 *    - Add icon, badge, or indicator based on file properties
 *    - Examples: git status icon, modified badge, read-only lock
 *    - Update CSS for new decoration styles
 *
 * 2. Adding custom file grouping/sorting:
 *    - Modify buildFileTree() to change grouping logic
 *    - Or modify renderTreeLevel() to change sort order
 *    - Current: folders first, then files, alphabetical
 *
 * 3. Adding file tree filters:
 *    - Add filter function similar to folderMatchesSearch()
 *    - Call in renderTreeLevel() to skip filtered items
 *    - Examples: show only modified files, hide .hidden files
 *
 * 4. Adding drag & drop functionality:
 *    - Modify handleDrop() to support new drop types
 *    - Add data to handleDragStart() for new drag sources
 *    - Update drop zones in handleDragOver()
 *
 * 5. Enhancing content search:
 *    - Modify performContentSearch() API call
 *    - Add options: case_sensitive, use_regex, file_types
 *    - Update UI to show search options
 *    - Add search highlighting in results
 *
 * INTEGRATION POINTS:
 * - state.js: state.files, state.folders, state.expandedFolders, state.contentSearchResults
 * - elements: elements.fileTree, elements.fileSearch
 * - api.js: fetchWithAuth for content search
 * - favorites.js: Recent files and favorites panels
 * - context-menu.js: Right-click menu
 * - app.js: File operations and navigation
 *
 * STATE MANAGEMENT:
 * - state.files: Flat array of all files
 * - state.folders: Flat array of all folders
 * - state.fileTree: Nested tree structure (built by buildFileTree)
 * - state.expandedFolders: Set of expanded folder paths
 * - state.contentSearchResults: Set of file paths matching search
 * - state.searchQuery: Current search query
 *
 * ARCHITECTURE NOTES:
 * - Tree is built from flat file list (O(n) construction)
 * - Rendering is recursive with depth tracking
 * - Search results filter the tree (hide non-matching files)
 * - Folders auto-expand when containing search matches
 * - Drag & drop supports file reordering and uploads
 * - Debounced rendering prevents excessive DOM updates
 *
 * COMMON PATTERNS:
 * - Build tree: state.fileTree = buildFileTree([...state.folders, ...state.files])
 * - Render tree: renderFileTree() → calls renderTreeLevel() recursively
 * - Toggle folder: state.expandedFolders.add/delete(path); renderFileTree()
 * - Content search: Set state.contentSearchResults → renderFileTree()
 * - Check search match: state.contentSearchResults?.has(file.path)
 *
 * CONTENT SEARCH:
 * - Searches file contents (not just names)
 * - Debounced 500ms to avoid excessive API calls
 * - Filters tree to show only matching files
 * - Auto-expands folders containing matches
 * - Shows loading state during search
 * - Clears results when search box is empty
 *
 * DRAG & DROP:
 * - Drop files from OS to upload
 * - Drag tree items to reorder (future feature)
 * - Visual feedback during drag operations
 * - Drop zones highlight on drag over
 *
 * ============================================================================
 */
import { state, elements, gitState } from './state.js';
import { fetchWithAuth } from './api.js';
import { API_BASE } from './constants.js';
import {
  showToast,
  showGlobalLoading,
  hideGlobalLoading,
  showConfirmDialog
} from './ui.js';
import { getFileIcon, formatBytes, isMobile } from './utils.js';

// Timer for debounced rendering
export let fileTreeRenderTimer = null;

// Timer for debounced content search
export let contentSearchTimer = null;

/**
 * Cancel any pending debounced search
 */
export function cancelPendingSearch() {
  if (contentSearchTimer) {
    clearTimeout(contentSearchTimer);
    contentSearchTimer = null;
  }
}

// Callbacks for cross-module functions
let callbacks = {
  toggleFavorite: null,
  renderRecentFilesPanel: null,
  renderFavoritesPanel: null,
  handleSelectionChange: null,
  showContextMenu: null,
  openFile: null,
  hideSidebar: null,
  showDiffModal: null,
  loadFiles: null,
  checkGitStatusIfEnabled: null,
  toggleSelectionMode: null,
  processUploads: null
};

export function registerFileTreeCallbacks(cb) {
  callbacks = { ...callbacks, ...cb };
}

/**
 * Debounced file tree rendering
 */
export function debouncedRenderFileTree() {
  if (fileTreeRenderTimer) clearTimeout(fileTreeRenderTimer);
  fileTreeRenderTimer = setTimeout(() => {
    renderFileTree();
  }, 50);
}

/**
 * Debounced content search in file tree
 */
export function debouncedContentSearch() {
  if (contentSearchTimer) clearTimeout(contentSearchTimer);

  // Show loading state
  if (elements.fileSearch) {
    elements.fileSearch.style.opacity = "0.7";
  }

  contentSearchTimer = setTimeout(() => {
    performContentSearch();
  }, 500); // 500ms debounce
}

/**
 * Debounced filename search in file tree
 */
export function debouncedFilenameSearch() {
  if (contentSearchTimer) clearTimeout(contentSearchTimer);

  // Show loading state
  if (elements.fileSearch) {
    elements.fileSearch.style.opacity = "0.7";
  }

  contentSearchTimer = setTimeout(() => {
    performFilenameSearch();
  }, 300); // 300ms debounce (faster for filename search)
}

/**
 * Perform content search across all files
 */
export async function performContentSearch() {
  const query = state.searchQuery.trim();

  if (!query) {
    state.contentSearchResults = null;
    if (elements.fileSearch) elements.fileSearch.style.opacity = "1";
    renderFileTree();
    return;
  }

  try {
    const results = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "global_search",
        query: query,
        case_sensitive: false,
        use_regex: false
      }),
    });

    // If query changed while fetching (e.g. user cleared the box), discard results
    if (state.searchQuery.trim() !== query) return;

    if (results && Array.isArray(results)) {
      state.contentSearchResults = new Set(results.map(r => r.path));
    } else {
      state.contentSearchResults = new Set();
    }
  } catch (e) {
    console.error("Content search failed", e);
    state.contentSearchResults = new Set();
  } finally {
    if (elements.fileSearch) elements.fileSearch.style.opacity = "1";
    // Only render if query still matches (user hasn't cleared)
    if (state.searchQuery.trim() === query) {
      renderFileTree();
    }
  }
}

/**
 * Perform filename search across all files (lazy loading mode)
 */
export async function performFilenameSearch() {
  const query = state.searchQuery.trim().toLowerCase();

  if (!query) {
    state.contentSearchResults = null;
    if (elements.fileSearch) elements.fileSearch.style.opacity = "1";
    renderFileTree();
    return;
  }

  try {
    // Load all files from backend
    const allFiles = await fetchWithAuth(API_BASE + "?action=list_files&show_hidden=" + state.showHidden);

    // If query changed while fetching (e.g. user cleared the box), discard results
    if (state.searchQuery.trim().toLowerCase() !== query) return;

    if (allFiles && Array.isArray(allFiles)) {
      const matchingPaths = allFiles
        .filter(file => file.name.toLowerCase().includes(query))
        .map(file => file.path);
      state.contentSearchResults = new Set(matchingPaths);
    } else {
      state.contentSearchResults = new Set();
    }
  } catch (e) {
    console.error("Filename search failed", e);
    state.contentSearchResults = new Set();
  } finally {
    if (elements.fileSearch) elements.fileSearch.style.opacity = "1";
    // Only render if query still matches (user hasn't cleared)
    if (state.searchQuery.trim().toLowerCase() === query) {
      renderFileTree();
    }
  }
}

/**
 * Build file tree structure from flat list
 */
export function buildFileTree(items) {
  const tree = {};

  items.forEach((item) => {
    const parts = item.path.split("/");
    let current = tree;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part - either a file or folder
        if (item.type === "file") {
          if (!current._files) current._files = [];
          current._files.push({ name: part, path: item.path });
        } else if (item.type === "folder") {
          // Create folder entry if it doesn't exist
          if (!current[part]) {
            current[part] = { _path: item.path };
          }
        }
      } else {
        // Intermediate folders in the path
        if (!current[part]) {
          current[part] = { _path: parts.slice(0, index + 1).join("/") };
        }
        current = current[part];
      }
    });
  });

  return tree;
}

/**
 * Render the entire file tree
 */
export function renderFileTree() {
  if (!elements.fileTree) return;
  if (callbacks.renderRecentFilesPanel) callbacks.renderRecentFilesPanel();
  if (callbacks.renderFavoritesPanel) callbacks.renderFavoritesPanel();
  elements.fileTree.innerHTML = "";

  // SEARCH MODE: Show search results as flat list (from any folder)
  if (state.contentSearchResults && state.contentSearchResults.size > 0) {
    const fragment = document.createDocumentFragment();

    // Convert search results to array and sort
    const searchResults = Array.from(state.contentSearchResults).sort();

    searchResults.forEach((filePath) => {
      const fileName = filePath.split("/").pop();
      const item = createTreeItem(fileName, 0, false, false, filePath);

      item.addEventListener("click", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        if (callbacks.openFile) callbacks.openFile(filePath);
        if (isMobile() && callbacks.hideSidebar) callbacks.hideSidebar();
      });

      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (callbacks.showContextMenu) {
          callbacks.showContextMenu(e.clientX, e.clientY, { path: filePath, isFolder: false });
        }
      });

      if (state.activeTab && state.activeTab.path === filePath) {
        item.classList.add("active");
      }

      const tab = state.openTabs.find((t) => t.path === filePath);
      if (tab && tab.modified) {
        item.classList.add("modified");
      }

      fragment.appendChild(item);
    });

    elements.fileTree.appendChild(fragment);
    updateToggleAllButton();
    return; // Exit early - don't show folder navigation
  }

  // COLLAPSABLE TREE MODE: Classic expand/collapse tree (when treeCollapsableMode is enabled)
  if (state.treeCollapsableMode && !state.lazyLoadingEnabled) {
    const fragment = document.createDocumentFragment();
    if (state.fileTree && Object.keys(state.fileTree).length > 0) {
      renderTreeLevel(state.fileTree, fragment, 0);
    }
    elements.fileTree.appendChild(fragment);
    updateToggleAllButton();
    return;
  }

  // FOLDER NAVIGATION MODE: Show only current folder contents
  const currentPath = state.currentNavigationPath;

  const currentData = state.loadedDirectories.get(currentPath);

  if (!currentData) {
    // No data loaded yet - show loading
    const loadingItem = document.createElement("div");
    loadingItem.className = "loading-item";
    loadingItem.innerHTML = `
      <span class="material-icons loading-spinner">sync</span>
      <span class="tree-name">Loading...</span>
    `;
    elements.fileTree.appendChild(loadingItem);
    return;
  }

  const query = state.searchQuery.toLowerCase();
  const fragment = document.createDocumentFragment();


  // Render folders (flat list, no tree hierarchy)
  currentData.folders.forEach((folder) => {
    if (query && !folder.name.toLowerCase().includes(query)) {
      return;
    }


    const item = createTreeItem(folder.name, 0, true, false, folder.path, false,
      folder.isSymlink ? (folder.symlinkTarget || "") : null);

    // Double-click to navigate into folder
    item.addEventListener("dblclick", (e) => {
      if (e.target.closest(".tree-action-btn")) return;
      e.stopPropagation();
      navigateToFolder(folder.path);
    });

    // Context menu
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (callbacks.showContextMenu) {
        callbacks.showContextMenu(e.clientX, e.clientY, { path: folder.path, isFolder: true });
      }
    });

    fragment.appendChild(item);
  });

  // Render files (flat list)
  currentData.files.forEach((file) => {
    // If search results exist (from either content or filename search), filter by them
    if (state.contentSearchResults && state.contentSearchResults.size > 0) {
      if (!state.contentSearchResults.has(file.path)) return;
    } else if (query && !file.name.toLowerCase().includes(query)) {
      // Fallback: local filename filtering (for non-lazy-loading mode)
      return;
    }


    const item = createTreeItem(file.name, 0, false, false, file.path, false,
      file.isSymlink ? (file.symlinkTarget || "") : null);

    item.addEventListener("click", (e) => {
      if (e.target.closest(".tree-action-btn")) return;
      if (callbacks.openFile) callbacks.openFile(file.path);
      if (isMobile() && callbacks.hideSidebar) callbacks.hideSidebar();
    });

    // Context menu
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (callbacks.showContextMenu) {
        callbacks.showContextMenu(e.clientX, e.clientY, { path: file.path, isFolder: false });
      }
    });

    if (state.activeTab && state.activeTab.path === file.path) {
      item.classList.add("active");
    }

    const tab = state.openTabs.find((t) => t.path === file.path);
    if (tab && tab.modified) {
      item.classList.add("modified");
    }

    fragment.appendChild(item);
  });

  elements.fileTree.appendChild(fragment);
  updateToggleAllButton();
}

/**
 * Render a level of the tree (recursive)
 */
export function renderTreeLevel(tree, container, depth) {
  const folders = Object.keys(tree)
    .filter((k) => !k.startsWith("_"))
    .sort();
  const files = (tree._files || []).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const query = state.searchQuery.toLowerCase();
  const fragment = document.createDocumentFragment();

  // Render folders
  folders.forEach((folderName) => {
    const folderData = tree[folderName];
    const folderPath = folderData._path;

    if (query && !folderMatchesSearch(folderData, query)) {
      return;
    }

    // Auto-expand if searching and matches
    const isExpanded = state.expandedFolders.has(folderPath) || (query && folderMatchesSearch(folderData, query));
    const isLoading = state.loadingDirectories.has(folderPath);
    const folderMeta = state.folders.find(f => f.path === folderPath);
    const item = createTreeItem(folderName, depth, true, isExpanded, folderPath, isLoading,
      folderMeta?.isSymlink ? (folderMeta.symlinkTarget || "") : null);

    if (state.currentFolderPath === folderPath) {
      item.classList.add("active");
    }

    item.addEventListener("click", (e) => {
      if (e.target.closest(".tree-action-btn")) return;
      e.stopPropagation();
      state.currentFolderPath = folderPath;
      toggleFolder(folderPath);
    });

    // Context menu
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (callbacks.showContextMenu) {
        callbacks.showContextMenu(e.clientX, e.clientY, { path: folderPath, isFolder: true });
      }
    });

    fragment.appendChild(item);

    if (isExpanded && !isLoading) {
      // Only render children if expanded and not currently loading
      renderTreeLevel(folderData, fragment, depth + 1);
    } else if (isExpanded && isLoading) {
      // Show loading placeholder
      const loadingItem = document.createElement("div");
      loadingItem.className = "tree-item loading-item";
      loadingItem.style.paddingLeft = `${(depth + 1) * 20 + 12}px`;
      loadingItem.innerHTML = `
        <span class="material-icons loading-spinner">sync</span>
        <span class="tree-name">Loading...</span>
      `;
      fragment.appendChild(loadingItem);
    }
  });

  // Render files
  files.forEach((file) => {
    // If search results exist (from either content or filename search), filter by them
    if (state.contentSearchResults && state.contentSearchResults.size > 0) {
      if (!state.contentSearchResults.has(file.path)) return;
    } else if (query && !file.name.toLowerCase().includes(query)) {
      return;
    }

    const fileMeta = state.files.find(f => f.path === file.path);
    const item = createTreeItem(file.name, depth, false, false, file.path, false,
      fileMeta?.isSymlink ? (fileMeta.symlinkTarget || "") : null);

    item.addEventListener("click", (e) => {
      if (e.target.closest(".tree-action-btn")) return;
      if (callbacks.openFile) callbacks.openFile(file.path);
      if (isMobile() && callbacks.hideSidebar) callbacks.hideSidebar();
    });

    // Context menu
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (callbacks.showContextMenu) {
        callbacks.showContextMenu(e.clientX, e.clientY, { path: file.path, isFolder: false });
      }
    });

    if (state.activeTab && state.activeTab.path === file.path) {
      item.classList.add("active");
    }

    const tab = state.openTabs.find((t) => t.path === file.path);
    if (tab && tab.modified) {
      item.classList.add("modified");
    }

    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}

/**
 * Handle dropping multiple files/folders
 */
export async function handleFileDropMulti(sourcePaths, targetFolder) {
  const targetFolderDisplay = targetFolder || "config folder";

  // Filter out redundant moves (already in target folder)
  const pathsToMove = sourcePaths.filter(path => {
    const lastSlash = path.lastIndexOf("/");
    const currentFolder = lastSlash === -1 ? "" : path.substring(0, lastSlash);
    return currentFolder !== (targetFolder || "");
  });

  if (pathsToMove.length === 0) return;

  const confirmed = await showConfirmDialog({
    title: "Move Multiple Items?",
    message: `Move <b>${pathsToMove.length} items</b> to <b>${targetFolderDisplay}</b>?`,
    confirmText: "Move All",
    cancelText: "Cancel"
  });

  if (confirmed) {
    try {
      showGlobalLoading(`Moving ${pathsToMove.length} items...`);

      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move_multi",
          paths: pathsToMove,
          destination: targetFolder
        }),
      });

      hideGlobalLoading();
      showToast(`Moved ${pathsToMove.length} items`, "success");

      // Exit selection mode and refresh
      if (state.selectionMode && callbacks.toggleSelectionMode) {
        callbacks.toggleSelectionMode();
      }
      if (callbacks.loadFiles) await callbacks.loadFiles(true);

      // Refresh git status if enabled
      if (callbacks.checkGitStatusIfEnabled) await callbacks.checkGitStatusIfEnabled();
    } catch (error) {
      hideGlobalLoading();
      showToast("Failed to move items: " + error.message, "error");
    }
  }
}

/**
 * Handle dropping a single file/folder
 */
export async function handleFileDrop(sourcePath, targetFolder) {
  if (sourcePath === targetFolder) return;

  const fileName = sourcePath.split("/").pop();
  const newPath = targetFolder ? `${targetFolder}/${fileName}` : fileName;

  // Check if moving into itself (for folders)
  if (targetFolder && targetFolder.startsWith(sourcePath + "/")) {
    showToast("Cannot move a folder into itself", "warning");
    return;
  }

  // Check if moving to same location
  const lastSlashIndex = sourcePath.lastIndexOf("/");
  const currentFolder = lastSlashIndex === -1 ? "" : sourcePath.substring(0, lastSlashIndex);
  const targetFolderNormalized = targetFolder || "";

  if (currentFolder === targetFolderNormalized) return;

  const confirmed = await showConfirmDialog({
    title: "Move Item?",
    message: `Move <b>${fileName}</b> to <b>${targetFolderNormalized || "config folder"}</b>?`,
    confirmText: "Move",
    cancelText: "Cancel"
  });

  if (confirmed) {
    try {
      showGlobalLoading("Moving...");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rename",
          source: sourcePath,
          destination: newPath
        }),
      });

      if (data.success) {
        showToast("Moved successfully", "success");
        if (callbacks.loadFiles) await callbacks.loadFiles();
      } else {
        showToast("Move failed: " + data.message, "error");
      }
    } catch (error) {
      showToast("Move error: " + error.message, "error");
    } finally {
      hideGlobalLoading();
    }
  }
}

/**
 * Check if folder matches search query
 */
export function folderMatchesSearch(folder, query) {
  // Search results mode (content or filename search)
  if (state.contentSearchResults && state.contentSearchResults.size > 0) {
    if (folder._files) {
      if (folder._files.some(f => state.contentSearchResults.has(f.path))) return true;
    }
    for (const key of Object.keys(folder)) {
      if (!key.startsWith("_") && folderMatchesSearch(folder[key], query)) return true;
    }
    return false;
  }

  // Standard Filename Search
  if (folder._files) {
    if (folder._files.some((f) => f.name.toLowerCase().includes(query))) {
      return true;
    }
  }

  for (const key of Object.keys(folder)) {
    if (!key.startsWith("_") && folderMatchesSearch(folder[key], query)) {
      return true;
    }
  }

  return false;
}

/**
 * Create a tree item element (file or folder)
 */
export function createTreeItem(name, depth, isFolder, isExpanded, itemPath = null, isLoading = false, symlinkTarget = null) {
  const item = document.createElement("div");
  item.className = "tree-item";
  item.style.setProperty("--depth", depth);
  item.draggable = true;
  item.dataset.path = itemPath;

  // Checkbox for selection mode
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "tree-item-checkbox";
  if (state.selectionMode) {
    checkbox.classList.add("visible");
    checkbox.checked = state.selectedItems.has(itemPath);
  }

  // Prevent item click when clicking checkbox
  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (callbacks.handleSelectionChange) {
      callbacks.handleSelectionChange(itemPath, e.target.checked);
    }
  });
  item.appendChild(checkbox);

  // In folder navigation mode (lazy loading), don't show chevrons
  // We navigate by double-clicking instead of expanding
  if (isFolder && !state.lazyLoadingEnabled) {
    const chevron = document.createElement("div");
    chevron.className = `tree-chevron ${isExpanded ? "expanded" : ""}`;
    if (isLoading) {
      // Show spinning loader icon while loading
      chevron.innerHTML = '<span class="material-icons loading-spinner">sync</span>';
    } else {
      chevron.innerHTML = '<span class="material-icons">chevron_right</span>';
    }
    item.appendChild(chevron);
  } else if (!state.lazyLoadingEnabled) {
    // Spacer for alignment if not a folder (only in tree mode)
    const spacer = document.createElement("div");
    spacer.className = "tree-chevron hidden";
    item.appendChild(spacer);
  }

  const fileIcon = getFileIcon(itemPath || name);
  const icon = document.createElement("div");
  icon.className = `tree-icon ${isFolder ? "folder" : fileIcon.class}`;
  icon.innerHTML = `<span class="material-icons">${
    isFolder ? (isExpanded ? "folder_open" : "folder") : fileIcon.icon
  }</span>`;
  item.appendChild(icon);

  const label = document.createElement("span");
  label.className = "tree-name";
  label.textContent = name;
  item.appendChild(label);

  // Check if this is a symlink (passed directly from renderFileTree)
  // Symlink indicator
  if (symlinkTarget !== null) {
    const symlinkIcon = document.createElement("span");
    symlinkIcon.className = "material-icons tree-symlink-badge";
    symlinkIcon.textContent = "link";
    symlinkIcon.style.fontSize = "14px";
    symlinkIcon.style.marginLeft = "4px";
    symlinkIcon.style.opacity = "0.8";
    if (symlinkTarget === "") {
      // Broken symlink
      symlinkIcon.style.color = "var(--error-color)";
      symlinkIcon.title = "Broken symlink";
    } else {
      symlinkIcon.style.color = "var(--accent-color)";
      symlinkIcon.title = `Symlink → ${symlinkTarget}`;
    }
    item.appendChild(symlinkIcon);
  }

  // File Size (if available)
  if (!isFolder && itemPath) {
    let fileData = state.files.find(f => f.path === itemPath);
    // For files in subdirectories (lazy loading), look in loadedDirectories cache
    if (!fileData && state.loadedDirectories) {
      const parentPath = itemPath.includes('/') ? itemPath.split('/').slice(0, -1).join('/') : '';
      const dirData = state.loadedDirectories.get(parentPath);
      if (dirData) {
        fileData = dirData.files.find(f => f.path === itemPath);
      }
    }
    if (fileData && typeof fileData.size === 'number') {
      const sizeLabel = document.createElement("span");
      sizeLabel.className = "tree-file-size";
      sizeLabel.textContent = formatBytes(fileData.size, 0);
      sizeLabel.style.fontSize = "11px";
      sizeLabel.style.color = "var(--text-muted)";
      sizeLabel.style.marginLeft = "8px";
      sizeLabel.style.flexShrink = "0";
      item.appendChild(sizeLabel);
    }
  }

  // Actions
  const actions = document.createElement("div");
  actions.className = "tree-item-actions";

  // Pin Button (Favorites)
  if (!state.selectionMode) {
    const isPinned = state.favoriteFiles.includes(itemPath);
    const pinBtn = document.createElement("button");
    pinBtn.className = "tree-action-btn";
    pinBtn.title = isPinned ? "Unpin" : "Pin to top";
    pinBtn.innerHTML = `<span class="material-icons" style="font-size: 16px; ${isPinned ? 'color: var(--accent-color);' : ''}">push_pin</span>`;
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (callbacks.toggleFavorite) callbacks.toggleFavorite(itemPath);
    });
    actions.appendChild(pinBtn);
  }

  // Diff Button - Only for modified files
  if (!isFolder && gitState.files.modified.includes(itemPath)) {
    const diffBtn = document.createElement("button");
    diffBtn.className = "tree-action-btn";
    diffBtn.title = "View Diff";
    diffBtn.innerHTML = '<span class="material-icons" style="font-size: 16px; color: var(--warning-color);">difference</span>';

    diffBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (callbacks.showDiffModal) callbacks.showDiffModal(itemPath);
    });
    actions.appendChild(diffBtn);
  }

  item.appendChild(actions);

  // Drag events
  item.addEventListener("dragstart", handleDragStart);
  item.addEventListener("dragover", handleDragOver);
  item.addEventListener("dragleave", handleDragLeave);
  item.addEventListener("drop", handleDrop);

  return item;
}

/**
 * Handle drag start
 */
export function handleDragStart(e) {
  const path = e.currentTarget.dataset.path;
  if (!path || path === ".git" || path === ".gitignore") {
    e.preventDefault();
    return;
  }

  // If dragged item is selected, we move all selected items
  if (state.selectionMode && state.selectedItems.has(path)) {
    const paths = Array.from(state.selectedItems);
    e.dataTransfer.setData("application/x-blueprint-studio-multi", JSON.stringify(paths));
  }

  e.dataTransfer.setData("text/plain", path);
  e.dataTransfer.effectAllowed = "move";
  e.currentTarget.classList.add("dragging");
}

/**
 * Handle drag over
 */
export function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";

  const item = e.currentTarget.closest(".tree-item");
  if (item) {
    item.classList.add("drag-over");
  } else if (e.currentTarget === elements.fileTree) {
    elements.fileTree.classList.add("drag-over-root");
  }
}

/**
 * Handle drag leave
 */
export function handleDragLeave(e) {
  const item = e.currentTarget.closest(".tree-item");
  if (item) {
    item.classList.remove("drag-over");
  } else if (e.currentTarget === elements.fileTree) {
    elements.fileTree.classList.remove("drag-over-root");
  }
}

/**
 * Handle drop
 */
export async function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const item = e.currentTarget.closest(".tree-item");
  if (item) {
    item.classList.remove("drag-over");
  }
  elements.fileTree.classList.remove("drag-over-root");

  const multiData = e.dataTransfer.getData("application/x-blueprint-studio-multi");
  const sourcePath = e.dataTransfer.getData("text/plain");
  const itemPath = item ? item.dataset.path : null; // null means root

  // Determine target folder
  let targetFolder = null;
  if (item) {
    const isFolder = state.folders.some(f => f.path === itemPath);
    if (isFolder) {
      targetFolder = itemPath;
    } else {
      // Drop onto a file - target its parent folder
      const lastSlash = itemPath.lastIndexOf("/");
      targetFolder = lastSlash === -1 ? null : itemPath.substring(0, lastSlash);
    }
  }

  // Case 1: External File Upload
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    if (callbacks.processUploads) {
      await callbacks.processUploads(e.dataTransfer.files, targetFolder);
    }
    return;
  }

  // Case 2: Internal Multi-Move
  if (multiData) {
    const paths = JSON.parse(multiData);
    await handleFileDropMulti(paths, targetFolder);
    return;
  }

  // Case 3: Internal Single Move
  if (sourcePath) {
    await handleFileDrop(sourcePath, targetFolder);
  }
}

/**
 * Toggle folder expansion
 */
/**
 * Navigate into a folder (show only its contents)
 */
export async function navigateToFolder(folderPath) {
  // Add current path to history before navigating
  if (state.currentNavigationPath !== folderPath) {
    state.navigationHistory.push(state.currentNavigationPath);
  }

  state.currentNavigationPath = folderPath;

  // Load folder contents if not already loaded
  if (!state.loadedDirectories.has(folderPath)) {
    await loadDirectory(folderPath);
  }

  // Render current folder
  renderFileTree();
  updateFolderNavigationBreadcrumb();
  updateNavigationBackButton();
}

/**
 * Navigate back to previous folder
 */
export function navigateBack() {
  if (state.navigationHistory.length === 0) return;

  const previousPath = state.navigationHistory.pop();
  state.currentNavigationPath = previousPath;

  renderFileTree();
  updateFolderNavigationBreadcrumb();
  updateNavigationBackButton();
}

/**
 * Update folder navigation breadcrumb
 */
export function updateFolderNavigationBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  breadcrumb.innerHTML = "";

  // Home (root)
  const homeItem = document.createElement("span");
  homeItem.className = `breadcrumb-item breadcrumb-home ${state.currentNavigationPath === "" ? "active" : ""}`;
  homeItem.dataset.path = "";
  homeItem.innerHTML = `
    <span class="material-icons">home</span>
    <span class="breadcrumb-text">Home</span>
  `;
  homeItem.addEventListener("click", () => navigateToFolder(""));
  breadcrumb.appendChild(homeItem);

  // Path segments
  if (state.currentNavigationPath) {
    const parts = state.currentNavigationPath.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      // Add separator
      const separator = document.createElement("span");
      separator.className = "breadcrumb-separator";
      separator.textContent = "›";
      breadcrumb.appendChild(separator);

      // Add breadcrumb item
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;

      const item = document.createElement("span");
      item.className = `breadcrumb-item ${isLast ? "active" : ""}`;
      item.dataset.path = currentPath;
      item.textContent = part;

      const itemPath = currentPath; // Capture for closure
      item.addEventListener("click", () => {
        // Navigate to this level
        state.navigationHistory = []; // Clear history when clicking breadcrumb
        navigateToFolder(itemPath);
      });

      breadcrumb.appendChild(item);
    });
  }
}

/**
 * Update navigation back button state
 */
export function updateNavigationBackButton() {
  const backBtn = document.getElementById("btn-nav-back");
  if (!backBtn) return;

  if (state.navigationHistory.length > 0) {
    backBtn.disabled = false;
  } else {
    backBtn.disabled = true;
  }
}

export async function toggleFolder(path) {
  if (state.expandedFolders.has(path)) {
    // Collapse folder
    state.expandedFolders.delete(path);
    renderFileTree();
  } else {
    // Expand folder
    state.expandedFolders.add(path);

    // LAZY LOADING: Load directory contents if not already loaded
    if (state.lazyLoadingEnabled && !state.loadedDirectories.has(path)) {
      await loadDirectory(path);
    }

    renderFileTree();
  }
}

/**
 * Load directory contents on demand (LAZY LOADING)
 */
async function loadDirectory(path) {
  if (state.loadingDirectories.has(path)) {
    // Already loading, skip
    return;
  }

  try {
    state.loadingDirectories.add(path);

    // Show loading indicator
    renderFileTree(); // Re-render to show spinner


    const result = await fetchWithAuth(
      `${API_BASE}?action=list_directory&path=${encodeURIComponent(path)}&show_hidden=${state.showHidden}`
    );


    if (result.error) {
      console.error(`Failed to load directory ${path}:`, result.error);
      showToast(`Failed to load folder: ${result.error}`, "error");
      return;
    }

    // Cache the loaded directory contents
    state.loadedDirectories.set(path, {
      folders: result.folders || [],
      files: result.files || []
    });


    // Update file tree structure (add loaded items)
    updateFileTreeWithLoadedDirectory(path, result.folders || [], result.files || []);

  } catch (error) {
    console.error(`Error loading directory ${path}:`, error);
    showToast(`Error loading folder: ${error.message}`, "error");
  } finally {
    state.loadingDirectories.delete(path);
    renderFileTree();
  }
}

/**
 * Update file tree structure with newly loaded directory contents
 */
function updateFileTreeWithLoadedDirectory(parentPath, folders, files) {
  // Navigate to parent folder in tree
  const parts = parentPath ? parentPath.split("/") : [];
  let current = state.fileTree;

  for (const part of parts) {
    if (!current[part]) {
      current[part] = { _path: parentPath };
    }
    current = current[part];
  }

  // Add folders
  folders.forEach(folder => {
    if (!current[folder.name]) {
      current[folder.name] = {
        _path: folder.path,
        _childCount: folder.childCount || 0
      };
    }
  });

  // Add files
  if (!current._files) {
    current._files = [];
  }
  files.forEach(file => {
    if (!current._files.find(f => f.name === file.name)) {
      current._files.push({ name: file.name, path: file.path, size: file.size });
    }
  });
}

/**
 * Update toggle all button state
 */
export function updateToggleAllButton() {
  if (elements.btnToggleAll) {
    const icon = elements.btnToggleAll.querySelector('.material-icons');
    if (state.expandedFolders.size > 0) {
      elements.btnToggleAll.title = "Collapse All";
      icon.textContent = "unfold_less";
    } else {
      elements.btnToggleAll.title = "Expand All";
      icon.textContent = "unfold_more";
    }
  }
}

/**
 * Collapse all folders — works in both tree and navigation modes
 */
export async function collapseAllFolders() {
  // Collapsable tree mode: clear expanded set and re-render
  if (state.treeCollapsableMode && !state.lazyLoadingEnabled) {
    state.expandedFolders.clear();
    renderFileTree();
    return;
  }

  // Folder navigation mode (default/lazy loading): navigate back to root
  if (state.currentNavigationPath !== "") {
    state.navigationHistory = [];
    await navigateToFolder("");
  }
}
