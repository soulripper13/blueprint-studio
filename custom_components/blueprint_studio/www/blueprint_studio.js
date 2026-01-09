/**
 * Blueprint Studio
 * A modern, feature-rich file editor for Home Assistant
 * https://github.com/katoaroosultan/blueprint-studio
 */

(function () {
  "use strict";

  // ============================================
  // Configuration
  // ============================================
  const API_BASE = "/api/blueprint_studio";
  const MOBILE_BREAKPOINT = 768;
  const STORAGE_KEY = "blueprint_studio_settings";

  // ============================================
  // Home Assistant Autocomplete Schema
  // ============================================
  const HA_SCHEMA = {
    // Core configuration keys
    configuration: [
      { text: "homeassistant:", type: "domain", description: "Core Home Assistant configuration" },
      { text: "automation:", type: "domain", description: "Automation configuration" },
      { text: "script:", type: "domain", description: "Script configuration" },
      { text: "scene:", type: "domain", description: "Scene configuration" },
      { text: "sensor:", type: "domain", description: "Sensor configuration" },
      { text: "binary_sensor:", type: "domain", description: "Binary sensor configuration" },
      { text: "template:", type: "domain", description: "Template entities" },
      { text: "input_boolean:", type: "domain", description: "Input boolean helper" },
      { text: "input_number:", type: "domain", description: "Input number helper" },
      { text: "input_text:", type: "domain", description: "Input text helper" },
      { text: "input_select:", type: "domain", description: "Input select helper" },
      { text: "input_datetime:", type: "domain", description: "Input datetime helper" },
      { text: "input_button:", type: "domain", description: "Input button helper" },
      { text: "counter:", type: "domain", description: "Counter helper" },
      { text: "timer:", type: "domain", description: "Timer helper" },
      { text: "group:", type: "domain", description: "Group configuration" },
      { text: "person:", type: "domain", description: "Person configuration" },
      { text: "zone:", type: "domain", description: "Zone configuration" },
      { text: "light:", type: "domain", description: "Light configuration" },
      { text: "switch:", type: "domain", description: "Switch configuration" },
      { text: "cover:", type: "domain", description: "Cover configuration" },
      { text: "climate:", type: "domain", description: "Climate configuration" },
      { text: "fan:", type: "domain", description: "Fan configuration" },
      { text: "lock:", type: "domain", description: "Lock configuration" },
      { text: "camera:", type: "domain", description: "Camera configuration" },
      { text: "media_player:", type: "domain", description: "Media player configuration" },
      { text: "notify:", type: "domain", description: "Notification configuration" },
      { text: "tts:", type: "domain", description: "Text-to-speech configuration" },
      { text: "mqtt:", type: "domain", description: "MQTT configuration" },
      { text: "http:", type: "domain", description: "HTTP configuration" },
      { text: "logger:", type: "domain", description: "Logger configuration" },
      { text: "recorder:", type: "domain", description: "Recorder configuration" },
      { text: "history:", type: "domain", description: "History configuration" },
      { text: "logbook:", type: "domain", description: "Logbook configuration" },
      { text: "frontend:", type: "domain", description: "Frontend configuration" },
      { text: "config:", type: "domain", description: "Configuration UI" },
      { text: "api:", type: "domain", description: "API configuration" },
      { text: "websocket_api:", type: "domain", description: "WebSocket API" },
      { text: "mobile_app:", type: "domain", description: "Mobile app integration" },
      { text: "shopping_list:", type: "domain", description: "Shopping list" },
      { text: "conversation:", type: "domain", description: "Conversation integration" },
      { text: "default_config:", type: "domain", description: "Default configuration" },
      { text: "system_health:", type: "domain", description: "System health monitoring" },
    ],

    // Common keys for automations
    automation: [
      { text: "alias:", type: "key", description: "Automation friendly name" },
      { text: "description:", type: "key", description: "Automation description" },
      { text: "id:", type: "key", description: "Unique automation ID" },
      { text: "mode:", type: "key", description: "Automation execution mode" },
      { text: "max:", type: "key", description: "Maximum concurrent runs" },
      { text: "max_exceeded:", type: "key", description: "Behavior when max exceeded" },
      { text: "trigger:", type: "key", description: "Automation triggers" },
      { text: "condition:", type: "key", description: "Automation conditions" },
      { text: "action:", type: "key", description: "Automation actions" },
    ],

    // Automation modes
    automation_modes: [
      { text: "single", type: "value", description: "Only one run at a time" },
      { text: "restart", type: "value", description: "Restart automation on new trigger" },
      { text: "queued", type: "value", description: "Queue runs" },
      { text: "parallel", type: "value", description: "Run in parallel" },
    ],

    // Trigger types
    triggers: [
      { text: "platform: state", type: "trigger", description: "State change trigger" },
      { text: "platform: numeric_state", type: "trigger", description: "Numeric state trigger" },
      { text: "platform: event", type: "trigger", description: "Event trigger" },
      { text: "platform: time", type: "trigger", description: "Time trigger" },
      { text: "platform: time_pattern", type: "trigger", description: "Time pattern trigger" },
      { text: "platform: mqtt", type: "trigger", description: "MQTT trigger" },
      { text: "platform: webhook", type: "trigger", description: "Webhook trigger" },
      { text: "platform: zone", type: "trigger", description: "Zone trigger" },
      { text: "platform: geo_location", type: "trigger", description: "Geo location trigger" },
      { text: "platform: homeassistant", type: "trigger", description: "Home Assistant event trigger" },
      { text: "platform: sun", type: "trigger", description: "Sun event trigger" },
      { text: "platform: tag", type: "trigger", description: "NFC tag trigger" },
      { text: "platform: template", type: "trigger", description: "Template trigger" },
      { text: "platform: calendar", type: "trigger", description: "Calendar trigger" },
      { text: "platform: conversation", type: "trigger", description: "Conversation trigger" },
    ],

    // Condition types
    conditions: [
      { text: "condition: state", type: "condition", description: "State condition" },
      { text: "condition: numeric_state", type: "condition", description: "Numeric state condition" },
      { text: "condition: template", type: "condition", description: "Template condition" },
      { text: "condition: time", type: "condition", description: "Time condition" },
      { text: "condition: zone", type: "condition", description: "Zone condition" },
      { text: "condition: sun", type: "condition", description: "Sun condition" },
      { text: "condition: and", type: "condition", description: "AND condition" },
      { text: "condition: or", type: "condition", description: "OR condition" },
      { text: "condition: not", type: "condition", description: "NOT condition" },
      { text: "condition: device", type: "condition", description: "Device condition" },
    ],

    // Common services
    services: [
      { text: "service: homeassistant.turn_on", type: "service", description: "Turn on entity" },
      { text: "service: homeassistant.turn_off", type: "service", description: "Turn off entity" },
      { text: "service: homeassistant.toggle", type: "service", description: "Toggle entity" },
      { text: "service: homeassistant.reload_config_entry", type: "service", description: "Reload config entry" },
      { text: "service: homeassistant.restart", type: "service", description: "Restart Home Assistant" },
      { text: "service: homeassistant.stop", type: "service", description: "Stop Home Assistant" },
      { text: "service: homeassistant.update_entity", type: "service", description: "Update entity" },
      { text: "service: light.turn_on", type: "service", description: "Turn on light" },
      { text: "service: light.turn_off", type: "service", description: "Turn off light" },
      { text: "service: light.toggle", type: "service", description: "Toggle light" },
      { text: "service: switch.turn_on", type: "service", description: "Turn on switch" },
      { text: "service: switch.turn_off", type: "service", description: "Turn off switch" },
      { text: "service: switch.toggle", type: "service", description: "Toggle switch" },
      { text: "service: cover.open_cover", type: "service", description: "Open cover" },
      { text: "service: cover.close_cover", type: "service", description: "Close cover" },
      { text: "service: cover.stop_cover", type: "service", description: "Stop cover" },
      { text: "service: climate.set_temperature", type: "service", description: "Set climate temperature" },
      { text: "service: climate.set_hvac_mode", type: "service", description: "Set HVAC mode" },
      { text: "service: notify.notify", type: "service", description: "Send notification" },
      { text: "service: script.turn_on", type: "service", description: "Run script" },
      { text: "service: automation.turn_on", type: "service", description: "Enable automation" },
      { text: "service: automation.turn_off", type: "service", description: "Disable automation" },
      { text: "service: automation.trigger", type: "service", description: "Trigger automation" },
      { text: "service: automation.reload", type: "service", description: "Reload automations" },
      { text: "service: scene.turn_on", type: "service", description: "Activate scene" },
      { text: "service: input_boolean.turn_on", type: "service", description: "Turn on input boolean" },
      { text: "service: input_boolean.turn_off", type: "service", description: "Turn off input boolean" },
      { text: "service: input_boolean.toggle", type: "service", description: "Toggle input boolean" },
      { text: "service: input_number.set_value", type: "service", description: "Set input number value" },
      { text: "service: input_text.set_value", type: "service", description: "Set input text value" },
      { text: "service: input_select.select_option", type: "service", description: "Select input option" },
      { text: "service: input_datetime.set_datetime", type: "service", description: "Set datetime" },
      { text: "service: input_button.press", type: "service", description: "Press input button" },
      { text: "service: counter.increment", type: "service", description: "Increment counter" },
      { text: "service: counter.decrement", type: "service", description: "Decrement counter" },
      { text: "service: counter.reset", type: "service", description: "Reset counter" },
      { text: "service: timer.start", type: "service", description: "Start timer" },
      { text: "service: timer.pause", type: "service", description: "Pause timer" },
      { text: "service: timer.cancel", type: "service", description: "Cancel timer" },
      { text: "service: persistent_notification.create", type: "service", description: "Create notification" },
      { text: "service: persistent_notification.dismiss", type: "service", description: "Dismiss notification" },
      { text: "service: tts.speak", type: "service", description: "Speak text" },
      { text: "service: media_player.media_play", type: "service", description: "Play media" },
      { text: "service: media_player.media_pause", type: "service", description: "Pause media" },
      { text: "service: media_player.media_stop", type: "service", description: "Stop media" },
      { text: "service: media_player.volume_up", type: "service", description: "Increase volume" },
      { text: "service: media_player.volume_down", type: "service", description: "Decrease volume" },
      { text: "service: media_player.volume_set", type: "service", description: "Set volume" },
    ],

    // Common action keys
    actionKeys: [
      { text: "entity_id:", type: "key", description: "Target entity ID" },
      { text: "device_id:", type: "key", description: "Target device ID" },
      { text: "area_id:", type: "key", description: "Target area ID" },
      { text: "data:", type: "key", description: "Service data" },
      { text: "target:", type: "key", description: "Service target" },
      { text: "delay:", type: "key", description: "Delay action" },
      { text: "wait_template:", type: "key", description: "Wait for template" },
      { text: "wait_for_trigger:", type: "key", description: "Wait for trigger" },
      { text: "choose:", type: "key", description: "Choose action based on condition" },
      { text: "repeat:", type: "key", description: "Repeat action" },
      { text: "if:", type: "key", description: "Conditional action" },
      { text: "then:", type: "key", description: "If condition is true" },
      { text: "else:", type: "key", description: "If condition is false" },
      { text: "parallel:", type: "key", description: "Run actions in parallel" },
      { text: "sequence:", type: "key", description: "Sequence of actions" },
    ],

    // Common config keys
    commonKeys: [
      { text: "name:", type: "key", description: "Entity name" },
      { text: "unique_id:", type: "key", description: "Unique entity ID" },
      { text: "icon:", type: "key", description: "Entity icon (mdi:icon-name)" },
      { text: "device_class:", type: "key", description: "Device class" },
      { text: "unit_of_measurement:", type: "key", description: "Unit of measurement" },
      { text: "state:", type: "key", description: "Entity state" },
      { text: "state_topic:", type: "key", description: "MQTT state topic" },
      { text: "command_topic:", type: "key", description: "MQTT command topic" },
      { text: "availability_topic:", type: "key", description: "MQTT availability topic" },
      { text: "payload_on:", type: "key", description: "Payload for ON state" },
      { text: "payload_off:", type: "key", description: "Payload for OFF state" },
      { text: "payload_available:", type: "key", description: "Payload for available" },
      { text: "payload_not_available:", type: "key", description: "Payload for not available" },
      { text: "value_template:", type: "key", description: "Template for value" },
      { text: "availability_template:", type: "key", description: "Template for availability" },
      { text: "attributes:", type: "key", description: "Entity attributes" },
      { text: "friendly_name:", type: "key", description: "Friendly entity name" },
    ],

    // YAML tags
    yamlTags: [
      { text: "!include ", type: "tag", description: "Include another YAML file (no space after !)" },
      { text: "!include_dir_list ", type: "tag", description: "Include directory as list (no space after !)" },
      { text: "!include_dir_named ", type: "tag", description: "Include directory as named entries (no space after !)" },
      { text: "!include_dir_merge_list ", type: "tag", description: "Include and merge directory as list (no space after !)" },
      { text: "!include_dir_merge_named ", type: "tag", description: "Include and merge directory as named (no space after !)" },
      { text: "!secret ", type: "tag", description: "Reference secret from secrets.yaml (no space after !)" },
      { text: "!env_var ", type: "tag", description: "Use environment variable (no space after !)" },
      { text: "!input ", type: "tag", description: "Blueprint input (no space after !)" },
    ],

    // Sensor platforms
    sensorPlatforms: [
      { text: "platform: template", type: "platform", description: "Template sensor" },
      { text: "platform: mqtt", type: "platform", description: "MQTT sensor" },
      { text: "platform: statistics", type: "platform", description: "Statistics sensor" },
      { text: "platform: time_date", type: "platform", description: "Time and date sensor" },
      { text: "platform: rest", type: "platform", description: "REST sensor" },
      { text: "platform: command_line", type: "platform", description: "Command line sensor" },
      { text: "platform: sql", type: "platform", description: "SQL sensor" },
      { text: "platform: file", type: "platform", description: "File sensor" },
      { text: "platform: folder", type: "platform", description: "Folder sensor" },
      { text: "platform: history_stats", type: "platform", description: "History statistics sensor" },
      { text: "platform: trend", type: "platform", description: "Trend sensor" },
      { text: "platform: min_max", type: "platform", description: "Min/Max sensor" },
      { text: "platform: filter", type: "platform", description: "Filter sensor" },
    ],
  };

  // ============================================
  // Home Assistant Autocomplete Function
  // ============================================

  function homeAssistantHint(editor, options) {
    const cursor = editor.getCursor();
    const currentLine = editor.getLine(cursor.line);
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const currentWord = currentLine.slice(start, end);

    // Determine context from previous lines and indentation
    const context = getYamlContext(editor, cursor.line);

    let suggestions = [];

    // Check if we're at the beginning of a line (after indentation)
    const trimmedLine = currentLine.trimStart();
    const isLineStart = currentLine.substring(0, cursor.ch).trim() === currentWord.trim();

    // Check for YAML tags (!include, !secret, etc.)
    if (currentWord.startsWith('!') || (isLineStart && currentWord === '!')) {
      suggestions = HA_SCHEMA.yamlTags.map(item => ({
        text: item.text,
        displayText: item.text,
        className: 'ha-hint-tag',
        render: (elem, self, data) => {
          elem.innerHTML = `
            <span>${data.text}</span>
            <span class="ha-hint-type">${data.type}</span>
          `;
        },
        hint: (cm, self, data) => {
          cm.replaceRange(data.text, { line: cursor.line, ch: start }, { line: cursor.line, ch: end });
        },
        ...item
      }));
    }
    // Top-level configuration keys
    else if (context.indent === 0 && isLineStart) {
      suggestions = HA_SCHEMA.configuration.map(item => ({
        text: item.text,
        displayText: item.text,
        className: 'ha-hint-domain',
        render: (elem, self, data) => {
          elem.innerHTML = `
            <span>${data.text}</span>
            <span class="ha-hint-description">${data.description}</span>
          `;
        },
        hint: (cm, self, data) => {
          cm.replaceRange(data.text, { line: cursor.line, ch: start }, { line: cursor.line, ch: end });
        },
        ...item
      }));
    }
    // Inside automation section
    else if (context.section === 'automation') {
      if (context.inTrigger) {
        suggestions = HA_SCHEMA.triggers;
      } else if (context.inCondition) {
        suggestions = HA_SCHEMA.conditions;
      } else if (context.inAction) {
        suggestions = [
          ...HA_SCHEMA.services,
          ...HA_SCHEMA.actionKeys,
        ];
      } else {
        suggestions = HA_SCHEMA.automation;
      }

      suggestions = suggestions.map(item => ({
        text: item.text,
        displayText: item.text,
        className: `ha-hint-${item.type}`,
        render: (elem, self, data) => {
          elem.innerHTML = `
            <span>${data.text}</span>
            <span class="ha-hint-type">${data.type}</span>
            ${data.description ? `<span class="ha-hint-description">${data.description}</span>` : ''}
          `;
        },
        hint: (cm, self, data) => {
          cm.replaceRange(data.text, { line: cursor.line, ch: start }, { line: cursor.line, ch: end });
        },
        ...item
      }));
    }
    // Inside sensor or binary_sensor section
    else if (context.section === 'sensor' || context.section === 'binary_sensor') {
      if (context.inPlatform) {
        suggestions = HA_SCHEMA.sensorPlatforms;
      } else {
        suggestions = HA_SCHEMA.commonKeys;
      }

      suggestions = suggestions.map(item => ({
        text: item.text,
        displayText: item.text,
        className: `ha-hint-${item.type}`,
        render: (elem, self, data) => {
          elem.innerHTML = `
            <span>${data.text}</span>
            ${data.description ? `<span class="ha-hint-description">${data.description}</span>` : ''}
          `;
        },
        hint: (cm, self, data) => {
          cm.replaceRange(data.text, { line: cursor.line, ch: start }, { line: cursor.line, ch: end });
        },
        ...item
      }));
    }
    // Generic keys for other sections
    else {
      suggestions = [
        ...HA_SCHEMA.commonKeys,
        ...HA_SCHEMA.configuration,
      ].map(item => ({
        text: item.text,
        displayText: item.text,
        className: `ha-hint-${item.type}`,
        render: (elem, self, data) => {
          elem.innerHTML = `
            <span>${data.text}</span>
            ${data.description ? `<span class="ha-hint-description">${data.description}</span>` : ''}
          `;
        },
        hint: (cm, self, data) => {
          cm.replaceRange(data.text, { line: cursor.line, ch: start }, { line: cursor.line, ch: end });
        },
        ...item
      }));
    }

    // Filter suggestions based on current word
    suggestions = suggestions.filter(item =>
      item.text.toLowerCase().includes(currentWord.toLowerCase())
    );

    // Sort suggestions by relevance
    suggestions.sort((a, b) => {
      const aStarts = a.text.toLowerCase().startsWith(currentWord.toLowerCase());
      const bStarts = b.text.toLowerCase().startsWith(currentWord.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.text.localeCompare(b.text);
    });

    return {
      list: suggestions.slice(0, 20), // Limit to 20 suggestions
      from: { line: cursor.line, ch: start },
      to: { line: cursor.line, ch: end }
    };
  }

  function getYamlContext(editor, lineNumber) {
    let context = {
      indent: 0,
      section: null,
      inTrigger: false,
      inCondition: false,
      inAction: false,
      inPlatform: false,
    };

    const currentLine = editor.getLine(lineNumber);
    const match = currentLine.match(/^(\s*)/);
    context.indent = match ? match[1].length : 0;

    // Look back to find context
    for (let i = lineNumber - 1; i >= 0; i--) {
      const line = editor.getLine(i);
      if (!line.trim()) continue;

      const lineIndent = line.match(/^(\s*)/)[1].length;

      // Only consider lines with less or equal indentation
      if (lineIndent < context.indent) {
        // Check for section markers
        if (line.includes('automation:')) {
          context.section = 'automation';
        } else if (line.includes('sensor:')) {
          context.section = 'sensor';
        } else if (line.includes('binary_sensor:')) {
          context.section = 'binary_sensor';
        } else if (line.includes('script:')) {
          context.section = 'script';
        }

        // Check for subsections
        if (line.includes('trigger:')) {
          context.inTrigger = true;
        } else if (line.includes('condition:')) {
          context.inCondition = true;
        } else if (line.includes('action:')) {
          context.inAction = true;
        } else if (line.includes('platform:')) {
          context.inPlatform = true;
        }

        // Stop at a much lower indentation level (likely a new section)
        if (lineIndent === 0 && context.indent > 0) {
          break;
        }
      }
    }

    return context;
  }

  // ============================================
  // Enhanced YAML Mode for Home Assistant
  // ============================================

  function defineHAYamlMode() {
    try {
      CodeMirror.defineMode("ha-yaml", function(config) {
        const yamlMode = CodeMirror.getMode(config, "yaml");

        return CodeMirror.overlayMode(yamlMode, {
          token: function(stream, state) {
            // Highlight Home Assistant YAML tags
            if (stream.match(/!include(_dir_(list|named|merge_list|merge_named))?/)) {
              return "tag ha-include-tag";
            }
            if (stream.match(/!secret/)) {
              return "tag ha-secret-tag";
            }
            if (stream.match(/!env_var/)) {
              return "tag ha-env-tag";
            }
            if (stream.match(/!input/)) {
              return "tag ha-input-tag";
            }

            // Highlight common HA domain keywords at start of line
            if (stream.sol()) {
              if (stream.match(/\s*(automation|script|sensor|binary_sensor|template|input_boolean|input_number|input_select|input_text|input_datetime|light|switch|climate|cover|scene|group|zone|person):/)) {
                return "keyword ha-domain";
              }
            }

            // Highlight trigger/condition/action keywords
            if (stream.match(/\s*(trigger|condition|action|service|entity_id|platform|device_id|area_id):/)) {
              return "keyword ha-key";
            }

            stream.next();
            return null;
          }
        });
      });
      console.log("HA YAML mode defined successfully");
    } catch (error) {
      console.error("Error defining HA YAML mode:", error);
    }
  }

  // Define the HA YAML mode on load
  defineHAYamlMode();

  // ============================================
  // State Management
  // ============================================
  const state = {
    files: [],
    fileTree: {},
    openTabs: [],
    activeTab: null,
    expandedFolders: new Set(),
    searchQuery: "",
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    sidebarVisible: window.innerWidth > MOBILE_BREAKPOINT,
    theme: "dark",
    showHidden: false,  // Show hidden files/folders
    contextMenuTarget: null,
    currentFolderPath: "",
    editor: null,  // Single shared editor instance
  };

  // ============================================
  // DOM Elements
  // ============================================
  const elements = {};

  function initElements() {
    elements.fileTree = document.getElementById("file-tree");
    elements.tabsContainer = document.getElementById("tabs-container");
    elements.editorContainer = document.getElementById("editor-container");
    elements.welcomeScreen = document.getElementById("welcome-screen");
    elements.filePath = document.getElementById("file-path");
    elements.fileSearch = document.getElementById("file-search");
    elements.toastContainer = document.getElementById("toast-container");
    elements.sidebar = document.getElementById("sidebar");
    elements.sidebarOverlay = document.getElementById("sidebar-overlay");
    elements.resizeHandle = document.getElementById("resize-handle");
    elements.statusPosition = document.getElementById("status-position");
    elements.statusLanguage = document.getElementById("status-language");
    elements.statusConnection = document.getElementById("status-connection");
    elements.btnSave = document.getElementById("btn-save");
    elements.btnSaveAll = document.getElementById("btn-save-all");
    elements.btnUndo = document.getElementById("btn-undo");
    elements.btnRedo = document.getElementById("btn-redo");
    elements.btnMenu = document.getElementById("btn-menu");
    elements.btnSearch = document.getElementById("btn-search");
    elements.btnRefresh = document.getElementById("btn-refresh");
    elements.btnValidate = document.getElementById("btn-validate");
    elements.btnCollapseAll = document.getElementById("btn-collapse-all");
    elements.btnExpandAll = document.getElementById("btn-expand-all");
    elements.btnCloseSidebar = document.getElementById("btn-close-sidebar");
    elements.btnShowHidden = document.getElementById("btn-show-hidden");
    elements.btnNewFile = document.getElementById("btn-new-file");
    elements.btnNewFolder = document.getElementById("btn-new-folder");
    elements.btnNewFileSidebar = document.getElementById("btn-new-file-sidebar");
    elements.btnNewFolderSidebar = document.getElementById("btn-new-folder-sidebar");
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
    elements.btnUpload = document.getElementById("btn-upload");
    elements.btnDownload = document.getElementById("btn-download");
    elements.btnUploadFolder = document.getElementById("btn-upload-folder");
    elements.btnDownloadFolder = document.getElementById("btn-download-folder");
    elements.fileUploadInput = document.getElementById("file-upload-input");
    elements.folderUploadInput = document.getElementById("folder-upload-input");
  }

  // ============================================
  // Utility Functions
  // ============================================

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const iconMap = {
      yaml: { icon: "description", class: "yaml" },
      yml: { icon: "description", class: "yaml" },
      json: { icon: "data_object", class: "json" },
      py: { icon: "code", class: "python" },
      js: { icon: "javascript", class: "js" },
      css: { icon: "style", class: "default" },
      html: { icon: "html", class: "default" },
      md: { icon: "article", class: "default" },
      txt: { icon: "text_snippet", class: "default" },
      log: { icon: "receipt_long", class: "default" },
      sh: { icon: "terminal", class: "default" },
      conf: { icon: "settings", class: "default" },
      cfg: { icon: "settings", class: "default" },
      ini: { icon: "settings", class: "default" },
    };
    return iconMap[ext] || { icon: "insert_drive_file", class: "default" };
  }

  function getEditorMode(filename) {
    const ext = filename.split(".").pop().toLowerCase();

    // Toggle for custom HA YAML mode - set to false if experiencing issues
    const USE_CUSTOM_HA_YAML = true;  // Set to true to enable custom HA YAML mode with enhanced syntax
    const yamlMode = USE_CUSTOM_HA_YAML ? "ha-yaml" : "yaml";

    const modeMap = {
      yaml: yamlMode,
      yml: yamlMode,
      json: { name: "javascript", json: true },
      py: "python",
      js: "javascript",
      css: "css",
      html: "htmlmixed",
      md: "markdown",
      sh: "shell",
      txt: null,
      log: null,
      conf: yamlMode,
      cfg: yamlMode,
      ini: "yaml",
    };
    return modeMap[ext] || null;
  }

  function getLanguageName(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const nameMap = {
      yaml: "YAML",
      yml: "YAML",
      json: "JSON",
      py: "Python",
      js: "JavaScript",
      css: "CSS",
      html: "HTML",
      md: "Markdown",
      sh: "Shell",
      txt: "Plain Text",
      log: "Log",
      conf: "Config",
      cfg: "Config",
      ini: "INI",
    };
    return nameMap[ext] || "Plain Text";
  }

  function buildFileTree(files) {
    const tree = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          if (!current._files) current._files = [];
          current._files.push({ name: part, path: file.path });
        } else {
          if (!current[part]) {
            current[part] = { _path: parts.slice(0, index + 1).join("/") };
          }
          current = current[part];
        }
      });
    });

    return tree;
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = {
      success: "check_circle",
      error: "error",
      warning: "warning",
    };

    toast.innerHTML = `
      <span class="material-icons">${iconMap[type]}</span>
      <span class="toast-message">${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function setConnectionStatus(connected) {
    if (elements.statusConnection) {
      elements.statusConnection.innerHTML = connected
        ? '<span class="material-icons">cloud_done</span><span>Connected</span>'
        : '<span class="material-icons">cloud_off</span><span>Disconnected</span>';
    }
  }

  // ============================================
  // Theme Management
  // ============================================

  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        state.theme = settings.theme || "dark";
        state.showHidden = settings.showHidden || false;
      }
    } catch (e) {
      console.log("Could not load settings:", e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        theme: state.theme,
        showHidden: state.showHidden
      }));
    } catch (e) {
      console.log("Could not save settings:", e);
    }
  }

  function getEffectiveTheme() {
    if (state.theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return state.theme;
  }

  function applyTheme() {
    const effectiveTheme = getEffectiveTheme();
    document.body.setAttribute("data-theme", effectiveTheme);

    // Update theme toggle display
    const themeIcons = { light: "light_mode", dark: "dark_mode", auto: "brightness_auto" };
    const themeLabels = { light: "Light", dark: "Dark", auto: "Auto" };

    if (elements.themeIcon) {
      elements.themeIcon.textContent = themeIcons[state.theme];
    }
    if (elements.themeLabel) {
      elements.themeLabel.textContent = themeLabels[state.theme];
    }

    // Update active menu item
    document.querySelectorAll(".theme-menu-item").forEach(item => {
      item.classList.toggle("active", item.dataset.theme === state.theme);
    });

    // Update CodeMirror theme
    const cmTheme = effectiveTheme === "dark" ? "material-darker" : "default";
    if (state.editor) {
      state.editor.setOption("theme", cmTheme);
    }
  }

  function setTheme(theme) {
    state.theme = theme;
    applyTheme();
    saveSettings();
  }

  function updateShowHiddenButton() {
    if (elements.btnShowHidden) {
      const icon = elements.btnShowHidden.querySelector('.material-icons');
      if (state.showHidden) {
        icon.textContent = 'visibility';
        elements.btnShowHidden.title = 'Hide hidden folders';
        elements.btnShowHidden.classList.add('active');
      } else {
        icon.textContent = 'visibility_off';
        elements.btnShowHidden.title = 'Show hidden folders';
        elements.btnShowHidden.classList.remove('active');
      }
    }
  }

  // ============================================
  // Modal Functions
  // ============================================

  let modalCallback = null;

  function showModal(options) {
    const { title, placeholder, hint, value = "", confirmText = "Confirm", isDanger = false } = options;

    elements.modalTitle.textContent = title;
    elements.modalInput.placeholder = placeholder || "";
    elements.modalInput.value = value;
    elements.modalHint.textContent = hint || "";
    elements.modalConfirm.textContent = confirmText;
    elements.modalConfirm.className = isDanger ? "modal-btn danger" : "modal-btn primary";

    elements.modalOverlay.classList.add("visible");
    elements.modalInput.focus();
    elements.modalInput.select();

    return new Promise((resolve) => {
      modalCallback = resolve;
    });
  }

  function hideModal() {
    elements.modalOverlay.classList.remove("visible");
    if (modalCallback) {
      modalCallback(null);
      modalCallback = null;
    }
  }

  function confirmModal() {
    const value = elements.modalInput.value.trim();
    elements.modalOverlay.classList.remove("visible");
    if (modalCallback) {
      modalCallback(value);
      modalCallback = null;
    }
  }

  // ============================================
  // Context Menu
  // ============================================

  function showContextMenu(x, y, target) {
    state.contextMenuTarget = target;

    const menu = elements.contextMenu;
    menu.classList.add("visible");

    // Position menu
    const menuRect = menu.getBoundingClientRect();
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    let posX = x;
    let posY = y;

    if (x + menuRect.width > viewWidth) {
      posX = viewWidth - menuRect.width - 10;
    }
    if (y + menuRect.height > viewHeight) {
      posY = viewHeight - menuRect.height - 10;
    }

    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;
  }

  function hideContextMenu() {
    elements.contextMenu.classList.remove("visible");
    state.contextMenuTarget = null;
  }

  // ============================================
  // Sidebar Management
  // ============================================

  function showSidebar() {
    state.sidebarVisible = true;
    if (isMobile()) {
      elements.sidebar.classList.add("visible");
      elements.sidebarOverlay.classList.add("visible");
    } else {
      elements.sidebar.classList.remove("hidden");
    }
  }

  function hideSidebar() {
    state.sidebarVisible = false;
    if (isMobile()) {
      elements.sidebar.classList.remove("visible");
      elements.sidebarOverlay.classList.remove("visible");
    } else {
      elements.sidebar.classList.add("hidden");
    }
  }

  function toggleSidebar() {
    if (state.sidebarVisible) {
      hideSidebar();
    } else {
      showSidebar();
    }
  }

  // ============================================
  // API Functions
  // ============================================

  async function fetchWithAuth(url, options = {}) {
    let headers = { ...options.headers };

    // Try to get auth token from Home Assistant
    try {
      if (window.parent && window.parent.hassConnection) {
        const conn = await window.parent.hassConnection;
        if (conn && conn.auth && conn.auth.accessToken) {
          headers["Authorization"] = `Bearer ${conn.auth.accessToken}`;
        }
      }
    } catch (e) {
      // Continue without auth header - the session cookie should work
      console.log("Using session authentication");
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "same-origin",
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async function loadFiles() {
    try {
      setConnectionStatus(true);
      const files = await fetchWithAuth(`${API_BASE}?action=list_files&show_hidden=${state.showHidden}`);
      state.files = files;
      state.fileTree = buildFileTree(files);
      renderFileTree();
    } catch (error) {
      setConnectionStatus(false);
      showToast("Failed to load files: " + error.message, "error");
    }
  }

  async function loadFile(path) {
    try {
      const data = await fetchWithAuth(
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}`
      );
      return data.content;
    } catch (error) {
      showToast("Failed to load file: " + error.message, "error");
      throw error;
    }
  }

  async function saveFile(path, content) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "write_file", path, content }),
      });
      showToast(`Saved ${path.split("/").pop()}`, "success");
      return true;
    } catch (error) {
      showToast("Failed to save: " + error.message, "error");
      return false;
    }
  }

  async function createFile(path, content = "") {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_file", path, content }),
      });
      showToast(`Created ${path.split("/").pop()}`, "success");
      await loadFiles();
      openFile(path);
      return true;
    } catch (error) {
      showToast("Failed to create file: " + error.message, "error");
      return false;
    }
  }

  async function createFolder(path) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_folder", path }),
      });
      showToast(`Created folder ${path.split("/").pop()}`, "success");
      await loadFiles();
      state.expandedFolders.add(path);
      renderFileTree();
      return true;
    } catch (error) {
      showToast("Failed to create folder: " + error.message, "error");
      return false;
    }
  }

  async function deleteItem(path) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", path }),
      });
      showToast(`Deleted ${path.split("/").pop()}`, "success");

      // Close tab if open
      const tab = state.openTabs.find(t => t.path === path);
      if (tab) {
        closeTab(tab, true);
      }

      await loadFiles();
      return true;
    } catch (error) {
      showToast("Failed to delete: " + error.message, "error");
      return false;
    }
  }

  async function copyItem(source, destination) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "copy", source, destination }),
      });
      showToast(`Copied to ${destination.split("/").pop()}`, "success");
      await loadFiles();
      return true;
    } catch (error) {
      showToast("Failed to copy: " + error.message, "error");
      return false;
    }
  }

  async function renameItem(source, destination) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rename", source, destination }),
      });
      showToast(`Renamed to ${destination.split("/").pop()}`, "success");

      // Update tab path if open
      const tab = state.openTabs.find(t => t.path === source);
      if (tab) {
        tab.path = destination;
        renderTabs();
      }

      await loadFiles();
      return true;
    } catch (error) {
      showToast("Failed to rename: " + error.message, "error");
      return false;
    }
  }

  async function validateYaml(content) {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_yaml", content }),
      });
      return data;
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async function uploadFile(path, content, overwrite = false) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload_file", path, content, overwrite }),
      });
      showToast(`Uploaded ${path.split("/").pop()}`, "success");
      await loadFiles();
      return true;
    } catch (error) {
      showToast("Failed to upload: " + error.message, "error");
      return false;
    }
  }

  // ============================================
  // Download & Upload Functions
  // ============================================

  function downloadCurrentFile() {
    if (!state.activeTab) {
      showToast("No file open", "warning");
      return;
    }

    const tab = state.activeTab;
    const filename = tab.path.split("/").pop();
    const content = tab.content;

    downloadContent(filename, content);
  }

  async function downloadFileByPath(path) {
    try {
      const content = await loadFile(path);
      const filename = path.split("/").pop();
      downloadContent(filename, content);
    } catch (error) {
      // Error already shown by loadFile
    }
  }

  function downloadContent(filename, content) {
    // Create blob and download link
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename}`, "success");
  }

  function triggerUpload() {
    if (elements.fileUploadInput) {
      elements.fileUploadInput.click();
    }
  }

  async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const basePath = state.currentFolderPath || "";

    for (const file of files) {
      try {
        const content = await readFileAsText(file);
        let filePath = basePath ? `${basePath}/${file.name}` : file.name;

        // Check if file exists
        const existingFile = state.files.find(f => f.path === filePath);
        if (existingFile) {
          const overwrite = confirm(`File "${file.name}" already exists. Overwrite?`);
          if (!overwrite) continue;
          await uploadFile(filePath, content, true);
        } else {
          await uploadFile(filePath, content, false);
        }

        // Open the uploaded file
        await openFile(filePath);
      } catch (error) {
        showToast(`Failed to upload ${file.name}: ${error.message}`, "error");
      }
    }

    // Reset input so same file can be uploaded again
    event.target.value = "";
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data URL prefix to get just the base64 data
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  // ============================================
  // Folder Download & Upload Functions
  // ============================================

  async function downloadFolder(path) {
    try {
      showToast("Preparing download...", "success");
      const data = await fetchWithAuth(
        `${API_BASE}?action=download_folder&path=${encodeURIComponent(path)}`
      );

      if (data.success && data.data) {
        // Decode base64 to binary
        const binaryString = atob(data.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob and download
        const blob = new Blob([bytes], { type: "application/zip" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = data.filename || `${path.split("/").pop()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Downloaded ${data.filename}`, "success");
      }
    } catch (error) {
      showToast("Failed to download folder: " + error.message, "error");
    }
  }

  function triggerFolderUpload() {
    if (elements.folderUploadInput) {
      elements.folderUploadInput.click();
    }
  }

  async function handleFolderUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith(".zip")) {
      showToast("Please select a ZIP file", "warning");
      event.target.value = "";
      return;
    }

    const basePath = state.currentFolderPath || "";

    // Prompt for folder name
    const folderName = file.name.replace(".zip", "");
    const result = await showModal({
      title: "Upload Folder",
      placeholder: "folder_name",
      value: folderName,
      hint: basePath
        ? `ZIP will be extracted to: ${basePath}/<folder_name>`
        : "Enter the folder name to extract ZIP contents to",
    });

    if (!result) {
      event.target.value = "";
      return;
    }

    const targetPath = basePath ? `${basePath}/${result}` : result;

    try {
      showToast("Uploading folder...", "success");
      const zipData = await readFileAsBase64(file);

      const response = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload_folder",
          path: targetPath,
          zip_data: zipData,
        }),
      });

      if (response.success) {
        showToast(`Extracted ${response.files_extracted} files to ${result}`, "success");
        await loadFiles();
        state.expandedFolders.add(targetPath);
        renderFileTree();
      }
    } catch (error) {
      showToast("Failed to upload folder: " + error.message, "error");
    }

    event.target.value = "";
  }

  // ============================================
  // File Operations UI
  // ============================================

  async function promptNewFile() {
    const basePath = state.currentFolderPath || "";
    const result = await showModal({
      title: "New File",
      placeholder: "filename.yaml",
      hint: basePath ? `Will be created in: ${basePath}/` : "Enter the full path or just filename",
    });

    if (result) {
      let fullPath = result;
      if (basePath && !result.includes("/")) {
        fullPath = `${basePath}/${result}`;
      }
      await createFile(fullPath);
    }
  }

  async function promptNewFolder() {
    const basePath = state.currentFolderPath || "";
    const result = await showModal({
      title: "New Folder",
      placeholder: "folder_name",
      hint: basePath ? `Will be created in: ${basePath}/` : "Enter the full path or just folder name",
    });

    if (result) {
      let fullPath = result;
      if (basePath && !result.includes("/")) {
        fullPath = `${basePath}/${result}`;
      }
      await createFolder(fullPath);
    }
  }

  async function promptRename(path, isFolder) {
    const currentName = path.split("/").pop();
    const parentPath = path.split("/").slice(0, -1).join("/");

    const result = await showModal({
      title: isFolder ? "Rename Folder" : "Rename File",
      placeholder: "New name",
      value: currentName,
      hint: "Enter the new name",
    });

    if (result && result !== currentName) {
      const newPath = parentPath ? `${parentPath}/${result}` : result;
      await renameItem(path, newPath);
    }
  }

  async function promptCopy(path, isFolder) {
    const currentName = path.split("/").pop();
    const parentPath = path.split("/").slice(0, -1).join("/");

    const result = await showModal({
      title: isFolder ? "Copy Folder" : "Copy File",
      placeholder: "New name",
      value: `${currentName}_copy`,
      hint: "Enter the name for the copy",
    });

    if (result) {
      const newPath = parentPath ? `${parentPath}/${result}` : result;
      await copyItem(path, newPath);
    }
  }

  async function promptDelete(path, isFolder) {
    const name = path.split("/").pop();
    const result = await showModal({
      title: isFolder ? "Delete Folder" : "Delete File",
      placeholder: `Type "${name}" to confirm`,
      hint: `This will permanently delete ${isFolder ? "the folder and all its contents" : "this file"}`,
      confirmText: "Delete",
      isDanger: true,
    });

    if (result === name) {
      await deleteItem(path);
    } else if (result !== null) {
      showToast("Name doesn't match. Deletion cancelled.", "warning");
    }
  }

  // ============================================
  // File Tree Rendering
  // ============================================

  function renderFileTree() {
    if (!elements.fileTree) return;
    elements.fileTree.innerHTML = "";
    renderTreeLevel(state.fileTree, elements.fileTree, 0);
  }

  function renderTreeLevel(tree, container, depth) {
    const folders = Object.keys(tree)
      .filter((k) => !k.startsWith("_"))
      .sort();
    const files = (tree._files || []).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const query = state.searchQuery.toLowerCase();

    // Render folders
    folders.forEach((folderName) => {
      const folderData = tree[folderName];
      const folderPath = folderData._path;

      if (query && !folderMatchesSearch(folderData, query)) {
        return;
      }

      const isExpanded = state.expandedFolders.has(folderPath);
      const item = createTreeItem(folderName, depth, true, isExpanded, folderPath);

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
        showContextMenu(e.clientX, e.clientY, { path: folderPath, isFolder: true });
      });

      // Touch support
      item.addEventListener("touchend", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        e.preventDefault();
        state.currentFolderPath = folderPath;
        toggleFolder(folderPath);
      });

      container.appendChild(item);

      if (isExpanded) {
        renderTreeLevel(folderData, container, depth + 1);
      }
    });

    // Render files
    files.forEach((file) => {
      if (query && !file.name.toLowerCase().includes(query)) {
        return;
      }

      const item = createTreeItem(file.name, depth, false, false, file.path);

      item.addEventListener("click", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        openFile(file.path);
        if (isMobile()) hideSidebar();
      });

      // Context menu
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, { path: file.path, isFolder: false });
      });

      // Touch support
      item.addEventListener("touchend", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        e.preventDefault();
        openFile(file.path);
        if (isMobile()) hideSidebar();
      });

      if (state.activeTab && state.activeTab.path === file.path) {
        item.classList.add("active");
      }

      const tab = state.openTabs.find((t) => t.path === file.path);
      if (tab && tab.modified) {
        item.classList.add("modified");
      }

      container.appendChild(item);
    });
  }

  function folderMatchesSearch(folder, query) {
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

  function createTreeItem(name, depth, isFolder, isExpanded, itemPath = null) {
    const item = document.createElement("div");
    item.className = "tree-item";
    item.style.setProperty("--depth", depth);

    const chevron = document.createElement("div");
    chevron.className = `tree-chevron ${isFolder ? (isExpanded ? "expanded" : "") : "hidden"}`;
    chevron.innerHTML = '<span class="material-icons">chevron_right</span>';

    const icon = document.createElement("div");
    if (isFolder) {
      icon.className = "tree-icon folder";
      icon.innerHTML = `<span class="material-icons">${isExpanded ? "folder_open" : "folder"}</span>`;
    } else {
      const fileIcon = getFileIcon(name);
      icon.className = `tree-icon ${fileIcon.class}`;
      icon.innerHTML = `<span class="material-icons">${fileIcon.icon}</span>`;
    }

    const nameSpan = document.createElement("span");
    nameSpan.className = "tree-name";
    nameSpan.textContent = name;

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "tree-item-actions";

    const renameBtn = document.createElement("button");
    renameBtn.className = "tree-action-btn";
    renameBtn.title = "Rename";
    renameBtn.innerHTML = '<span class="material-icons">edit</span>';
    renameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      promptRename(itemPath, isFolder);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "tree-action-btn";
    deleteBtn.title = "Delete";
    deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      promptDelete(itemPath, isFolder);
    });

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(chevron);
    item.appendChild(icon);
    item.appendChild(nameSpan);
    item.appendChild(actions);

    if (itemPath) {
      item.dataset.path = itemPath;
    }

    return item;
  }

  function toggleFolder(path) {
    if (state.expandedFolders.has(path)) {
      state.expandedFolders.delete(path);
    } else {
      state.expandedFolders.add(path);
    }
    renderFileTree();
  }

  // ============================================
  // Tab Management
  // ============================================

  async function openFile(path) {
    let tab = state.openTabs.find((t) => t.path === path);

    if (!tab) {
      try {
        const content = await loadFile(path);

        tab = {
          path,
          content,
          originalContent: content,
          modified: false,
          history: null,  // Store CodeMirror history
          cursor: null,   // Store cursor position
          scroll: null,   // Store scroll position
        };

        state.openTabs.push(tab);
      } catch (error) {
        return;
      }
    }

    activateTab(tab);
    renderTabs();
    renderFileTree();
  }

  function activateTab(tab) {
    // Hide welcome screen
    if (elements.welcomeScreen) {
      elements.welcomeScreen.style.display = "none";
    }

    // Save current tab state before switching
    if (state.activeTab && state.editor) {
      state.activeTab.content = state.editor.getValue();
      state.activeTab.history = state.editor.getHistory();
      state.activeTab.cursor = state.editor.getCursor();
      state.activeTab.scroll = state.editor.getScrollInfo();
    }

    state.activeTab = tab;

    // Create editor if it doesn't exist
    if (!state.editor) {
      createEditor();
    }

    // Update editor content and settings
    const mode = getEditorMode(tab.path);

    // Try to set the mode, fall back to yaml if ha-yaml fails
    try {
      state.editor.setOption("mode", mode);
    } catch (error) {
      console.error("Error setting editor mode:", error);
      // Fallback to regular yaml if ha-yaml fails
      if (mode === "ha-yaml") {
        console.log("Falling back to regular yaml mode");
        state.editor.setOption("mode", "yaml");
      }
    }

    state.editor.setOption("lint", (mode === "ha-yaml" || mode === "yaml") ? { getAnnotations: yamlLinter, async: true } : false);

    // Set content without triggering change event
    state.editor.off("change", handleEditorChange);
    state.editor.setValue(tab.content);
    state.editor.on("change", handleEditorChange);

    // Restore history if available
    if (tab.history) {
      state.editor.setHistory(tab.history);
    } else {
      state.editor.clearHistory();
    }

    // Restore cursor and scroll position
    if (tab.cursor) {
      state.editor.setCursor(tab.cursor);
    }
    if (tab.scroll) {
      state.editor.scrollTo(tab.scroll.left, tab.scroll.top);
    }

    // Refresh and focus
    state.editor.refresh();
    state.editor.focus();

    updateToolbarState();
    updateStatusBar();

    if (elements.filePath) {
      elements.filePath.textContent = tab.path;
    }

    // Update current folder path
    state.currentFolderPath = tab.path.split("/").slice(0, -1).join("/");
  }

  function handleEditorChange() {
    if (!state.activeTab || !state.editor) return;

    const currentContent = state.editor.getValue();
    state.activeTab.content = currentContent;
    state.activeTab.modified = currentContent !== state.activeTab.originalContent;
    updateToolbarState();
    renderTabs();
    renderFileTree();
  }

  function createEditor() {
    const wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    wrapper.id = "codemirror-wrapper";
    elements.editorContainer.appendChild(wrapper);

    const effectiveTheme = getEffectiveTheme();
    const cmTheme = effectiveTheme === "dark" ? "material-darker" : "default";

    state.editor = CodeMirror(wrapper, {
      value: "",
      mode: null,
      theme: cmTheme,
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      foldGutter: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
      hintOptions: {
        hint: homeAssistantHint,
        completeSingle: false,
        closeOnUnfocus: true,
        alignWithWord: true,
        closeCharacters: /[\s()\[\]{};:>,]/
      },
      extraKeys: {
        "Ctrl-S": () => saveCurrentFile(),
        "Cmd-S": () => saveCurrentFile(),
        "Ctrl-F": () => state.editor.execCommand("find"),
        "Cmd-F": () => state.editor.execCommand("find"),
        "Ctrl-H": () => state.editor.execCommand("replace"),
        "Cmd-Option-F": () => state.editor.execCommand("replace"),
        "Ctrl-G": () => state.editor.execCommand("jumpToLine"),
        "Cmd-G": () => state.editor.execCommand("jumpToLine"),
        "Ctrl-/": () => state.editor.execCommand("toggleComment"),
        "Cmd-/": () => state.editor.execCommand("toggleComment"),
        "Ctrl-Space": (cm) => {
          cm.showHint({ hint: homeAssistantHint });
        },
        "Tab": (cm) => {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            cm.replaceSelection("  ", "end");
          }
        },
      },
      inputStyle: "contenteditable",
    });

    // Track changes
    state.editor.on("change", handleEditorChange);

    // Track cursor position
    state.editor.on("cursorActivity", () => {
      updateStatusBar();
    });

    // Auto-trigger autocomplete for YAML files
    state.editor.on("inputRead", (cm, changeObj) => {
      // Only auto-complete in YAML mode
      const mode = cm.getOption("mode");
      if (mode !== "ha-yaml" && mode !== "yaml") return;

      // Don't autocomplete if we're in the middle of completing
      if (cm.state.completionActive) return;

      // Get the character that was just typed
      const text = changeObj.text[0];

      // Auto-trigger on certain characters
      const autoTriggerChars = [':', ' ', '-', '!'];
      const lastChar = text[text.length - 1];

      // Auto-trigger after typing certain characters or when starting a new word
      if (autoTriggerChars.includes(lastChar) ||
          (text.match(/^[a-zA-Z]$/) && changeObj.origin === "+input")) {

        // Small delay to make it feel more natural
        setTimeout(() => {
          if (!cm.state.completionActive) {
            cm.showHint({
              hint: homeAssistantHint,
              completeSingle: false
            });
          }
        }, 100);
      }
    });

    // Initial refresh
    state.editor.refresh();
  }

  function yamlLinter(content, updateLinting) {
    validateYaml(content).then((result) => {
      const annotations = [];
      if (!result.valid && result.error) {
        const match = result.error.match(/line (\d+)/);
        if (match) {
          const line = parseInt(match[1]) - 1;
          annotations.push({
            from: CodeMirror.Pos(line, 0),
            to: CodeMirror.Pos(line, 100),
            message: result.error,
            severity: "error",
          });
        }
      }
      updateLinting(annotations);
    });
  }

  function renderTabs() {
    if (!elements.tabsContainer) return;
    elements.tabsContainer.innerHTML = "";

    state.openTabs.forEach((tab) => {
      const tabEl = document.createElement("div");
      tabEl.className = `tab ${tab === state.activeTab ? "active" : ""}`;

      const icon = getFileIcon(tab.path);
      const fileName = tab.path.split("/").pop();

      tabEl.innerHTML = `
        <span class="tab-icon material-icons" style="color: var(--icon-${icon.class})">${icon.icon}</span>
        <span class="tab-name">${fileName}</span>
        ${tab.modified ? '<div class="tab-modified"></div>' : ""}
        <div class="tab-close"><span class="material-icons">close</span></div>
      `;

      tabEl.addEventListener("click", (e) => {
        if (!e.target.closest(".tab-close")) {
          activateTab(tab);
          renderTabs();
          renderFileTree();
        }
      });

      const closeBtn = tabEl.querySelector(".tab-close");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab);
      });

      elements.tabsContainer.appendChild(tabEl);
    });
  }

  function closeTab(tab, force = false) {
    if (tab.modified && !force) {
      if (!confirm(`${tab.path.split("/").pop()} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    const index = state.openTabs.indexOf(tab);
    state.openTabs.splice(index, 1);

    if (state.activeTab === tab) {
      if (state.openTabs.length > 0) {
        const newIndex = Math.min(index, state.openTabs.length - 1);
        activateTab(state.openTabs[newIndex]);
      } else {
        state.activeTab = null;
        // Clear the editor but don't remove it
        if (state.editor) {
          state.editor.setValue("");
        }
        if (elements.welcomeScreen) {
          elements.welcomeScreen.style.display = "";
        }
        if (elements.filePath) {
          elements.filePath.textContent = "";
        }
      }
    }

    renderTabs();
    renderFileTree();
    updateToolbarState();
  }

  // ============================================
  // File Operations
  // ============================================

  async function saveCurrentFile() {
    if (!state.activeTab) return;

    const tab = state.activeTab;
    const success = await saveFile(tab.path, tab.content);

    if (success) {
      tab.originalContent = tab.content;
      tab.modified = false;
      renderTabs();
      renderFileTree();
      updateToolbarState();
    }
  }

  async function saveAllFiles() {
    const modifiedTabs = state.openTabs.filter((t) => t.modified);

    for (const tab of modifiedTabs) {
      const success = await saveFile(tab.path, tab.content);
      if (success) {
        tab.originalContent = tab.content;
        tab.modified = false;
      }
    }

    renderTabs();
    renderFileTree();
    updateToolbarState();
    showToast(`Saved ${modifiedTabs.length} file(s)`, "success");
  }

  // ============================================
  // UI Updates
  // ============================================

  function updateToolbarState() {
    const tab = state.activeTab;
    const hasEditor = !!state.editor && !!tab;
    const hasModified = state.openTabs.some((t) => t.modified);

    if (elements.btnSave) {
      elements.btnSave.disabled = !tab || !tab.modified;
    }
    if (elements.btnSaveAll) {
      elements.btnSaveAll.disabled = !hasModified;
    }
    if (elements.btnUndo) {
      elements.btnUndo.disabled = !hasEditor || !state.editor?.historySize().undo;
    }
    if (elements.btnRedo) {
      elements.btnRedo.disabled = !hasEditor || !state.editor?.historySize().redo;
    }
    if (elements.btnDownload) {
      elements.btnDownload.disabled = !hasEditor;
    }
  }

  function updateStatusBar() {
    const tab = state.activeTab;

    if (tab && state.editor) {
      const cursor = state.editor.getCursor();
      if (elements.statusPosition) {
        elements.statusPosition.innerHTML = `<span>Ln ${cursor.line + 1}, Col ${cursor.ch + 1}</span>`;
      }
      if (elements.statusLanguage) {
        elements.statusLanguage.innerHTML = `<span>${getLanguageName(tab.path)}</span>`;
      }
    } else {
      if (elements.statusPosition) {
        elements.statusPosition.innerHTML = "<span>Ln 1, Col 1</span>";
      }
      if (elements.statusLanguage) {
        elements.statusLanguage.innerHTML = "<span>-</span>";
      }
    }
  }

  // ============================================
  // Resize Handle
  // ============================================

  function initResizeHandle() {
    if (!elements.resizeHandle || isMobile()) return;

    let isResizing = false;

    elements.resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      elements.resizeHandle.classList.add("active");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        elements.sidebar.style.width = `${newWidth}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        elements.resizeHandle.classList.remove("active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        // Refresh editor after resize
        if (state.editor) {
          state.editor.refresh();
        }
      }
    });
  }

  // ============================================
  // Event Listeners
  // ============================================

  function initEventListeners() {
    // Menu button (sidebar toggle)
    if (elements.btnMenu) {
      elements.btnMenu.addEventListener("click", toggleSidebar);
    }

    // Close sidebar button
    if (elements.btnCloseSidebar) {
      elements.btnCloseSidebar.addEventListener("click", hideSidebar);
    }

    // Sidebar overlay click
    if (elements.sidebarOverlay) {
      elements.sidebarOverlay.addEventListener("click", hideSidebar);
    }

    // Save buttons
    if (elements.btnSave) {
      elements.btnSave.addEventListener("click", saveCurrentFile);
    }
    if (elements.btnSaveAll) {
      elements.btnSaveAll.addEventListener("click", saveAllFiles);
    }

    // Undo/Redo
    if (elements.btnUndo) {
      elements.btnUndo.addEventListener("click", () => {
        if (state.editor) {
          state.editor.undo();
          updateToolbarState();
        }
      });
    }
    if (elements.btnRedo) {
      elements.btnRedo.addEventListener("click", () => {
        if (state.editor) {
          state.editor.redo();
          updateToolbarState();
        }
      });
    }

    // Search
    if (elements.btnSearch) {
      elements.btnSearch.addEventListener("click", () => {
        if (state.editor) {
          state.editor.execCommand("find");
        }
      });
    }

    // Refresh
    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener("click", loadFiles);
    }

    // Validate YAML
    if (elements.btnValidate) {
      elements.btnValidate.addEventListener("click", async () => {
        if (state.activeTab) {
          const result = await validateYaml(state.activeTab.content);
          if (result.valid) {
            showToast("YAML is valid!", "success");
          } else {
            showToast("YAML error: " + result.error, "error");
          }
        } else {
          showToast("No file open", "warning");
        }
      });
    }

    // New File/Folder buttons
    if (elements.btnNewFile) {
      elements.btnNewFile.addEventListener("click", promptNewFile);
    }
    if (elements.btnNewFolder) {
      elements.btnNewFolder.addEventListener("click", promptNewFolder);
    }
    if (elements.btnNewFileSidebar) {
      elements.btnNewFileSidebar.addEventListener("click", promptNewFile);
    }
    if (elements.btnNewFolderSidebar) {
      elements.btnNewFolderSidebar.addEventListener("click", promptNewFolder);
    }

    // Upload/Download buttons
    if (elements.btnUpload) {
      elements.btnUpload.addEventListener("click", triggerUpload);
    }
    if (elements.btnDownload) {
      elements.btnDownload.addEventListener("click", downloadCurrentFile);
    }
    if (elements.fileUploadInput) {
      elements.fileUploadInput.addEventListener("change", handleFileUpload);
    }
    if (elements.btnUploadFolder) {
      elements.btnUploadFolder.addEventListener("click", triggerFolderUpload);
    }
    if (elements.btnDownloadFolder) {
      elements.btnDownloadFolder.addEventListener("click", () => {
        if (state.currentFolderPath) {
          downloadFolder(state.currentFolderPath);
        } else {
          showToast("Select a folder first", "warning");
        }
      });
    }
    if (elements.folderUploadInput) {
      elements.folderUploadInput.addEventListener("change", handleFolderUpload);
    }

    // Collapse/Expand all
    if (elements.btnCollapseAll) {
      elements.btnCollapseAll.addEventListener("click", () => {
        state.expandedFolders.clear();
        renderFileTree();
      });
    }
    if (elements.btnExpandAll) {
      elements.btnExpandAll.addEventListener("click", () => {
        function expandAll(tree) {
          for (const key of Object.keys(tree)) {
            if (!key.startsWith("_")) {
              if (tree[key]._path) {
                state.expandedFolders.add(tree[key]._path);
              }
              expandAll(tree[key]);
            }
          }
        }
        expandAll(state.fileTree);
        renderFileTree();
      });
    }

    // Show/Hide hidden folders toggle
    if (elements.btnShowHidden) {
      elements.btnShowHidden.addEventListener("click", () => {
        state.showHidden = !state.showHidden;
        saveSettings();
        updateShowHiddenButton();
        loadFiles();
      });
    }

    // File search
    if (elements.fileSearch) {
      elements.fileSearch.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderFileTree();
      });
    }

    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        elements.themeMenu.classList.toggle("visible");
      });
    }

    // Theme menu items
    document.querySelectorAll(".theme-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        setTheme(item.dataset.theme);
        elements.themeMenu.classList.remove("visible");
      });
    });

    // Close theme menu on outside click
    document.addEventListener("click", () => {
      if (elements.themeMenu) {
        elements.themeMenu.classList.remove("visible");
      }
    });

    // Modal events
    if (elements.modalClose) {
      elements.modalClose.addEventListener("click", hideModal);
    }
    if (elements.modalCancel) {
      elements.modalCancel.addEventListener("click", hideModal);
    }
    if (elements.modalConfirm) {
      elements.modalConfirm.addEventListener("click", confirmModal);
    }
    if (elements.modalOverlay) {
      elements.modalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.modalOverlay) {
          hideModal();
        }
      });
    }
    if (elements.modalInput) {
      elements.modalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          confirmModal();
        } else if (e.key === "Escape") {
          hideModal();
        }
      });
    }

    // Context menu items
    document.querySelectorAll(".context-menu-item").forEach(item => {
      item.addEventListener("click", async () => {
        const action = item.dataset.action;
        const target = state.contextMenuTarget;
        hideContextMenu();

        if (!target) return;

        switch (action) {
          case "rename":
            await promptRename(target.path, target.isFolder);
            break;
          case "copy":
            await promptCopy(target.path, target.isFolder);
            break;
          case "download":
            if (target.isFolder) {
              await downloadFolder(target.path);
            } else {
              await downloadFileByPath(target.path);
            }
            break;
          case "delete":
            await promptDelete(target.path, target.isFolder);
            break;
        }
      });
    });

    // Hide context menu on outside click
    document.addEventListener("click", hideContextMenu);

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (e.shiftKey) {
          saveAllFiles();
        } else {
          saveCurrentFile();
        }
      }

      // Ctrl/Cmd + W - close tab
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        if (state.activeTab) {
          closeTab(state.activeTab);
        }
      }

      // Escape - close sidebar on mobile, hide modals/menus
      if (e.key === "Escape") {
        if (elements.modalOverlay.classList.contains("visible")) {
          hideModal();
        } else if (elements.contextMenu.classList.contains("visible")) {
          hideContextMenu();
        } else if (elements.themeMenu.classList.contains("visible")) {
          elements.themeMenu.classList.remove("visible");
        } else if (isMobile() && state.sidebarVisible) {
          hideSidebar();
        }
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      const wasMobile = state.isMobile;
      state.isMobile = isMobile();

      if (wasMobile !== state.isMobile) {
        if (state.isMobile) {
          hideSidebar();
        } else {
          showSidebar();
        }
      }

      // Refresh editor
      if (state.editor) {
        setTimeout(() => state.editor.refresh(), 100);
      }
    });

    // Before unload warning
    window.addEventListener("beforeunload", (e) => {
      if (state.openTabs.some((t) => t.modified)) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    // Orientation change (mobile)
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        if (state.editor) {
          state.editor.refresh();
        }
      }, 300);
    });

    // System theme change (for auto mode)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (state.theme === "auto") {
        applyTheme();
      }
    });

    // Visibility change - refresh editor when page/tab becomes visible
    // This is crucial for iframe-based panels in Home Assistant
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.editor) {
        setTimeout(() => state.editor.refresh(), 50);
        setTimeout(() => state.editor.refresh(), 150);
        setTimeout(() => state.editor.refresh(), 300);
      }
    });

    // Also handle focus on the window (helps with HA mobile apps)
    window.addEventListener("focus", () => {
      if (state.editor) {
        setTimeout(() => state.editor.refresh(), 50);
        setTimeout(() => state.editor.refresh(), 150);
      }
    });
  }

  // ============================================
  // Initialization
  // ============================================

  async function init() {
    initElements();
    loadSettings();
    applyTheme();
    updateShowHiddenButton();
    initEventListeners();
    initResizeHandle();

    // Set initial sidebar state
    if (isMobile()) {
      elements.sidebar.classList.remove("visible");
      state.sidebarVisible = false;
    }

    // Load files
    await loadFiles();

    // Don't auto-expand folders - let users expand what they need
    renderFileTree();

    updateToolbarState();
    updateStatusBar();
  }

  // Start the application
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
