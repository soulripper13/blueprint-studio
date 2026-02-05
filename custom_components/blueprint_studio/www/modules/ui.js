/**
 * UI and Theme management for Blueprint Studio
 */
import { state, elements } from './state.js';
import { THEME_PRESETS, ACCENT_COLORS } from './constants.js';
import { lightenColor } from './utils.js';

export function getEffectiveTheme() {
  if (state.theme === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return state.theme;
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

export function showModal({ title, message, inputPlaceholder, inputValue, confirmText, cancelText, danger, image }) {
    return new Promise((resolve) => {
        elements.modalTitle.textContent = title;
        elements.modalHint.textContent = "";
        
        if (image) {
            elements.modalBody.innerHTML = `<img src="${image}" style="max-width: 100%; height: auto; border-radius: 4px;">`;
        } else {
            elements.modalBody.innerHTML = message || "";
        }

        if (inputPlaceholder !== undefined) {
            elements.modalInput.style.display = "block";
            elements.modalInput.placeholder = inputPlaceholder;
            elements.modalInput.value = inputValue || "";
            setTimeout(() => elements.modalInput.focus(), 100);
        } else {
            elements.modalInput.style.display = "none";
        }

        elements.modalConfirm.textContent = confirmText || "Confirm";
        elements.modalConfirm.className = "modal-btn " + (danger ? "danger" : "primary");
        elements.modalCancel.textContent = cancelText || "Cancel";

        elements.modalOverlay.classList.add("visible");

        const handleConfirm = () => {
            const value = elements.modalInput.value;
            close();
            resolve(inputPlaceholder !== undefined ? value : true);
        };

        const handleCancel = () => {
            close();
            resolve(null);
        };

        const close = () => {
            elements.modalOverlay.classList.remove("visible");
            elements.modalConfirm.removeEventListener("click", handleConfirm);
            elements.modalCancel.removeEventListener("click", handleCancel);
            elements.modalClose.removeEventListener("click", handleCancel);
        };

        elements.modalConfirm.addEventListener("click", handleConfirm);
        elements.modalCancel.addEventListener("click", handleCancel);
        elements.modalClose.addEventListener("click", handleCancel);
    });
}
