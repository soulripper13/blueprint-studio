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
  let HA_ENTITIES = [];

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

    // Entity autocompletion (e.g. light.kitchen)
    // We check the raw text before cursor because CodeMirror tokenizes dots separately
    const lineText = currentLine.slice(0, cursor.ch);
    const entityMatch = lineText.match(/([a-z0-9_]+)\.([a-z0-9_]*)$/);

    if (entityMatch) {
      const fullMatch = entityMatch[0]; // e.g. "light.kit"
      
      // Calculate start position
      const matchStart = cursor.ch - fullMatch.length;
      
      const matchedEntities = HA_ENTITIES.filter(e => e.entity_id.startsWith(fullMatch));
      
      if (matchedEntities.length > 0) {
          suggestions = matchedEntities.map(e => ({
              text: e.entity_id,
              displayText: e.entity_id,
              className: 'ha-hint-entity',
              render: (elem, self, data) => {
                  // Clean icon string
                  const iconName = e.icon ? e.icon.replace('mdi:', '') : 'help-circle';
                  const iconHtml = `<span class="mdi mdi-${iconName}" style="margin-right: 6px; vertical-align: middle;"></span>`;
                  
                  elem.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        ${iconHtml}
                        <span>${data.text}</span>
                        <span class="ha-hint-description" style="margin-left: auto; font-size: 0.8em; opacity: 0.7; padding-left: 10px;">${e.friendly_name || ''}</span>
                    </div>
                  `;
              },
              hint: (cm, self, data) => {
                  cm.replaceRange(data.text, { line: cursor.line, ch: matchStart }, { line: cursor.line, ch: end });
              }
          }));
          
          return {
              list: suggestions,
              from: CodeMirror.Pos(cursor.line, matchStart),
              to: CodeMirror.Pos(cursor.line, end)
          };
      }
    }

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
    showRecentFiles: true, // Show recent files panel
    contextMenuTarget: null,
    currentFolderPath: "",
    editor: null,  // Single shared editor instance
    gitConfig: null,  // Git configuration
    selectionMode: false,
    selectedItems: new Set(),
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
    elements.btnShortcutsHelp = document.getElementById("btn-shortcuts-help");
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
    elements.btnToggleSelect = document.getElementById("btn-toggle-select"); // New selection toggle
    elements.selectionToolbar = document.getElementById("selection-toolbar"); // New toolbar
    elements.selectionCount = document.getElementById("selection-count");
    elements.btnDownloadSelected = document.getElementById("btn-download-selected");
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
    
    // Quick Switcher
    elements.quickSwitcherOverlay = document.getElementById("quick-switcher-overlay");
    elements.quickSwitcherInput = document.getElementById("quick-switcher-input");
    elements.quickSwitcherResults = document.getElementById("quick-switcher-results");

    // Search Widget
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
  }

  // ============================================
  // Utility Functions
  // ============================================

  // List of extensions considered text files that CodeMirror can handle
  const TEXT_FILE_EXTENSIONS = new Set([
    "yaml", "yml", "json", "py", "js", "css", "html", "txt",
    "md", "conf", "cfg", "ini", "sh", "log", "svg", "jinja", "jinja2", "j2", 
  ]);

  function isTextFile(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    return TEXT_FILE_EXTENSIONS.has(ext);
  }

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
      jinja2: { icon: "integration_instructions", class: "default" },
      jinja: { icon: "integration_instructions", class: "default" },  
      j2: { icon: "integration_instructions", class: "default" },  
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
      jinja2: yamlMode,
      jinja: yamlMode,
      j2: yamlMode,
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
      jinja2: "Jinja2",
      jinja: "Jinja",
      j2: "J2",   
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
    // Make error toasts persistent by default (duration 0)
    if (type === "error" && duration === 3000) {
        duration = 0;
    }

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
    } else if (duration > 0) {
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

  function translateYamlError(errorMessage) {
    const translations = [
      {
        pattern: /could not find expected ':',/i,
        translation: "<b>Missing Colon:</b> Every line should be a key-value pair (e.g., `key: value`). The parser couldn't find a colon (:) on or near this line."
      },
      {
        pattern: /mapping values are not allowed here/i,
        translation: "<b>Indentation Error:</b> A line is indented incorrectly. Check that this line and the ones around it have the correct number of spaces. Child items should typically be indented 2 spaces more than their parent."
      },
      {
        pattern: /bad indentation/i,
        translation: "<b>Indentation Error:</b> The number of spaces on this line is incorrect. Ensure it aligns properly with the lines above and below it."
      },
      {
        pattern: /unexpected character/i,
        translation: "<b>Unexpected Character:</b> There's a character on this line that doesn't belong. This can sometimes be caused by a copy-paste error or a typo."
      }
    ];

    for (const rule of translations) {
      if (rule.pattern.test(errorMessage)) {
        // Return the simple explanation along with the original technical error for reference
        return `${rule.translation}<br><br><b>Original Error:</b><br>${errorMessage}`;
      }
    }
    
    // If no specific translation is found, just return the original error
    return errorMessage;
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

  async function loadSettings() {
    try {
      // 1. Fetch from server
      let serverSettings = {};
      try {
          serverSettings = await fetchWithAuth(`${API_BASE}?action=get_settings`);
      } catch (e) {
          console.log("Failed to fetch settings from server, using local fallback");
      }

      // 2. Fetch local (legacy/fallback)
      const localStored = localStorage.getItem(STORAGE_KEY);
      const localSettings = localStored ? JSON.parse(localStored) : {};
      
      // 3. Migration: If server is empty but local exists, migrate to server
      let settings = serverSettings;
      if (Object.keys(serverSettings).length === 0 && (Object.keys(localSettings).length > 0 || localStorage.getItem("onboardingCompleted"))) {
          console.log("Migrating settings to server...");
          settings = { ...localSettings };
          // Migrate root keys
          settings.onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
          settings.gitIntegrationEnabled = localStorage.getItem("gitIntegrationEnabled") !== "false";
          
          // Save back to server immediately
          await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "save_settings", settings: settings }),
          });
      }

      // 4. Apply to State
      state.theme = settings.theme || localSettings.theme || "dark";
      state.showHidden = settings.showHidden || false;
      state.showRecentFiles = settings.showRecentFiles !== false;
      state.favoriteFiles = settings.favoriteFiles || [];
      state.recentFiles = settings.recentFiles || [];
      state.gitConfig = settings.gitConfig || null;
      
      // New state properties for sync
      state.onboardingCompleted = settings.onboardingCompleted ?? (localStorage.getItem("onboardingCompleted") === "true");
      state.gitIntegrationEnabled = settings.gitIntegrationEnabled ?? (localStorage.getItem("gitIntegrationEnabled") !== "false");

      state._savedOpenTabs = settings.openTabs || localSettings.openTabs || [];
      state._savedActiveTabPath = settings.activeTabPath || localSettings.activeTabPath || null;

    } catch (e) {
      console.log("Could not load settings:", e);
    }
  }

  async function saveSettings() {
    try {
      // Save open tabs state
      const openTabsState = state.openTabs.map(tab => ({
        path: tab.path,
        modified: tab.modified
      }));
      const activeTabPath = state.activeTab ? state.activeTab.path : null;

      const settings = {
        theme: state.theme,
        showHidden: state.showHidden,
        showRecentFiles: state.showRecentFiles,
        favoriteFiles: state.favoriteFiles,
        recentFiles: state.recentFiles,
        openTabs: openTabsState,
        activeTabPath: activeTabPath,
        gitConfig: state.gitConfig,
        onboardingCompleted: state.onboardingCompleted,
        gitIntegrationEnabled: state.gitIntegrationEnabled
      };

      // Save to server
      fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_settings", settings: settings }),
      }).catch(e => console.error("Failed to save settings to server:", e));

      // Save to local storage (cache/fallback)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      // Sync legacy keys
      if (state.onboardingCompleted) localStorage.setItem("onboardingCompleted", "true");
      localStorage.setItem("gitIntegrationEnabled", state.gitIntegrationEnabled);

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

    if (!state.showRecentFiles) {
      recentFilesContainer.style.display = "none";
      return;
    }

    // Filter existing files
    const existingRecentFiles = state.recentFiles.filter(filePath => 
      state.files.some(f => f.path === filePath)
    );

    if (existingRecentFiles.length === 0) {
      recentFilesContainer.style.display = "none";
      return;
    }

    recentFilesContainer.style.display = "block";
    recentFilesContainer.innerHTML = '<div class="recent-files-header">Recent Files</div><div class="recent-files-list" id="recent-files-list"></div>';
    const listContainer = document.getElementById("recent-files-list");

    existingRecentFiles.forEach((filePath) => {
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

      listContainer.appendChild(item);
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
    const { title, message, image, placeholder, hint, value = "", confirmText = "Confirm", isDanger = false } = options;

    // Ensure modal is in default state before showing
    resetModalToDefault();

    elements.modalTitle.textContent = title;
    elements.modalConfirm.textContent = confirmText;
    elements.modalConfirm.className = isDanger ? "modal-btn danger" : "modal-btn primary";
    
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
        elements.modalCancel.style.display = "none"; // Hide cancel button
    } else {
        // Input mode
        elements.modalInput.style.display = "";
        elements.modalHint.style.fontSize = "";
        elements.modalHint.style.color = "";
        elements.modalCancel.style.display = ""; // Show cancel button
        elements.modalInput.placeholder = placeholder || "";
        elements.modalInput.value = value;
        elements.modalHint.textContent = hint || "";
        elements.modalInput.focus();
        elements.modalInput.select();
    }

    elements.modalOverlay.classList.add("visible");

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
  // Search Implementation
  // ============================================

  function updateSearchHighlights(query) {
    if (!state.editor) return;
    
    // Remove existing overlay if any
    if (state.searchOverlay) {
      state.editor.removeOverlay(state.searchOverlay);
      state.searchOverlay = null;
    }
    
    if (!query) return;

    // Create a new overlay for all matches
    state.searchOverlay = {
      token: function(stream) {
        if (stream.match(query, true, true)) {
          return "search-match";
        }
        while (stream.next() != null && !stream.match(query, false, true)) {}
        return null;
      }
    };
    
    state.editor.addOverlay(state.searchOverlay);
  }

  function updateMatchStatus(query) {
      if (!state.editor || !query) {
          if (elements.searchCount) elements.searchCount.textContent = "";
          if (state.activeMatchMark) {
             state.activeMatchMark.clear();
             state.activeMatchMark = null;
          }
          return;
      }

      const cursor = state.editor.getSearchCursor(query, null, { caseFold: true });
      let count = 0;
      let currentIdx = -1;
      
      const selFrom = state.editor.getCursor("from");
      const selTo = state.editor.getCursor("to");
      
      // Clear previous active mark
      if (state.activeMatchMark) {
          state.activeMatchMark.clear();
          state.activeMatchMark = null;
      }

      while (cursor.findNext()) {
          count++;
          // Check if this match is the selected one
          // We check if the match range equals the selection range
          if (cursor.from().line === selFrom.line && cursor.from().ch === selFrom.ch &&
              cursor.to().line === selTo.line && cursor.to().ch === selTo.ch) {
              currentIdx = count;
              
              // Highlight this specific match as active
              state.activeMatchMark = state.editor.markText(
                  cursor.from(), 
                  cursor.to(), 
                  { className: "cm-search-active" }
              );
          }
      }
      
      if (elements.searchCount) {
          if (count > 0) {
              if (currentIdx > 0) {
                  elements.searchCount.textContent = `${currentIdx} of ${count}`;
              } else {
                  elements.searchCount.textContent = `${count} found`;
              }
          } else {
              elements.searchCount.textContent = "No results";
          }
      }
  }

  function openSearchWidget(replaceMode = false) {
    if (!elements.searchWidget) return;
    elements.searchWidget.classList.add("visible");
    
    if (replaceMode) {
        elements.searchWidget.classList.add("replace-mode");
        elements.searchReplaceRow.style.display = "flex";
    } else {
        elements.searchWidget.classList.remove("replace-mode");
        elements.searchReplaceRow.style.display = "none";
    }

    if (state.editor) {
        const selection = state.editor.getSelection();
        if (selection) {
            elements.searchFindInput.value = selection;
            updateSearchHighlights(selection);
            updateMatchStatus(selection);
        } else if (elements.searchFindInput.value) {
            updateSearchHighlights(elements.searchFindInput.value);
            updateMatchStatus(elements.searchFindInput.value);
        }
    }
    
    elements.searchFindInput.focus();
    elements.searchFindInput.select();
  }

  function closeSearchWidget() {
    if (!elements.searchWidget) return;
    elements.searchWidget.classList.remove("visible");
    
    // Clear highlights
    if (state.editor && state.searchOverlay) {
        state.editor.removeOverlay(state.searchOverlay);
        state.searchOverlay = null;
    }
    // Clear active mark
    if (state.activeMatchMark) {
        state.activeMatchMark.clear();
        state.activeMatchMark = null;
    }
    
    if (elements.searchCount) elements.searchCount.textContent = "";

    if (state.editor) state.editor.focus();
  }

  function doFind(reverse = false) {
    if (!state.editor) return;
    const query = elements.searchFindInput.value;
    
    // Update highlights
    updateSearchHighlights(query);
    
    if (!query) {
        updateMatchStatus(""); // Clear status
        return;
    }

    // Determine start position based on direction and current selection
    const startPos = state.editor.getCursor(reverse ? "from" : "to");
    
    let cursor = state.editor.getSearchCursor(query, startPos, { caseFold: true });
    
    let found = false;
    
    if (reverse) {
        found = cursor.findPrevious();
    } else {
        found = cursor.findNext();
    }
    
    // Handle wrapping if not found
    if (!found) {
        const wrapStart = reverse 
            ? { line: state.editor.lineCount(), ch: 0 } 
            : { line: 0, ch: 0 };                       
            
        cursor = state.editor.getSearchCursor(query, wrapStart, { caseFold: true });
        
        if (reverse) {
            found = cursor.findPrevious();
        } else {
            found = cursor.findNext();
        }
        
        if (found) {
            showToast("Search wrapped", "info", 1000);
        }
    }

    if (found) {
        state.editor.setSelection(cursor.from(), cursor.to());
        state.editor.scrollIntoView({from: cursor.from(), to: cursor.to()}, 20);
    } else {
        showToast("No match found", "info", 1500);
    }
    
    // Update status/count AFTER selection is set, so we can identify current match
    updateMatchStatus(query);
  }

  function doReplace() {
    if (!state.editor) return;
    const query = elements.searchFindInput.value;
    const replacement = elements.searchReplaceInput.value;
    if (!query) return;

    // Check if current selection matches query
    const selection = state.editor.getSelection();
    if (selection && selection.toLowerCase() === query.toLowerCase()) {
        state.editor.replaceSelection(replacement);
        doFind(); // Find next
    } else {
        doFind(); // Find first
    }
    // Update count after replace
    updateMatchStatus(query);
  }

  function doReplaceAll() {
    if (!state.editor) return;
    const query = elements.searchFindInput.value;
    const replacement = elements.searchReplaceInput.value;
    if (!query) return;

    const cursor = state.editor.getSearchCursor(query, null, { caseFold: true });
    state.editor.operation(() => {
        let count = 0;
        while (cursor.findNext()) {
            cursor.replace(replacement);
            count++;
        }
        showToast(`Replaced ${count} occurrences`, "success");
        // Clear highlights/count since they are gone/changed
        updateSearchHighlights(query);
        updateMatchStatus(query);
    });
  }

  // ============================================
  // Quick Switcher
  // ============================================

  let quickSwitcherSelectedIndex = 0;

  function showQuickSwitcher() {
    if (!elements.quickSwitcherOverlay) return;
    elements.quickSwitcherOverlay.classList.add("visible");
    elements.quickSwitcherInput.value = "";
    elements.quickSwitcherInput.focus();
    updateQuickSwitcherResults("");
  }

  function hideQuickSwitcher() {
    if (!elements.quickSwitcherOverlay) return;
    elements.quickSwitcherOverlay.classList.remove("visible");
  }

  function updateQuickSwitcherResults(query) {
    if (!elements.quickSwitcherResults) return;
    
    query = query.toLowerCase();
    let matches = [];

    // Filter files
    if (!query) {
        // Show recent files if no query
        matches = state.recentFiles.map(path => {
            return state.files.find(f => f.path === path);
        }).filter(f => f); // Filter out nulls
        
        // Fill up with other files up to limit
        if (matches.length < 20) {
            const others = state.files.filter(f => !state.recentFiles.includes(f.path));
            matches = matches.concat(others.slice(0, 20 - matches.length));
        }
    } else {
        // Simple fuzzy: check if name includes query
        matches = state.files.filter(f => f.name.toLowerCase().includes(query));
        
        // Also search paths if few matches
        if (matches.length < 10) {
            const pathMatches = state.files.filter(f => 
                !matches.includes(f) && f.path.toLowerCase().includes(query)
            );
            matches = matches.concat(pathMatches);
        }
    }

    // Limit results
    matches = matches.slice(0, 50);
    quickSwitcherSelectedIndex = 0;

    let html = "";
    matches.forEach((file, index) => {
        const fileIcon = getFileIcon(file.name);
        const isSelected = index === 0 ? "selected" : "";
        
        html += `
            <div class="quick-switcher-item ${isSelected}" data-index="${index}" data-path="${file.path}">
                <span class="material-icons ${fileIcon.class}">${fileIcon.icon}</span>
                <span class="quick-switcher-name">${file.name}</span>
                <span class="quick-switcher-path">${file.path}</span>
            </div>
        `;
    });

    if (matches.length === 0) {
        html = `<div style="padding: 16px; text-align: center; color: var(--text-secondary);">No files found</div>`;
    }

    elements.quickSwitcherResults.innerHTML = html;
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
  // Bulk Selection Functions
  // ============================================

  function toggleSelectionMode() {
    state.selectionMode = !state.selectionMode;
    if (!state.selectionMode) {
        state.selectedItems.clear();
    }
    
    // Update toolbar visibility
    if (elements.selectionToolbar) {
        elements.selectionToolbar.style.display = state.selectionMode ? "flex" : "none";
    }
    
    // Update button active state
    if (elements.btnToggleSelect) {
        elements.btnToggleSelect.classList.toggle("active", state.selectionMode);
    }
    
    updateSelectionCount();
    renderFileTree();
  }

  function handleSelectionChange(path, isSelected) {
    if (isSelected) {
        state.selectedItems.add(path);
    } else {
        state.selectedItems.delete(path);
    }
    updateSelectionCount();
  }

  function updateSelectionCount() {
    if (elements.selectionCount) {
        const count = state.selectedItems.size;
        elements.selectionCount.textContent = `${count} selected`;
        
        if (elements.btnDownloadSelected) {
            elements.btnDownloadSelected.disabled = count === 0;
        }
    }
  }

  async function downloadSelectedItems() {
    if (state.selectedItems.size === 0) return;

    const paths = Array.from(state.selectedItems);
    
    // If only one item is selected, check if it's a file or folder
    if (paths.length === 1) {
        const path = paths[0];
        const isFolder = state.folders.some(f => f.path === path);
        
        if (!isFolder) {
            // Single file selected - download directly
            await downloadFileByPath(path);
            toggleSelectionMode(); // Exit selection mode
            return;
        }
        // Single folder selected - will be zipped by the logic below
    }

    try {
      showGlobalLoading("Preparing bulk download...");

      const response = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "download_multi", paths }),
      });

      hideGlobalLoading();

      if (response.success && response.data) {
        downloadContent(response.filename, response.data, true, "application/zip");
        showToast(`Downloaded ${paths.length} items`, "success");
        
        // Exit selection mode after download
        toggleSelectionMode();
      }
    } catch (error) {
      hideGlobalLoading();
      showToast("Failed to download items: " + error.message, "error");
    }
  }

  // ============================================
  // API Functions
  // ============================================

  async function fetchWithAuth(url, options = {}) {
    let headers = { ...options.headers };
    let token = null;
    let isHassEnvironment = false;

    // Helper to get fresh token
    try {
      if (window.parent && window.parent.hassConnection) {
        isHassEnvironment = true;
        const conn = await window.parent.hassConnection;
        if (conn && conn.auth) {
            if (conn.auth.expired) {
                await conn.auth.refreshAccessToken();
            }
            token = conn.auth.accessToken;
        }
      }
    } catch (e) {
      // If auth fails in HA environment, abort to prevent log spam/bans
      if (isHassEnvironment) {
          throw new Error("Auth refresh failed: " + e.message);
      }
      console.log("Using session authentication");
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else if (isHassEnvironment) {
        // Prevent fallback to cookies if we expect a token
        throw new Error("No authentication token available");
    }

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "same-origin",
    });

    // Handle 401 - Token might have expired during request or wasn't refreshed
    if (response.status === 401) {
        console.log("Received 401, attempting to refresh token...");
        try {
            if (window.parent && window.parent.hassConnection) {
                const conn = await window.parent.hassConnection;
                if (conn && conn.auth) {
                    await conn.auth.refreshAccessToken();
                    token = conn.auth.accessToken;
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                        // Retry request
                        response = await fetch(url, {
                            ...options,
                            headers,
                            credentials: "same-origin",
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to refresh token:", e);
        }
    }

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

  async function loadEntities() {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_entities" }),
      });
      if (data.entities) {
        HA_ENTITIES = data.entities;
      }
    } catch (e) {
      console.log("Failed to load entities for autocomplete", e);
    }
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
      // loadFile must now return the full data object, not just data.content
      return data; // returns {content: ..., is_base64: ...}
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
      // Refresh files to get updated size (including current file's new size)
      await loadFiles();
      // Find the file to get its size
      const fileEntry = state.files.find(f => f.path === path);
      const fileSize = fileEntry && typeof fileEntry.size === 'number' ? ` (${formatBytes(fileEntry.size)})` : '';
      showToast(`Saved ${path.split("/").pop()}${fileSize}`, "success");

      // Auto-refresh git status after saving to show changes immediately
      await checkGitStatusIfEnabled();

      return true;
    } catch (error) {
      showToast("Failed to save: " + error.message, "error");
      return false;
    }
  }

  async function createFile(path, content = "", is_base64 = false) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_file", path, content, is_base64 }),
      });
      showToast(`Created ${path.split("/").pop()}`, "success");
      await loadFiles();
      openFile(path);

      // Auto-refresh git status after creating file
      await checkGitStatusIfEnabled();

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
      await checkGitStatusIfEnabled();

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
      await checkGitStatusIfEnabled();

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
      await checkGitStatusIfEnabled();

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
      await checkGitStatusIfEnabled();

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

  async function uploadFile(path, content, overwrite = false, is_base64 = false) {
    try {
      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload_file", path, content, overwrite, is_base64 }),
      });
      showToast(`Uploaded ${path.split("/").pop()}`, "success");
      await loadFiles();

      // Auto-refresh git status after uploading file
      await checkGitStatusIfEnabled();

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
      const data = await fetchWithAuth( // data will contain { content: ..., is_base64: ... }
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}`
      );
      downloadContent(path.split("/").pop(), data.content, data.is_base64);
    } catch (error) {
      // Error already shown by loadFile
    }
  }

  function downloadContent(filename, content, is_base64 = false, mimeType = "application/octet-stream") {
    let blobContent;
    let blobType = mimeType;

    if (is_base64) {
      const binaryString = atob(content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      blobContent = [bytes];
    } else {
      blobContent = [content];
      if (!blobType || blobType === "application/octet-stream") {
          blobType = "text/plain;charset=utf-8";
      }
    }

    // Create blob and URL
    const blob = new Blob(blobContent, { type: blobType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke after a delay to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 100);

    showToast(`Downloaded ${filename}`, "success");
  }

  function triggerUpload() {
    if (elements.fileUploadInput) {
      elements.fileUploadInput.click();
    }
  }

  async function processUploads(files, targetFolder = null) {
    if (!files || files.length === 0) return;

    const basePath = targetFolder || state.currentFolderPath || "";
    let uploadedCount = 0;
    const totalFiles = files.length;

    showGlobalLoading(`Uploading 0 of ${totalFiles} file(s)...`); 

    for (const file of files) {
      uploadedCount++;
      showGlobalLoading(`Uploading ${uploadedCount} of ${totalFiles} file(s): ${file.name}...`); 

      try {
        const isBinaryFile = !isTextFile(file.name);
        let content;
        if (isBinaryFile) {
          content = await readFileAsBase64(file);
        } else {
          content = await readFileAsText(file);
        }

        let filePath = basePath ? `${basePath}/${file.name}` : file.name;

        // Check if file exists
        const existingFile = state.files.find(f => f.path === filePath);
        if (existingFile) {
          const overwrite = await showConfirmDialog({
            title: "File Already Exists",
            message: `File "${file.name}" already exists in ${basePath || "root"}.<br><br>Do you want to overwrite it?`,
            confirmText: "Overwrite",
            cancelText: "Cancel",
            isDanger: true
          });

          if (!overwrite) {
            continue; 
          }
          await uploadFile(filePath, content, true, isBinaryFile); 
        } else {
          await uploadFile(filePath, content, false, isBinaryFile); 
        }
      } catch (error) {
        showGlobalLoading(`Uploading ${uploadedCount} of ${totalFiles} file(s): ${file.name}...`);
        showToast(`Failed to upload ${file.name}: ${error.message}`, "error");
      }
    }

    hideGlobalLoading();
    showToast(`Successfully uploaded ${totalFiles} file(s).`, "success");
  }

  async function handleFileUpload(event) {
    const files = event.target.files;
    await processUploads(files);
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
        await checkGitStatusIfEnabled();
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
    isInitialized: false,
    hasRemote: false,
    ahead: 0,
    behind: 0,
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

  function isGitEnabled() {
    return localStorage.getItem("gitIntegrationEnabled") !== "false";
  }

  async function checkGitStatusIfEnabled(shouldFetch = false) {
    if (isGitEnabled()) {
        await gitStatus(shouldFetch);
    }
  }

  async function showDiffModal(path) {
    showGlobalLoading("Loading diff...");
    try {
        // 1. Get HEAD content (Old)
        const headData = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_show", path: path }),
        });
        
        let oldContent = "";
        if (headData.success) {
            oldContent = headData.content;
        }

        // 2. Get Current Content (New)
        let newContent = "";
        const tab = state.openTabs.find(t => t.path === path);
        if (tab) {
            newContent = tab.content;
        } else {
            const diskData = await loadFile(path);
            newContent = diskData.content;
        }

        hideGlobalLoading();

        // 3. Setup Modal
        const modalOverlay = document.getElementById("modal-overlay");
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modal-title");
        const modalBody = document.getElementById("modal-body");
        const modalFooter = document.querySelector(".modal-footer");

        resetModalToDefault();
        modal.style.maxWidth = "95vw";
        modal.style.width = "95vw";
        modal.style.height = "85vh";
        modal.style.display = "flex";
        modal.style.flexDirection = "column";
        
        modalTitle.textContent = `Diff: ${path}`;
        modalFooter.style.display = "none";
        
        // Use flex column for body to let MergeView fill it
        modalBody.innerHTML = `<div id="diff-view" style="height: 100%; width: 100%;"></div>`;
        modalBody.style.padding = "0";
        modalBody.style.flex = "1";
        modalBody.style.display = "flex";
        modalBody.style.flexDirection = "column";
        modalBody.style.overflow = "hidden"; // Let CodeMirror handle scroll

        modalOverlay.classList.add("visible");

        // 4. Initialize CodeMirror Merge View
        const target = document.getElementById("diff-view");
        const mode = getEditorMode(path); 

        // Old on Left (origLeft), New on Right (value/main)
        const mergeView = CodeMirror.MergeView(target, {
            value: newContent,
            origLeft: oldContent,
            lineNumbers: true,
            mode: mode,
            theme: state.theme === "light" ? "default" : "material-darker",
            highlightDifferences: true,
            connect: "align",
            collapseIdentical: false,
            readOnly: true,
            revertButtons: false 
        });

        // Cleanup handler
        const closeHandler = () => {
            modalOverlay.classList.remove("visible");
            modalOverlay.removeEventListener("click", overlayClickHandler);
            // Clean up modal styles
            resetModalToDefault();
            modal.style.width = "";
            modal.style.height = "";
            modal.style.display = "";
            modal.style.flexDirection = "";
            modalBody.style.padding = "";
            modalBody.style.flex = "";
            modalBody.style.display = "";
            modalBody.style.overflow = "";
        };
        
        const overlayClickHandler = (e) => {
            if (e.target === modalOverlay) closeHandler();
        };
        modalOverlay.addEventListener("click", overlayClickHandler);
        document.getElementById("modal-close").onclick = closeHandler;

    } catch (error) {
        hideGlobalLoading();
        showToast("Diff failed: " + error.message, "error");
    }
  }

  async function gitStatus(shouldFetch = false) {
    // Double check enabled state (redundant but safe)
    if (!isGitEnabled()) return;

    try {
      setButtonLoading(elements.btnGitStatus, true);

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "git_status",
            fetch: shouldFetch 
        }),
      });

      setButtonLoading(elements.btnGitStatus, false);

      if (data.success) {
        // Update git state
        gitState.isInitialized = data.is_initialized;
        gitState.hasRemote = data.has_remote;
        gitState.ahead = data.ahead || 0;
        gitState.behind = data.behind || 0;
        
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

  async function gitInit(skipConfirm = false) {
    if (!skipConfirm) {
        const confirmed = await showConfirmDialog({
          title: "Initialize Git Repository",
          message: "Are you sure you want to initialize a new Git repository in the config directory?",
          confirmText: "Initialize",
          cancelText: "Cancel"
        });

        if (!confirmed) {
          return false;
        }
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
        // Update state
        gitState.isInitialized = true;
        // Refresh status to be sure
        await gitStatus(); 
        return true;
      } else {
        showToast("Failed to init: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Git init failed: " + error.message, "error");
    }
    return false;
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
    return new Promise(async (resolve) => {
        // Ensure any previous polling timer is stopped before starting a new one
        if (activePollTimer) {
          clearInterval(activePollTimer);
          activePollTimer = null;
        }
        // Shared Blueprint Studio OAuth Client ID
        const SHARED_CLIENT_ID = "Ov23liKHRfvPI4p0eN2f";

        const customClientId = localStorage.getItem("githubOAuthClientId") || "";
        const finalClientId = customClientId || SHARED_CLIENT_ID;

        showToast("Starting GitHub login...", "success");
        const flowData = await githubDeviceFlowStart(finalClientId);

        if (!flowData.success) {
          showToast("Failed to start GitHub login: " + (flowData.error || "Unknown error"), "error");
          resolve(false);
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

        if (modalFooter) {
          modalFooter.style.display = "none";
        }

        // Function to clean up and close
        const closeDeviceFlow = (result) => {
          if (activePollTimer) {
            clearInterval(activePollTimer);
            activePollTimer = null;
          }
          modalOverlay.classList.remove("visible");
          resetModalToDefault();
          modalOverlay.removeEventListener("click", overlayClickHandler);
          resolve(result);
        };

        // Start polling
        let pollInterval = (flowData.interval || 5) * 1000;
        if (pollInterval < 5000) pollInterval = 5000; // Safety minimum
        const maxPolls = Math.floor(flowData.expiresIn / (pollInterval / 1000)) || 180; // Default ~15 mins
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
            setTimeout(() => closeDeviceFlow(false), 2000);
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
            setTimeout(() => closeDeviceFlow(true), 2000);
          } else if (result.status === "expired") {
            showToast("GitHub login expired", "error");
            setTimeout(() => closeDeviceFlow(false), 1000);
          } else if (result.status === "denied") {
            showToast("GitHub login denied", "error");
            setTimeout(() => closeDeviceFlow(false), 1000);
          } else if (result.status === "slow_down") {
            pollInterval = pollInterval * 1.5;
          }
        }, pollInterval);

        const overlayClickHandler = (e) => {
          if (e.target === modalOverlay) {
            closeDeviceFlow(false);
          }
        };

        // Delay adding listener to prevent immediate closing from bubbling events
        setTimeout(() => {
            modalOverlay.addEventListener("click", overlayClickHandler);
        }, 300);

        const btnCheckAuthNow = document.getElementById("btn-check-auth-now");
        if (btnCheckAuthNow) {
          btnCheckAuthNow.addEventListener("click", async () => {
            btnCheckAuthNow.disabled = true;
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
              setTimeout(() => closeDeviceFlow(true), 2000);
            } else if (result.status === "pending") {
              if (statusDiv) statusDiv.querySelector('p').textContent = "Still waiting for authorization...";
              showToast("Still waiting for authorization...", "info", 3000);
            } else if (result.status === "slow_down") {
              if (statusDiv) statusDiv.querySelector('p').textContent = "GitHub requests slower polling. Waiting...";
              showToast("GitHub requests slower polling...", "warning", 3000);
              pollInterval = pollInterval * 1.5;
            } else if (result.status === "expired") {
              if (statusDiv) statusDiv.innerHTML = `<span class="material-icons" style="color: #f44336;">error</span><p style="color: #f44336;">Login expired.</p>`;
              showToast("GitHub login expired", "error");
              setTimeout(() => closeDeviceFlow(false), 2000);
            } else if (result.status === "denied") {
              if (statusDiv) statusDiv.innerHTML = `<span class="material-icons" style="color: #f44336;">error</span><p style="color: #f44336;">Login denied.</p>`;
              showToast("GitHub login denied", "error");
              setTimeout(() => closeDeviceFlow(false), 2000);
            } else {
                showToast("Error checking status: " + (result.message || "Unknown error"), "error");
                if (statusDiv) statusDiv.querySelector('p').textContent = "Error checking status. Waiting...";
            }
            btnCheckAuthNow.disabled = false;
            if (btnTextSpan) btnTextSpan.textContent = "Check Now";
          });
        }
    });
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

  // Repair Git Index
  async function gitRepairIndex() {
    try {
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_repair_index" }),
      });

      if (data.success) {
        showToast(data.message, "success");
        return true;
      } else {
        showToast("Failed to repair Git index", "error");
        return false;
      }
    } catch (error) {
      showToast("Failed to repair Git index: " + error.message, "error");
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
      const errorMsg = error.message || "";
      if (errorMsg.includes("index.lock") || errorMsg.includes("File exists")) {
        showToast("Git lock detected. Commit failed.", "error", 0, {
          text: "Clean & Retry",
          callback: async () => {
            const cleaned = await gitCleanLocks();
            if (cleaned) {
                // We can't easily retry the commit because we lost the message context
                // But cleaning allows them to try again immediately
                showToast("Locks cleaned. Please try committing again.", "success");
            }
          }
        });
      } else if (errorMsg.includes("index file smaller than expected") || errorMsg.includes("bad index file")) {
        showToast("Git repository corrupted. Repair needed.", "error", 0, {
          text: "Repair Repo",
          callback: async () => {
            const repaired = await gitRepairIndex();
            if (repaired) {
                showToast("Repository repaired. Please try again.", "success");
                await gitStatus();
            }
          }
        });
      } else {
        showToast("Git commit failed: " + error.message, "error");
      }
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
        await checkGitStatusIfEnabled();
        
        // Reload active tab content to reflect changes
        if (state.activeTab) {
            await openFile(state.activeTab.path, true);
        }
      }
    } catch (error) {
      setButtonLoading(elements.btnGitPull, false);
      const errorMsg = error.message || "";
      
      if (errorMsg.includes("rebase-merge") || errorMsg.includes("rebase-apply")) {
          showToast("Stale rebase detected. Would you like to abort it?", "error", 0, {
              text: "Abort & Retry",
              callback: async () => {
                  showGlobalLoading("Aborting rebase...");
                  try {
                      await fetchWithAuth(API_BASE, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "git_abort" }),
                      });
                      // Also clean locks just in case
                      await gitCleanLocks();
                      hideGlobalLoading();
                      // Retry the pull
                      await gitPull();
                  } catch (e) {
                      hideGlobalLoading();
                      showToast("Failed to abort rebase: " + e.message, "error");
                  }
              }
          });
      } else {
          showToast("Git pull failed: " + errorMsg, "error");
      }
    }
  }

  async function gitPush() {
    try {
      // Proactive safety check: If there are staged changes, ask to commit them first
      if (gitState.files.staged.length > 0) {
        const shouldCommit = await showConfirmDialog({
          title: "Staged Changes Detected",
          message: `You have ${gitState.files.staged.length} prepared changes that haven't been saved (committed).<br><br>Would you like to commit and push these changes now?`,
          confirmText: "Commit & Push",
          cancelText: "Push Existing Only"
        });

        if (shouldCommit) {
          // Trigger the commit flow
          await commitStagedFiles();
          // After commit (or if cancelled inside commit), the status will refresh.
          // If they successfully committed, gitStatus polling or the refresh will update staged count.
          // We should re-check or just continue to the push logic which will check for HEAD.
        }
      }

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
    const actions = panel.querySelector(".git-panel-actions");

    // Update badge
    badge.textContent = gitState.totalChanges;

    // Remove any existing sync indicators to prevent duplicates
    const oldIndicators = actions.querySelectorAll(".git-sync-indicator");
    oldIndicators.forEach(i => i.remove());

    // Add ahead/behind indicators
    if (gitState.isInitialized && gitState.hasRemote) {
        if (gitState.ahead > 0) {
            const pushBtn = document.createElement("button");
            pushBtn.className = "git-panel-btn git-sync-indicator";
            pushBtn.id = "btn-git-push-sync";
            pushBtn.title = `${gitState.ahead} commits to push`;
            pushBtn.innerHTML = `
                <span class="material-icons" style="font-size: 18px; color: var(--success-color);">arrow_upward</span>
                <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--success-color);">${gitState.ahead}</span>
            `;
            actions.insertBefore(pushBtn, actions.firstChild);
        }
        if (gitState.behind > 0) {
            const pullBtn = document.createElement("button");
            pullBtn.className = "git-panel-btn git-sync-indicator";
            pullBtn.id = "btn-git-pull-sync";
            pullBtn.title = `${gitState.behind} commits to pull`;
            pullBtn.innerHTML = `
                <span class="material-icons" style="font-size: 18px; color: var(--warning-color);">arrow_downward</span>
                <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--warning-color);">${gitState.behind}</span>
            `;
            actions.insertBefore(pullBtn, actions.firstChild);
        }
    }

    // Show panel if not initialized or no remote, to guide user
    if (!gitState.isInitialized || !gitState.hasRemote) {
        panel.classList.add("visible");
        
        // Resize sidebar if needed
        if (!isMobile() && elements.sidebar) {
            const currentWidth = parseInt(window.getComputedStyle(elements.sidebar).width);
            if (currentWidth < 340) {
                elements.sidebar.style.width = "360px";
            }
        }
    } else if (gitState.totalChanges > 0 || gitState.ahead > 0 || gitState.behind > 0) {
        panel.classList.add("visible");
        if (!isMobile() && elements.sidebar) {
            const currentWidth = parseInt(window.getComputedStyle(elements.sidebar).width);
            if (currentWidth < 340) {
                elements.sidebar.style.width = "360px";
            }
        }
    }

    if (!gitState.isInitialized) {
        container.innerHTML = `
            <div class="git-empty-state">
                <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px;">source</span>
                <p style="margin: 0 0 10px 0; font-weight: 500;">Git Not Initialized</p>
                <p style="font-size: 12px; margin-bottom: 15px; max-width: 200px; color: var(--text-secondary);">Start tracking changes by initializing a repository.</p>
                <button class="btn-primary" id="btn-git-init-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons" style="font-size: 18px;">play_circle</span> Initialize Repo
                </button>
            </div>
        `;
        commitBtn.disabled = true;
        return;
    }

    if (!gitState.hasRemote) {
        // If there are changes, we show them, but maybe add a warning? 
        // Or for simplicity, if no remote, we guide them to connect first/alongside.
        // Actually, let's allow local commits without remote.
        // But if there are NO changes, show the Connect prompt.
        if (gitState.totalChanges === 0) {
             container.innerHTML = `
                <div class="git-empty-state">
                    <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px;">link_off</span>
                    <p style="margin: 0 0 10px 0; font-weight: 500;">No Remote Configured</p>
                    <p style="font-size: 12px; margin-bottom: 15px; max-width: 200px; color: var(--text-secondary);">Connect to GitHub to push your changes to the cloud.</p>
                    <button class="btn-primary" id="btn-git-connect-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" style="fill: white;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
                        Connect to GitHub
                    </button>
                </div>
            `;
            commitBtn.disabled = true;
            return;
        }
    }

    if (gitState.totalChanges > 0) {
      renderGitFiles(container);
    } else {
      container.innerHTML = `
        <div class="git-empty-state">
          <span class="material-icons">check_circle</span>
          <p>No changes detected</p>
          <div class="git-empty-state-actions" style="display: flex; gap: 8px; margin-top: 12px; justify-content: center;">
            <button class="btn-secondary" id="btn-git-pull-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
              <span class="material-icons" style="font-size: 16px;">cloud_download</span>
              Pull
            </button>
            <button class="btn-secondary" id="btn-git-refresh-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
              <span class="material-icons" style="font-size: 16px;">refresh</span>
              Refresh
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
        
        let diffButton = "";
        // Show diff for Modified or Staged files (not Added/Deleted/Untracked which have no history)
        if ((group.key === "modified" || group.key === "staged") && isTextFile(file)) {
            diffButton = `
                <button class="btn-icon-only btn-git-diff" data-path="${file}" title="View Diff" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); margin-left: auto; padding: 4px;">
                    <span class="material-icons" style="font-size: 16px;">difference</span>
                </button>
            `;
        }

        html += `
          <div class="git-file-item" data-file="${file}">
            <input type="checkbox" class="git-file-checkbox" ${checked} data-file-path="${file}" />
            <span class="git-file-icon ${group.color}">${group.icon}</span>
            <span class="git-file-name" title="${file}" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file}</span>
            ${diffButton}
            ${isStaged ? '<span class="git-file-status staged" style="margin-left: 4px;">Staged</span>' : ''}
            ${isUnstaged && !isStaged ? '<span class="git-file-status unstaged" style="margin-left: 4px;">Unstaged</span>' : ''}
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
    const stagedCount = gitState.files.staged.length;
    if (stagedCount === 0) return;

    // Generate a smart default commit message
    let defaultMessage = "Update via Blueprint Studio";
    if (stagedCount === 1) {
        const filename = gitState.files.staged[0].split("/").pop();
        defaultMessage = `Update ${filename}`;
    } else if (stagedCount > 1) {
        const filename = gitState.files.staged[0].split("/").pop();
        defaultMessage = `Update ${filename} and ${stagedCount - 1} others`;
    }

    const commitMessage = await showModal({
      title: "Commit Changes",
      placeholder: "Commit message",
      value: defaultMessage,
      hint: `Committing ${stagedCount} staged file(s)`,
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
    const gitEnabled = localStorage.getItem("gitIntegrationEnabled") !== "false"; // Default to true;
    const showRecentFiles = state.showRecentFiles;

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

          <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
            <div style="flex: 1;">
              <div style="font-weight: 500; margin-bottom: 4px;">Show Recent Files</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Display recently opened files at the top of the file tree</div>
            </div>
            <label class="toggle-switch" style="margin-left: 16px;">
              <input type="checkbox" id="recent-files-toggle" ${showRecentFiles ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
            <div style="flex: 1;">
              <div style="font-weight: 500; margin-bottom: 4px;">Git Exclusions (.gitignore)</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Select which files and folders to include in your repository</div>
            </div>
            <button class="btn-secondary" id="btn-manage-exclusions" style="padding: 6px 12px; font-size: 12px;">
              Manage Exclusions
            </button>
          </div>

          <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: 8px; font-size: 13px;">
            <span class="material-icons" style="font-size: 16px; vertical-align: middle; color: var(--info-color, #2196f3);">info</span>
            <span style="margin-left: 8px;">Changes will take effect immediately</span>
          </div>

          <div class="git-settings-section" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px;">
            <div class="git-settings-label" style="color: var(--error-color);">Danger Zone</div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="font-size: 12px; color: var(--text-secondary); max-width: 70%;">
                    Reset all application settings, theme preferences, and onboarding status. This does not delete your files.
                </div>
                <button class="btn-secondary" id="btn-reset-app" style="padding: 6px 12px; font-size: 12px; color: var(--error-color); border-color: var(--error-color);">
                    Reset Application
                </button>
            </div>
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

    // Handle Recent Files toggle
    const recentFilesToggle = document.getElementById("recent-files-toggle");
    if (recentFilesToggle) {
      recentFilesToggle.addEventListener("change", (e) => {
        state.showRecentFiles = e.target.checked;
        saveSettings();
        renderFileTree();
      });
    }

    // Handle Manage Exclusions button
    const btnManageExclusions = document.getElementById("btn-manage-exclusions");
    if (btnManageExclusions) {
      btnManageExclusions.addEventListener("click", () => {
        closeSettings();
        showGitExclusions();
      });
    }

    // Handle Reset Application button
    const btnResetApp = document.getElementById("btn-reset-app");
    if (btnResetApp) {
      btnResetApp.addEventListener("click", () => {
        // Manually build modal to include checkbox
        resetModalToDefault();
        elements.modalTitle.textContent = "Reset Application?";
        
        elements.modalInput.style.display = "none";
        elements.modalHint.innerHTML = `
            <div style="font-size: 14px; color: var(--text-primary);">
                <p>This will reset all your saved settings, theme preferences, and onboarding progress.</p>
                <br>
                <label style="display: flex; align-items: center; background: var(--bg-tertiary); padding: 10px; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">
                    <input type="checkbox" id="reset-clear-creds" checked style="margin-right: 10px; width: 16px; height: 16px; accent-color: var(--error-color);">
                    <div>
                        <div style="font-weight: 500;">Sign out from GitHub</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Clear saved credentials from server</div>
                    </div>
                </label>
                <label style="display: flex; align-items: center; background: var(--bg-tertiary); padding: 10px; border-radius: 4px; cursor: pointer;">
                    <input type="checkbox" id="reset-delete-repo" style="margin-right: 10px; width: 16px; height: 16px; accent-color: var(--error-color);">
                    <div>
                        <div style="font-weight: 500;">Delete Git Repository (.git)</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">WARNING: Permanently deletes all version history!</div>
                    </div>
                </label>
                <br>
                <p><b>Your actual config files will NOT be deleted.</b></p>
            </div>
        `;
        
        elements.modalConfirm.textContent = "Reset & Reload";
        elements.modalConfirm.className = "modal-btn danger";
        
        elements.modalOverlay.classList.add("visible");

        // Handle Confirm
        const handleConfirm = async () => {
            const clearCreds = document.getElementById("reset-clear-creds").checked;
            const deleteRepo = document.getElementById("reset-delete-repo").checked;
            
            showGlobalLoading("Resetting...");
            
            if (clearCreds) {
                await gitClearCredentials();
            }

            if (deleteRepo) {
                try {
                    await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "git_delete_repo" }),
                    });
                } catch (e) {
                    console.error("Failed to delete repo:", e);
                }
            }
            
            localStorage.clear();
            window.location.reload();
        };

        // One-time listener for this specific modal instance
        const cleanup = () => {
            elements.modalConfirm.removeEventListener("click", handleConfirm);
            elements.modalCancel.removeEventListener("click", hideModal); // Re-bind default hide
        };

        elements.modalConfirm.addEventListener("click", handleConfirm, { once: true });
        // We don't need to re-bind cancel because hideModal is global, 
        // but showConfirmDialog usually handles cleanup. 
        // Here we just let the global hideModal handle the Cancel button click (it's already bound in initEventListeners).
      });
    }
  }

  // Show Git Exclusions modal
  async function showGitExclusions() {
    return new Promise(async (resolve) => {
    showGlobalLoading("Loading file list...");

    try {
      const items = await fetchWithAuth(`${API_BASE}?action=list_git_files`);
      
      // Build tree structure
      const tree = buildFileTree(items);

      // Create a map for quick size lookup
      const sizeMap = new Map();
      items.forEach(item => {
          sizeMap.set(item.path, { size: item.size || 0, type: item.type });
      });

      // 2. Fetch current .gitignore content
      let gitignoreContent = "";
      try {
        const data = await loadFile(".gitignore");
        gitignoreContent = data.content;
      } catch (e) {
        // It's okay if .gitignore doesn't exist yet
      }

      hideGlobalLoading();

      // 3. Parse .gitignore to find what's currently ignored
      const ignoredLines = new Set(
        gitignoreContent.split("\n")
          .map(line => line.trim())
          .filter(line => line && !line.startsWith("#"))
      );

      // Default ignores if .gitignore is empty/new
      if (ignoredLines.size === 0) {
        ["__pycache__", ".cloud", ".storage", "deps", ".ha_run.lock"].forEach(item => ignoredLines.add(item));
      }

      // 4. Create Modal Content
      const modalOverlay = document.getElementById("modal-overlay");
      const modal = document.getElementById("modal");
      const modalTitle = document.getElementById("modal-title");
      const modalBody = document.getElementById("modal-body");
      const modalFooter = document.querySelector(".modal-footer");

      modalTitle.textContent = "Manage Git Exclusions";

      // Helper to check if a path or any of its parents are ignored
      function isPathIgnored(path) {
        if (ignoredLines.has(path) || ignoredLines.has(path + "/")) return true;
        
        const parts = path.split("/");
        for (let i = 1; i < parts.length; i++) {
            const parentPath = parts.slice(0, i).join("/");
            if (ignoredLines.has(parentPath) || ignoredLines.has(parentPath + "/")) return true;
        }
        return false;
      }

      // Helper to render tree recursively
      function renderExclusionTreeHtml(treeNode, depth = 0) {
        let html = "";
        
        const folders = Object.keys(treeNode)
          .filter(k => !k.startsWith("_"))
          .sort();
        const files = (treeNode._files || []).sort((a, b) => a.name.localeCompare(b.name));

        // Render folders
        folders.forEach(folderName => {
            const folderData = treeNode[folderName];
            const folderPath = folderData._path;
            
            const isIgnored = isPathIgnored(folderPath);
            const isChecked = !isIgnored;
            const isDisabled = folderPath === ".git";
            const forcedState = folderPath === ".git" ? "" : (isChecked ? "checked" : "");
            
            const itemSize = sizeMap.get(folderPath)?.size || 0;
            const paddingLeft = 4 + (depth * 20); 

            // Note: We put the click handler on the header div
            html += `
              <div class="exclusion-folder-group">
                <div class="exclusion-folder-header" style="display: flex; align-items: center; padding: 8px 12px; padding-left: ${paddingLeft}px; border-bottom: 1px solid var(--border-color); background: var(--bg-tertiary); cursor: pointer;">
                  <span class="material-icons exclusion-chevron" style="margin-right: 4px; font-size: 20px; color: var(--text-secondary); transition: transform 0.2s;">chevron_right</span>
                  <label style="display: flex; align-items: center; flex: 1; cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; pointer-events: none;">
                    <input type="checkbox" class="exclusion-checkbox" data-path="${folderPath}" data-type="folder" ${forcedState} ${isDisabled ? 'disabled' : ''} style="margin-right: 12px; width: 16px; height: 16px; pointer-events: auto;">
                    <span class="material-icons" style="margin-right: 8px; font-size: 20px; color: var(--icon-folder);">folder</span>
                    <span style="font-size: 14px; flex: 1;">${folderName}</span>
                    <span style="font-size: 12px; color: var(--text-secondary); margin-right: 8px;">${formatBytes(itemSize)}</span>
                    ${isIgnored ? '<span style="font-size: 10px; padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary);">Ignored</span>' : ''}
                  </label>
                </div>
                <div class="exclusion-children" style="display: none;">
                  ${renderExclusionTreeHtml(folderData, depth + 1)}
                </div>
              </div>
            `;
        });

        // Render files
        files.forEach(file => {
            const isIgnored = isPathIgnored(file.path);
            const isChecked = !isIgnored;
            const isDisabled = file.path === ".gitignore"; 
            const forcedState = isDisabled ? "checked" : (isChecked ? "checked" : "");
            
            const itemSize = sizeMap.get(file.path)?.size || 0;
            const isLarge = itemSize > 100 * 1024 * 1024;
            const paddingLeft = 4 + (depth * 20) + 24; 
            
            html += `
              <label style="display: flex; align-items: center; padding: 8px 12px; padding-left: ${paddingLeft}px; border-bottom: 1px solid var(--border-color); cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; background: var(--bg-tertiary);">
                <input type="checkbox" class="exclusion-checkbox" data-path="${file.path}" data-type="file" data-size="${itemSize}" ${forcedState} ${isDisabled ? 'disabled' : ''} style="margin-right: 12px; width: 16px; height: 16px;">
                <span class="material-icons" style="margin-right: 8px; font-size: 20px; color: var(--text-secondary);">insert_drive_file</span>
                <span style="font-size: 14px; flex: 1; ${isLarge ? 'color: var(--error-color); font-weight: bold;' : ''}">${file.name}</span>
                <span style="font-size: 12px; color: ${isLarge ? 'var(--error-color)' : 'var(--text-secondary)'}; margin-right: 8px;">${formatBytes(itemSize)}</span>
                ${isIgnored ? '<span style="font-size: 10px; padding: 2px 6px; background: var(--bg-secondary); border-radius: 4px; color: var(--text-secondary);">Ignored</span>' : ''}
              </label>
            `;
        });

        return html;
      }

      // Clear body
      modalBody.innerHTML = '';

      // Info Header
      const infoHeader = document.createElement('div');
      infoHeader.innerHTML = `
        <div class="git-settings-info" style="margin-bottom: 16px; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span class="material-icons">info</span>
                <div>
                    <div style="font-weight: 500;">Check items to PUSH to GitHub</div>
                    <div style="font-size: 12px;">Unchecked items will be added to .gitignore</div>
                </div>
            </div>
            <label style="display: flex; align-items: center; cursor: pointer; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px;">
                <input type="checkbox" id="git-exclude-select-all" style="margin-right: 6px;">
                <span style="font-size: 12px; font-weight: 500;">Select All</span>
            </label>
          </div>
          <div id="git-total-size" style="margin-top: 12px; padding: 8px; background: var(--bg-primary); border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-weight: 500;">
            <span>Total Selected Size:</span>
            <span id="git-total-size-value">Calculating...</span>
          </div>
        </div>
      `;
      modalBody.appendChild(infoHeader);

      // Handle Select All
      infoHeader.addEventListener("change", (e) => {
        if (e.target.id === "git-exclude-select-all") {
            const isChecked = e.target.checked;
            const allCheckboxes = container.querySelectorAll(".exclusion-checkbox");
            allCheckboxes.forEach(cb => {
                if (!cb.disabled) {
                    cb.checked = isChecked;
                }
            });
            updateTotalSize();
        }
      });

      // List Container
      const container = document.createElement('div');
      container.className = 'git-exclusion-list';
      container.style.maxHeight = '50vh';
      container.style.overflowY = 'auto';
      container.style.border = '1px solid var(--border-color)';
      container.style.borderRadius = '4px';
      
      container.innerHTML = renderExclusionTreeHtml(tree);
      modalBody.appendChild(container);
      
      // Reset modal buttons
      modalFooter.style.display = "flex";
      const btnCancel = document.getElementById("modal-cancel");
      const btnConfirm = document.getElementById("modal-confirm");
      
      btnConfirm.textContent = "Save Changes";
      btnConfirm.className = "modal-btn primary";

      modalOverlay.classList.add("visible");
      // make modal wider
      modal.style.maxWidth = "600px";

      // Function to recalculate total size
      const updateTotalSize = () => {
        let totalSize = 0;
        let hasLargeFile = false;
        const checkboxes = modalBody.querySelectorAll(".exclusion-checkbox[data-type='file']");
        
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const size = parseInt(cb.dataset.size || 0);
                totalSize += size;
                if (size > 100 * 1024 * 1024) hasLargeFile = true;
            }
        });

        const sizeDisplay = document.getElementById("git-total-size-value");
        const sizeContainer = document.getElementById("git-total-size");
        
        if (sizeDisplay && sizeContainer) {
            sizeDisplay.textContent = formatBytes(totalSize);
            
            // Warn if total > 100MB (soft limit warning) or single file > 100MB (hard limit)
            if (hasLargeFile) {
                sizeContainer.style.color = "var(--error-color)";
                sizeDisplay.textContent += " (⚠️ File > 100MB detected!)";
            } else if (totalSize > 100 * 1024 * 1024) {
                sizeContainer.style.color = "var(--warning-color)";
                sizeDisplay.textContent += " (⚠️ Large push)";
            } else {
                sizeContainer.style.color = "var(--success-color)";
            }
        }
      };

      // Initial calculation
      updateTotalSize();

      // Handle events (Toggle collapse + Cascading Checkboxes)
      container.addEventListener("click", (e) => {
        // Handle Collapse/Expand (Header click)
        const header = e.target.closest(".exclusion-folder-header");
        if (header) {
            // Don't toggle if clicking the checkbox directly
            if (e.target.classList.contains("exclusion-checkbox")) return;

            const group = header.parentElement; // .exclusion-folder-group
            const children = group.querySelector(".exclusion-children");
            const chevron = header.querySelector(".exclusion-chevron");
            
            if (children) {
                const isHidden = children.style.display === "none";
                children.style.display = isHidden ? "block" : "none";
                if (chevron) chevron.style.transform = isHidden ? "rotate(90deg)" : "";
            }
            return;
        }
      });

      container.addEventListener("change", (e) => {
        // Handle Cascading Checkboxes
        if (e.target.classList.contains("exclusion-checkbox")) {
            const isChecked = e.target.checked;
            const target = e.target;
            
            // 1. Cascade DOWN (Parent -> Children)
            if (target.dataset.type === "folder") {
                const group = target.closest(".exclusion-folder-group");
                if (group) {
                    const childrenContainer = group.querySelector(".exclusion-children");
                    if (childrenContainer) {
                        const childCheckboxes = childrenContainer.querySelectorAll(".exclusion-checkbox");
                        childCheckboxes.forEach(cb => {
                            if (!cb.disabled) {
                                cb.checked = isChecked;
                            }
                        });
                    }
                }
            }

            // 2. Bubble UP (Child -> Parent)
            let current = target;
            while (current) {
                // Find immediate parent group container
                const childrenContainer = current.closest(".exclusion-children");
                if (!childrenContainer) break;
                
                const parentGroup = childrenContainer.parentElement; // .exclusion-folder-group
                if (!parentGroup) break;

                const parentHeader = parentGroup.querySelector(".exclusion-folder-header");
                const parentCheckbox = parentHeader ? parentHeader.querySelector(".exclusion-checkbox") : null;
                
                if (parentCheckbox && !parentCheckbox.disabled) {
                    // Check if ANY descendant is checked
                    const allDescendants = childrenContainer.querySelectorAll(".exclusion-checkbox");
                    let anyChecked = false;
                    for (let i = 0; i < allDescendants.length; i++) {
                        if (allDescendants[i].checked) {
                            anyChecked = true;
                            break;
                        }
                    }
                    parentCheckbox.checked = anyChecked;
                }
                
                current = parentGroup; // Continue up
            }
            
            updateTotalSize();
        }
      });

      // Handle Save
      const saveHandler = async () => {
        const checkboxes = modalBody.querySelectorAll(".exclusion-checkbox");
        const rawIgnoreList = new Set();
        const itemsToInclude = new Set();

        checkboxes.forEach(cb => {
          if (!cb.disabled) {
              if (!cb.checked) {
                rawIgnoreList.add(cb.dataset.path);
              } else {
                itemsToInclude.add(cb.dataset.path);
              }
          }
        });

        // Optimization: Filter out redundant paths from ignore list
        // If a parent folder is ignored, we don't need to list its children
        const sortedIgnoreList = Array.from(rawIgnoreList).sort();
        const optimizedIgnoreList = [];
        
        for (const path of sortedIgnoreList) {
            let covered = false;
            for (const existing of optimizedIgnoreList) {
                if (path.startsWith(existing + "/") || path === existing) {
                    covered = true;
                    break;
                }
            }
            if (!covered) {
                optimizedIgnoreList.push(path);
            }
        }

        // Update .gitignore logic
        let newContentLines = gitignoreContent.split("\n").filter(line => {
            const trimmed = line.trim();
            // Keep comments and empty lines
            if (!trimmed || trimmed.startsWith("#")) return true;
            
            // Clean the line from trailing slashes for comparison
            const path = trimmed.replace(/\/$/, "");
            
            // 1. Remove if specifically included now
            if (itemsToInclude.has(path)) return false;
            
            // 2. Remove if already covered by an optimized ignore path
            for (const optimized of optimizedIgnoreList) {
                if (path.startsWith(optimized + "/") || path === optimized) {
                    return false;
                }
            }
            
            return true;
        });

        // Append new optimized exclusions
        if (optimizedIgnoreList.length > 0) {
            // Find if our section already exists
            const sectionHeader = "# Exclusions via Blueprint Studio";
            if (!newContentLines.includes(sectionHeader)) {
                newContentLines.push("");
                newContentLines.push(sectionHeader);
            }
            
            optimizedIgnoreList.forEach(path => {
                // Determine if it's a folder to add trailing slash
                const isFolder = items.find(item => item.path === path && item.type === "folder");
                const entry = isFolder ? `${path}/` : path;
                
                if (!newContentLines.includes(entry)) {
                    newContentLines.push(entry);
                }
            });
        }

        const newContent = newContentLines.join("\n").trim() + "\n";

        showGlobalLoading("Saving .gitignore...");
        const success = await saveFile(".gitignore", newContent);
        
        if (success) {
            if (optimizedIgnoreList.length > 0) {
                showGlobalLoading("Updating git index...");
                try {
                    await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            action: "git_stop_tracking", 
                            files: optimizedIgnoreList 
                        }),
                    });
                } catch (e) {
                    console.error("Failed to stop tracking files:", e);
                }
            }

            hideGlobalLoading();
            modalOverlay.classList.remove("visible");
            await gitStatus();
            cleanup(true);
        } else {
            hideGlobalLoading();
        }
      };

      const cancelHandler = () => {
        modalOverlay.classList.remove("visible");
        cleanup(false);
      };

      const cleanup = (result) => {
        btnConfirm.removeEventListener("click", saveHandler);
        btnCancel.removeEventListener("click", cancelHandler);
        container.removeEventListener("change", updateTotalSize);
        resetModalToDefault(); 
        modal.style.maxWidth = ""; 
        resolve(result);
      };

      btnConfirm.addEventListener("click", saveHandler);
      btnCancel.addEventListener("click", cancelHandler);

    } catch (error) {
      hideGlobalLoading();
      showToast("Failed to load file list: " + error.message, "error");
      resolve(false);
    }
    });
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
            <div style="flex: 1; min-width: 0;">
                <span class="git-remote-name">${name}</span>
                <span class="git-remote-url">${url}</span>
            </div>
            <button class="btn-icon-only remove-remote-btn" data-remote-name="${name}" title="Remove Remote" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px;">
                <span class="material-icons" style="font-size: 18px;">delete</span>
            </button>
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

    // Attach event handlers for Remove Remote buttons
    const removeRemoteBtns = modalBody.querySelectorAll('.remove-remote-btn');
    removeRemoteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const remoteName = e.currentTarget.dataset.remoteName;
            const confirmed = await showConfirmDialog({
                title: "Remove Remote",
                message: `Are you sure you want to remove the remote '${remoteName}'?`,
                confirmText: "Remove",
                cancelText: "Cancel",
                isDanger: true
            });

            if (confirmed) {
                try {
                    const data = await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "git_remove_remote", name: remoteName }),
                    });

                    if (data.success) {
                        showToast(data.message, "success");
                        // Refresh settings modal
                        setTimeout(() => showGitSettings(), 300);
                    } else {
                        showToast("Failed to remove remote: " + data.message, "error");
                    }
                } catch (error) {
                    showToast("Error removing remote: " + error.message, "error");
                }
            }
        });
    });

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
    return new Promise(async (resolve) => {
        // Check if logged in
        const credentialsData = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "git_get_credentials" }),
        });

        if (!credentialsData.has_credentials) {
          showToast("Please login with GitHub first", "error");
          resolve(false);
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
        const closeDialog = (result) => {
          modalOverlay.classList.remove("visible");
          resetModalToDefault();
          modalOverlay.removeEventListener("click", overlayClickHandler);
          resolve(result);
        };

        // Overlay click handler
        const overlayClickHandler = (e) => {
          if (e.target === modalOverlay) {
            closeDialog(false);
          }
        };
        modalOverlay.addEventListener("click", overlayClickHandler);

        // Update preview as user types
        const repoNameInput = document.getElementById("new-repo-name");
        const repoNamePreview = document.getElementById("repo-name-preview");
        if (repoNameInput && repoNamePreview) {
            repoNameInput.addEventListener("input", () => {
              repoNamePreview.textContent = repoNameInput.value || "repository-name";
            });
        }

        // Cancel button
        document.getElementById("btn-cancel-create-repo").addEventListener("click", () => {
          closeDialog(false);
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

          if (!/^[a-zA-Z0-9._-]+$/.test(repoName)) {
            showToast("Repository name can only contain letters, numbers, dots, hyphens, and underscores", "error");
            return;
          }

          // Don't close yet, wait for creation result? 
          // Ideally we show loading state. 
          // Current logic closes dialog then creates.
          // Let's stick to current logic but resolve true.
          
          closeDialog(true); // Assume intention to proceed.
          // Actually, we should await the creation to know if it succeeded?
          // The previous code closed dialog THEN awaited creation.
          // If we resolve(true) here, the caller proceeds.
          
          // Let's modify slightly: await creation, THEN close and resolve(true).
          
          showToast("Creating repository...", "info");
          // Re-implement the creation call here or just call it after close?
          // If we close, the modal is gone.
          // Let's keep it simple: Resolve(true) means "User submitted valid form".
          // The actual creation happens inside here.
          
          await githubCreateRepo(repoName, description, isPrivate);
          await gitStatus();
          
        }, { once: true });
    });
  }

  async function showGlobalSearchDialog() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    resetModalToDefault();
    modalTitle.textContent = "Search in All Files";
    
    modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 60vh;">
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <input type="text" id="global-search-input" class="modal-input" placeholder="Text to find..." style="flex: 1;">
                <button id="btn-global-search" class="btn-primary" style="padding: 0 16px;">Search</button>
            </div>
            <div id="global-search-status" style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; min-height: 18px;"></div>
            <div id="global-search-results" style="flex: 1; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary);"></div>
        </div>
    `;
    
    modal.style.maxWidth = "700px";
    if (modalFooter) modalFooter.style.display = "none";
    modalOverlay.classList.add("visible");

    const input = document.getElementById("global-search-input");
    const btnSearch = document.getElementById("btn-global-search");
    const resultsContainer = document.getElementById("global-search-results");
    const statusDiv = document.getElementById("global-search-status");

    const performSearch = async () => {
        const query = input.value.trim();
        if (!query) return;

        statusDiv.textContent = "Searching...";
        resultsContainer.innerHTML = "";
        btnSearch.disabled = true;

        try {
            const results = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "global_search", query: query }),
            });

            if (results && Array.isArray(results)) {
                statusDiv.textContent = `Found ${results.length} matches (limit 100)`;
                if (results.length === 0) {
                    resultsContainer.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted);">No results found</div>`;
                } else {
                    results.forEach(res => {
                        const item = document.createElement("div");
                        item.style.padding = "8px 12px";
                        item.style.borderBottom = "1px solid var(--border-color)";
                        item.style.cursor = "pointer";
                        item.style.fontSize = "13px";
                        
                        const safeContent = res.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        
                        item.innerHTML = `
                            <div style="font-weight: 500; color: var(--accent-color); margin-bottom: 2px;">${res.path} <span style="color: var(--text-muted); font-weight: normal;">:${res.line}</span></div>
                            <div style="font-family: monospace; white-space: pre-wrap; color: var(--text-primary); word-break: break-all;">${safeContent}</div>
                        `;
                        
                        item.addEventListener("click", async () => {
                            closeDialog();
                            await openFile(res.path);
                            if (state.editor) {
                                state.editor.setCursor(res.line - 1, 0);
                                state.editor.scrollIntoView({line: res.line - 1, ch: 0}, 200);
                                state.editor.focus();
                            }
                        });
                        
                        item.addEventListener("mouseenter", () => { item.style.background = "var(--bg-tertiary)"; });
                        item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });

                        resultsContainer.appendChild(item);
                    });
                }
            } else {
                statusDiv.textContent = "Error searching";
            }
        } catch (e) {
            statusDiv.textContent = "Error: " + e.message;
        } finally {
            btnSearch.disabled = false;
        }
    };

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performSearch();
    });
    btnSearch.addEventListener("click", performSearch);
    
    input.focus();

    const closeDialog = () => {
        modalOverlay.classList.remove("visible");
        resetModalToDefault();
        modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    const overlayClickHandler = (e) => {
        if (e.target === modalOverlay) closeDialog();
    };
    modalOverlay.addEventListener("click", overlayClickHandler);
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
    
    let defaultName = `${currentName}_copy`;
    
    // If it's a file with an extension, insert _copy before the extension
    if (!isFolder && currentName.includes(".")) {
        const parts = currentName.split(".");
        const ext = parts.pop();
        const name = parts.join(".");
        if (name) { // Ensure it's not just ".gitignore" (empty name)
            defaultName = `${name}_copy.${ext}`;
        }
    }

    const result = await showModal({
      title: isFolder ? "Copy Folder" : "Copy File",
      placeholder: "New name",
      value: defaultName,
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

  async function handleFileDrop(sourcePath, targetFolder) {
    if (sourcePath === targetFolder) return;

    const fileName = sourcePath.split("/").pop();
    // If target is root (null or empty string), new path is just filename
    // targetFolder might be null for root drop
    const newPath = targetFolder ? `${targetFolder}/${fileName}` : fileName;

    // Check if moving into itself (for folders)
    if (targetFolder && targetFolder.startsWith(sourcePath + "/")) {
        showToast("Cannot move a folder into itself", "warning");
        return;
    }

    // Check if moving to same location
    // sourcePath "folder/file.yaml" -> currentFolder "folder"
    // sourcePath "file.yaml" -> currentFolder ""
    const lastSlashIndex = sourcePath.lastIndexOf("/");
    const currentFolder = lastSlashIndex === -1 ? "" : sourcePath.substring(0, lastSlashIndex);
    
    // Normalize null target to empty string for comparison
    const targetFolderNormalized = targetFolder || "";

    if (currentFolder === targetFolderNormalized) return;

    const confirmed = await showConfirmDialog({
        title: "Move Item?",
        message: `Move <b>${fileName}</b> to <b>${targetFolderNormalized || "root"}</b>?`,
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
                await loadFiles();
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
    item.draggable = true; // Make items draggable
    item.dataset.path = itemPath; // Store path for drag/drop logic

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
        handleSelectionChange(itemPath, e.target.checked);
    });
    item.appendChild(checkbox);

    if (isFolder) {
      const chevron = document.createElement("div");
      chevron.className = `tree-chevron ${isExpanded ? "expanded" : ""}`;
      chevron.innerHTML = '<span class="material-icons">chevron_right</span>';
      item.appendChild(chevron);
    } else {
        // Spacer for alignment if not a folder (to match chevron width)
        const spacer = document.createElement("div");
        spacer.className = "tree-chevron hidden"; // reuse class for size
        item.appendChild(spacer);
    }

    const fileIcon = getFileIcon(name);
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

    // File Size (if available in state.files)
    if (!isFolder && itemPath) {
        const fileData = state.files.find(f => f.path === itemPath);
        if (fileData && typeof fileData.size === 'number') {
            const sizeLabel = document.createElement("span");
            sizeLabel.className = "tree-file-size";
            sizeLabel.textContent = formatBytes(fileData.size, 0); // 0 decimals for compactness
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

    // Pin Button (Favorites) - Only show if not selected
    if (!state.selectionMode) {
        const isPinned = state.favoriteFiles.includes(itemPath);
        const pinBtn = document.createElement("button");
        pinBtn.className = "tree-action-btn";
        pinBtn.title = isPinned ? "Unpin" : "Pin to top";
        pinBtn.innerHTML = `<span class="material-icons" style="font-size: 16px; ${isPinned ? 'color: var(--accent-color);' : ''}">push_pin</span>`;
        pinBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(itemPath);
        });
        actions.appendChild(pinBtn);
    }

    // Diff Button - Only for modified files and when not a folder
    if (!isFolder && gitState.files.modified.includes(itemPath)) {
        const diffBtn = document.createElement("button");
        diffBtn.className = "tree-action-btn";
        diffBtn.title = "View Diff";
        diffBtn.innerHTML = '<span class="octicon" style="color: var(--warning-color);"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M13 1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 12H3V3h10v10zM8 4h2v2H8V4zM6 8h2v2H6V8zm0 4h2v2H6v-2z"/></svg></span>';
        // Simpler diff icon:
        diffBtn.innerHTML = '<span class="material-icons" style="font-size: 16px; color: var(--warning-color);">difference</span>';
        
        diffBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showDiffModal(itemPath);
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

  // ============================================
  // Drag & Drop Handlers
  // ============================================

  function handleDragStart(e) {
    const path = e.currentTarget.dataset.path;
    if (!path || path === ".git" || path === ".gitignore") {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData("text/plain", path);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("dragging");
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    const item = e.currentTarget.closest(".tree-item");
    if (item) {
        item.classList.add("drag-over");
    } else if (e.currentTarget === elements.fileTree) {
        elements.fileTree.classList.add("drag-over-root");
    }
  }

  function handleDragLeave(e) {
    const item = e.currentTarget.closest(".tree-item");
    if (item) {
        item.classList.remove("drag-over");
    } else if (e.currentTarget === elements.fileTree) {
        elements.fileTree.classList.remove("drag-over-root");
    }
  }

  async function handleDrop(e) {
    e.preventDefault();
    
    const item = e.currentTarget.closest(".tree-item");
    if (item) {
        item.classList.remove("drag-over");
    }
    elements.fileTree.classList.remove("drag-over-root");

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
        await processUploads(e.dataTransfer.files, targetFolder);
        return;
    }

    // Case 2: Internal Move
    if (sourcePath) {
        await handleFileDrop(sourcePath, targetFolder);
    }
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

  async function openFile(path, forceReload = false) {
    // Check if it's a binary file (not meant for CodeMirror)
    if (!isTextFile(path)) {
      const filename = path.split("/").pop();
      const ext = filename.split(".").pop().toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext);
      const isPdf = ext === "pdf";

      if (isImage || isPdf) {
        showToast(`Opening ${filename}...`, "info");
        try {
          const data = await loadFile(path);
          if (isImage) {
            const dataUrl = `data:${data.mime_type};base64,${data.content}`;
            await showModal({
              title: filename,
              image: dataUrl,
              confirmText: "Close"
            });
          } else {
            // PDF Viewer with fallback buttons
            const binaryString = atob(data.content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);

            await showModal({
              title: filename,
              message: `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                    <span class="material-icons" style="font-size: 64px; color: var(--text-secondary); margin-bottom: 20px;">picture_as_pdf</span>
                    <div style="font-size: 16px; margin-bottom: 30px; text-align: center;">
                        This PDF cannot be previewed directly. Please download it to view.
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <a href="${blobUrl}" download="${filename}" class="modal-btn primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;">
                            <span class="material-icons">download</span> Download PDF
                        </a>
                    </div>
                </div>
              `,
              confirmText: "Close"
            });
            
            // Clean up the blob URL after the modal is likely closed
            setTimeout(() => URL.revokeObjectURL(blobUrl), 120000); // 2 minutes

            // Ensure modal is sized appropriately
            elements.modal.style.maxWidth = "500px";
            elements.modal.style.width = "90vw";
          }
        } catch (error) {
          console.error("Failed to open media:", error);
        }
        return;
      }

      // For other binary files (like .zip), just download them
      showToast(`Downloading ${filename}...`, "info");
      downloadFileByPath(path);
      return;
    }

    let tab = state.openTabs.find((t) => t.path === path);

    if (tab && forceReload) {
        try {
            const data = await loadFile(path);
            tab.content = data.content;
            tab.originalContent = data.content;
            tab.modified = false;
            // Clear history if reloading externally changed file to avoid confusing undo state
            tab.history = null; 
        } catch (e) {
            console.error("Failed to reload file content", e);
        }
    } else if (!tab) {
      try {
        const data = await loadFile(path); // data is now {content: ..., is_base64: ...}
        const content = data.content; // This backend call will only work for text files

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
        // loadFile will show a toast if it fails (e.g., trying to read binary as text)
        return;
      }
    }

    activateTab(tab);
    renderTabs();
    renderFileTree();
    saveSettings(); // To save recent files
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
        "Ctrl-F": () => openSearchWidget(false),
        "Cmd-F": () => openSearchWidget(false),
        "Ctrl-H": () => openSearchWidget(true),
        "Cmd-Option-F": () => openSearchWidget(true),
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
      const autoTriggerChars = [':', ' ', '-', '!', '.'];
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
    const content = tab.content;
    const isYaml = tab.path.endsWith(".yaml") || tab.path.endsWith(".yml");

    // 1. Validate if it's a YAML file
    if (isYaml) {
      const validationResult = await validateYaml(content);
      if (!validationResult.valid) {
        const confirmed = await showConfirmDialog({
          title: "YAML Validation Error",
          message: `The file contains an error and may not work with Home Assistant.<br><br><div style="background: var(--bg-tertiary); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${translateYamlError(validationResult.error)}</div>`,
          confirmText: "Save Anyway",
          cancelText: "Cancel",
          isDanger: true
        });

        if (!confirmed) {
          showToast("Save cancelled due to validation errors.", "warning");
          return; // Abort save
        }
      }
    }

    // 2. Proceed with saving
    setButtonLoading(elements.btnSave, true);

    const success = await saveFile(tab.path, content);

    setButtonLoading(elements.btnSave, false);

    if (success) {
      tab.originalContent = content;
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
          openSearchWidget(false);
        }
      });
    }

    // Search Input Listener
    if (elements.searchFindInput) {
      elements.searchFindInput.addEventListener("input", (e) => {
        const query = e.target.value;
        if (state.editor) {
            updateSearchHighlights(query);
            updateMatchStatus(query);
        }
      });
    }

    // Shortcuts Help
    if (elements.btnShortcutsHelp) {
      elements.btnShortcutsHelp.addEventListener("click", showShortcuts);
    }

    if (elements.btnToggleSelect) {
      elements.btnToggleSelect.addEventListener("click", toggleSelectionMode);
    }

    if (elements.btnDownloadSelected) {
      elements.btnDownloadSelected.addEventListener("click", downloadSelectedItems);
    }

    if (elements.btnCancelSelection) {
      elements.btnCancelSelection.addEventListener("click", toggleSelectionMode);
    }

    // Refresh
    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener("click", loadFiles);
    }

    // Restart HA
    if (elements.btnRestartHa) {
      elements.btnRestartHa.addEventListener("click", async () => {
        const confirmed = await showConfirmDialog({
            title: "Restart Home Assistant?",
            message: "Are you sure you want to restart Home Assistant? Blueprint Studio will be unavailable until the restart completes.",
            confirmText: "Restart",
            cancelText: "Cancel",
            isDanger: true
        });

        if (confirmed) {
            try {
                const data = await fetchWithAuth(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "restart_home_assistant" }),
                });
                if (data.success) {
                    showToast("Restarting Home Assistant...", "success");
                }
            } catch (error) {
                showToast("Failed to trigger restart: " + error.message, "error");
            }
        }
      });
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
            showToast("YAML error detected.", "error", 0, { // Use duration 0 to keep toast visible until action
              text: "View Details",
              callback: async () => {
                // Display the full error in a modal
                await showModal({
                  title: "YAML Validation Error",
                  message: `<div style="background: var(--bg-tertiary); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; max-height: 300px; overflow-y: auto;">${translateYamlError(result.error)}</div>`,
                  confirmText: "Close",
                  isDanger: true // Indicate error
                });
              }
            });
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
      elements.btnGitStatus.addEventListener("click", () => gitStatus(true));
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
      elements.btnGitRefresh.addEventListener("click", () => gitStatus(true));
    }
    if (elements.btnGitHelp) {
      elements.btnGitHelp.addEventListener("click", () => {
        showModal({
          title: "Git for Beginners",
          message: `
            <div style="line-height: 1.6;">
              <p>Git helps you track changes and sync them with GitHub. Here is the typical workflow:</p>
              <br>
              <p><b>1. Stage (Prepare):</b> Select the files you've changed and click "Stage". This is like putting items into a box before shipping.</p>
              <br>
              <p><b>2. Commit (Save Checkpoint):</b> Give your prepared changes a name (message) and click "Commit". This saves a "checkpoint" of your work on your local device.</p>
              <br>
              <p><b>3. Push (Upload):</b> Click the "↑" arrow or "Git Push" to upload your saved checkpoints to GitHub.</p>
              <br>
              <p><b>4. Pull (Download):</b> Click the "↓" arrow or "Git Pull" to download any new changes from GitHub to your device.</p>
            </div>
          `,
          confirmText: "Got it!"
        });
      });
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

    // Git panel header sync indicators (delegation)
    const gitPanelActions = document.querySelector(".git-panel-actions");
    if (gitPanelActions) {
      gitPanelActions.addEventListener("click", (e) => {
        const target = e.target.closest(".git-sync-indicator");
        if (target) {
          if (target.id === "btn-git-push-sync") {
            gitPush();
          } else if (target.id === "btn-git-pull-sync") {
            gitPull();
          }
        }
      });
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

        // Handle Diff Button
        const diffBtn = e.target.closest(".btn-git-diff");
        if (diffBtn) {
            const path = diffBtn.dataset.path;
            showDiffModal(path);
            return;
        }

        // Handle empty state buttons
        const target = e.target.closest('button'); // Get the button itself if clicked on icon/span inside
        if (target) {
          if (target.id === "btn-git-pull-empty-state") {
            gitPull();
          } else if (target.id === "btn-git-refresh-empty-state") {
            gitStatus(true);
          } else if (target.id === "btn-git-init-panel") {
            gitInit();
          } else if (target.id === "btn-git-connect-panel") {
            showGitSettings();
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

      // Ctrl/Cmd + E - Quick Switcher
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        showQuickSwitcher();
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

      // Alt + W - close tab (Ctrl/Cmd + W closes browser tab)
      if (e.altKey && e.key === "w") {
        e.preventDefault();
        if (state.activeTab) {
          closeTab(state.activeTab);
        }
      }

      // Ctrl/Cmd + Shift + ] (Next) / [ (Prev) - Tab Navigation
      // Matches }/{ as well since Shift is held
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "}" || e.key === "]" || e.key === "{" || e.key === "[")) {
        e.preventDefault();
        if (state.openTabs.length > 1) {
            const currentIndex = state.openTabs.indexOf(state.activeTab);
            let nextIndex;
            // { or [ is Prev
            if (e.key === "{" || e.key === "[") {
                nextIndex = (currentIndex - 1 + state.openTabs.length) % state.openTabs.length;
            } else {
                nextIndex = (currentIndex + 1) % state.openTabs.length;
            }
            activateTab(state.openTabs[nextIndex]);
        }
      }

      // Ctrl/Cmd + B - Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }

      // Ctrl/Cmd + Shift + F - Global Search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        showGlobalSearchDialog();
      }

      // Ctrl/Cmd + F - Find
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        openSearchWidget(false);
      }

      // Ctrl/Cmd + H - Replace
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        openSearchWidget(true);
      }

      // Escape - close sidebar on mobile, hide modals/menus
      if (e.key === "Escape") {
        if (elements.shortcutsOverlay.classList.contains("visible")) {
          hideShortcuts();
        } else if (elements.searchWidget && elements.searchWidget.classList.contains("visible")) {
          closeSearchWidget();
        } else if (elements.quickSwitcherOverlay && elements.quickSwitcherOverlay.classList.contains("visible")) {
          hideQuickSwitcher();
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

    // Search Widget Events
    if (elements.searchWidget) {
      elements.searchToggle.addEventListener("click", () => {
        elements.searchWidget.classList.toggle("replace-mode");
        if (elements.searchWidget.classList.contains("replace-mode")) {
            elements.searchReplaceRow.style.display = "flex";
            elements.searchReplaceInput.focus();
        } else {
            elements.searchReplaceRow.style.display = "none";
            elements.searchFindInput.focus();
        }
      });

      elements.searchFindInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doFind(e.shiftKey); // Shift+Enter = Prev
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeSearchWidget();
        }
      });

      elements.searchReplaceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.ctrlKey || e.altKey) {
                doReplaceAll();
            } else {
                doReplace();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeSearchWidget();
        }
      });

      elements.searchNext.addEventListener("click", () => doFind(false));
      elements.searchPrev.addEventListener("click", () => doFind(true));
      elements.searchClose.addEventListener("click", closeSearchWidget);
      elements.searchReplaceBtn.addEventListener("click", doReplace);
      elements.searchReplaceAllBtn.addEventListener("click", doReplaceAll);
    }

    // Quick Switcher Events
    if (elements.quickSwitcherInput) {
      elements.quickSwitcherInput.addEventListener("input", (e) => {
        updateQuickSwitcherResults(e.target.value);
      });

      elements.quickSwitcherInput.addEventListener("keydown", (e) => {
        const items = elements.quickSwitcherResults.querySelectorAll(".quick-switcher-item");
        if (items.length === 0) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          items[quickSwitcherSelectedIndex].classList.remove("selected");
          quickSwitcherSelectedIndex = (quickSwitcherSelectedIndex + 1) % items.length;
          items[quickSwitcherSelectedIndex].classList.add("selected");
          items[quickSwitcherSelectedIndex].scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          items[quickSwitcherSelectedIndex].classList.remove("selected");
          quickSwitcherSelectedIndex = (quickSwitcherSelectedIndex - 1 + items.length) % items.length;
          items[quickSwitcherSelectedIndex].classList.add("selected");
          items[quickSwitcherSelectedIndex].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          e.preventDefault();
          const path = items[quickSwitcherSelectedIndex].dataset.path;
          openFile(path);
          hideQuickSwitcher();
        }
      });
    }

    if (elements.quickSwitcherOverlay) {
      elements.quickSwitcherOverlay.addEventListener("click", (e) => {
        if (e.target === elements.quickSwitcherOverlay) {
          hideQuickSwitcher();
        }
      });
    }

    if (elements.quickSwitcherResults) {
      elements.quickSwitcherResults.addEventListener("click", (e) => {
        const item = e.target.closest(".quick-switcher-item");
        if (item) {
          openFile(item.dataset.path);
          hideQuickSwitcher();
        }
      });
    }

    // File Tree Drag & Drop (Root)
    if (elements.fileTree) {
      elements.fileTree.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        elements.fileTree.classList.add("drag-over-root");
      });

      elements.fileTree.addEventListener("dragleave", (e) => {
        // Only remove if leaving the tree entirely
        if (e.relatedTarget && !elements.fileTree.contains(e.relatedTarget)) {
             elements.fileTree.classList.remove("drag-over-root");
        }
      });

      elements.fileTree.addEventListener("drop", async (e) => {
        e.preventDefault();
        elements.fileTree.classList.remove("drag-over-root");
        
        // Check for external files
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processUploads(e.dataTransfer.files, null); // Upload to root
            return;
        }

        const sourcePath = e.dataTransfer.getData("text/plain");
        // Target is null (root)
        if (sourcePath) {
            await handleFileDrop(sourcePath, null);
        }
      });
    }

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
    await loadSettings();
    applyTheme();
    applyGitVisibility(); // Apply Git visibility setting
    updateShowHiddenButton();
    initEventListeners();
    initResizeHandle();

    // Load entities for autocomplete
    loadEntities();

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

      if (data.success) {
        gitState.files = data.files;
        gitState.isInitialized = data.is_initialized;
        gitState.hasRemote = data.has_remote;
        gitState.ahead = data.ahead || 0;
        gitState.behind = data.behind || 0;
        
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

    // Start onboarding if new user
    startOnboarding();

    // Start periodic git status polling (every 30 seconds)
    // This catches changes made outside Blueprint Studio
    startGitStatusPolling();
  }

  async function startOnboarding() {
    if (state.onboardingCompleted) return;

    let shouldOpenSettings = false;

    // Step 1: Welcome & Git Choice
    const useGit = await showConfirmDialog({
        title: "Welcome to Blueprint Studio! 🚀",
        message: `
            <div style="text-align: center;">
                <p>The modern, Git-powered file editor for Home Assistant.</p>
                <br>
                <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Would you like to enable Git integration?</div>
                    <ul style="text-align: left; display: inline-block; font-size: 13px; color: var(--text-secondary); margin: 0; padding-left: 20px;">
                        <li>Track file changes & revert mistakes</li>
                        <li>Backup configuration to GitHub</li>
                        <li>Manage version history visually</li>
                    </ul>
                </div>
                <p style="font-size: 12px; color: var(--text-secondary);">You can change this later in Settings.</p>
            </div>
        `,
        confirmText: "Enable Git Features",
        cancelText: "Disable Git Features"
    });

    if (useGit) {
        // User chose to enable (default)
        state.gitIntegrationEnabled = true;
        saveSettings();
        applyGitVisibility();

        // Step 3: Initialize Git (if needed)
        if (!gitState.isInitialized) {
          const initResult = await showConfirmDialog({
            title: "Step 1: Track Your Changes",
            message: `
              <div style="text-align: center;">
                <span class="material-icons" style="font-size: 48px; color: var(--accent-color);">source</span>
                <p>First, we need to initialize a Git repository to track your file changes.</p>
                <p style="font-size: 12px; color: var(--text-secondary);">This creates a hidden .git folder in your config directory.</p>
              </div>
            `,
            confirmText: "Initialize Repo",
            cancelText: "Skip"
          });

          if (initResult) {
            const success = await gitInit(true); // Skip prompt
            if (success) {
                gitState.isInitialized = true;
            }
          }
        }

        // Step 4: Git Ignore
        if (gitState.isInitialized) {
            const ignoreResult = await showConfirmDialog({
                title: "Step 2: Ignore Files",
                message: `
                    <div style="text-align: center;">
                        <span class="material-icons" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;">visibility_off</span>
                        <p style="margin-bottom: 10px;">Configure which files to hide from GitHub (like passwords or temp files).</p>
                        <p style="font-size: 12px; color: var(--text-secondary);">We've already configured safe defaults for you.</p>
                    </div>
                `,
                confirmText: "Manage Exclusions",
                cancelText: "Use Defaults"
            });

            if (ignoreResult) {
                await showGitExclusions();
            }
        }

        // Step 5: Connect to GitHub (Login)
        let isLoggedIn = false;
        try {
            const creds = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "git_get_credentials" }),
            });
            isLoggedIn = creds.has_credentials;
        } catch (e) {}

        if (!isLoggedIn) {
            const loginResult = await showConfirmDialog({
                title: "Step 3: Login to GitHub",
                message: `
                    <div style="text-align: center;">
                        <span class="material-icons" style="font-size: 48px; color: var(--text-secondary);">login</span>
                        <p>Login to GitHub to sync your configuration to the cloud.</p>
                    </div>
                `,
                confirmText: "Login",
                cancelText: "Skip"
            });

            if (loginResult) {
                const success = await showGithubDeviceFlowLogin();
                if (success) isLoggedIn = true;
            }
        }

        // Step 6: Create Repository (if logged in and no remote)
        if (isLoggedIn && !gitState.hasRemote) {
            const createResult = await showConfirmDialog({
                title: "Step 4: Create Repository",
                message: `
                    <div style="text-align: center;">
                        <span class="material-icons" style="font-size: 48px; color: var(--accent-color);">add_circle_outline</span>
                        <p>Create a new private repository on GitHub to store your backups.</p>
                    </div>
                `,
                confirmText: "Create Repo",
                cancelText: "Skip"
            });

            if (createResult) {
                await showCreateGithubRepoDialog();
            }
        }
    } else {
        // User chose to disable
        state.gitIntegrationEnabled = false;
        saveSettings();
        applyGitVisibility();
    }

    // Final Step: Finish
    const finishMessage = useGit 
        ? `
        <div style="text-align: center;">
          <p>Explore your files on the left.</p>
          <p>Use the <b>Git Panel</b> to stage, commit, and push changes.</p>
          <br>
          <p style="font-size: 12px;">Need help? Click the <span class="material-icons" style="font-size: 14px; vertical-align: middle;">help_outline</span> icon in the Git panel.</p>
        </div>
      `
        : `
        <div style="text-align: center;">
          <p>You're good to go! 🚀</p>
          <br>
          <p>Explore your files on the left and start editing.</p>
          <br>
          <p style="font-size: 12px; color: var(--text-secondary);">If you change your mind, you can enable Git integration in <b>Settings</b>.</p>
        </div>
      `;

    await showModal({
      title: "You're All Set! 🎉",
      message: finishMessage,
      confirmText: "Start Editing"
    });

    state.onboardingCompleted = true;
    saveSettings();

    // If they chose to connect GitHub, open the settings modal now
    if (shouldOpenSettings) {
        showGitSettings();
    }
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
        // Only poll if git is visible and enabled
        if (!isGitEnabled()) {
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
