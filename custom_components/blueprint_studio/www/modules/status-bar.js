/** STATUS-BAR.JS | Purpose: Displays editor status information in bottom bar (cursor position, */
import { state, elements } from './state.js';
import { getLanguageName } from './utils.js';
import { t } from './translations.js';
import { eventBus } from './event-bus.js';

/**
 * Shows tab size picker menu
 */
function showTabSizePicker(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();

  // Remove existing picker if any
  const existingPicker = document.querySelector('.tab-size-picker');
  if (existingPicker) {
    existingPicker.remove();
    return; // Toggle off if clicking again
  }

  // Create picker menu
  const picker = document.createElement('div');
  picker.className = 'tab-size-picker';
  picker.innerHTML = `
    <div class="picker-header">Select Indentation</div>
    <div class="picker-option" data-size="2">
      <span class="material-icons">${state.tabSize === 2 ? 'check' : ''}</span>
      <span>2 Spaces</span>
    </div>
    <div class="picker-option" data-size="4">
      <span class="material-icons">${state.tabSize === 4 ? 'check' : ''}</span>
      <span>4 Spaces</span>
    </div>
    <div class="picker-option" data-size="8">
      <span class="material-icons">${state.tabSize === 8 ? 'check' : ''}</span>
      <span>8 Spaces</span>
    </div>
    <div class="picker-divider"></div>
    <div class="picker-option picker-toggle" data-action="toggle-tabs">
      <span class="material-icons">${state.indentWithTabs ? 'check' : ''}</span>
      <span>Indent with Tabs</span>
    </div>
  `;

  // Position above status bar
  picker.style.position = 'fixed';
  picker.style.left = `${rect.left}px`;
  picker.style.bottom = `${window.innerHeight - rect.top + 5}px`;

  document.body.appendChild(picker);

  // Handle option clicks
  picker.querySelectorAll('.picker-option').forEach(option => {
    option.addEventListener('click', async (e) => {
      const size = option.getAttribute('data-size');
      const action = option.getAttribute('data-action');

      if (action === 'toggle-tabs') {
        // Toggle indent with tabs
        state.indentWithTabs = !state.indentWithTabs;
        if (state.primaryEditor) {
          state.primaryEditor.setOption("indentWithTabs", state.indentWithTabs);
          state.primaryEditor.setOption("indentUnit", state.indentWithTabs ? 1 : state.tabSize);
        }
        if (state.secondaryEditor) {
          state.secondaryEditor.setOption("indentWithTabs", state.indentWithTabs);
          state.secondaryEditor.setOption("indentUnit", state.indentWithTabs ? 1 : state.tabSize);
        }
        // Sync settings panel checkbox
        const toggle = document.getElementById("indent-with-tabs-toggle");
        if (toggle) toggle.checked = state.indentWithTabs;
      } else if (size) {
        // Change tab size
        state.tabSize = parseInt(size);
        if (state.primaryEditor) {
          state.primaryEditor.setOption("tabSize", state.tabSize);
          state.primaryEditor.setOption("indentUnit", state.indentWithTabs ? 1 : state.tabSize);
        }
        if (state.secondaryEditor) {
          state.secondaryEditor.setOption("tabSize", state.tabSize);
          state.secondaryEditor.setOption("indentUnit", state.indentWithTabs ? 1 : state.tabSize);
        }
        // Sync settings panel dropdown
        const select = document.getElementById("tab-size-select");
        if (select) select.value = state.tabSize;
      }

      // Save settings
      eventBus.emit('settings:save');

      // Update status bar
      updateStatusBar();

      // Show toast notification
      const message = action === 'toggle-tabs'
        ? `Indent with tabs: ${state.indentWithTabs ? 'ON' : 'OFF'}`
        : `Tab size set to ${state.tabSize} spaces`;
      eventBus.emit('ui:show-toast', { message, type: 'success' });

      // Remove picker
      picker.remove();
    });
  });

  // Close picker when clicking outside
  setTimeout(() => {
    const closePickerOnClickOutside = (e) => {
      if (!picker.contains(e.target) && e.target !== button) {
        picker.remove();
        document.removeEventListener('click', closePickerOnClickOutside);
      }
    };
    document.addEventListener('click', closePickerOnClickOutside);
  }, 0);
}

/**
 * Initialize status bar click events
 */
export function initStatusBarEvents() {
  if (elements.statusIndent) {
    // Make it look clickable
    elements.statusIndent.style.cursor = 'pointer';
    elements.statusIndent.title = 'Select Indentation';

    // Add click listener
    elements.statusIndent.addEventListener('click', showTabSizePicker);
  }
}

/**
 * Updates the status bar with current editor state
 * Shows cursor position, indent settings, encoding, and language
 */
export function updateStatusBar() {
  const tab = state.activeTab;

  if (tab && state.editor) {
    const cursor = state.editor.getCursor();
    if (elements.statusPosition) {
      elements.statusPosition.innerHTML = `<span>${t("status.position", {line: cursor.line + 1, col: cursor.ch + 1})}</span>`;
    }

    if (elements.statusIndent) {
      const tabSize = state.editor.getOption("tabSize") || 2;
      const indentWithTabs = state.editor.getOption("indentWithTabs");
      const label = indentWithTabs ? "Tabs" : "Spaces";
      elements.statusIndent.innerHTML = `<span>${t("status.indent", {size: tabSize}).replace("Spaces", label)}</span>`;
    }

    if (elements.statusEncoding) {
      elements.statusEncoding.innerHTML = `<span>UTF-8</span>`;
    }

    if (elements.statusLanguage) {
      elements.statusLanguage.innerHTML = `<span>${getLanguageName(tab.path)}</span>`;
    }
  } else {
    if (elements.statusPosition) {
      elements.statusPosition.innerHTML = "<span>Ln 1, Col 1</span>";
    }
    if (elements.statusIndent) {
      const label = state.indentWithTabs ? 'Tabs' : 'Spaces';
      const size = state.tabSize || 2;
      elements.statusIndent.innerHTML = `<span>${label}: ${size}</span>`;
    }
    if (elements.statusEncoding) {
      elements.statusEncoding.innerHTML = "<span>-</span>";
    }
    if (elements.statusLanguage) {
      elements.statusLanguage.innerHTML = "<span>-</span>";
    }
  }
}
