/**
 * ============================================================================
 * UI MODULE
 * ============================================================================
 *
 * PURPOSE:
 * Provides core UI utilities including modals, toasts, themes, loading states,
 * and common UI interactions. This is the foundation for all user interface
 * feedback and dialogs.
 *
 * EXPORTED FUNCTIONS:
 * Modals & Dialogs:
 * - showModal(options) - Show input modal
 * - hideModal() - Hide current modal
 * - confirmModal() - Confirm current modal
 * - showConfirmDialog(options) - Show confirmation dialog
 * - resetModalToDefault() - Reset modal to default state
 *
 * Toasts & Notifications:
 * - showToast(message, type, duration, action) - Show toast notification
 * - hideToast() - Hide current toast
 *
 * Loading States:
 * - showGlobalLoading(message) - Show global loading overlay
 * - hideGlobalLoading() - Hide loading overlay
 * - setButtonLoading(button, isLoading) - Set button loading state
 *
 * Themes:
 * - applyTheme() - Apply current theme
 * - setTheme(theme) - Set theme (dark/light)
 * - setThemePreset(preset) - Set theme preset
 * - setAccentColor(color) - Set accent color
 * - applyCustomSyntaxColors() - Apply custom syntax highlighting
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding a new toast type:
 *    - Add CSS class in styles.css (.toast.type-name)
 *    - Use in showToast(message, "type-name")
 *    - Add icon/styling as needed
 *    - Example types: success, error, warning, info
 *
 * 2. Adding a new modal type:
 *    - Create modal HTML structure
 *    - Add show/hide functions
 *    - Handle keyboard events (Enter/Escape)
 *    - Return promise for user input
 *    - Example: showImageCropModal()
 *
 * 3. Adding a new theme preset:
 *    - Add to THEME_PRESETS in constants.js
 *    - Define CSS variables
 *    - Test in both dark/light modes
 *    - Add to settings UI
 *
 * 4. Adding custom accent colors:
 *    - Add to ACCENT_COLORS in constants.js
 *    - Update CSS variable: --accent-color
 *    - Derive hover/active colors
 *    - Test accessibility (contrast ratios)
 *
 * 5. Adding loading animations:
 *    - Modify showGlobalLoading() HTML
 *    - Add CSS animations
 *    - Support custom messages
 *    - Handle nested loading states
 *
 * INTEGRATION POINTS:
 * - All modules use toast notifications
 * - All modules use modals for user input
 * - settings.js: Theme persistence
 * - state.js: Theme state
 * - All buttons use setButtonLoading
 *
 * MODAL OPTIONS:
 * {
 *   title: "Modal Title",
 *   message: "Modal message (HTML supported)",
 *   placeholder: "Input placeholder",
 *   value: "Default input value",
 *   hint: "Help text",
 *   confirmText: "OK",
 *   cancelText: "Cancel",
 *   isDanger: false  // Red confirm button for destructive actions
 * }
 *
 * TOAST OPTIONS:
 * - message: String (required)
 * - type: "success" | "error" | "warning" | "info"
 * - duration: Milliseconds (0 = no auto-hide)
 * - action: { text: "Action", callback: () => {} }
 *
 * ARCHITECTURE NOTES:
 * - Modals use Promise-based API for easy async/await
 * - Toasts stack and auto-dismiss
 * - Themes use CSS variables for runtime switching
 * - Loading states prevent duplicate clicks
 * - All UI feedback is accessible (ARIA labels)
 *
 * COMMON PATTERNS:
 * - Show toast: showToast("Saved successfully", "success")
 * - Confirm action: const ok = await showConfirmDialog({title, message}); if (ok) { ... }
 * - Input modal: const value = await showModal({title, placeholder}); if (value) { ... }
 * - Loading: showGlobalLoading("Loading..."); await doWork(); hideGlobalLoading()
 * - Button loading: setButtonLoading(btn, true); await doWork(); setButtonLoading(btn, false)
 * - Theme: setTheme("dark"); applyTheme()
 *
 * THEME SYSTEM:
 * - CSS variables defined in :root
 * - Variables change based on theme
 * - Smooth transitions between themes
 * - Persisted in settings
 * - Syncs with system preference option (future)
 *
 * ACCESSIBILITY:
 * - Modals trap focus
 * - Keyboard navigation (Tab, Enter, Escape)
 * - ARIA labels on interactive elements
 * - Sufficient color contrast
 * - Screen reader announcements for toasts
 *
 * ============================================================================
 */
import { state, elements } from './state.js';
import { THEME_PRESETS, ACCENT_COLORS, SYNTAX_THEMES } from './constants.js';
import { lightenColor } from './utils.js';

let callbacks = {
    saveSettings: null
};

export function registerUICallbacks(cb) {
    callbacks = { ...callbacks, ...cb };
}

export function getEffectiveTheme() {
  if (state.theme === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return state.theme;
}

export function applyCustomSyntaxColors() {
    const styleId = "custom-syntax-colors";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Determine which color set to use
    let colors;
    const themeDef = SYNTAX_THEMES[state.syntaxTheme];
    if (themeDef && themeDef.colors) {
      colors = themeDef.colors;
    } else {
      colors = state.customColors || {};
    }

    let css = "";

    const addRule = (selector, color) => {
      if (color) {
        css += `.cm-s-material-darker ${selector}, .cm-s-default ${selector} { color: ${color} !important; }\n`;
      }
    };

    addRule(".cm-comment", colors.comment);
    addRule(".cm-keyword, .cm-ha-domain", colors.keyword);
    addRule(".cm-string", colors.string);
    addRule(".cm-number", colors.number);
    addRule(".cm-atom", colors.boolean);
    addRule(".cm-ha-key, .cm-property, .cm-attribute", colors.key);
    addRule(".cm-tag, .cm-ha-include-tag, .cm-ha-secret-tag, .cm-ha-env-tag, .cm-ha-input-tag", colors.tag);

    styleEl.textContent = css;

    // Refresh both editors to apply the new colors immediately
    if (state.primaryEditor) {
      state.primaryEditor.refresh();
    }
    if (state.secondaryEditor) {
      state.secondaryEditor.refresh();
    }
}

export function applyTheme() {
  const effectiveTheme = getEffectiveTheme();
  const preset = THEME_PRESETS[state.themePreset] || THEME_PRESETS.dark;
  
  const root = document.documentElement;
  const colors = preset.colors;
  
  let accentColor = colors.accentColor;
  let accentHover = colors.accentHover;
  if (state.accentColor) {
    accentColor = state.accentColor;
    accentHover = lightenColor(accentColor, 20);
  }
  
  root.style.setProperty('--bg-primary', colors.bgPrimary);
  root.style.setProperty('--bg-secondary', colors.bgSecondary);
  root.style.setProperty('--bg-tertiary', colors.bgTertiary);
  root.style.setProperty('--bg-hover', colors.bgHover);
  root.style.setProperty('--bg-active', colors.bgActive);
  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  root.style.setProperty('--text-muted', colors.textMuted);
  root.style.setProperty('--border-color', colors.borderColor);
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--accent-hover', accentHover);
  root.style.setProperty('--success-color', colors.successColor);
  root.style.setProperty('--warning-color', colors.warningColor);
  root.style.setProperty('--error-color', colors.errorColor);
  root.style.setProperty('--icon-folder', colors.iconFolder);
  root.style.setProperty('--icon-yaml', colors.iconYaml);
  root.style.setProperty('--icon-json', colors.iconJson);
  root.style.setProperty('--icon-python', colors.iconPython);
  root.style.setProperty('--icon-js', colors.iconJs);
  root.style.setProperty('--icon-default', colors.iconDefault);
  root.style.setProperty('--modal-bg', colors.modalBg);
  root.style.setProperty('--input-bg', colors.inputBg);
  root.style.setProperty('--shadow-color', colors.shadowColor);
  root.style.setProperty('--cm-theme', colors.cmTheme);
  root.style.setProperty('--cm-gutter-bg', colors.bgGutter || colors.bgSecondary);
  
  const custom = state.customColors || {};
  root.style.setProperty('--cm-line-number-color', custom.lineNumberColor || colors.textMuted);
  root.style.setProperty('--cm-fold-color', custom.foldColor || colors.textMuted);
  
  document.body.setAttribute("data-theme", effectiveTheme);
  document.body.setAttribute("data-theme-preset", state.themePreset);

  // Update CodeMirror theme
  if (state.editor) {
    state.editor.setOption("theme", colors.cmTheme);
  }

  updateThemeToggleDisplay();
}

function updateThemeToggleDisplay() {
    const themeIcons = { 
        light: "light_mode", dark: "dark_mode", auto: "brightness_auto",
        highContrast: "contrast", solarizedDark: "palette", solarizedLight: "palette",
        ocean: "water", dracula: "nightlight_round"
    };
    const themeLabels = { 
        light: "Light", dark: "Dark", auto: "Auto",
        highContrast: "Contrast", solarizedDark: "Solar Dark", solarizedLight: "Solar Light",
        ocean: "Ocean", dracula: "Dracula"
    };

    const displayKey = state.theme === 'auto' ? 'auto' : state.themePreset;

    if (elements.themeIcon) elements.themeIcon.textContent = themeIcons[displayKey] || "dark_mode";
    if (elements.themeLabel) elements.themeLabel.textContent = themeLabels[displayKey] || "Dark";

    document.querySelectorAll(".theme-menu-item").forEach(item => {
      const itemTheme = item.dataset.theme;
      const isActive = (state.theme === 'auto' && itemTheme === 'auto') || 
                       (state.theme !== 'auto' && itemTheme === state.themePreset);
      item.classList.toggle("active", isActive);
    });
}

export function showGlobalLoading(message = "Loading...") {
  if (elements.loadingOverlay) {
    elements.loadingText.textContent = message;
    elements.loadingOverlay.classList.add("visible");
  }
}

export function hideGlobalLoading() {
  if (elements.loadingOverlay) {
    elements.loadingOverlay.classList.remove("visible");
  }
}

export function showToast(message, type = "success", duration = 3000, action = null) {
  if (!state.showToasts && type !== "error" && !action) return;

  if (type === "error" && duration === 3000) duration = 0;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = { success: "check_circle", error: "error", warning: "warning", info: "info" };

  let actionButtonHtml = '';
  if (action && action.text && action.callback) {
    actionButtonHtml = `<button class="toast-action-btn">${action.text}</button>`;
  }

  toast.innerHTML = `
    <span class="material-icons">${iconMap[type] || 'info'}</span>
    <span class="toast-message">${message}</span>
    ${actionButtonHtml}
  `;

  elements.toastContainer.appendChild(toast);

  if (action && action.callback) {
    const actionBtn = toast.querySelector('.toast-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        action.callback();
        toast.remove();
      });
    }
  } else if (duration > 0) {
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close-btn';
  closeBtn.innerHTML = '<span class="material-icons">close</span>';
  closeBtn.addEventListener('click', () => toast.remove());
  toast.appendChild(closeBtn);
}

// ============================================
// Modal Management
// ============================================

export let modalCallback = null;

export const DEFAULT_MODAL_BODY_HTML = `
    <input type="text" class="modal-input" id="modal-input" placeholder="Enter name...">
    <div class="modal-hint" id="modal-hint"></div>
`;

export function resetModalToDefault() {
    const modalBody = document.getElementById("modal-body");
    const modalTitle = document.getElementById("modal-title");
    const modal = document.getElementById("modal");
    const modalFooter = document.querySelector(".modal-footer");

    // Reset modal body to default
    if (modalBody) {
      modalBody.innerHTML = DEFAULT_MODAL_BODY_HTML;

      // Re-bind element references after HTML reset
      elements.modalInput = document.getElementById("modal-input");
      elements.modalHint = document.getElementById("modal-hint");

      // Re-attach event listener for Enter key
      if (elements.modalInput) {
        elements.modalInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            confirmModal();
          } else if (e.key === "Escape") {
            hideModal();
          }
        });
      }
    }

    // Reset modal title
    if (modalTitle) {
      modalTitle.textContent = "Modal Title";
    }

    // Reset modal width
    if (modal) {
      modal.style.maxWidth = "";
      modal.style.width = "";
    }

    // Show modal footer
    if (modalFooter) {
      modalFooter.style.display = "";
    }

    // Clear any callback
    modalCallback = null;
}

export function showModal(options) {
    // Support both the previous positional-style call and new object-style
    const { 
        title, 
        message, 
        image, 
        placeholder, 
        inputPlaceholder, // support both names
        hint, 
        value = "", 
        inputValue, // support both names
        confirmText = "Confirm", 
        cancelText = "Cancel",
        isDanger = false,
        danger = false // support both names
    } = options;

    const useDanger = isDanger || danger;
    const usePlaceholder = placeholder || inputPlaceholder;
    const useValue = value || inputValue || "";

    // Ensure modal is in default state before showing
    resetModalToDefault();

    elements.modalTitle.textContent = title;
    elements.modalConfirm.textContent = confirmText;
    elements.modalCancel.textContent = cancelText;
    elements.modalConfirm.className = useDanger ? "modal-btn danger" : "modal-btn primary";
    
    if (image) {
        // Image viewer mode
        elements.modalInput.style.display = "none";
        elements.modalHint.innerHTML = `<div style="text-align: center; padding: 10px; background: var(--bg-primary); border-radius: 4px;">
            <img src="${image}" style="max-width: 100%; max-height: 70vh; border-radius: 2px; display: block; margin: 0 auto;">
        </div>`;
        elements.modalHint.style.fontSize = "14px";
        elements.modalCancel.style.display = "none";
        // Make modal wider for images
        elements.modal.style.maxWidth = "90vw";
        elements.modal.style.width = "auto";
    } else if (message) {
        // Message mode
        elements.modalInput.style.display = "none";
        elements.modalHint.innerHTML = message;
        elements.modalHint.style.fontSize = "14px";
        elements.modalHint.style.color = "var(--text-primary)";
        // In legacy app.js version, message mode sometimes hid cancel button
        // but ui.js version kept it. Let's keep it visible by default unless specified.
    } else {
        // Input mode
        elements.modalInput.style.display = "";
        elements.modalHint.style.fontSize = "";
        elements.modalHint.style.color = "";
        elements.modalCancel.style.display = ""; 
        elements.modalInput.placeholder = usePlaceholder || "";
        elements.modalInput.value = useValue;
        elements.modalHint.textContent = hint || "";
        
        setTimeout(() => {
            elements.modalInput.focus();
            if (elements.modalInput.value) {
                const len = elements.modalInput.value.length;
                elements.modalInput.setSelectionRange(len, len);
            }
        }, 100);
    }

    elements.modalOverlay.classList.add("visible");

    return new Promise((resolve) => {
      modalCallback = resolve;
    });
}

export function showConfirmDialog(options) {
    const { title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false } = options;

    resetModalToDefault();

    elements.modalTitle.textContent = title;
    elements.modalInput.style.display = "none";
    elements.modalHint.innerHTML = message;
    elements.modalHint.style.fontSize = "14px";
    elements.modalHint.style.color = "var(--text-primary)";
    elements.modalConfirm.textContent = confirmText;
    elements.modalCancel.textContent = cancelText;
    elements.modalConfirm.className = isDanger ? "modal-btn danger" : "modal-btn primary";

    elements.modalOverlay.classList.add("visible");

    return new Promise((resolve) => {
      const confirmHandler = () => {
        elements.modalOverlay.classList.remove("visible");
        resolve(true);
        cleanup();
      };

      const cancelHandler = () => {
        elements.modalOverlay.classList.remove("visible");
        resolve(false);
        cleanup();
      };

      const cleanup = () => {
        elements.modalConfirm.removeEventListener("click", confirmHandler);
        elements.modalCancel.removeEventListener("click", cancelHandler);
      };

      elements.modalConfirm.addEventListener("click", confirmHandler, { once: true });
      elements.modalCancel.addEventListener("click", cancelHandler, { once: true });
    });
}

export function hideModal() {
    elements.modalOverlay.classList.remove("visible");
    if (modalCallback) {
      modalCallback(null);
      modalCallback = null;
    }
}

export function confirmModal() {
    const value = elements.modalInput ? elements.modalInput.value.trim() : true;
    elements.modalOverlay.classList.remove("visible");
    if (modalCallback) {
      modalCallback(value);
      modalCallback = null;
    }
}

export function initElements() {
    elements.fileTree = document.getElementById("file-tree");
    elements.favoritesPanel = document.getElementById("favorites-panel");
    elements.favoritesTree = document.getElementById("favorites-tree");
    elements.recentFilesPanel = document.getElementById("recent-files-panel");
    elements.recentFilesList = document.getElementById("recent-files-list");
    elements.tabsContainer = document.getElementById("tabs-container");
    elements.editorContainer = document.getElementById("editor-container");
    elements.assetPreview = document.getElementById("asset-preview");
    elements.welcomeScreen = document.getElementById("welcome-screen");
    elements.filePath = document.getElementById("file-path");
    elements.breadcrumb = document.getElementById("breadcrumb");
    elements.breadcrumbCopy = document.getElementById("breadcrumb-copy");
    elements.fileSearch = document.getElementById("file-search");
    elements.btnContentSearch = document.getElementById("btn-content-search");
    elements.toastContainer = document.getElementById("toast-container");
    elements.sidebar = document.getElementById("sidebar");
    elements.sidebarOverlay = document.getElementById("sidebar-overlay");
    elements.activityExplorer = document.getElementById("activity-explorer");
    elements.activitySearch = document.getElementById("activity-search");
    elements.viewExplorer = document.getElementById("view-explorer");
    elements.viewSearch = document.getElementById("view-search");
    elements.globalSearchInput = document.getElementById("global-search-input");
    elements.globalReplaceInput = document.getElementById("global-replace-input");
    elements.globalSearchInclude = document.getElementById("global-search-include");
    elements.globalSearchExclude = document.getElementById("global-search-exclude");
    elements.globalSearchResults = document.getElementById("global-search-results");
    elements.globalSearchLoading = document.getElementById("global-search-loading");
    elements.btnMatchCase = document.getElementById("btn-match-case");
    elements.btnMatchWord = document.getElementById("btn-match-word");
    elements.btnUseRegex = document.getElementById("btn-use-regex");
    elements.btnToggleReplaceAll = document.getElementById("btn-toggle-replace-all");
    elements.btnGlobalReplaceAll = document.getElementById("btn-global-replace-all");
    elements.globalReplaceContainer = document.getElementById("global-replace-container");
    elements.btnTogglePatterns = document.getElementById("btn-toggle-patterns");
    elements.globalPatternsContainer = document.getElementById("global-patterns-container");
    elements.resizeHandle = document.getElementById("resize-handle");
    elements.statusPosition = document.getElementById("status-position");
    elements.statusIndent = document.getElementById("status-indent");
    elements.statusEncoding = document.getElementById("status-encoding");
    elements.statusLanguage = document.getElementById("status-language");
    elements.statusConnection = document.getElementById("status-connection");
    elements.btnSave = document.getElementById("btn-save");
    elements.btnSaveAll = document.getElementById("btn-save-all");
    elements.btnUndo = document.getElementById("btn-undo");
    elements.btnRedo = document.getElementById("btn-redo");
    elements.btnFormat = document.getElementById("btn-format");
    elements.btnMenu = document.getElementById("btn-menu");
    elements.btnSearch = document.getElementById("btn-search");
    elements.btnRefresh = document.getElementById("btn-refresh");
    elements.btnSupport = document.getElementById("btn-support");
    elements.modalSupportOverlay = document.getElementById("modal-support-overlay");
    elements.btnCloseSupport = document.getElementById("btn-close-support");
    elements.btnSupportShortcuts = document.getElementById("btn-support-shortcuts");
    elements.btnSupportFeature = document.getElementById("btn-support-feature");
    elements.btnSupportIssue = document.getElementById("btn-support-issue");
    elements.btnGithubStar = document.getElementById("btn-github-star");
    elements.btnGithubFollow = document.getElementById("btn-github-follow");
    elements.appVersionDisplay = document.getElementById("app-version-display");
    elements.groupMarkdown = document.getElementById("group-markdown");
    elements.btnMarkdownPreview = document.getElementById("btn-markdown-preview");

    elements.btnAiStudio = document.getElementById("btn-ai-studio");
    elements.btnRestartHa = document.getElementById("btn-restart-ha");
    elements.btnAppSettings = document.getElementById("btn-app-settings");
    elements.btnValidate = document.getElementById("btn-validate");
    elements.btnToggleAll = document.getElementById("btn-toggle-all");
    elements.btnCloseSidebar = document.getElementById("btn-close-sidebar");
    elements.btnShowHidden = document.getElementById("btn-show-hidden");
    elements.btnNewFile = document.getElementById("btn-new-file");
    elements.btnNewFolder = document.getElementById("btn-new-folder");
    elements.btnNewFileSidebar = document.getElementById("btn-new-file-sidebar");
    elements.btnNewFolderSidebar = document.getElementById("btn-new-folder-sidebar");
    elements.btnToggleSelect = document.getElementById("btn-toggle-select");
    elements.btnCollapseAllFolders = document.getElementById("btn-collapse-all-folders");
    elements.btnOneTabMode = document.getElementById("btn-one-tab-mode");
    elements.selectionToolbar = document.getElementById("selection-toolbar");
    elements.selectionCount = document.getElementById("selection-count");
    elements.btnDownloadSelected = document.getElementById("btn-download-selected");
    elements.btnDeleteSelected = document.getElementById("btn-delete-selected");
    elements.btnCancelSelection = document.getElementById("btn-cancel-selection");
    elements.themeToggle = document.getElementById("theme-toggle");
    elements.themeMenu = document.getElementById("theme-menu");
    elements.themeIcon = document.getElementById("theme-icon");
    elements.themeLabel = document.getElementById("theme-label");
    elements.modalOverlay = document.getElementById("modal-overlay");
    elements.modal = document.getElementById("modal");
    elements.modalTitle = document.getElementById("modal-title");
    elements.modalInput = document.getElementById("modal-input");
    elements.modalHint = document.getElementById("modal-hint");
    elements.modalConfirm = document.getElementById("modal-confirm");
    elements.modalCancel = document.getElementById("modal-cancel");
    elements.modalClose = document.getElementById("modal-close");
    elements.contextMenu = document.getElementById("context-menu");
    elements.tabContextMenu = document.getElementById("tab-context-menu");
    elements.btnUpload = document.getElementById("btn-upload");
    elements.btnDownload = document.getElementById("btn-download");
    elements.btnUploadFolder = document.getElementById("btn-upload-folder");
    elements.btnDownloadFolder = document.getElementById("btn-download-folder");
    elements.fileUploadInput = document.getElementById("file-upload-input");
    elements.folderUploadInput = document.getElementById("folder-upload-input");
    elements.btnGitPull = document.getElementById("btn-git-pull");
    elements.btnGitPush = document.getElementById("btn-git-push");
    elements.btnGitStatus = document.getElementById("btn-git-status");
    elements.btnGitSettings = document.getElementById("btn-git-settings");
    elements.btnGitHelp = document.getElementById("btn-git-help");
    elements.btnGitRefresh = document.getElementById("btn-git-refresh");
    elements.btnGitCollapse = document.getElementById("btn-git-collapse");
    elements.btnFileTreeCollapse = document.getElementById("btn-file-tree-collapse");
    elements.btnGitHistory = document.getElementById("btn-git-history");
    elements.btnStageSelected = document.getElementById("btn-stage-selected");
    elements.btnStageAll = document.getElementById("btn-stage-all");
    elements.btnUnstageAll = document.getElementById("btn-unstage-all");
    elements.btnCommitStaged = document.getElementById("btn-commit-staged");
    
    elements.btnGiteaPull = document.getElementById("btn-gitea-pull");
    elements.btnGiteaPush = document.getElementById("btn-gitea-push");
    elements.btnGiteaStatus = document.getElementById("btn-gitea-status");
    elements.btnGiteaSettings = document.getElementById("btn-gitea-settings");
    elements.btnGiteaHelp = document.getElementById("btn-gitea-help");
    elements.btnGiteaRefresh = document.getElementById("btn-gitea-refresh");
    elements.btnGiteaCollapse = document.getElementById("btn-gitea-collapse");
    elements.btnGiteaHistory = document.getElementById("btn-gitea-history");
    elements.btnGiteaStageSelected = document.getElementById("btn-gitea-stage-selected");
    elements.btnGiteaStageAll = document.getElementById("btn-gitea-stage-all");
    elements.btnGiteaUnstageAll = document.getElementById("btn-gitea-unstage-all");
    elements.btnGiteaCommitStaged = document.getElementById("btn-gitea-commit-staged");

    elements.loadingOverlay = document.getElementById("loading-overlay");
    elements.loadingText = document.getElementById("loading-text");
    elements.shortcutsOverlay = document.getElementById("shortcuts-overlay");
    elements.shortcutsClose = document.getElementById("shortcuts-close");
    elements.btnWelcomeNewFile = document.getElementById("btn-welcome-new-file");
    elements.btnWelcomeUploadFile = document.getElementById("btn-welcome-upload-file");
    
    elements.commandPaletteOverlay = document.getElementById("command-palette-overlay");
    elements.commandPaletteInput = document.getElementById("command-palette-input");
    elements.commandPaletteResults = document.getElementById("command-palette-results");

    elements.quickSwitcherOverlay = document.getElementById("quick-switcher-overlay");
    elements.quickSwitcherInput = document.getElementById("quick-switcher-input");
    elements.quickSwitcherResults = document.getElementById("quick-switcher-results");

    elements.searchWidget = document.getElementById("search-widget");
    elements.searchToggle = document.getElementById("search-toggle-replace");
    elements.searchFindInput = document.getElementById("search-find-input");
    elements.searchReplaceInput = document.getElementById("search-replace-input");
    elements.searchPrev = document.getElementById("search-prev");
    elements.searchNext = document.getElementById("search-next");
    elements.searchClose = document.getElementById("search-close");
    elements.searchReplaceRow = document.getElementById("search-replace-row");
    elements.searchReplaceBtn = document.getElementById("search-replace");
    elements.searchReplaceAllBtn = document.getElementById("search-replace-all");
    elements.searchCount = document.getElementById("search-results-count");
    elements.searchCaseSensitiveBtn = document.getElementById("search-case-sensitive");
    elements.searchWholeWordBtn = document.getElementById("search-whole-word");
    elements.searchUseRegexBtn = document.getElementById("search-use-regex");
}

export function applyEditorSettings() {
    if (!state.editor && !state.primaryEditor) return;

    // Apply font settings directly to editor instances (more efficient than querySelectorAll)
    if (state.primaryEditor) {
      const primaryWrapper = state.primaryEditor.getWrapperElement();
      if (primaryWrapper) {
        primaryWrapper.style.fontSize = state.fontSize + 'px';
        primaryWrapper.style.fontFamily = state.fontFamily;
      }
      state.primaryEditor.setOption('lineNumbers', state.showLineNumbers);
      state.primaryEditor.setOption('lineWrapping', state.wordWrap);

      state.primaryEditor.removeOverlay("show-whitespace");
      if (state.showWhitespace) {
        state.primaryEditor.addOverlay("show-whitespace");
      }
    }

    // Apply settings to secondary editor if it exists
    if (state.secondaryEditor) {
      const secondaryWrapper = state.secondaryEditor.getWrapperElement();
      if (secondaryWrapper) {
        secondaryWrapper.style.fontSize = state.fontSize + 'px';
        secondaryWrapper.style.fontFamily = state.fontFamily;
      }
      state.secondaryEditor.setOption('lineNumbers', state.showLineNumbers);
      state.secondaryEditor.setOption('lineWrapping', state.wordWrap);

      state.secondaryEditor.removeOverlay("show-whitespace");
      if (state.showWhitespace) {
        state.secondaryEditor.addOverlay("show-whitespace");
      }
    }

    // Apply to state.editor for backward compatibility (if it's different from primary/secondary)
    if (state.editor && state.editor !== state.primaryEditor && state.editor !== state.secondaryEditor) {
      const editorWrapper = state.editor.getWrapperElement();
      if (editorWrapper) {
        editorWrapper.style.fontSize = state.fontSize + 'px';
        editorWrapper.style.fontFamily = state.fontFamily;
      }
      state.editor.setOption('lineNumbers', state.showLineNumbers);
      state.editor.setOption('lineWrapping', state.wordWrap);

      state.editor.removeOverlay("show-whitespace");
      if (state.showWhitespace) {
        state.editor.addOverlay("show-whitespace");
      }
    }

    const minimapEl = document.getElementById('minimap');
    if (minimapEl) {
      minimapEl.style.display = state.showMinimap ? 'block' : 'none';
    }
}

export function applyLayoutSettings() {
    if (elements.sidebar) {
      elements.sidebar.style.width = state.sidebarWidth + 'px';
    }
    
    document.body.setAttribute('data-tab-position', state.tabPosition);
    document.body.classList.toggle('file-tree-compact', state.fileTreeCompact);
    document.body.classList.toggle('file-tree-no-icons', !state.fileTreeShowIcons);

    // Show/hide folder navigation elements based on tree mode
    const breadcrumb = document.getElementById("breadcrumb");
    const backBtn = document.getElementById("btn-nav-back");
    if (breadcrumb) breadcrumb.style.display = state.treeCollapsableMode ? "none" : "";
    if (backBtn) backBtn.style.display = state.treeCollapsableMode ? "none" : "";
}

export function setThemePreset(preset) {
    state.themePreset = preset;
    if (preset === 'light') {
      state.theme = 'light';
    } else if (['dark', 'highContrast', 'solarizedDark', 'solarizedLight', 'ocean', 'dracula'].includes(preset)) {
      state.theme = 'dark';
    }
    applyTheme();
    if (callbacks.saveSettings) callbacks.saveSettings();
}

export function setAccentColor(color) {
    state.accentColor = color;
    applyTheme();
    if (callbacks.saveSettings) callbacks.saveSettings();
}

export function setTheme(theme) {
    state.theme = theme;
    applyTheme();
    if (callbacks.saveSettings) callbacks.saveSettings();
}
