/**
 * ============================================================================
 * FAVORITES MODULE
 * ============================================================================
 *
 * PURPOSE: Manages favorite files - add, remove, persist, render panel.
 * Allows quick access to frequently used files.
 *
 * EXPORTED FUNCTIONS:
 * - registerFavoritesCallbacks(cb) - Register dependencies
 * - toggleFavorite(path) - Add/remove favorite
 * - renderFavoritesPanel() - Render favorites in sidebar
 *
 * HOW TO ADD FEATURES:
 * 1. Add favorite folders: Support favoriting folders not just files
 * 2. Add favorite groups: Organize favorites into groups
 * 3. Add favorite sorting: Sort by name, date added, type
 *
 * INTEGRATION: settings.js (persistence), file-tree.js, sidebar.js
 * ============================================================================
 */
import { state, elements } from './state.js';
import { showToast } from './ui.js';
import { getFileIcon, isMobile } from './utils.js';

// Callbacks for cross-module functions
let callbacks = {
  openFile: null,
  hideSidebar: null,
  saveSettings: null,
  renderFileTree: null
};

export function registerFavoritesCallbacks(cb) {
  callbacks = { ...callbacks, ...cb };
}

/**
 * Check if a file path is favorited
 * @param {string} path - File path
 * @returns {boolean}
 */
export function isFavorite(path) {
  return state.favoriteFiles.includes(path);
}

/**
 * Toggle favorite status of a file
 * @param {string} path - File path
 */
export function toggleFavorite(path) {
  if (isFavorite(path)) {
    state.favoriteFiles = state.favoriteFiles.filter(p => p !== path);
    showToast(`Removed ${path.split("/").pop()} from favorites`, "success");
  } else {
    state.favoriteFiles.push(path);
    showToast(`Added ${path.split("/").pop()} to favorites`, "success");
  }

  if (callbacks.saveSettings) callbacks.saveSettings();
  if (callbacks.renderFileTree) callbacks.renderFileTree();
}

/**
 * Render the favorites panel in the sidebar
 */
export function renderFavoritesPanel() {
  const favoritesPanel = document.getElementById("favorites-panel");
  if (!favoritesPanel) return;

  // Use the inner favorites-tree container if it exists, otherwise fall back to the panel itself
  const favoritesTree = document.getElementById("favorites-tree") || favoritesPanel;

  // Filter valid favorites first — check against all loaded items (files + folders)
  const validFavorites = state.favoriteFiles.filter(filePath =>
    state.files.some(f => f.path === filePath) ||
    state.folders.some(f => f.path === filePath)
  );

  if (validFavorites.length === 0) {
    favoritesPanel.style.display = "none";
    return;
  }

  favoritesPanel.style.display = "block";

  // Only clear the tree container, not the whole panel (preserves the header element)
  favoritesTree.innerHTML = "";

  validFavorites.forEach((filePath) => {
    const fileName = filePath.split("/").pop();
    const item = document.createElement("div");
    item.className = "tree-item favorite-item";
    item.style.setProperty("--depth", 0);

    const fileIcon = getFileIcon(filePath);
    const isActive = state.activeTab && state.activeTab.path === filePath;

    item.innerHTML = `
      <div class="tree-chevron hidden"></div>
      <div class="tree-icon ${fileIcon.class}">
        <span class="material-icons">${fileIcon.icon}</span>
      </div>
      <span class="tree-name">${fileName}</span>
      <div class="tree-item-actions">
        <button class="tree-action-btn" title="Unpin from favorites">
          <span class="material-icons">push_pin</span>
        </button>
      </div>
    `;

    if (isActive) {
      item.classList.add("active");
    }

    const tab = state.openTabs.find((t) => t.path === filePath);
    if (tab && tab.modified) {
      item.classList.add("modified");
    }

    item.addEventListener("click", (e) => {
      if (e.target.closest(".tree-action-btn")) {
        toggleFavorite(filePath);
      } else {
        if (callbacks.openFile) callbacks.openFile(filePath);
        if (isMobile() && callbacks.hideSidebar) callbacks.hideSidebar();
      }
    });

    favoritesTree.appendChild(item);
  });
}
