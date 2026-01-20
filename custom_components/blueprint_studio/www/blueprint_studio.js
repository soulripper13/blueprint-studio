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
  const MAX_RECENT_FILES = 10;

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
    favoriteFiles: [],  // Array of favorite file paths
    recentFiles: [],    // Array of recently opened file paths
    searchQuery: "",
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    sidebarVisible: window.innerWidth > MOBILE_BREAKPOINT,
    theme: "dark",
    showHidden: false,  // Show hidden files/folders
    contextMenuTarget: null,
    currentFolderPath: "",
    editor: null,  // Single shared editor instance
    gitConfig: null,  // Git configuration
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
    elements.breadcrumb = document.getElementById("breadcrumb");
    elements.breadcrumbCopy = document.getElementById("breadcrumb-copy");
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
    elements.btnAppSettings = document.getElementById("btn-app-settings");
    elements.btnValidate = document.getElementById("btn-validate");
    elements.btnToggleAll = document.getElementById("btn-toggle-all");
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
    elements.btnGitPull = document.getElementById("btn-git-pull");
    elements.btnGitPush = document.getElementById("btn-git-push");
    elements.btnGitStatus = document.getElementById("btn-git-status");
    elements.btnGitSettings = document.getElementById("btn-git-settings");
    elements.btnGitRefresh = document.getElementById("btn-git-refresh");
    elements.btnGitCollapse = document.getElementById("btn-git-collapse");
    elements.btnStageSelected = document.getElementById("btn-stage-selected");
    elements.btnStageAll = document.getElementById("btn-stage-all");
    elements.btnUnstageAll = document.getElementById("btn-unstage-all");
    elements.btnCommitStaged = document.getElementById("btn-commit-staged");
    elements.loadingOverlay = document.getElementById("loading-overlay");
    elements.loadingText = document.getElementById("loading-text");
    elements.shortcutsOverlay = document.getElementById("shortcuts-overlay");
    elements.shortcutsClose = document.getElementById("shortcuts-close");
    elements.btnWelcomeNewFile = document.getElementById("btn-welcome-new-file");
    elements.btnWelcomeUploadFile = document.getElementById("btn-welcome-upload-file");
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

  function buildFileTree(items) {
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

  function showToast(message, type = "success", duration = 3000, action = null) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = {
      success: "check_circle",
      error: "error",
      warning: "warning",
      info: "info"
    };

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
          toast.remove(); // Remove toast after action
        });
      }
      // If action is present, toast won't auto-remove; user must click action or close button
    } else {
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(100%)";
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    // Add a close button to all toasts
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close-btn';
    closeBtn.innerHTML = '<span class="material-icons">close</span>';
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });
    toast.appendChild(closeBtn);
  }

  function setConnectionStatus(connected) {
    if (elements.statusConnection) {
      elements.statusConnection.innerHTML = connected
        ? '<span class="material-icons">cloud_done</span><span>Connected</span>'
        : '<span class="material-icons">cloud_off</span><span>Disconnected</span>';
    }
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
        state.favoriteFiles = settings.favoriteFiles || [];
        state.recentFiles = settings.recentFiles || []; // Load recent files
        state.gitConfig = settings.gitConfig || null;
        // Store open tabs info for later restoration (after files are loaded)
        state._savedOpenTabs = settings.openTabs || [];
        state._savedActiveTabPath = settings.activeTabPath || null;
      }
    } catch (e) {
      console.log("Could not load settings:", e);
    }
  }

  function saveSettings() {
    try {
      // Save open tabs state
      const openTabsState = state.openTabs.map(tab => ({
        path: tab.path,
        modified: tab.modified
      }));
      const activeTabPath = state.activeTab ? state.activeTab.path : null;

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        theme: state.theme,
        showHidden: state.showHidden,
        favoriteFiles: state.favoriteFiles, // Corrected to use state.favoriteFiles
        recentFiles: state.recentFiles,     // Save recent files
        openTabs: openTabsState,
        activeTabPath: activeTabPath,
        gitConfig: state.gitConfig
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
  // Favorites Management
  // ============================================

  function isFavorite(path) {
    return state.favoriteFiles.includes(path);
  }

  function toggleFavorite(path) {
    if (isFavorite(path)) {
      state.favoriteFiles = state.favoriteFiles.filter(p => p !== path);
      showToast(`Removed ${path.split("/").pop()} from favorites`, "success");
    } else {
      state.favoriteFiles.push(path);
      showToast(`Added ${path.split("/").pop()} to favorites`, "success");
    }
    saveSettings();
    renderFileTree();
  }

  function renderFavoritesPanel() {
    const favoritesContainer = document.getElementById("favorites-panel");
    if (!favoritesContainer) return;

    if (state.favoriteFiles.length === 0) {
      favoritesContainer.style.display = "none";
      return;
    }

    favoritesContainer.style.display = "block";
    favoritesContainer.innerHTML = '<div class="favorites-header">Favorites</div>';

    state.favoriteFiles.forEach((filePath) => {
      // Check if file still exists
      const fileExists = state.files.some(f => f.path === filePath);
      if (!fileExists) return;

      const fileName = filePath.split("/").pop();
      const item = document.createElement("div");
      item.className = "tree-item favorite-item";
      item.style.setProperty("--depth", 0);

      const fileIcon = getFileIcon(fileName);
      const isActive = state.activeTab && state.activeTab.path === filePath;

      item.innerHTML = `
        <div class="tree-icon ${fileIcon.class}">
          <span class="material-icons">${fileIcon.icon}</span>
        </div>
        <span class="tree-name">${fileName}</span>
        <div class="tree-item-actions">
          <button class="tree-action-btn" title="Unpin">
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
          openFile(filePath);
          if (isMobile()) hideSidebar();
        }
      });

      favoritesContainer.appendChild(item);
    });
  }

  // ============================================
  // Recent Files Management
  // ============================================

  function renderRecentFilesPanel() {
    const recentFilesContainer = document.getElementById("recent-files-panel");
    if (!recentFilesContainer) return;

    if (state.recentFiles.length === 0) {
      recentFilesContainer.style.display = "none";
      return;
    }

    recentFilesContainer.style.display = "block";
    recentFilesContainer.innerHTML = '<div class="recent-files-header">Recent Files</div>';

    state.recentFiles.forEach((filePath) => {
      // Check if file still exists
      const fileExists = state.files.some(f => f.path === filePath);
      if (!fileExists) return;

      const fileName = filePath.split("/").pop();
      const item = document.createElement("div");
      item.className = "tree-item recent-item";
      item.style.setProperty("--depth", 0);

      const fileIcon = getFileIcon(fileName);
      const isActive = state.activeTab && state.activeTab.path === filePath;

      item.innerHTML = `
        <div class="tree-icon ${fileIcon.class}">
          <span class="material-icons">${fileIcon.icon}</span>
        </div>
        <span class="tree-name">${fileName}</span>
      `;

      if (isActive) {
        item.classList.add("active");
      }

      const tab = state.openTabs.find((t) => t.path === filePath);
      if (tab && tab.modified) {
        item.classList.add("modified");
      }

      item.addEventListener("click", (e) => {
        openFile(filePath);
        if (isMobile()) hideSidebar();
      });

      // Context menu
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, { path: filePath, isFolder: false });
      });

      recentFilesContainer.appendChild(item);
    });
  }

  // ============================================
  // Modal Functions
  // ============================================

  let modalCallback = null;
  let activePollTimer = null;

  // Default modal HTML structure for reset
  const DEFAULT_MODAL_BODY_HTML = `
    <input type="text" class="modal-input" id="modal-input" placeholder="">
    <div class="modal-hint" id="modal-hint"></div>
  `;

  function resetModalToDefault() {
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
    }

    // Reset modal title
    if (modalTitle) {
      modalTitle.textContent = "Modal Title";
    }

    // Reset modal width
    if (modal) {
      modal.style.maxWidth = "";
    }

    // Show modal footer
    if (modalFooter) {
      modalFooter.style.display = "";
    }

    // Clear any callback
    modalCallback = null;
  }

  function showModal(options) {
    const { title, placeholder, hint, value = "", confirmText = "Confirm", isDanger = false } = options;

    // Ensure modal is in default state before showing
    resetModalToDefault();

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

  function showConfirmDialog(options) {
    const { title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false } = options;

    // Ensure modal is in default state before showing
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
  // Loading States
  // ============================================

  function showGlobalLoading(message = "Loading...") {
    if (elements.loadingOverlay) {
      elements.loadingText.textContent = message;
      elements.loadingOverlay.classList.add("visible");
    }
  }

  function hideGlobalLoading() {
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.remove("visible");
    }
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.classList.add("loading");
      button.disabled = true;
    } else {
      button.classList.remove("loading");
      button.disabled = false;
    }
  }

  function setFileTreeLoading(isLoading) {
    if (elements.fileTree) {
      if (isLoading) {
        elements.fileTree.classList.add("loading");
      } else {
        elements.fileTree.classList.remove("loading");
      }
    }
  }

  function showShortcuts() {
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.classList.add("visible");
    }
  }

  function hideShortcuts() {
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.classList.remove("visible");
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
      setFileTreeLoading(true);
      setButtonLoading(elements.btnRefresh, true);

      const items = await fetchWithAuth(`${API_BASE}?action=list_all&show_hidden=${state.showHidden}`);
      state.files = items.filter(item => item.type === "file");
      state.folders = items.filter(item => item.type === "folder");
      state.allItems = items;
      state.fileTree = buildFileTree(items);
      renderFileTree();

      setFileTreeLoading(false);
      setButtonLoading(elements.btnRefresh, false);
    } catch (error) {
      setConnectionStatus(false);
      setFileTreeLoading(false);
      setButtonLoading(elements.btnRefresh, false);
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

      // Auto-refresh git status after saving to show changes immediately
      await gitStatus();

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

      // Auto-refresh git status after creating file
      await gitStatus();

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

      // Auto-refresh git status after creating folder
      await gitStatus();

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

      // Auto-refresh git status after deleting file
      await gitStatus();

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

      // Auto-refresh git status after copying file
      await gitStatus();

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

      // Auto-refresh git status after renaming file
      await gitStatus();

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

      // Auto-refresh git status after uploading file
      await gitStatus();

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

    showGlobalLoading(`Uploading ${files.length} file(s)...`);

    for (const file of files) {
      try {
        const content = await readFileAsText(file);
        let filePath = basePath ? `${basePath}/${file.name}` : file.name;

        // Check if file exists
        const existingFile = state.files.find(f => f.path === filePath);
        if (existingFile) {
          hideGlobalLoading();
          const overwrite = confirm(`File "${file.name}" already exists. Overwrite?`);
          if (!overwrite) continue;
          showGlobalLoading(`Uploading ${file.name}...`);
          await uploadFile(filePath, content, true);
        } else {
          await uploadFile(filePath, content, false);
        }

        // Open the uploaded file
        await openFile(filePath);
      } catch (error) {
        hideGlobalLoading();
        showToast(`Failed to upload ${file.name}: ${error.message}`, "error");
      }
    }

    hideGlobalLoading();

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
      showGlobalLoading("Preparing download...");

      const data = await fetchWithAuth(
        `${API_BASE}?action=download_folder&path=${encodeURIComponent(path)}`
      );

      hideGlobalLoading();

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
      showGlobalLoading("Uploading and extracting folder...");

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

      hideGlobalLoading();

      if (response.success) {
        showToast(`Extracted ${response.files_extracted} files to ${result}`, "success");
        await loadFiles();
        state.expandedFolders.add(targetPath);
        renderFileTree();

        // Auto-refresh git status after uploading folder
        await gitStatus();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast("Failed to upload folder: " + error.message, "error");
    }

    event.target.value = "";
  }

  // ============================================
  // GitHub Integration Functions
  // ============================================

  // Git state management
  const gitState = {
    files: {
      modified: [],
      added: [],
      deleted: [],
      untracked: [],
      staged: [],
      unstaged: []
    },
    selectedFiles: new Set(),
    totalChanges: 0
  };

  async function gitStatus() {
    try {
      setButtonLoading(elements.btnGitStatus, true);

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_status" }),
      });

      setButtonLoading(elements.btnGitStatus, false);

      if (data.success) {
        // Update git state
        gitState.files = data.files || {
          modified: [],
          added: [],
          deleted: [],
          untracked: [],
          staged: [],
          unstaged: []
        };

        // Calculate total changes
        gitState.totalChanges = [
          ...gitState.files.modified,
          ...gitState.files.added,
          ...gitState.files.deleted,
          ...gitState.files.untracked
        ].length;

        // Update UI
        updateGitPanel();

        if (data.has_changes) {
          showToast(`Git: ${gitState.totalChanges} change(s) detected`, "success");
        } else {
          showToast("Working tree clean, no changes", "success");
        }
      }
    } catch (error) {
      setButtonLoading(elements.btnGitStatus, false);
      showToast("Git error: " + error.message, "error");
    }
  }

  async function gitInit() {
    const confirmed = await showConfirmDialog({
      title: "Initialize Git Repository",
      message: "Are you sure you want to initialize a new Git repository in the config directory?",
      confirmText: "Initialize",
      cancelText: "Cancel"
    });

    if (!confirmed) {
      return;
    }

    try {
      showToast("Initializing git repository...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_init" }),
      });

      if (data.success) {
        showToast("Git repository initialized successfully", "success");
      }
    } catch (error) {
      showToast("Git init failed: " + error.message, "error");
    }
  }

  async function gitAddRemote(name, url) {
    try {
      showToast("Adding git remote...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_add_remote", name, url }),
      });

      if (data.success) {
        showToast(data.message, "success");
        return true;
      }
    } catch (error) {
      showToast("Failed to add remote: " + error.message, "error");
      return false;
    }
  }

  async function githubCreateRepo(repoName, description, isPrivate) {
    try {
      showToast("Creating GitHub repository...", "info");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "github_create_repo",
          repo_name: repoName,
          description: description,
          is_private: isPrivate
        }),
      });

      if (data.success) {
        showToast(data.message, "success");

        // Show link to new repo
        if (data.html_url) {
          setTimeout(() => {
            showToast(
              `View your repo: ${data.html_url}`,
              "success",
              10000  // Show for 10 seconds
            );
          }, 2000);
        }

        return data;
      } else {
        showToast("Failed to create repo: " + (data.message || "Unknown error"), "error");
        return null;
      }
    } catch (error) {
      showToast("Failed to create repo: " + error.message, "error");
      return null;
    }
  }

  async function gitGetRemotes() {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_get_remotes" }),
      });

      if (data.success) {
        return data.remotes || {};
      }
    } catch (error) {
      console.error("Failed to get remotes:", error);
      return {};
    }
  }

  async function gitSetCredentials(username, token, rememberMe = true) {
    try {
      showToast("Configuring git credentials...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_set_credentials", username, token, remember_me: rememberMe }),
      });

      if (data.success) {
        showToast("Git credentials configured successfully", "success");
        return true;
      }
    } catch (error) {
      showToast("Failed to set credentials: " + error.message, "error");
      return false;
    }
  }

  async function gitTestConnection() {
    try {
      showToast("Testing connection to remote...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_test_connection" }),
      });

      if (data.success) {
        showToast("Connection successful!", "success");
        return true;
      } else {
        showToast("Connection failed: " + (data.error || "Unknown error"), "error");
        return false;
      }
    } catch (error) {
      showToast("Connection test failed: " + error.message, "error");
      return false;
    }
  }

  async function gitClearCredentials() {
    try {
      showToast("Clearing GitHub credentials...", "info");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_clear_credentials" }),
      });

      if (data.success) {
        showToast("Successfully signed out from GitHub", "success");
        return true;
      } else {
        showToast("Failed to sign out: " + (data.error || "Unknown error"), "error");
        return false;
      }
    } catch (error) {
      showToast("Failed to sign out: " + error.message, "error");
      return false;
    }
  }

  // GitHub OAuth Device Flow
  async function githubDeviceFlowStart(clientId) {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "github_device_flow_start", client_id: clientId }),
      });

      if (data.success) {
        return {
          success: true,
          deviceCode: data.device_code,
          userCode: data.user_code,
          verificationUri: data.verification_uri,
          expiresIn: data.expires_in,
          interval: data.interval
        };
      }
      return { success: false, error: data.message || "Unknown error" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function githubDeviceFlowPoll(clientId, deviceCode) {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "github_device_flow_poll",
          client_id: clientId,
          device_code: deviceCode
        }),
      });

      return data;
    } catch (error) {
      return { success: false, status: "error", message: error.message };
    }
  }

  async function showGithubDeviceFlowLogin() {
    // Ensure any previous polling timer is stopped before starting a new one
    if (activePollTimer) {
      clearInterval(activePollTimer);
      activePollTimer = null;
    }
    // Shared Blueprint Studio OAuth Client ID
    // This is public and safe to share - all users can use it
    const SHARED_CLIENT_ID = "Ov23liKHRfvPI4p0eN2f";

    // Load custom Client ID from localStorage (for advanced users who want their own)
    const customClientId = localStorage.getItem("githubOAuthClientId") || "";

    // Use custom if provided, otherwise use shared
    const finalClientId = customClientId || SHARED_CLIENT_ID;

    // Start device flow immediately (no prompt needed!)
    showToast("Starting GitHub login...", "success");
    const flowData = await githubDeviceFlowStart(finalClientId);

    if (!flowData.success) {
      showToast("Failed to start GitHub login: " + (flowData.error || "Unknown error"), "error");
      return;
    }

    // Show device code modal
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = "Login with GitHub";

    modalBody.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="margin-bottom: 20px;">
          <span class="material-icons" style="font-size: 48px; color: #4caf50;">verified_user</span>
        </div>
        <h3>Authenticate with GitHub</h3>
        <p>Visit this URL in your browser:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <a href="${flowData.verificationUri}" target="_blank" style="color: #2196f3; font-size: 18px; text-decoration: none;">
            ${flowData.verificationUri}
          </a>
        </div>
        <p>Enter this code:</p>
        <div style="background: #2196f3; color: white; padding: 20px; border-radius: 8px; margin: 15px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
          ${flowData.userCode}
        </div>
        <div id="device-flow-status" style="margin-top: 20px; color: #666;">
          <span class="material-icons" style="animation: spin 1s linear infinite;">sync</span>
          <p>Waiting for authorization...</p>
        </div>
        <button class="btn-primary" id="btn-check-auth-now" style="width: 100%; padding: 10px; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px;">
            <span class="material-icons">refresh</span>
            Check Now
        </button>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "500px";

    // Hide default modal buttons
    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Function to clean up and close the Device Flow modal
    const closeDeviceFlow = () => {
      if (activePollTimer) {
        clearInterval(activePollTimer);
        activePollTimer = null;
      }
      modalOverlay.classList.remove("visible");

      // Reset modal to default state (don't try to restore saved state)
      resetModalToDefault();

      // Remove this specific overlay click handler
      modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    // Start polling
    let pollInterval = flowData.interval * 1000;
    const maxPolls = Math.floor(flowData.expiresIn / flowData.interval);
    let pollCount = 0;

    activePollTimer = setInterval(async () => {
      pollCount++;

      if (pollCount > maxPolls) {
        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
          statusDiv.innerHTML = `
            <span class="material-icons" style="color: #f44336;">error</span>
            <p style="color: #f44336;">Login expired. Please try again.</p>
          `;
        }
        showToast("GitHub login expired", "error");
        // The timer will be cleared inside closeDeviceFlow
        setTimeout(() => closeDeviceFlow(), 2000);
        return;
      }

      const result = await githubDeviceFlowPoll(finalClientId, flowData.deviceCode);

      if (result.success && result.status === "authorized") {
        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
          statusDiv.innerHTML = `
            <span class="material-icons" style="color: #4caf50;">check_circle</span>
            <p style="color: #4caf50;">Successfully logged in as ${result.username}!</p>
          `;
        }
        showToast(`Successfully logged in as ${result.username}!`, "success");

        // The timer will be cleared inside closeDeviceFlow
        setTimeout(() => {
          closeDeviceFlow();
        }, 2000);
      } else if (result.status === "expired") {
        showToast("GitHub login expired", "error");
        setTimeout(() => closeDeviceFlow(), 1000);
      } else if (result.status === "denied") {
        showToast("GitHub login denied", "error");
        setTimeout(() => closeDeviceFlow(), 1000);
      } else if (result.status === "slow_down") {
        // Increase polling interval
        pollInterval = pollInterval * 1.5;
      }
      // If pending, just continue polling
    }, pollInterval);

    // Overlay click handler (defined separately so we can remove it)
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeDeviceFlow();
      }
    };

    modalOverlay.addEventListener("click", overlayClickHandler);

    const btnCheckAuthNow = document.getElementById("btn-check-auth-now");
    if (btnCheckAuthNow) {
      btnCheckAuthNow.addEventListener("click", async () => {
        btnCheckAuthNow.disabled = true; // Disable to prevent spamming
        const btnTextSpan = btnCheckAuthNow.querySelector('span:not(.material-icons)');
        if (btnTextSpan) btnTextSpan.textContent = "Checking...";
        const btnIcon = btnCheckAuthNow.querySelector('.material-icons');
        if (btnIcon) btnIcon.classList.add('spinning');

        const statusDiv = document.getElementById("device-flow-status");
        if (statusDiv) {
            statusDiv.querySelector('p').textContent = "Checking status...";
        }


        const result = await githubDeviceFlowPoll(finalClientId, flowData.deviceCode);

        if (btnIcon) btnIcon.classList.remove('spinning');

        if (result.success && result.status === "authorized") {
          if (statusDiv) {
            statusDiv.innerHTML = `
              <span class="material-icons" style="color: #4caf50;">check_circle</span>
              <p style="color: #4caf50;">Successfully logged in as ${result.username}!</p>
            `;
          }
          showToast(`Successfully logged in as ${result.username}!`, "success");
          if (activePollTimer) {
            clearInterval(activePollTimer);
            activePollTimer = null;
          }
          setTimeout(() => {
            closeDeviceFlow();
          }, 2000);
        } else if (result.status === "pending") {
          if (statusDiv) {
            statusDiv.querySelector('p').textContent = "Still waiting for authorization...";
          }
          showToast("Still waiting for authorization. Please complete login on GitHub.", "info", 3000);
        } else if (result.status === "slow_down") {
          if (statusDiv) {
            statusDiv.querySelector('p').textContent = "GitHub requests slower polling. Waiting...";
          }
          showToast("GitHub requests slower polling. Automatic check interval increased.", "warning", 3000);
          pollInterval = pollInterval * 1.5; // Update pollInterval for auto-polling
        } else if (result.status === "expired") {
          if (statusDiv) {
            statusDiv.innerHTML = `
              <span class="material-icons" style="color: #f44336;">error</span>
              <p style="color: #f44336;">Login expired. Please try again.</p>
            `;
          }
          showToast("GitHub login expired", "error");
          if (activePollTimer) {
            clearInterval(activePollTimer);
            activePollTimer = null;
          }
          setTimeout(() => closeDeviceFlow(), 2000);
        } else if (result.status === "denied") {
          if (statusDiv) {
            statusDiv.innerHTML = `
              <span class="material-icons" style="color: #f44336;">error</span>
              <p style="color: #f44336;">Login denied by user.</p>
            `;
          }
          showToast("GitHub login denied", "error");
          if (activePollTimer) {
            clearInterval(activePollTimer);
            activePollTimer = null;
          }
          setTimeout(() => closeDeviceFlow(), 2000);
        } else {
            // Generic error or other unexpected status
            showToast("Error checking status: " + (result.message || "Unknown error"), "error");
            if (statusDiv) {
                statusDiv.querySelector('p').textContent = "Error checking status. Waiting...";
            }
        }
        btnCheckAuthNow.disabled = false; // Re-enable button
        if (btnTextSpan) btnTextSpan.textContent = "Check Now";
      });
    }
  }

  async function gitStage(files) {
    if (!files || files.length === 0) return;

    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_stage", files }),
      });

      if (data.success) {
        showToast(data.message, "success");
        await gitStatus(); // Refresh status
      } else {
        // Error returned from backend
        const errorMsg = data.message || "";
        if (errorMsg.includes("index.lock") || errorMsg.includes("File exists")) {
          showToast("Git lock detected. Staging failed.", "error", 0, {
            text: "Clean & Retry",
            callback: async () => {
              await handleGitLockAndRetry(files);
            }
          });
        } else {
          showToast("Failed to stage files: " + errorMsg, "error");
        }
      }
    } catch (error) {
      // Exception thrown (500 error, network error, etc.)
      const errorMsg = error.message || "";
      if (errorMsg.includes("index.lock") || errorMsg.includes("File exists")) {
        showToast("Git lock detected. Staging failed.", "error", 0, {
          text: "Clean & Retry",
          callback: async () => {
            await handleGitLockAndRetry(files);
          }
        });
      } else {
        showToast("Failed to stage files: " + errorMsg, "error");
      }
    }
  }

  // Handle Git lock file cleanup and retry staging
  async function handleGitLockAndRetry(files) {
    const cleaned = await gitCleanLocks();

    if (cleaned) {
      // Wait a moment for filesystem
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retry the stage operation
      try {
        const retryData = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "git_stage", files }),
        });

        if (retryData.success) {
          showToast(retryData.message, "success");
          await gitStatus();
        } else {
          showToast("Failed to stage after cleaning locks. Try again or restart Home Assistant.", "error");
        }
      } catch (retryError) {
        showToast("Failed to stage after cleaning locks. Try again or restart Home Assistant.", "error");
      }
    } else {
      showToast("Could not clean lock files. Please restart Home Assistant.", "error");
    }
  }

  // Clean Git lock files
  async function gitCleanLocks() {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_clean_locks" }),
      });

      if (data.success) {
        showToast(data.message, "success");
        return true;
      } else {
        showToast("Failed to clean Git locks", "error");
        return false;
      }
    } catch (error) {
      showToast("Failed to clean Git locks: " + error.message, "error");
      return false;
    }
  }

  async function gitUnstage(files) {
    if (!files || files.length === 0) return;

    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_unstage", files }),
      });

      if (data.success) {
        showToast(data.message, "success");
        await gitStatus(); // Refresh status
      }
    } catch (error) {
      showToast("Failed to unstage files: " + error.message, "error");
    }
  }

  async function gitReset(files) {
    if (!files || files.length === 0) return;

    const confirmed = await showConfirmDialog({
      title: "Discard Changes",
      message: `Are you sure you want to discard changes to ${files.length} file(s)?<br><br>This action cannot be undone.`,
      confirmText: "Discard",
      cancelText: "Cancel",
      isDanger: true
    });

    if (!confirmed) {
      return;
    }

    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_reset", files }),
      });

      if (data.success) {
        showToast(data.message, "success");
        await gitStatus(); // Refresh status
      }
    } catch (error) {
      showToast("Failed to reset files: " + error.message, "error");
    }
  }

  async function gitCommit(commitMessage) {
    try {
      showToast("Committing staged changes...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_commit", commit_message: commitMessage }),
      });

      if (data.success) {
        showToast("Changes committed successfully", "success");
        await gitStatus(); // Refresh status
        return true;
      }
    } catch (error) {
      showToast("Git commit failed: " + error.message, "error");
      return false;
    }
  }

  async function gitPull() {
    const confirmed = await showConfirmDialog({
      title: "Pull from Remote",
      message: "Are you sure you want to pull changes from the remote repository? This will update your local files.",
      confirmText: "Pull",
      cancelText: "Cancel"
    });

    if (!confirmed) {
      return;
    }

    try {
      setButtonLoading(elements.btnGitPull, true);
      showToast("Pulling from remote...", "success");

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_pull" }),
      });

      setButtonLoading(elements.btnGitPull, false);

      if (data.success) {
        showToast("Successfully pulled from remote", "success");
        // Reload files to show changes
        await loadFiles();
        await gitStatus();
      }
    } catch (error) {
      setButtonLoading(elements.btnGitPull, false);
      showToast("Git pull failed: " + error.message, "error");
    }
  }

  async function gitPush() {
    try {
      setButtonLoading(elements.btnGitPush, true);
      showToast("Pushing to remote...", "info");

      // First try to push existing commits without committing
      const pushData = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "git_push_only"
        }),
      });

      if (pushData.success) {
        setButtonLoading(elements.btnGitPush, false);
        showToast(pushData.message || "Successfully pushed to remote", "success");
        await gitStatus();
        return;
      }

      // If push_only failed, show the error
      const errorMessage = pushData.message || pushData.error || "Unknown error";

      // If push_only failed, check if it's because of uncommitted changes
      if (errorMessage.includes("uncommitted changes")) {
        setButtonLoading(elements.btnGitPush, false);

        // Ask for commit message and use git_push (commit + push)
        const commitMessage = await showModal({
          title: "Commit & Push Changes",
          placeholder: "Commit message",
          value: "Update configuration via Blueprint Studio",
          hint: "You have uncommitted changes. Enter a message to commit and push:",
        });

        if (!commitMessage) {
          return;
        }

        setButtonLoading(elements.btnGitPush, true);
        showToast("Committing and pushing changes...", "info");

        const data = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "git_push",
            commit_message: commitMessage,
          }),
        });

        setButtonLoading(elements.btnGitPush, false);

        if (data.success) {
          showToast("Successfully pushed to remote", "success");
          await gitStatus();
        } else {
          const errMsg = data.message || data.error || "Unknown error";
          showToast("Push failed: " + errMsg, "error");
        }
      } else if (errorMessage.includes("No commits to push")) {
        setButtonLoading(elements.btnGitPush, false);
        showToast("No commits to push. Please stage and commit files first.", "warning", 0, {
          text: "Open Git Panel",
          callback: () => {
            const gitPanel = document.getElementById("git-panel");
            if (gitPanel) {
              gitPanel.classList.add("visible");
              const gitPanelHeader = gitPanel.querySelector(".git-panel-header"); // Assuming a header or first element to scroll to
              if (gitPanelHeader) {
                gitPanelHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        });
      } else {
        setButtonLoading(elements.btnGitPush, false);
        // Show the actual error message
        showToast("Push failed: " + errorMessage, "error");
      }
    } catch (error) {
      setButtonLoading(elements.btnGitPush, false);
      console.error("Git push exception:", error);
      showToast("Git push failed: " + error.message, "error");
    }
  }

  // Update Git Panel UI
  function updateGitPanel() {
    const panel = document.getElementById("git-panel");
    const container = document.getElementById("git-files-container");
    const badge = document.getElementById("git-changes-count");
    const commitBtn = document.getElementById("btn-commit-staged");

    // Update badge
    badge.textContent = gitState.totalChanges;

    // Show/hide panel based on changes
    if (gitState.totalChanges > 0) {
      panel.classList.add("visible");

      // Auto-resize sidebar if needed to fit stage buttons cleanly
      // Only do this on desktop (not mobile) and if sidebar is too narrow
      if (!isMobile() && elements.sidebar) {
        const currentWidth = parseInt(window.getComputedStyle(elements.sidebar).width);
        // If sidebar is less than 340px, resize to 360px for better button layout
        if (currentWidth < 340) {
          elements.sidebar.style.width = "360px";
        }
      }

      renderGitFiles(container);
    } else {
      container.innerHTML = `
        <div class="git-empty-state">
          <span class="material-icons">check_circle</span>
          <p>No changes detected</p>
          <div class="git-empty-state-actions" style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="btn-secondary" id="btn-git-pull-empty-state">
              <span class="material-icons">cloud_download</span>
              Pull from Remote
            </button>
            <button class="btn-secondary" id="btn-git-refresh-empty-state">
              <span class="material-icons">refresh</span>
              Refresh Status
            </button>
          </div>
        </div>
      `;
    }

    // Enable/disable commit button based on staged files
    commitBtn.disabled = gitState.files.staged.length === 0;
  }

  // Render git files in the panel
  function renderGitFiles(container) {
    const groups = [
      {
        key: "staged",
        title: "Staged Changes",
        files: gitState.files.staged,
        icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M10.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm1.43.75a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.001 4.001 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32z"></path></svg>',
        color: "success"
      },
      {
        key: "modified",
        title: "Modified",
        files: gitState.files.modified.filter(f => !gitState.files.staged.includes(f)),
        icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.5 2.75v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H2.75a.25.25 0 0 0-.25.25Zm1.75 6.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75ZM5 5.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 5.25Z"></path></svg>',
        color: "modified"
      },
      {
        key: "added",
        title: "Added",
        files: gitState.files.added.filter(f => !gitState.files.staged.includes(f)),
        icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20" fill="#51cf66"><path d="M13.25 2.5H2.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4Z"></path></svg>',
        color: "added"
      },
      {
        key: "deleted",
        title: "Deleted",
        files: gitState.files.deleted.filter(f => !gitState.files.staged.includes(f)),
        icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20" fill="#ff6b6b"><path d="M13.25 2.5H2.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1Zm8.5 7.25a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75Z"></path></svg>',
        color: "deleted"
      },
      {
        key: "untracked",
        title: "Untracked",
        files: gitState.files.untracked,
        icon: '<svg class="octicon" viewBox="0 0 16 16" width="20" height="20"><path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path></svg>',
        color: "untracked"
      }
    ];

    let html = "";

    for (const group of groups) {
      if (group.files.length === 0) continue;

      html += `
        <div class="git-file-group" data-group="${group.key}">
          <div class="git-file-group-header">
            <span class="git-file-group-icon ${group.color}">${group.icon}</span>
            <span>${group.title}</span>
            <span class="git-file-group-count">(${group.files.length})</span>
            <span class="material-icons git-file-group-chevron">chevron_right</span>
          </div>
          <div class="git-file-list">
      `;

      for (const file of group.files) {
        const isStaged = gitState.files.staged.includes(file);
        const isUnstaged = gitState.files.unstaged.includes(file);
        const checked = gitState.selectedFiles.has(file) ? 'checked' : '';

        html += `
          <div class="git-file-item" data-file="${file}">
            <input type="checkbox" class="git-file-checkbox" ${checked} data-file-path="${file}" />
            <span class="git-file-icon ${group.color}">${group.icon}</span>
            <span class="git-file-name" title="${file}">${file}</span>
            ${isStaged ? '<span class="git-file-status staged">Staged</span>' : ''}
            ${isUnstaged && !isStaged ? '<span class="git-file-status unstaged">Unstaged</span>' : ''}
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // Toggle git file group collapse
  function toggleGitGroup(groupKey) {
    const group = document.querySelector(`.git-file-group[data-group="${groupKey}"]`);
    if (group) {
      group.classList.toggle("collapsed");
    }
  }

  // Toggle file selection
  function toggleFileSelection(file) {
    if (gitState.selectedFiles.has(file)) {
      gitState.selectedFiles.delete(file);
    } else {
      gitState.selectedFiles.add(file);
    }
  }

  // Stage selected files
  async function stageSelectedFiles() {
    const selectedFiles = Array.from(gitState.selectedFiles);

    if (selectedFiles.length === 0) {
      showToast("No files selected. Check boxes next to files you want to stage.", "warning");
      return;
    }

    await gitStage(selectedFiles);
    gitState.selectedFiles.clear(); // Clear selection after staging
  }

  // Stage all unstaged files
  async function stageAllFiles() {
    const unstagedFiles = [
      ...gitState.files.modified.filter(f => !gitState.files.staged.includes(f)),
      ...gitState.files.added.filter(f => !gitState.files.staged.includes(f)),
      ...gitState.files.deleted.filter(f => !gitState.files.staged.includes(f)),
      ...gitState.files.untracked
    ];

    if (unstagedFiles.length > 0) {
      await gitStage(unstagedFiles);
    }
  }

  // Unstage all staged files
  async function unstageAllFiles() {
    if (gitState.files.staged.length > 0) {
      await gitUnstage(gitState.files.staged);
    }
  }

  // Commit staged files
  async function commitStagedFiles() {
    const commitMessage = await showModal({
      title: "Commit Changes",
      placeholder: "Commit message",
      value: "Update via Blueprint Studio",
      hint: `Committing ${gitState.files.staged.length} staged file(s)`,
    });

    if (!commitMessage) {
      return;
    }

    await gitCommit(commitMessage);
  }

  // ============================================
  // App Settings
  // ============================================

  // Show App Settings modal
  async function showAppSettings() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    // Get current setting from localStorage
    const gitEnabled = localStorage.getItem("gitIntegrationEnabled") !== "false"; // Default to true

    modalTitle.textContent = "Blueprint Studio Settings";

    modalBody.innerHTML = `
      <div class="git-settings-content">
        <div class="git-settings-section">
          <div class="git-settings-label">Features</div>

          <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
            <div style="flex: 1;">
              <div style="font-weight: 500; margin-bottom: 4px;">GitHub Integration</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Push/pull configs to GitHub, stage changes, and manage commits</div>
            </div>
            <label class="toggle-switch" style="margin-left: 16px;">
              <input type="checkbox" id="git-integration-toggle" ${gitEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: 8px; font-size: 13px;">
            <span class="material-icons" style="font-size: 16px; vertical-align: middle; color: var(--info-color, #2196f3);">info</span>
            <span style="margin-left: 8px;">Changes will take effect immediately</span>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "500px";

    // Hide default modal buttons
    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Function to clean up and close the Settings modal
    const closeSettings = () => {
      modalOverlay.classList.remove("visible");

      // Reset modal to default state (don't try to restore saved state)
      resetModalToDefault();

      // Remove overlay click handler
      modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    // Overlay click handler
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeSettings();
      }
    };

    modalOverlay.addEventListener("click", overlayClickHandler);

    // Handle Git integration toggle
    const gitToggle = document.getElementById("git-integration-toggle");
    if (gitToggle) {
      gitToggle.addEventListener("change", (e) => {
        const enabled = e.target.checked;
        localStorage.setItem("gitIntegrationEnabled", enabled);
        applyGitVisibility();
        showToast(enabled ? "GitHub integration enabled" : "GitHub integration disabled", "success");
      });
    }
  }

  // Apply Git visibility based on localStorage setting
  function applyGitVisibility() {
    const gitEnabled = localStorage.getItem("gitIntegrationEnabled") !== "false"; // Default to true

    if (gitEnabled) {
      document.body.classList.remove("git-disabled");
    } else {
      document.body.classList.add("git-disabled");
    }
  }

  // ============================================
  // Git Settings
  // ============================================

  // Show Git Settings modal
  async function showGitSettings() {
    // Get current remotes
    const remotes = await gitGetRemotes();

    // Get saved credentials
    const credentialsData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_get_credentials" }),
    });

    const savedUsername = credentialsData.has_credentials ? credentialsData.username : "";
    const hasCredentials = credentialsData.has_credentials;

    // Check if OAuth Client ID is saved
    const savedClientId = localStorage.getItem("githubOAuthClientId") || "";
    const hasOAuthSetup = savedClientId.length > 0;

    // Create modal content
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = "Git Settings";

    let remotesHtml = "";
    if (Object.keys(remotes).length > 0) {
      remotesHtml = '<div class="git-settings-section"><div class="git-settings-label">Current Remotes</div>';
      for (const [name, url] of Object.entries(remotes)) {
        remotesHtml += `
          <div class="git-remote-item">
            <span class="git-remote-name">${name}</span>
            <span class="git-remote-url">${url}</span>
          </div>
        `;
      }
      remotesHtml += '</div>';
    }

    let credentialsStatusHtml = "";
    if (hasCredentials) {
      credentialsStatusHtml = `
        <div class="git-settings-info" style="color: #4caf50; margin-bottom: 12px;">
          <span class="material-icons">check_circle</span>
          <span>You are logged in as <strong>${savedUsername}</strong></span>
        </div>
        <button id="btn-github-signout" style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.15s;">
          <span class="material-icons">logout</span>
          <span>Sign Out</span>
        </button>
      `;
    }

    modalBody.innerHTML = `
      <div class="git-settings-content">
        ${remotesHtml}

        ${hasCredentials ? `
        <div class="git-settings-section" style="background: var(--primary-background-color); padding: 16px; border-radius: 8px; border: 2px dashed #2196f3;">
          <div class="git-settings-label" style="color: #1976d2; font-weight: 600;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 4px;">add_circle</span>
            Quick Start: Create New GitHub Repository
          </div>
          <div class="git-settings-info" style="margin-bottom: 12px; color: #f0f7ff;">
            Create a new repository on GitHub and automatically connect it to Blueprint Studio.
          </div>
          <button class="btn-primary" id="btn-create-github-repo" style="width: 100%; padding: 12px; font-size: 15px;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">rocket_launch</span>
            Create New GitHub Repository
          </button>
        </div>

        <div style="display: flex; align-items: center; text-align: center; margin: 20px 0; color: #666;">
          <div style="flex-grow: 1; border-bottom: 1px solid #ddd;"></div>
          <span style="flex-shrink: 0; padding: 0 10px; background: var(--primary-background-color);">OR Connect Existing Repo</span>
          <div style="flex-grow: 1; border-bottom: 1px solid #ddd;"></div>
        </div>
        ` : ''}

        <div class="git-settings-section">
          <div class="git-settings-label">Repository URL</div>
          <input type="text" class="git-settings-input" id="git-repo-url"
                 placeholder="https://github.com/username/repo.git"
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="git-settings-buttons">
            <button class="btn-secondary" id="btn-git-init-modal">Init Repo</button>
            <button class="btn-primary" id="btn-save-git-remote">Save Remote</button>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">
            <svg height="20" width="20" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 8px; fill: currentColor;">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            GitHub Authentication
          </div>

          ${credentialsStatusHtml}

          ${!hasCredentials ? `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <div style="color: white; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <span class="material-icons">verified_user</span>
                Recommended: OAuth Login
              </div>
              <div style="color: rgba(255,255,255,0.9); font-size: 13px; margin-bottom: 12px;">
                Secure authentication via GitHub OAuth - no tokens to manage!
              </div>
              <button class="btn-primary" id="btn-github-device-login" style="width: 100%; padding: 12px; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; background: white; color: #667eea; font-weight: 600;">
                <svg height="20" width="20" viewBox="0 0 16 16" style="fill: #667eea;">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span>Login with GitHub</span>
              </button>
            </div>

            <div style="text-align: center; margin: 24px 0; position: relative;">
              <div style="border-top: 1px solid var(--border-color);"></div>
              <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--modal-bg); padding: 0 12px; font-size: 12px; color: var(--text-secondary); font-weight: 600;">OR USE PERSONAL ACCESS TOKEN</span>
            </div>
          ` : ''}

          ${hasCredentials ? `
            <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
              <div class="git-settings-label">Update Credentials</div>
            </div>
          ` : ''}

          <input type="text" class="git-settings-input" id="git-username"
                 placeholder="GitHub username"
                 value="${savedUsername}"
                 autocomplete="username" autocorrect="off" autocapitalize="off" spellcheck="false"
                 style="margin-bottom: 8px;" />
          <input type="password" class="git-settings-input" id="git-token"
                 placeholder="${hasCredentials ? 'Enter new token to update (leave blank to keep current)' : 'Personal Access Token'}"
                 autocomplete="off"
                 style="margin-bottom: 12px;" />

          <label for="git-remember-me" style="display: flex; align-items: center; padding: 12px; background: var(--bg-tertiary); border-radius: 6px; cursor: pointer; margin-bottom: 12px; transition: background 0.15s;">
            <input type="checkbox" id="git-remember-me" ${hasCredentials ? 'checked' : ''} style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-color);" />
            <div style="flex: 1;">
              <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Remember me</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Keep me logged in after restart</div>
            </div>
          </label>

          <div class="git-settings-info" style="margin-bottom: 16px;">
            <span class="material-icons">info</span>
            <div>
              <div style="font-weight: 500; margin-bottom: 4px;">Create a Personal Access Token:</div>
              <a href="https://github.com/settings/tokens/new" target="_blank" style="color: var(--accent-color); text-decoration: none;">github.com/settings/tokens/new ↗</a>
              <div style="margin-top: 4px; font-size: 12px;">Required scope: <code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 3px;">repo</code></div>
            </div>
          </div>

          <div class="git-settings-buttons">
            <button class="btn-secondary" id="btn-test-git-connection">Test Connection</button>
            <button class="btn-primary" id="btn-save-git-credentials">${hasCredentials ? 'Update' : 'Save'} Credentials</button>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Troubleshooting</div>
          <div class="git-settings-info">
            <span class="material-icons">build</span>
            <span>If Git operations fail with "index.lock" errors, click below to clean lock files.</span>
          </div>
          <button class="btn-secondary" id="btn-clean-git-locks" style="width: 100%;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">delete_sweep</span>
            Clean Git Lock Files
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add("visible");

    // Set wider modal for Git Settings (responsive on mobile via CSS)
    modal.style.maxWidth = "650px";

    // Hide default modal buttons
    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Function to clean up and close the Git Settings modal
    const closeGitSettings = () => {
      modalOverlay.classList.remove("visible");

      // Reset modal to default state (don't try to restore saved state)
      resetModalToDefault();

      // Remove this specific overlay click handler
      modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    // Overlay click handler (defined separately so we can remove it)
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeGitSettings();
      }
    };

    // Attach overlay click handler
    modalOverlay.addEventListener("click", overlayClickHandler);

    // Attach event handlers for Git Settings modal buttons (use once to prevent duplicates)
    const btnGitInitModal = document.getElementById("btn-git-init-modal");
    const btnSaveGitRemote = document.getElementById("btn-save-git-remote");
    const btnCreateGithubRepo = document.getElementById("btn-create-github-repo");
    const btnGithubDeviceLogin = document.getElementById("btn-github-device-login");
    const btnGithubSignout = document.getElementById("btn-github-signout");
    const btnTestGitConnection = document.getElementById("btn-test-git-connection");
    const btnSaveGitCredentials = document.getElementById("btn-save-git-credentials");
    const btnCleanGitLocks = document.getElementById("btn-clean-git-locks");

    if (btnGitInitModal) {
      btnGitInitModal.addEventListener("click", gitInit, { once: true });
    }
    if (btnSaveGitRemote) {
      btnSaveGitRemote.addEventListener("click", async () => {
        await saveGitRemote();
        closeGitSettings();
      }, { once: true });
    }
    if (btnGithubDeviceLogin) {
      btnGithubDeviceLogin.addEventListener("click", async () => {
        closeGitSettings();  // Close Git Settings first
        await showGithubDeviceFlowLogin();
      }, { once: true });
    }
    if (btnGithubSignout) {
      btnGithubSignout.addEventListener("click", async () => {
        const confirmed = await showConfirmDialog({
          title: "Sign Out from GitHub",
          message: "Are you sure you want to sign out?<br><br>Your saved credentials will be removed and you'll need to login again to use GitHub features.",
          confirmText: "Sign Out",
          cancelText: "Cancel",
          isDanger: true
        });

        if (confirmed) {
          await gitClearCredentials();
          closeGitSettings();
          // Reopen settings to show updated state
          setTimeout(() => showGitSettings(), 300);
        }
      }, { once: true });
    }
    if (btnTestGitConnection) {
      btnTestGitConnection.addEventListener("click", testGitConnection, { once: true });
    }
    if (btnSaveGitCredentials) {
      btnSaveGitCredentials.addEventListener("click", async () => {
        await saveGitCredentials();
        closeGitSettings();
      }, { once: true });
    }
    if (btnCleanGitLocks) {
      btnCleanGitLocks.addEventListener("click", async () => {
        showToast("Cleaning Git lock files...", "info");
        const success = await gitCleanLocks();
        if (success) {
          showToast("Git lock files cleaned successfully", "success");
        } else {
          showToast("No lock files found or failed to clean", "warning");
        }
      }, { once: true });
    }
    if (btnCreateGithubRepo) {
      btnCreateGithubRepo.addEventListener("click", async () => {
        await showCreateGithubRepoDialog();
      }, { once: true });
    }

    // Mobile optimization: prevent iOS zoom on input focus
    if (isMobile()) {
      const inputs = modalBody.querySelectorAll('.git-settings-input');
      inputs.forEach(input => {
        // Ensure font-size is 16px on mobile to prevent zoom
        input.style.fontSize = '16px';
      });
    }
  }

  async function showCreateGithubRepoDialog() {
    // Check if logged in
    const credentialsData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "git_get_credentials" }),
    });

    if (!credentialsData.has_credentials) {
      showToast("Please login with GitHub first", "error");
      return;
    }

    // Create modal content
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = "Create GitHub Repository";

    modalBody.innerHTML = `
      <div class="git-settings-content">
        <div class="git-settings-section">
          <div class="git-settings-label">Repository Name *</div>
          <input type="text" class="git-settings-input" id="new-repo-name"
                 placeholder="home-assistant-config"
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="git-settings-info" style="font-size: 12px; margin-top: 4px;">
            Will be created as: ${credentialsData.username}/<span id="repo-name-preview">repository-name</span>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Description (Optional)</div>
          <input type="text" class="git-settings-input" id="new-repo-description"
                 placeholder="My Home Assistant configuration"
                 autocomplete="off" />
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Visibility</div>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px;">
            <input type="radio" name="repo-visibility" value="private" checked style="margin-right: 8px;">
            <div>
              <div style="font-weight: 500;">Private (Recommended)</div>
              <div style="font-size: 12px; color: #666;">Only you can see this repository</div>
            </div>
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px;">
            <input type="radio" name="repo-visibility" value="public" style="margin-right: 8px;">
            <div>
              <div style="font-weight: 500;">Public</div>
              <div style="font-size: 12px; color: #666;">Anyone can see this repository</div>
            </div>
          </label>
        </div>

        <div class="git-settings-buttons">
          <button class="btn-secondary" id="btn-cancel-create-repo">Cancel</button>
          <button class="btn-primary" id="btn-confirm-create-repo">
            <span class="material-icons" style="vertical-align: middle; margin-right: 4px; font-size: 18px;">add</span>
            Create Repository
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "500px";

    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Cleanup function
    const closeDialog = () => {
      modalOverlay.classList.remove("visible");

      // Reset modal to default state (don't try to restore saved state)
      resetModalToDefault();

      modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    // Overlay click handler
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeDialog();
      }
    };
    modalOverlay.addEventListener("click", overlayClickHandler);

    // Update preview as user types
    const repoNameInput = document.getElementById("new-repo-name");
    const repoNamePreview = document.getElementById("repo-name-preview");
    repoNameInput.addEventListener("input", () => {
      repoNamePreview.textContent = repoNameInput.value || "repository-name";
    });

    // Cancel button
    document.getElementById("btn-cancel-create-repo").addEventListener("click", () => {
      closeDialog();
    }, { once: true });

    // Create button
    document.getElementById("btn-confirm-create-repo").addEventListener("click", async () => {
      const repoName = repoNameInput.value.trim();
      const description = document.getElementById("new-repo-description").value.trim();
      const isPrivate = document.querySelector('input[name="repo-visibility"]:checked').value === "private";

      if (!repoName) {
        showToast("Repository name is required", "error");
        return;
      }

      // Validate repo name format
      if (!/^[a-zA-Z0-9._-]+$/.test(repoName)) {
        showToast("Repository name can only contain letters, numbers, dots, hyphens, and underscores", "error");
        return;
      }

      closeDialog();

      // Create the repo
      await githubCreateRepo(repoName, description, isPrivate);

      // Refresh git status to show the new repo is ready
      await gitStatus();
    }, { once: true });
  }

  // Save git remote
  async function saveGitRemote() {
    const url = document.getElementById("git-repo-url")?.value;
    if (!url) {
      showToast("Please enter a repository URL", "error");
      return;
    }

    const success = await gitAddRemote("origin", url);
    if (success) {
      // Refresh settings modal to show updated remotes
      setTimeout(() => showGitSettings(), 500);
    }
  }

  // Save git credentials
  async function saveGitCredentials() {
    const username = document.getElementById("git-username")?.value;
    const token = document.getElementById("git-token")?.value;
    const rememberMe = document.getElementById("git-remember-me")?.checked ?? true;

    if (!username || !token) {
      showToast("Please enter both username and token", "error");
      return;
    }

    await gitSetCredentials(username, token, rememberMe);
  }

  // Test git connection
  async function testGitConnection() {
    await gitTestConnection();
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
    renderRecentFilesPanel(); // Call to render recent files
    renderFavoritesPanel();  // Render favorites next
    elements.fileTree.innerHTML = "";
    renderTreeLevel(state.fileTree, elements.fileTree, 0);
    updateToggleAllButton(); // Update the button state
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

      // Gesture detection for mobile
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTouchMove = false;

      item.addEventListener("touchstart", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isTouchMove = false;
      });

      item.addEventListener("touchmove", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);

        // If moved more than 10px, consider it scrolling
        if (deltaX > 10 || deltaY > 10) {
          isTouchMove = true;
        }
      });

      item.addEventListener("touchend", (e) => {
        if (e.target.closest(".tree-action-btn")) return;

        const touchDuration = Date.now() - touchStartTime;

        // Only trigger if it was a quick tap (not a long press) and not a scroll
        if (!isTouchMove && touchDuration < 300) {
          e.preventDefault();
          e.stopPropagation();
          state.currentFolderPath = folderPath;
          toggleFolder(folderPath);
        }
      });

      item.addEventListener("click", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        // Only handle click on desktop (when not a touch device)
        if (!('ontouchstart' in window)) {
          e.stopPropagation();
          state.currentFolderPath = folderPath;
          toggleFolder(folderPath);
        }
      });

      // Context menu
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, { path: folderPath, isFolder: true });
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

      // Gesture detection for mobile
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTouchMove = false;

      item.addEventListener("touchstart", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isTouchMove = false;
      });

      item.addEventListener("touchmove", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);

        // If moved more than 10px, consider it scrolling
        if (deltaX > 10 || deltaY > 10) {
          isTouchMove = true;
        }
      });

      item.addEventListener("touchend", (e) => {
        if (e.target.closest(".tree-action-btn")) return;

        const touchDuration = Date.now() - touchStartTime;

        // Only trigger if it was a quick tap (not a long press) and not a scroll
        if (!isTouchMove && touchDuration < 300) {
          e.preventDefault();
          e.stopPropagation();
          openFile(file.path);
          if (isMobile()) hideSidebar();
        }
      });

      item.addEventListener("click", (e) => {
        if (e.target.closest(".tree-action-btn")) return;
        // Only handle click on desktop (when not a touch device)
        if (!('ontouchstart' in window)) {
          openFile(file.path);
          if (isMobile()) hideSidebar();
        }
      });

      // Context menu
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, { path: file.path, isFolder: false });
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
    // Optimize touch behavior on mobile devices
    item.style.touchAction = "manipulation";

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

    item.appendChild(chevron);
    item.appendChild(icon);
    item.appendChild(nameSpan);

    // Add file size if it's a file and size is available
    if (!isFolder && itemPath) {
      const file = state.files.find(f => f.path === itemPath);
      if (file && typeof file.size === 'number') {
        const sizeSpan = document.createElement("span");
        sizeSpan.className = "tree-file-size";
        sizeSpan.textContent = formatBytes(file.size);
        sizeSpan.style.marginLeft = "auto"; // Push to the right
        sizeSpan.style.marginRight = "10px"; // Some spacing
        sizeSpan.style.fontSize = "0.75em"; // Smaller font
        sizeSpan.style.color = "var(--text-secondary)"; // Muted color
        item.appendChild(sizeSpan);
      }
    }

    // Add pin button for files only
    if (!isFolder && itemPath) {
      const pinBtn = document.createElement("button");
      pinBtn.className = "tree-action-btn";
      pinBtn.title = isFavorite(itemPath) ? "Unpin from favorites" : "Pin to favorites";
      pinBtn.innerHTML = `<span class="material-icons">${isFavorite(itemPath) ? 'push_pin' : 'push_pin'}</span>`;
      pinBtn.style.color = isFavorite(itemPath) ? 'var(--warning-color)' : '';
      pinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(itemPath);
      });
      actions.appendChild(pinBtn);
    }

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

        // Update recent files
        state.recentFiles = state.recentFiles.filter(p => p !== path); // Remove if already exists
        state.recentFiles.unshift(path); // Add to the beginning
        if (state.recentFiles.length > MAX_RECENT_FILES) {
          state.recentFiles.pop(); // Trim to max size
        }

      } catch (error) {
        return;
      }
    }

    activateTab(tab);
    renderTabs();
    renderFileTree();
    saveSettings();  // Save open tabs state
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

    // Update breadcrumb navigation
    updateBreadcrumb(tab.path);

    // Update current folder path
    state.currentFolderPath = tab.path.split("/").slice(0, -1).join("/");
  }

  // ============================================
  // Breadcrumb Navigation
  // ============================================

  function updateBreadcrumb(path) {
    if (!elements.breadcrumb) return;

    elements.breadcrumb.innerHTML = "";

    if (!path) return;

    const parts = path.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      if (index > 0) {
        currentPath += "/";
      }
      currentPath += part;

      // Create breadcrumb item
      const item = document.createElement("span");
      item.className = "breadcrumb-item";

      const link = document.createElement("span");
      link.className = "breadcrumb-link";
      link.textContent = part;
      link.title = currentPath;

      // Make all parts except the last one clickable to open folder
      if (index < parts.length - 1) {
        const folderPath = currentPath;
        link.style.cursor = "pointer";
        link.addEventListener("click", () => {
          // Expand folder in tree
          expandFolderInTree(folderPath);
        });
      }

      item.appendChild(link);

      // Add separator except for last item
      if (index < parts.length - 1) {
        const separator = document.createElement("span");
        separator.className = "breadcrumb-separator";
        separator.textContent = "›";
        item.appendChild(separator);
      }

      elements.breadcrumb.appendChild(item);
    });
  }

  function expandFolderInTree(folderPath) {
    // This will expand the folder in the file tree
    // The folder is already rendered, we just need to expand it
    const folderElement = document.querySelector(`[data-path="${folderPath}"]`);
    if (folderElement && folderElement.classList.contains("tree-item")) {
      // Trigger click on the folder to expand it
      folderElement.click();
    }
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
        // Clear breadcrumb
        if (elements.breadcrumb) {
          elements.breadcrumb.innerHTML = "";
        }
      }
    }

    renderTabs();
    renderFileTree();
    updateToolbarState();
    saveSettings();  // Save open tabs state
  }

  // ============================================
  // File Operations
  // ============================================

  async function saveCurrentFile() {
    if (!state.activeTab) return;

    const tab = state.activeTab;
    setButtonLoading(elements.btnSave, true);

    const success = await saveFile(tab.path, tab.content);

    setButtonLoading(elements.btnSave, false);

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

    setButtonLoading(elements.btnSaveAll, true);

    for (const tab of modifiedTabs) {
      const success = await saveFile(tab.path, tab.content);
      if (success) {
        tab.originalContent = tab.content;
        tab.modified = false;
      }
    }

    setButtonLoading(elements.btnSaveAll, false);

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

  function updateToggleAllButton() {
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

    // App Settings
    if (elements.btnAppSettings) {
      elements.btnAppSettings.addEventListener("click", showAppSettings);
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

    // Breadcrumb copy button
    if (elements.breadcrumbCopy) {
      elements.breadcrumbCopy.addEventListener("click", () => {
        const path = elements.filePath?.textContent;
        if (path) {
          navigator.clipboard.writeText(path).then(() => {
            // Visual feedback
            elements.breadcrumbCopy.classList.add("copied");
            const icon = elements.breadcrumbCopy.querySelector(".material-icons");
            if (icon) {
              const originalIcon = icon.textContent;
              icon.textContent = "check";
              setTimeout(() => {
                icon.textContent = originalIcon;
                elements.breadcrumbCopy.classList.remove("copied");
              }, 2000);
            }
            showToast("Path copied to clipboard", "success");
          }).catch(() => {
            showToast("Failed to copy path", "error");
          });
        } else {
          showToast("No file open", "warning");
        }
      });
    }

    // Shortcuts overlay close button
    if (elements.shortcutsClose) {
      elements.shortcutsClose.addEventListener("click", hideShortcuts);
    }

    // Close shortcuts on overlay click
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.addEventListener("click", (e) => {
        if (e.target === elements.shortcutsOverlay) {
          hideShortcuts();
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

    // Git buttons
    if (elements.btnGitStatus) {
      elements.btnGitStatus.addEventListener("click", gitStatus);
    }
    if (elements.btnGitPull) {
      elements.btnGitPull.addEventListener("click", gitPull);
    }
    if (elements.btnGitPush) {
      elements.btnGitPush.addEventListener("click", gitPush);
    }

    // Git Settings button
    if (elements.btnGitSettings) {
      elements.btnGitSettings.addEventListener("click", showGitSettings);
    }

    // Git panel buttons
    if (elements.btnGitRefresh) {
      elements.btnGitRefresh.addEventListener("click", gitStatus);
    }
    if (elements.btnGitCollapse) {
      elements.btnGitCollapse.addEventListener("click", () => {
        const panel = document.getElementById("git-panel");
        if (panel) {
          panel.classList.toggle("visible");
          const icon = elements.btnGitCollapse.querySelector(".material-icons");
          if (icon) {
            icon.textContent = panel.classList.contains("visible") ? "expand_less" : "expand_more";
          }
        }
      });
    }
    if (elements.btnStageSelected) {
      elements.btnStageSelected.addEventListener("click", stageSelectedFiles);
    }
    if (elements.btnStageAll) {
      elements.btnStageAll.addEventListener("click", stageAllFiles);
    }
    if (elements.btnUnstageAll) {
      elements.btnUnstageAll.addEventListener("click", unstageAllFiles);
    }
    if (elements.btnCommitStaged) {
      elements.btnCommitStaged.addEventListener("click", commitStagedFiles);
    }

    // Git panel event delegation for dynamically created elements
    const gitFilesContainer = document.getElementById("git-files-container");
    if (gitFilesContainer) {
      // Touch event tracking for mobile gestures
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTouchScroll = false;

      // Click event delegation for group headers AND new empty state buttons
      gitFilesContainer.addEventListener("click", (e) => {
        // Handle git file group header clicks (toggle collapse)
        const groupHeader = e.target.closest(".git-file-group-header");
        if (groupHeader && !isTouchScroll) {
          const groupElement = groupHeader.closest(".git-file-group");
          if (groupElement) {
            const groupKey = groupElement.getAttribute("data-group");
            toggleGitGroup(groupKey);
          }
        }

        // Handle empty state buttons
        const target = e.target.closest('button'); // Get the button itself if clicked on icon/span inside
        if (target) {
          if (target.id === "btn-git-pull-empty-state") {
            gitPull();
          } else if (target.id === "btn-git-refresh-empty-state") {
            gitStatus();
          }
        }
      });

      // Touch start event for detecting scroll vs tap
      gitFilesContainer.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isTouchScroll = false;
      }, { passive: true });

      // Touch move event for detecting scroll
      gitFilesContainer.addEventListener("touchmove", (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = Math.abs(touchY - touchStartY);

        // If user moved more than 10px, consider it a scroll
        if (deltaY > 10) {
          isTouchScroll = true;
        }
      }, { passive: true });

      // Touch end event for tap gestures
      gitFilesContainer.addEventListener("touchend", (e) => {
        const touchDuration = Date.now() - touchStartTime;

        // If it was a quick tap (not a scroll), handle as click
        if (!isTouchScroll && touchDuration < 300) {
          const groupHeader = e.target.closest(".git-file-group-header");
          if (groupHeader) {
            e.preventDefault(); // Prevent double-firing with click event
            const groupElement = groupHeader.closest(".git-file-group");
            if (groupElement) {
              const groupKey = groupElement.getAttribute("data-group");
              toggleGitGroup(groupKey);
            }
          }
        }
      });

      // Change event delegation for checkboxes
      gitFilesContainer.addEventListener("change", (e) => {
        // Handle checkbox changes for file selection
        if (e.target.classList.contains("git-file-checkbox")) {
          const filePath = e.target.getAttribute("data-file-path");
          if (filePath) {
            toggleFileSelection(filePath);
          }
        }
      });
    }

    // Toggle Collapse/Expand all
    if (elements.btnToggleAll) {
      elements.btnToggleAll.addEventListener("click", () => {
        if (state.expandedFolders.size > 0) {
          // Collapse all
          state.expandedFolders.clear();
        } else {
          // Expand all
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
        }
        renderFileTree(); // This will also call updateToggleAllButton
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

    // Welcome screen actions
    if (elements.btnWelcomeNewFile) {
      elements.btnWelcomeNewFile.addEventListener("click", promptNewFile);
    }
    if (elements.btnWelcomeUploadFile) {
      elements.btnWelcomeUploadFile.addEventListener("click", triggerUpload);
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
      // ? - Show keyboard shortcuts help (only if not typing in input/textarea)
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.classList.contains("CodeMirror")
        );
        if (!isTyping) {
          e.preventDefault();
          showShortcuts();
        }
      }

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
        if (elements.shortcutsOverlay.classList.contains("visible")) {
          hideShortcuts();
        } else if (elements.modalOverlay.classList.contains("visible")) {
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

  async function restoreOpenTabs() {
    if (!state._savedOpenTabs || state._savedOpenTabs.length === 0) {
      return;
    }

    // Restore tabs
    for (const tabState of state._savedOpenTabs) {
      // Check if file still exists
      const fileExists = state.files.some(f => f.path === tabState.path);
      if (fileExists) {
        await openFile(tabState.path);
      }
    }

    // Restore active tab
    if (state._savedActiveTabPath) {
      const activeTab = state.openTabs.find(t => t.path === state._savedActiveTabPath);
      if (activeTab) {
        activateTab(activeTab);
        renderTabs();
        renderFileTree();
      }
    }

    // Clear saved state
    delete state._savedOpenTabs;
    delete state._savedActiveTabPath;
  }

  async function init() {
    initElements();
    loadSettings();
    applyTheme();
    applyGitVisibility(); // Apply Git visibility setting
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

    // Restore open tabs after files are loaded
    await restoreOpenTabs();

    updateToolbarState();
    updateStatusBar();

    // Load git status (silently, without toast)
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_status" }),
      });

      if (data.success && data.files) {
        gitState.files = data.files;
        gitState.totalChanges = [
          ...gitState.files.modified,
          ...gitState.files.added,
          ...gitState.files.deleted,
          ...gitState.files.untracked
        ].length;
        updateGitPanel();
      }
    } catch (error) {
      // Silently fail - git might not be initialized
      console.log("Git status not available:", error.message);
    }

    // Start periodic git status polling (every 30 seconds)
    // This catches changes made outside Blueprint Studio
    startGitStatusPolling();
  }

  // Periodic git status polling
  let gitStatusPollingInterval = null;

  function startGitStatusPolling() {
    // Clear any existing interval
    if (gitStatusPollingInterval) {
      clearInterval(gitStatusPollingInterval);
    }

    // Poll every 30 seconds
    gitStatusPollingInterval = setInterval(async () => {
      try {
        // Only poll if git is visible and initialized
        if (!settings.showGit) {
          return;
        }

        const data = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "git_status" }),
        });

        if (data.success && data.files) {
          gitState.files = data.files;
          gitState.totalChanges = [
            ...gitState.files.modified,
            ...gitState.files.added,
            ...gitState.files.deleted,
            ...gitState.files.untracked
          ].length;
          updateGitPanel();
        }
      } catch (error) {
        // Silently fail - don't spam console
      }
    }, 30000); // 30 seconds
  }

  function stopGitStatusPolling() {
    if (gitStatusPollingInterval) {
      clearInterval(gitStatusPollingInterval);
      gitStatusPollingInterval = null;
    }
  }

  // Start the application
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
