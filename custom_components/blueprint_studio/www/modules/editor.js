/**
 * Editor management module for Blueprint Studio
 */
import { state, elements } from './state.js';
import { THEME_PRESETS, HA_SCHEMA } from './constants.js';
import { getEffectiveTheme } from './ui.js';

// Callbacks registered from main.js
let callbacks = {
    saveCurrentFile: null,
    showCommandPalette: null,
    openSearchWidget: null,
    validateYaml: null,
    saveSettings: null,
    updateStatusBar: null
};

export function registerEditorCallbacks(cb) {
    callbacks = { ...callbacks, ...cb };
}

export function getEditorMode(path) {
    if (!path) return null;
    const ext = path.split(".").pop().toLowerCase();
    if (ext === "yaml" || ext === "yml") return "ha-yaml";
    if (ext === "py") return "python";
    if (ext === "js") return "javascript";
    if (ext === "json") return "javascript"; // JSON uses JS mode in CodeMirror
    if (ext === "css") return "css";
    if (ext === "html") return "htmlmixed";
    if (ext === "md") return "markdown";
    if (ext === "sh") return "shell";
    if (ext === "jinja" || ext === "jinja2" || ext === "j2") return "jinja2";
    return null;
}

export function createEditor() {
    const wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    wrapper.id = "codemirror-wrapper";
    elements.editorContainer.appendChild(wrapper);

    const preset = THEME_PRESETS[state.themePreset] || THEME_PRESETS.dark;
    const cmTheme = preset.colors.cmTheme;

    state.editor = CodeMirror(wrapper, {
      value: "",
      mode: null,
      theme: cmTheme,
      lineNumbers: state.showLineNumbers,
      lineWrapping: state.wordWrap,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      foldGutter: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      gutters: state.showLineNumbers ? ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"] : ["CodeMirror-foldgutter", "CodeMirror-lint-markers"],
      extraKeys: {
        "Ctrl-S": () => callbacks.saveCurrentFile(),
        "Cmd-S": () => callbacks.saveCurrentFile(),
        "Ctrl-K": () => callbacks.showCommandPalette(),
        "Cmd-K": () => callbacks.showCommandPalette(),
        // ... more keys ...
      }
    });

    state.editor.on("change", handleEditorChange);
    state.editor.on("cursorActivity", () => {
        if (callbacks.updateStatusBar) callbacks.updateStatusBar();
    });
}

function handleEditorChange() {
    if (!state.activeTab || !state.editor) return;
    const currentContent = state.editor.getValue();
    if (state.activeTab.content !== currentContent) {
      state.activeTab.content = currentContent;
      state.activeTab.modified = true;
      // renderTabs(); // We'll need to call this
    }
}

export function applyEditorSettings() {
    if (!state.editor) return;
    const editorEl = document.querySelector('.CodeMirror');
    if (editorEl) {
      editorEl.style.fontSize = state.fontSize + 'px';
      editorEl.style.fontFamily = state.fontFamily;
    }
    state.editor.setOption('lineNumbers', state.showLineNumbers);
    state.editor.setOption('lineWrapping', state.wordWrap);
}
