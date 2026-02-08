/**
 * Blueprint Studio
 * A modern, feature-rich file editor for Home Assistant
 * https://github.com/katoaroosultan/blueprint-studio
 * v2.1.28-cache-bust
 */


  // ============================================
  // Configuration
  // ============================================
export const API_BASE = "/api/blueprint_studio";
export const MOBILE_BREAKPOINT = 768;
export const STORAGE_KEY = "blueprint_studio_settings";
export const MAX_RECENT_FILES = 10;

  // ============================================
  // Theme Presets
  // ============================================
export const THEME_PRESETS = {
    dark: {
      name: "Dark (Default)",
      colors: {
        bgPrimary: "#1e1e1e",
        bgSecondary: "#252526",
        bgTertiary: "#2d2d30",
        bgHover: "#3c3c3c",
        bgActive: "#094771",
        textPrimary: "#cccccc",
        textSecondary: "#858585",
        textMuted: "#6e6e6e",
        borderColor: "#3c3c3c",
        accentColor: "#0e639c",
        accentHover: "#1177bb",
        successColor: "#4ec9b0",
        warningColor: "#dcdcaa",
        errorColor: "#f14c4c",
        iconFolder: "#dcb67a",
        iconYaml: "#cb4b16",
        iconJson: "#cbcb41",
        iconPython: "#3572a5",
        iconJs: "#f1e05a",
        iconDefault: "#858585",
        modalBg: "#2d2d30",
        inputBg: "#3c3c3c",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        cmTheme: "material-darker",
        bgGutter: "#2d2d30"
      }
    },
    light: {
      name: "Light",
      colors: {
        bgPrimary: "#ffffff",
        bgSecondary: "#f3f3f3",
        bgTertiary: "#e8e8e8",
        bgHover: "#e0e0e0",
        bgActive: "#0060c0",
        textPrimary: "#1e1e1e",
        textSecondary: "#616161",
        textMuted: "#9e9e9e",
        borderColor: "#d4d4d4",
        accentColor: "#0066b8",
        accentHover: "#0078d4",
        successColor: "#16825d",
        warningColor: "#bf8803",
        errorColor: "#e51400",
        iconFolder: "#c09553",
        iconYaml: "#a83232",
        iconJson: "#b89500",
        iconPython: "#2b5b84",
        iconJs: "#b8a000",
        iconDefault: "#616161",
        modalBg: "#ffffff",
        inputBg: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.2)",
        cmTheme: "default"
      }
    },
    highContrast: {
      name: "High Contrast",
      colors: {
        bgPrimary: "#000000",
        bgSecondary: "#0c0c0c",
        bgTertiary: "#1a1a1a",
        bgHover: "#333333",
        bgActive: "#ffff00",
        textPrimary: "#ffffff",
        textSecondary: "#cccccc",
        textMuted: "#999999",
        borderColor: "#ffffff",
        accentColor: "#00ffff",
        accentHover: "#66ffff",
        successColor: "#00ff00",
        warningColor: "#ffff00",
        errorColor: "#ff0000",
        iconFolder: "#ffff00",
        iconYaml: "#ff9900",
        iconJson: "#ffff00",
        iconPython: "#00ff00",
        iconJs: "#ffff00",
        iconDefault: "#cccccc",
        modalBg: "#0c0c0c",
        inputBg: "#000000",
        shadowColor: "rgba(255, 255, 255, 0.3)",
        cmTheme: "default"
      }
    },
    solarizedDark: {
      name: "Solarized Dark",
      colors: {
        bgPrimary: "#002b36",
        bgSecondary: "#073642",
        bgTertiary: "#586e75",
        bgHover: "#073642",
        bgActive: "#268bd2",
        textPrimary: "#839496",
        textSecondary: "#93a1a1",
        textMuted: "#586e75",
        borderColor: "#073642",
        accentColor: "#268bd2",
        accentHover: "#2aa198",
        successColor: "#859900",
        warningColor: "#b58900",
        errorColor: "#dc322f",
        iconFolder: "#b58900",
        iconYaml: "#cb4b16",
        iconJson: "#b58900",
        iconPython: "#2aa198",
        iconJs: "#b58900",
        iconDefault: "#93a1a1",
        modalBg: "#073642",
        inputBg: "#002b36",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        cmTheme: "default"
      }
    },
    solarizedLight: {
      name: "Solarized Light",
      colors: {
        bgPrimary: "#fdf6e3",
        bgSecondary: "#eee8d5",
        bgTertiary: "#e8e0c8",
        bgHover: "#d4ceb6",
        bgActive: "#268bd2",
        textPrimary: "#657b83",
        textSecondary: "#586e75",
        textMuted: "#93a1a1",
        borderColor: "#e8e0c8",
        accentColor: "#268bd2",
        accentHover: "#2aa198",
        successColor: "#859900",
        warningColor: "#b58900",
        errorColor: "#dc322f",
        iconFolder: "#b58900",
        iconYaml: "#cb4b16",
        iconJson: "#b58900",
        iconPython: "#2aa198",
        iconJs: "#b58900",
        iconDefault: "#586e75",
        modalBg: "#eee8d5",
        inputBg: "#fdf6e3",
        shadowColor: "rgba(0, 0, 0, 0.2)",
        cmTheme: "default"
      }
    },
    ocean: {
      name: "Ocean",
      colors: {
        bgPrimary: "#0f1419",
        bgSecondary: "#131d27",
        bgTertiary: "#1a2634",
        bgHover: "#243447",
        bgActive: "#1da1f2",
        textPrimary: "#e6eef7",
        textSecondary: "#8899a6",
        textMuted: "#5b7083",
        borderColor: "#243447",
        accentColor: "#1da1f2",
        accentHover: "#4db8ff",
        successColor: "#17bf63",
        warningColor: "#ffad1f",
        errorColor: "#e0245e",
        iconFolder: "#ffad1f",
        iconYaml: "#f45d22",
        iconJson: "#ffad1f",
        iconPython: "#17bf63",
        iconJs: "#ffad1f",
        iconDefault: "#8899a6",
        modalBg: "#1a2634",
        inputBg: "#131d27",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        cmTheme: "material-darker",
        bgGutter: "#1a2634"
      }
    },
    dracula: {
      name: "Dracula",
      colors: {
        bgPrimary: "#282a36",
        bgSecondary: "#44475a",
        bgTertiary: "#6272a4",
        bgHover: "#44475a",
        bgActive: "#bd93f9",
        textPrimary: "#f8f8f2",
        textSecondary: "#bfbfbf",
        textMuted: "#6272a4",
        borderColor: "#44475a",
        accentColor: "#bd93f9",
        accentHover: "#ff79c6",
        successColor: "#50fa7b",
        warningColor: "#f1fa8c",
        errorColor: "#ff5555",
        iconFolder: "#ffb86c",
        iconYaml: "#ff79c6",
        iconJson: "#f1fa8c",
        iconPython: "#50fa7b",
        iconJs: "#f1fa8c",
        iconDefault: "#bfbfbf",
        modalBg: "#44475a",
        inputBg: "#282a36",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        cmTheme: "material-darker",
        bgGutter: "#6272a4"
      }
    }
  };

  // Accent color options
export const ACCENT_COLORS = [
    { name: "Blue", value: "#0e639c", lightValue: "#0066b8" },
    { name: "Purple", value: "#7c4dff", lightValue: "#651fff" },
    { name: "Pink", value: "#ff4081", lightValue: "#c60055" },
    { name: "Red", value: "#ff5252", lightValue: "#d32f2f" },
    { name: "Orange", value: "#ff9100", lightValue: "#ef6c00" },
    { name: "Green", value: "#4caf50", lightValue: "#2e7d32" },
    { name: "Teal", value: "#00bfa5", lightValue: "#00897b" },
    { name: "Cyan", value: "#00b8d4", lightValue: "#0097a7" }
  ];

  // ============================================
  // Home Assistant Autocomplete Schema
  // ============================================
export let HA_ENTITIES = [];

export const HA_SCHEMA = {
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

    snippets: [
      { 
        text: "snip:automation", 
        label: "Automation Snippet",
        type: "snippet", 
        description: "Standard automation template",
        content: `- alias: "New Automation"\n  description: "Description of the automation"\n  trigger:\n    - platform: state\n      entity_id: light.example\n      to: "on"\n  condition: []\n  action:\n    - service: light.turn_on\n      target:\n        entity_id: light.example\n  mode: single`
      },
      { 
        text: "snip:script", 
        label: "Script Snippet",
        type: "snippet", 
        description: "Standard script template",
        content: `new_script:\n  alias: "New Script"\n  sequence:\n    - service: light.turn_on\n      target:\n        entity_id: light.example\n  mode: single`
      },
      { 
        text: "snip:sensor", 
        label: "Template Sensor Snippet",
        type: "snippet", 
        description: "Modern template sensor",
        content: `template:\n  - sensor:\n      - name: "My Sensor"\n        state: >\n          {{ states('sensor.source') }}\n        unit_of_measurement: "°C"\n        device_class: temperature`
      }
    ]
  };

  // ============================================
  // Home Assistant Autocomplete Function
  // ============================================

export function homeAssistantHint(editor, options) {
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
    // Check for snippets (prefix with snip:)
    const snipMatch = lineText.match(/(snip:[a-z0-9_]*|sni?p?:?)$/i);
    if (snipMatch) {
      const snipQuery = snipMatch[0].toLowerCase();
      const snipStart = cursor.ch - snipQuery.length;
      
      const snipMatches = HA_SCHEMA.snippets.filter(s => s.text.startsWith(snipQuery) || snipQuery.startsWith(s.text.split(':')[0]));
      
      if (snipMatches.length > 0) {
          suggestions = snipMatches.map(item => ({
            text: item.text,
            displayText: item.label,
            className: 'ha-hint-snippet',
            render: (elem, self, data) => {
              elem.innerHTML = `
                <div style="display: flex; align-items: center; width: 100%;">
                    <span class="material-icons" style="font-size: 16px; margin-right: 6px; color: var(--warning-color);">auto_fix_high</span>
                    <span>${data.displayText}</span>
                    <span class="ha-hint-type" style="margin-left: auto;">${item.type}</span>
                </div>
              `;
            },
            hint: (cm, self, data) => {
              // Indent the snippet based on current line indentation
              const indent = currentLine.match(/^\s*/)[0];
              const indentedContent = item.content.split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n');
              cm.replaceRange(indentedContent, { line: cursor.line, ch: snipStart }, { line: cursor.line, ch: end });
            }
          }));
          
          return {
              list: suggestions,
              from: CodeMirror.Pos(cursor.line, snipStart),
              to: CodeMirror.Pos(cursor.line, end)
          };
      }
    }

    // Top-level configuration keys
    if (suggestions.length === 0 && context.indent === 0 && isLineStart) {
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

export function getYamlContext(editor, lineNumber) {
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

export function defineHAYamlMode() {
    try {
      CodeMirror.defineMode("ha-yaml", function(config) {
        const yamlMode = CodeMirror.getMode(config, "yaml");

        return {
          startState: function() {
            return {
              yamlState: CodeMirror.startState(yamlMode),
              inJinja: false,
              jinjaType: null
            };
          },
          copyState: function(state) {
            return {
              yamlState: CodeMirror.copyState(yamlMode, state.yamlState),
              inJinja: state.inJinja,
              jinjaType: state.jinjaType
            };
          },
          token: function(stream, state) {
            // Check for Jinja start if not in Jinja mode
            if (!state.inJinja) {
              // We must check for Jinja BEFORE delegating to YAML, 
              // but we must be careful not to break YAML strings.
              // However, in HA, {{ usually starts a value or is part of a string.
              
              if (stream.match("{{")) {
                state.inJinja = true;
                state.jinjaType = "{{";
                return "jinja-bracket"; 
              }
              if (stream.match("{%")) {
                state.inJinja = true;
                state.jinjaType = "{%";
                return "jinja-bracket";
              }
              if (stream.match("{#")) {
                state.inJinja = true;
                state.jinjaType = "{#";
                return "comment";
              }

              // Delegate to YAML
              const style = yamlMode.token(stream, state.yamlState);
              
              // Post-process for HA Overlay logic
              // Highlight Home Assistant YAML tags
              const current = stream.current();
              if (current.match(/^!(include(_dir_(list|named|merge_list|merge_named))?|secret|env_var|input)/)) {
                return "ha-include-tag";
              }

              // Highlight common HA domain keywords at start of line
              if (style === "atom" || style === "tag" || !style) {
                  if (current.match(/^[\s-]*(automation|script|sensor|binary_sensor|template|input_boolean|input_number|input_select|input_text|input_datetime|light|switch|climate|cover|scene|group|zone|person):/)) {
                    return style ? style + " ha-domain" : "ha-domain";
                  }
                  // Highlight trigger/condition/action keywords
                  if (current.match(/^[\s-]*(id|alias|trigger|triggers|condition|conditions|action|actions|service|entity_id|platform|device_id|area_id):/)) {
                    return style ? style + " ha-key" : "ha-key";
                  }
              }
              return style;
            }

            // Inside Jinja Mode
            if (state.inJinja) {
              // Check for end
              if ((state.jinjaType === "{{" && stream.match("}}")) ||
                  (state.jinjaType === "{%" && stream.match("%}")) ||
                  (state.jinjaType === "{#" && stream.match("#}"))) {
                state.inJinja = false;
                state.jinjaType = null;
                return "jinja-bracket";
              }
              
              if (state.jinjaType === "{#") {
                stream.next();
                return "comment";
              }
              
              // Keywords
              if (stream.match(/^(if|else|elif|endif|for|endfor|in|is|and|or|not|true|false|none|null|block|endblock|extends|include|import|macro|endmacro|call|endcall|filter|endfilter|set|ns|namespace)\b/)) {
                return "jinja-keyword";
              }
              
              // Atom (Booleans/None)
              if (stream.match(/^(true|false|none|null)\b/)) {
                return "jinja-atom";
              }
              
              // Strings
              if (stream.match(/^'([^']|\\')*'/)) return "string";
              if (stream.match(/^"([^"]|\\")*"/)) return "string";
              
              // Numbers
              if (stream.match(/^\d+(\.\d+)?/)) return "number";
              
              // Variables / Functions
              if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
                 return "variable"; 
              }
              
              // Operators
              if (stream.match(/^(\+|\-|\*|\/|%|==|!=|<=|>=|<|>|=|\||\(|\)|\[|\]|\.|,)/)) {
                return "jinja-operator";
              }
              
              // Whitespace or unknown char
              stream.next();
              return null;
            }
          },
          indent: function(state, textAfter) {
            return yamlMode.indent ? yamlMode.indent(state.yamlState, textAfter) : CodeMirror.Pass;
          },
          innerMode: function(state) {
            return {state: state.yamlState, mode: yamlMode};
          }
        };
      });
      console.log("HA YAML mode defined successfully");
    } catch (error) {
      console.error("Error defining HA YAML mode:", error);
    }
  }

  // Define the HA YAML mode on load
  defineHAYamlMode();

  // Define Whitespace Visualization Mode
export function defineShowWhitespaceMode() {
    try {
      CodeMirror.defineMode("show-whitespace", function(config, parserConfig) {
        return {
          token: function(stream, state) {
            if (stream.eat(" ")) return "whitespace-space";
            if (stream.eat("\t")) return "whitespace-tab";
            stream.next();
            return null;
          }
        };
      });
    } catch (error) {
        console.error("Error defining whitespace mode:", error);
    }
  }
  defineShowWhitespaceMode();

  // ============================================
  // State Management
  // ============================================
  
  // Auto-save timer reference
export let autoSaveTimer = null;
export let workspaceSaveTimer = null;
  
export const state = {
    files: [],
    fileTree: {},
    openTabs: [],
    activeTab: null,
    expandedFolders: new Set(),
    favoriteFiles: [],  // Array of favorite file paths
    recentFiles: [],    // Array of recently opened file paths
    searchQuery: "",
    contentSearchEnabled: false,
    contentSearchResults: null, // Set of matching file paths
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
    customColors: {},
    aiIntegrationEnabled: false, // AI integration state
    aiProvider: "local",         // AI Provider: local, gemini, openai
    aiModel: "gemini-3-flash-preview", // Default model
    geminiApiKey: "",
    openaiApiKey: "",
    // New UI customization settings
    themePreset: "dark",         // Theme preset name
    accentColor: null,           // Custom accent color (null = use preset)
    fontSize: 14,                // Editor font size
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
    sidebarWidth: 320,           // Sidebar width in px
    tabPosition: "top",          // Tab position: top, left, right
    wordWrap: true,              // Word wrap in editor
    showLineNumbers: true,       // Show line numbers
    showMinimap: false,          // Show minimap
    showWhitespace: false,       // Show whitespace characters
    autoSave: false,             // Auto-save files
    autoSaveDelay: 1000,         // Auto-save delay in ms
    fileTreeCompact: false,      // Compact file tree mode
    fileTreeShowIcons: true,     // Show file icons in tree
    recentFilesLimit: 10,        // Number of recent files to show
    breadcrumbStyle: "path",     // Breadcrumb style: path, filename
    giteaIntegrationEnabled: false, // Gitea integration state
    gitPanelCollapsed: false,    // Git panel collapse state
    giteaPanelCollapsed: false,  // Gitea panel collapse state
    rememberWorkspace: true,     // Remember open tabs, active tab, cursor, and scroll
    showToasts: true,            // Show toast notifications
    _lastShowHidden: false,      // Track previous hidden state for cache invalidation
    _lastGitChanges: null,       // Track previous Git change list
    _lastGiteaChanges: null      // Track previous Gitea change list
  };

  // ============================================
  // DOM Elements
  // ============================================
export const elements = {};

export function initElements() {
    elements.fileTree = document.getElementById("file-tree");
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
    elements.btnToggleSelect = document.getElementById("btn-toggle-select"); // New selection toggle
    elements.selectionToolbar = document.getElementById("selection-toolbar"); // New toolbar
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
    elements.btnGitHistory = document.getElementById("btn-git-history");
    elements.btnStageSelected = document.getElementById("btn-stage-selected");
    elements.btnStageAll = document.getElementById("btn-stage-all");
    elements.btnUnstageAll = document.getElementById("btn-unstage-all");
    elements.btnCommitStaged = document.getElementById("btn-commit-staged");
    
    // Gitea Elements
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
    
    // Command Palette
    elements.commandPaletteOverlay = document.getElementById("command-palette-overlay");
    elements.commandPaletteInput = document.getElementById("command-palette-input");
    elements.commandPaletteResults = document.getElementById("command-palette-results");

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

  // Helper to dynamically load scripts
export async function loadScript(url) {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Lazy-load Diff/Merge libraries
export async function ensureDiffLibrariesLoaded() {
    if (window.diff_match_patch && CodeMirror.MergeView) return;
    
    showGlobalLoading("Initializing Diff viewer...");
    try {
        if (!window.diff_match_patch) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js");
        }
        if (!CodeMirror.MergeView) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/merge/merge.min.js");
        }
    } catch (e) {
        console.error("Failed to load Diff libraries", e);
        throw new Error("Could not load Diff components. Please check your internet connection.");
    } finally {
        hideGlobalLoading();
    }
  }

  // Debounced file tree rendering to prevent UI lag
export let fileTreeRenderTimer = null;
export function debouncedRenderFileTree() {
    if (fileTreeRenderTimer) clearTimeout(fileTreeRenderTimer);
    fileTreeRenderTimer = setTimeout(() => {
        renderFileTree();
    }, 50);
  }

  // List of extensions considered text files that CodeMirror can handle
export const TEXT_FILE_EXTENSIONS = new Set([
    "yaml", "yml", "json", "py", "js", "css", "html", "txt",
    "md", "conf", "cfg", "ini", "sh", "log", "svg", "jinja", "jinja2", "j2",
    "pem", "crt", "key", "cpp", "h", "gitignore", "lock"
  ]);

export function isTextFile(filename) {
    if (filename.includes(".storage/") || filename.startsWith(".storage/")) return true;
    const ext = filename.split(".").pop().toLowerCase();
    return TEXT_FILE_EXTENSIONS.has(ext);
  }

export function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

export function getFileIcon(filename) {
    if (filename && (filename.includes(".storage/") || filename.startsWith(".storage/"))) {
        return { icon: "data_object", class: "json" };
    }
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
      jinja: { icon: "integration_instructions", class: "default" },
      jinja2: { icon: "integration_instructions", class: "default" },
      j2: { icon: "integration_instructions", class: "default" },
      db: { icon: "storage", class: "default" },
      sqlite: { icon: "storage", class: "default" },
      pem: { icon: "verified_user", class: "default" },
      crt: { icon: "verified_user", class: "default" },
      key: { icon: "vpn_key", class: "default" },
      der: { icon: "verified_user", class: "default" },
      bin: { icon: "memory", class: "default" },
      ota: { icon: "system_update", class: "default" },
      cpp: { icon: "code", class: "default" },
      h: { icon: "code", class: "default" },
      tar: { icon: "folder_zip", class: "default" },
      gz: { icon: "folder_zip", class: "default" },
      gitignore: { icon: "rule", class: "default" },
      lock: { icon: "lock", class: "default" },
    };
    return iconMap[ext] || { icon: "insert_drive_file", class: "default" };
  }

export function getEditorMode(filename) {
    if (filename.includes(".storage/") || filename.startsWith(".storage/")) {
        return { name: "javascript", json: true };
    }
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
      jinja: yamlMode,
      jinja2: yamlMode,
      j2: yamlMode,
      db: null,
      sqlite: null,
      pem: null,
      crt: null,
      key: null,
      der: null,
      bin: null,
      ota: null,
      cpp: "text/x-c++src",
      h: "text/x-c++src",
      tar: null,
      gz: null,
      gitignore: yamlMode,
      lock: null,
    };
    return modeMap[ext] || null;
  }

export function getLanguageName(filename) {
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
      jinja: "Jinja",
      jinja2: "Jinja2",
      j2: "Jinja",
      db: "Database",
      sqlite: "Database",
      pem: "Certificate",
      crt: "Certificate",
      key: "Key",
      der: "Binary Certificate",
      bin: "Binary",
      ota: "OTA Firmware",
      cpp: "C++",
      h: "C/C++ Header",
      tar: "Tar Archive",
      gz: "Gzip Archive",
      gitignore: "Git Ignore",
      lock: "Lock File",
    };
    return nameMap[ext] || "Plain Text";
  }

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

export function showToast(message, type = "success", duration = 3000, action = null) {
    if (!state.showToasts && type !== "error" && !action) {
        return;
    }

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
        toast.style.transform = "translateX(100%)";
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

export function setConnectionStatus(connected) {
    if (elements.statusConnection) {
      elements.statusConnection.innerHTML = connected
        ? '<span class="material-icons">cloud_done</span><span>Connected</span>'
        : '<span class="material-icons">cloud_off</span><span>Disconnected</span>';
    }
  }

export function translateYamlError(errorMessage) {
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

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

export function applyCustomSyntaxColors() {
    const styleId = "custom-syntax-colors";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const colors = state.customColors || {};
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
  }

  // ============================================
  // Theme Management
  // ============================================

export async function loadSettings() {
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
      state.customColors = settings.customColors || {};
      state.geminiApiKey = settings.geminiApiKey || null;
      state.openaiApiKey = settings.openaiApiKey || null;
      state.claudeApiKey = settings.claudeApiKey || null;
      
      // New UI customization settings
      state.themePreset = settings.themePreset || "dark";
      state.accentColor = settings.accentColor || null;
      state.fontSize = settings.fontSize || 14;
      state.fontFamily = settings.fontFamily || "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace";
      state.sidebarWidth = settings.sidebarWidth || 320;
      state.tabPosition = settings.tabPosition || "top";
      state.wordWrap = settings.wordWrap !== false; // default true
      state.showLineNumbers = settings.showLineNumbers !== false; // default true
      state.showMinimap = settings.showMinimap || false;
      state.showWhitespace = settings.showWhitespace || false;
      state.autoSave = settings.autoSave || false;
      state.autoSaveDelay = settings.autoSaveDelay || 1000;
      state.fileTreeCompact = settings.fileTreeCompact || false;
      state.fileTreeShowIcons = settings.fileTreeShowIcons !== false; // default true
      state.recentFilesLimit = settings.recentFilesLimit || 10;
      state.breadcrumbStyle = settings.breadcrumbStyle || "path";
      state.showToasts = settings.showToasts !== false; // default true
      
      // New state properties for sync
      state.onboardingCompleted = settings.onboardingCompleted ?? (localStorage.getItem("onboardingCompleted") === "true");
      state.gitIntegrationEnabled = settings.gitIntegrationEnabled ?? (localStorage.getItem("gitIntegrationEnabled") !== "false");
      state.giteaIntegrationEnabled = settings.giteaIntegrationEnabled ?? (localStorage.getItem("giteaIntegrationEnabled") === "true");
      state.gitPanelCollapsed = settings.gitPanelCollapsed || false;
      state.giteaPanelCollapsed = settings.giteaPanelCollapsed || false;
      state.rememberWorkspace = settings.rememberWorkspace !== false; // default true
      state.aiIntegrationEnabled = settings.aiIntegrationEnabled ?? false;
      state.aiProvider = settings.aiProvider || "local";
      state.aiModel = settings.aiModel || (state.aiProvider === "openai" ? "gpt-5.2" : "gemini-3-flash-preview");
      state.geminiApiKey = settings.geminiApiKey || "";
      state.openaiApiKey = settings.openaiApiKey || "";

      state._savedOpenTabs = settings.openTabs || localSettings.openTabs || [];
      state._savedActiveTabPath = settings.activeTabPath || localSettings.activeTabPath || null;

      applyTheme();
      applyCustomSyntaxColors();
      updateAIVisibility();

    } catch (e) {
      console.log("Could not load settings:", e);
    }
  }

export async function saveSettings() {
    try {
      // Update current active tab's cursor/scroll before saving
      if (state.activeTab && state.editor) {
        state.activeTab.cursor = state.editor.getCursor();
        state.activeTab.scroll = state.editor.getScrollInfo();
      }

      // Save open tabs state
      let openTabsState = [];
      let activeTabPath = null;
      
      if (state.rememberWorkspace) {
        openTabsState = state.openTabs.map(tab => ({
          path: tab.path,
          modified: tab.modified,
          cursor: tab.cursor,
          scroll: tab.scroll
        }));
        activeTabPath = state.activeTab ? state.activeTab.path : null;
      }

      const settings = {
        theme: state.theme,
        showHidden: state.showHidden,
        showRecentFiles: state.showRecentFiles,
        favoriteFiles: state.favoriteFiles,
        recentFiles: state.recentFiles,
        customColors: state.customColors,
        openTabs: openTabsState,
        activeTabPath: activeTabPath,
        gitConfig: state.gitConfig,
        onboardingCompleted: state.onboardingCompleted,
        gitIntegrationEnabled: state.gitIntegrationEnabled,
        giteaIntegrationEnabled: state.giteaIntegrationEnabled,
        aiIntegrationEnabled: state.aiIntegrationEnabled,
        aiProvider: state.aiProvider,
        aiModel: state.aiModel,
        geminiApiKey: state.geminiApiKey,
        openaiApiKey: state.openaiApiKey,
        // New UI customization settings
        themePreset: state.themePreset,
        accentColor: state.accentColor,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        sidebarWidth: state.sidebarWidth,
        tabPosition: state.tabPosition,
        wordWrap: state.wordWrap,
        showLineNumbers: state.showLineNumbers,
        showMinimap: state.showMinimap,
        showWhitespace: state.showWhitespace,
        autoSave: state.autoSave,
        autoSaveDelay: state.autoSaveDelay,
        fileTreeCompact: state.fileTreeCompact,
        fileTreeShowIcons: state.fileTreeShowIcons,
        recentFilesLimit: state.recentFilesLimit,
        breadcrumbStyle: state.breadcrumbStyle,
        gitPanelCollapsed: state.gitPanelCollapsed,
        giteaPanelCollapsed: state.giteaPanelCollapsed,
        rememberWorkspace: state.rememberWorkspace
      };

      // Save to server
      const savePromise = fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_settings", settings: settings }),
      }).catch(e => console.error("Failed to save settings to server:", e));

      // Save to local storage (cache/fallback)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      // Sync legacy keys
      if (state.onboardingCompleted) localStorage.setItem("onboardingCompleted", "true");
      localStorage.setItem("gitIntegrationEnabled", state.gitIntegrationEnabled);

      return savePromise;
    } catch (e) {
      console.log("Could not save settings:", e);
      return Promise.resolve();
    }
  }

export function getEffectiveTheme() {
    if (state.theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return state.theme;
  }

export function applyTheme() {
    const effectiveTheme = getEffectiveTheme();
    const preset = THEME_PRESETS[state.themePreset] || THEME_PRESETS.dark;
    
    // Apply CSS variables
    const root = document.documentElement;
    const colors = preset.colors;
    
    // Override accent color if custom
    let accentColor = colors.accentColor;
    let accentHover = colors.accentHover;
    if (state.accentColor) {
      accentColor = state.accentColor;
      // Generate hover color by lightening
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
    
    // Custom editor colors
    const custom = state.customColors || {};
    root.style.setProperty('--cm-line-number-color', custom.lineNumberColor || colors.textMuted);
    root.style.setProperty('--cm-fold-color', custom.foldColor || colors.textMuted);
    
    document.body.setAttribute("data-theme", effectiveTheme);
    document.body.setAttribute("data-theme-preset", state.themePreset);

    // Update theme toggle display
    const themeIcons = { 
        light: "light_mode", 
        dark: "dark_mode", 
        auto: "brightness_auto",
        highContrast: "contrast",
        solarizedDark: "palette",
        solarizedLight: "palette",
        ocean: "water",
        dracula: "nightlight_round"
    };
    const themeLabels = { 
        light: "Light", 
        dark: "Dark", 
        auto: "Auto",
        highContrast: "Contrast",
        solarizedDark: "Solar Dark",
        solarizedLight: "Solar Light",
        ocean: "Ocean",
        dracula: "Dracula"
    };

    // Use themePreset for label lookup if not auto, otherwise fallback to theme state
    const displayKey = state.theme === 'auto' ? 'auto' : state.themePreset;

    if (elements.themeIcon) {
      elements.themeIcon.textContent = themeIcons[displayKey] || "dark_mode";
    }
    if (elements.themeLabel) {
      elements.themeLabel.textContent = themeLabels[displayKey] || "Dark";
    }

    // Update active menu item based on preset
    document.querySelectorAll(".theme-menu-item").forEach(item => {
      const itemTheme = item.dataset.theme;
      // Match if item is 'auto' and state is 'auto', OR if item matches current preset
      const isActive = (state.theme === 'auto' && itemTheme === 'auto') || 
                       (state.theme !== 'auto' && itemTheme === state.themePreset);
      item.classList.toggle("active", isActive);
    });

    // Apply editor-specific customizations
    applyEditorSettings();
    
    // Apply layout customizations
    applyLayoutSettings();

    // Update CodeMirror theme
    if (state.editor) {
      state.editor.setOption("theme", colors.cmTheme);
    }
  }

  // Helper function to lighten a hex color
export function lightenColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  // Apply editor settings
export function applyEditorSettings() {
    if (!state.editor) return;
    
    // Font settings
    const editorEl = document.querySelector('.CodeMirror');
    if (editorEl) {
      editorEl.style.fontSize = state.fontSize + 'px';
      editorEl.style.fontFamily = state.fontFamily;
    }
    
    // CodeMirror options
    state.editor.setOption('lineNumbers', state.showLineNumbers);
    state.editor.setOption('lineWrapping', state.wordWrap);
    
    // Whitespace Visualization
    // We remove it first to avoid duplicates, then add if enabled
    state.editor.removeOverlay("show-whitespace");
    if (state.showWhitespace) {
        state.editor.addOverlay("show-whitespace");
    }
    
    // Minimap is custom implementation - would need additional setup
    const minimapEl = document.getElementById('minimap');
    if (minimapEl) {
      minimapEl.style.display = state.showMinimap ? 'block' : 'none';
    }
  }

  // Apply layout settings
export function applyLayoutSettings() {
    // Sidebar width
    if (elements.sidebar) {
      elements.sidebar.style.width = state.sidebarWidth + 'px';
    }
    
    // Tab position
    document.body.setAttribute('data-tab-position', state.tabPosition);
    
    // File tree compact mode
    document.body.classList.toggle('file-tree-compact', state.fileTreeCompact);
    
    // File tree icons
    document.body.classList.toggle('file-tree-no-icons', !state.fileTreeShowIcons);
  }

  // Set theme preset
export function setThemePreset(preset) {
    state.themePreset = preset;
    if (preset === 'light') {
      state.theme = 'light';
    } else if (preset === 'dark' || preset === 'highContrast' || preset === 'solarizedDark' || preset === 'ocean' || preset === 'dracula') {
      state.theme = 'dark';
    }
    applyTheme();
    saveSettings();
  }

  // Set accent color
export function setAccentColor(color) {
    state.accentColor = color;
    applyTheme();
    saveSettings();
  }

export function setTheme(theme) {
    state.theme = theme;
    applyTheme();
    saveSettings();
  }

export function updateShowHiddenButton() {
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

export function isFavorite(path) {
    return state.favoriteFiles.includes(path);
  }

export function toggleFavorite(path) {
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

export function renderFavoritesPanel() {
    const favoritesContainer = document.getElementById("favorites-panel");
    if (!favoritesContainer) return;

    // Filter valid favorites first
    const validFavorites = state.favoriteFiles.filter(filePath => 
      state.files.some(f => f.path === filePath)
    );

    if (validFavorites.length === 0) {
      favoritesContainer.style.display = "none";
      return;
    }

    favoritesContainer.style.display = "block";
    favoritesContainer.innerHTML = '<div class="favorites-header">Favorites</div>';

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

export function renderRecentFilesPanel() {
    const recentFilesContainer = document.getElementById("recent-files-panel");
    if (!recentFilesContainer) return;

    if (!state.showRecentFiles) {
      recentFilesContainer.style.display = "none";
      return;
    }

    // Filter existing files and apply limit
    const limit = state.recentFilesLimit || MAX_RECENT_FILES;
    const existingRecentFiles = state.recentFiles
      .filter(filePath => state.files.some(f => f.path === filePath))
      .slice(0, limit);

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

      const fileIcon = getFileIcon(filePath);
      const isActive = state.activeTab && state.activeTab.path === filePath;

      item.innerHTML = `
        <div class="tree-chevron hidden"></div>
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

export let modalCallback = null;
export let activePollTimer = null;

  // Default modal HTML structure for reset
export const DEFAULT_MODAL_BODY_HTML = `
    <input type="text" class="modal-input" id="modal-input" placeholder="">
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
    }

    // Show modal footer
    if (modalFooter) {
      modalFooter.style.display = "";
    }

    // Clear any callback
    modalCallback = null;
  }

export function showModal(options) {
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

export function showConfirmDialog(options) {
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

export function hideModal() {
    elements.modalOverlay.classList.remove("visible");
    if (modalCallback) {
      modalCallback(null);
      modalCallback = null;
    }
  }

export function confirmModal() {
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

export function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.classList.add("loading");
      button.disabled = true;
    } else {
      button.classList.remove("loading");
      button.disabled = false;
    }
  }

export function setFileTreeLoading(isLoading) {
    if (elements.fileTree) {
      if (isLoading) {
        elements.fileTree.classList.add("loading");
        // Show skeletons
        elements.fileTree.innerHTML = `
            <div class="skeleton file-skeleton"></div>
            <div class="skeleton file-skeleton" style="width: 70%;"></div>
            <div class="skeleton file-skeleton" style="width: 85%;"></div>
            <div class="skeleton file-skeleton" style="width: 60%;"></div>
            <div class="skeleton file-skeleton" style="width: 90%;"></div>
        `;
      } else {
        elements.fileTree.classList.remove("loading");
      }
    }
  }

export async function reportIssue() {
    let haVersion = "Unknown";
    let integrationVersion = "2.1.0";

    try {
      const versionData = await fetchWithAuth(`${API_BASE}?action=get_version`);
      if (versionData.ha_version) haVersion = versionData.ha_version;
      if (versionData.integration_version) integrationVersion = versionData.integration_version;
    } catch (e) {
      console.error("Failed to fetch version info", e);
    }

    const body = `
**Describe the bug or feature request**
A clear and concise description of what the issue is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment**
- **Blueprint Studio Version:** ${integrationVersion}
- **Home Assistant Version:** ${haVersion}
- **Browser:** ${navigator.userAgent}

**Screenshots**
If applicable, add screenshots to help explain your problem.
    `.trim();

    const title = "[BUG] ";
    const url = `https://github.com/soulripper13/blueprint-studio/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  }

export function requestFeature() {
    const body = `
## Is your feature request related to a problem?
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Describe the solution you'd like
A clear and concise description of what you want to happen.

## Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

## Use Case
Explain how this feature would be used and who would benefit from it.

## Example
If applicable, provide an example of how this feature would work or look.

## Screenshots/Mockups
If applicable, add screenshots or mockups to help explain your feature request.

## Additional Context
Add any other context, links, or references about the feature request here.

## Checklist
- [ ] I have checked existing issues to avoid duplicates
- [ ] I have described the use case clearly
- [ ] This feature aligns with Blueprint Studio's purpose
    `.trim();

    const title = "[FEATURE] ";
    const url = `https://github.com/soulripper13/blueprint-studio/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  }

export function showShortcuts() {
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.classList.add("visible");
    }
  }

export function hideShortcuts() {
    if (elements.shortcutsOverlay) {
      elements.shortcutsOverlay.classList.remove("visible");
    }
  }

  // ============================================
  // Context Menu
  // ============================================

export function showContextMenu(x, y, target) {
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

export function showTabContextMenu(x, y, tab) {
    state.tabContextMenuTarget = tab;
    const menu = elements.tabContextMenu;
    if (!menu) return;

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

export function hideContextMenu() {
    elements.contextMenu.classList.remove("visible");
    if (elements.tabContextMenu) elements.tabContextMenu.classList.remove("visible");
    state.contextMenuTarget = null;
    state.tabContextMenuTarget = null;
  }

  // ============================================
  // Search Implementation
  // ============================================

export function updateSearchHighlights(query) {
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

export function updateMatchStatus(query) {
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

export function openSearchWidget(replaceMode = false) {
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

export function closeSearchWidget() {
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

export function doFind(reverse = false) {
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

export function doReplace() {
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

export function doReplaceAll() {
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

export let quickSwitcherSelectedIndex = 0;

export function showQuickSwitcher() {
    if (!elements.quickSwitcherOverlay) return;
    elements.quickSwitcherOverlay.classList.add("visible");
    elements.quickSwitcherInput.value = "";
    elements.quickSwitcherInput.focus();
    updateQuickSwitcherResults("");
  }

export function hideQuickSwitcher() {
    if (!elements.quickSwitcherOverlay) return;
    elements.quickSwitcherOverlay.classList.remove("visible");
  }

export function updateQuickSwitcherResults(query) {
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
        const fileIcon = getFileIcon(file.path);
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

export function showSidebar() {
    state.sidebarVisible = true;
    if (isMobile()) {
      elements.sidebar.classList.add("visible");
      elements.sidebarOverlay.classList.add("visible");
    } else {
      elements.sidebar.classList.remove("hidden");
    }
  }

export function hideSidebar() {
    state.sidebarVisible = false;
    if (isMobile()) {
      elements.sidebar.classList.remove("visible");
      elements.sidebarOverlay.classList.remove("visible");
    } else {
      elements.sidebar.classList.add("hidden");
    }
  }

export function toggleSidebar() {
    if (state.sidebarVisible) {
      hideSidebar();
    } else {
      showSidebar();
    }
  }

  // ============================================
  // Bulk Selection Functions
  // ============================================

export function toggleSelectionMode() {
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

export function handleSelectionChange(path, isSelected) {
    if (isSelected) {
        state.selectedItems.add(path);
    } else {
        state.selectedItems.delete(path);
    }
    updateSelectionCount();
  }

export function updateSelectionCount() {
    if (elements.selectionCount) {
        const count = state.selectedItems.size;
        elements.selectionCount.textContent = `${count} selected`;
        
        if (elements.btnDownloadSelected) {
            elements.btnDownloadSelected.disabled = count === 0;
        }
        if (elements.btnDeleteSelected) {
            elements.btnDeleteSelected.disabled = count === 0;
        }
    }
  }

export async function deleteSelectedItems() {
    if (state.selectedItems.size === 0) return;

    const paths = Array.from(state.selectedItems);
    
    const confirmed = await showConfirmDialog({
        title: "Delete Selected Items?",
        message: `Are you sure you want to permanently delete <b>${paths.length} items</b>? This action cannot be undone.`,
        confirmText: "Delete All",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        try {
            showGlobalLoading(`Deleting ${paths.length} items...`);

            await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete_multi", paths }),
            });

            hideGlobalLoading();
            showToast(`Deleted ${paths.length} items`, "success");
            
            // Exit selection mode and refresh
            toggleSelectionMode();
            await loadFiles(true);
            
            // Refresh git status if enabled
            await checkGitStatusIfEnabled();
        } catch (error) {
            hideGlobalLoading();
            showToast("Failed to delete items: " + error.message, "error");
        }
    }
}

export async function downloadSelectedItems() {
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

export async function fetchWithAuth(url, options = {}) {
    let headers = { ...options.headers };
    let token = null;
    let isHassEnvironment = false;

    // Helper to get fresh token
    try {
      if (window.parent) {
        let auth = null;
        if (window.parent.hassConnection) {
            isHassEnvironment = true;
            const result = await window.parent.hassConnection;
            auth = result.auth || (result.accessToken ? result : null);
        } else if (window.parent.hass && window.parent.hass.auth) {
            isHassEnvironment = true;
            auth = window.parent.hass.auth;
        }
        
        if (auth) {
            if (auth.expired) {
                await auth.refreshAccessToken();
            }
            token = auth.accessToken;
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
            if (window.parent) {
                let auth = null;
                if (window.parent.hassConnection) {
                    const result = await window.parent.hassConnection;
                    auth = result.auth || (result.accessToken ? result : null);
                } else if (window.parent.hass && window.parent.hass.auth) {
                    auth = window.parent.hass.auth;
                }
                
                if (auth) {
                    await auth.refreshAccessToken();
                    token = auth.accessToken;
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

export async function getAuthToken() {
    try {
      if (window.parent) {
        let auth = null;
        if (window.parent.hassConnection) {
            const result = await window.parent.hassConnection;
            auth = result.auth || (result.accessToken ? result : null);
        } else if (window.parent.hass && window.parent.hass.auth) {
            auth = window.parent.hass.auth;
        }
        
        if (auth) {
            if (auth.expired) {
                await auth.refreshAccessToken();
            }
            return auth.accessToken;
        }
      }
    } catch (e) {
      console.error("Failed to get auth token", e);
    }
    return null;
}

export async function loadEntities() {
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

export async function loadFiles(force = false) {
    try {
      if (elements.btnRefresh) {
          elements.btnRefresh.classList.add("loading");
          elements.btnRefresh.disabled = true;
      }

      // If we are changing showHidden, we MUST force a refresh to bypass backend cache
      const shouldForce = force || state._lastShowHidden !== state.showHidden;
      state._lastShowHidden = state.showHidden;

      const items = await fetchWithAuth(`${API_BASE}?action=list_all&show_hidden=${state.showHidden}&force=${shouldForce}`);
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

export async function loadFile(path) {
    try {
      // Large File Protection
      const fileInfo = state.files.find(f => f.path === path);
      if (fileInfo && fileInfo.size > 2 * 1024 * 1024) { // 2MB limit
          const confirmed = await showConfirmDialog({
              title: "Large File Detected",
              message: `This file is <b>${formatBytes(fileInfo.size)}</b>. Opening it may cause the browser to freeze.<br><br>Do you want to download it instead?`,
              confirmText: "Download",
              cancelText: "Open Anyway (Risky)"
          });

          if (confirmed) {
              downloadFileByPath(path);
              // Return dummy content to prevent editor from loading empty state
              return { content: "", mtime: 0 }; 
          }
      }

      const data = await fetchWithAuth(
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}&_t=${Date.now()}`
      );
      // loadFile must now return the full data object, not just data.content
      return data; // returns {content: ..., is_base64: ...}
    } catch (error) {
      showToast("Failed to load file: " + error.message, "error");
      throw error;
    }
  }

export async function saveFile(path, content) {
    try {
      const response = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "write_file", path, content }),
      });
      
      // Update tab mtime if successful
      if (response.success && response.mtime) {
          const tab = state.openTabs.find(t => t.path === path);
          if (tab) tab.mtime = response.mtime;
      }

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

export async function createFile(path, content = "", is_base64 = false) {
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

export async function createFolder(path) {
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

export async function deleteItem(path) {
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

export async function copyItem(source, destination) {
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

export async function renameItem(source, destination) {
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

export function formatCode() {
    if (!state.editor) return;
    
    // Feature disabled temporarily
    showToast("Auto-formatting is currently disabled", "info");

    /*
    // Heuristic: Fix Home Assistant root keys indentation
    // These keys should almost always be at the root level in configuration.yaml
    const ROOT_KEYS = [
        "automation:", "script:", "scene:", "template:", "sensor:", "binary_sensor:", 
        "switch:", "light:", "fan:", "cover:", "climate:", "person:", "zone:", 
        "homeassistant:", "default_config:", "frontend:", "http:", "panel_custom:", 
        "panel_iframe:", "group:", "input_boolean:", "input_number:", "input_select:",
        "input_text:", "input_datetime:", "timer:", "counter:", "notify:", "tts:",
        "media_player:", "camera:", "alarm_control_panel:", "lock:", "vacuum:", "siren:"
    ];

    state.editor.operation(() => {
        const doc = state.editor.getDoc();
        const totalLines = doc.lineCount();
        const cursor = doc.getCursor();
        const scroll = state.editor.getScrollInfo();

        let lastRootKeyLine = -1;
        const isListFile = state.activeTab && state.activeTab.path.match(/(automations|scripts|scenes)\.yaml$/);

        // 1. Fix Indentation Heuristics
        for (let i = 0; i < totalLines; i++) {
            const lineContent = doc.getLine(i);
            const trimmed = lineContent.trim();
            
            // Skip empty lines or comments
            if (!trimmed || trimmed.startsWith("#")) continue;

            const leadingWhitespace = lineContent.match(/^\s+/);
            const currentIndent = leadingWhitespace ? leadingWhitespace[0].length : 0;

            // A. Root Keys -> Force 0 indent
            if (ROOT_KEYS.some(key => trimmed.startsWith(key))) {
                if (currentIndent > 0) {
                    doc.replaceRange("", {line: i, ch: 0}, {line: i, ch: currentIndent});
                }
                lastRootKeyLine = i;
                continue;
            }
            
            // A.2 Root List Items (for automations.yaml, scripts.yaml) -> Force 0 indent
            if (isListFile && (trimmed.startsWith("- id:") || trimmed.startsWith("- alias:"))) {
                if (currentIndent > 0) {
                    doc.replaceRange("", {line: i, ch: 0}, {line: i, ch: currentIndent});
                }
                // Reset root context since this starts a new block
                lastRootKeyLine = i; 
                continue;
            }

            // B. Level 1 Lists (children of root keys) -> Force 2 indent
            // If we are directly under a root key (no other keys in between)
            // This is a heuristic: if previous line was root, this line MUST be indented.
            if (lastRootKeyLine === i - 1) {
                // If it starts with dash or text, it should be indented
                // Standard HA indentation is 2 spaces
                if (currentIndent !== 2) {
                    // Replace existing indent with 2 spaces
                    doc.replaceRange("  ", {line: i, ch: 0}, {line: i, ch: currentIndent});
                }
            }
        }

        // 2. Run Standard Auto-Indent to fix deeper levels based on our corrected anchors
        if (state.editor.somethingSelected()) {
            state.editor.indentSelection("smart");
        } else {
            state.editor.execCommand("selectAll");
            state.editor.indentSelection("smart");
            state.editor.setCursor(cursor);
            state.editor.scrollTo(scroll.left, scroll.top);
        }
    });
    showToast("Code formatted", "success");
    */
}

export async function validateYaml(content) {
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

export async function uploadFile(path, content, overwrite = false, is_base64 = false) {
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

export function downloadCurrentFile() {
    if (!state.activeTab) {
      showToast("No file open", "warning");
      return;
    }

    const tab = state.activeTab;
    const filename = tab.path.split("/").pop();
    const content = tab.content;

    downloadContent(filename, content);
  }

export async function downloadFileByPath(path) {
    try {
      const data = await fetchWithAuth( // data will contain { content: ..., is_base64: ... }
        `${API_BASE}?action=read_file&path=${encodeURIComponent(path)}`
      );
      downloadContent(path.split("/").pop(), data.content, data.is_base64);
    } catch (error) {
      // Error already shown by loadFile
    }
  }

export function downloadContent(filename, content, is_base64 = false, mimeType = "application/octet-stream") {
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

export function triggerUpload() {
    if (elements.fileUploadInput) {
      elements.fileUploadInput.click();
    }
  }

export async function processUploads(files, targetFolder = null) {
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

export async function handleFileUpload(event) {
    const files = event.target.files;
    await processUploads(files);
    // Reset input so same file can be uploaded again
    event.target.value = "";
  }

export function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

export function readFileAsBase64(file) {
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

export async function downloadFolder(path) {
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

export function triggerFolderUpload() {
    if (elements.folderUploadInput) {
      elements.folderUploadInput.click();
    }
  }

export async function handleFolderUpload(event) {
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
export const gitState = {
    isInitialized: false,
    hasRemote: false,
    currentBranch: "unknown",
    localBranches: [],
    remoteBranches: [],
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

export const giteaState = {
    isInitialized: false,
    hasRemote: false,
    currentBranch: "unknown",
    localBranches: [],
    remoteBranches: [],
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

export function isGitEnabled() {
    return localStorage.getItem("gitIntegrationEnabled") !== "false";
  }

export async function checkGitStatusIfEnabled(shouldFetch = false, silent = false) {
    if (isGitEnabled()) {
        await gitStatus(shouldFetch, silent);
    }
    if (state.giteaIntegrationEnabled) {
        await giteaStatus(shouldFetch, silent);
    }
  }

export async function showDiffModal(path) {
    try {
        await ensureDiffLibrariesLoaded();
        showGlobalLoading(`Calculating diff for ${path}...`);
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

export async function gitStatus(shouldFetch = false, silent = false) {
    // Double check enabled state (redundant but safe)
    if (!isGitEnabled()) return;

    try {
      if (!silent) {
          // Use pulsing effect instead of spinner
          if (elements.btnGitStatus) elements.btnGitStatus.classList.add("pulsing");
      }

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "git_status",
            fetch: shouldFetch 
        }),
      });

      if (!silent) {
          if (elements.btnGitStatus) elements.btnGitStatus.classList.remove("pulsing");
      }

      if (data.success) {
        // Store previous change list string to check for meaningful changes
        const currentChangesList = JSON.stringify(data.files);
        // Only consider it a new change if the list content is different AND it's not the first load
        const hasMeaningfulChange = state._lastGitChanges && state._lastGitChanges !== currentChangesList;
        
        if (hasMeaningfulChange) {
            console.log("Git Notification Triggered. Diff:", {
                old: state._lastGitChanges,
                new: currentChangesList
            });
        }

        state._lastGitChanges = currentChangesList;

        // Update git state
        gitState.isInitialized = data.is_initialized;
        gitState.hasRemote = data.has_remote;
        gitState.currentBranch = data.current_branch || "unknown";
        gitState.localBranches = data.local_branches || [];
        gitState.remoteBranches = data.remote_branches || [];
        gitState.ahead = data.ahead || 0;
        gitState.behind = data.behind || 0;
        gitState.status = data.status || "";
        
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

        // SMART NOTIFICATION:
        // 1. If NOT silent (manual refresh), always show toast
        // 2. If silent (polling), only show toast if the LIST of changes is different (and non-empty)
        if (!silent || (hasMeaningfulChange && gitState.totalChanges > 0)) {
            if (data.has_changes) {
              showToast(`Git: ${gitState.totalChanges} change(s) detected`, "success");
            } else if (!silent) {
              showToast("Working tree clean, no changes", "success");
            }
        }
      }
    } catch (error) {
      if (!silent) {
          if (elements.btnGitStatus) elements.btnGitStatus.classList.remove("pulsing");
          showToast("Git error: " + error.message, "error");
      }
    }
  }

export async function showGitHistory() {
    if (!isGitEnabled() || !gitState.isInitialized) {
        showToast("Git integration is not initialized", "error");
        return;
    }

    try {
        showGlobalLoading("Fetching history...");
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_log", count: 30 }),
        });
        hideGlobalLoading();

        if (data.success) {
            if (data.commits.length === 0) {
                showToast("No commits found in this repository", "success");
                return;
            }

            const commitListHtml = data.commits.map(commit => {
                const date = new Date(commit.timestamp * 1000).toLocaleString();
                return `
                    <div class="git-history-item" data-hash="${commit.hash}" style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600; color: var(--accent-color); font-family: monospace;">${commit.hash.substring(0, 7)}</span>
                            <span style="font-size: 11px; color: var(--text-muted);">${date}</span>
                        </div>
                        <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">${commit.message}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); opacity: 0.8;">by ${commit.author}</div>
                    </div>
                `;
            }).join("");

            showModal({
                title: "Commit History",
                message: `
                    <div style="max-height: 60vh; overflow-y: auto; margin: -16px; background: var(--bg-primary);">
                        ${commitListHtml}
                    </div>
                `,
                confirmText: "Close",
                onConfirm: () => {}
            });

            // Add click listeners to history items
            setTimeout(() => {
                const items = document.querySelectorAll(".git-history-item");
                items.forEach(item => {
                    item.addEventListener("click", () => {
                        const hash = item.getAttribute("data-hash");
                        const commit = data.commits.find(c => c.hash === hash);
                        showGitCommitDiff(commit);
                    });
                    item.addEventListener("mouseenter", () => item.style.background = "var(--bg-tertiary)");
                    item.addEventListener("mouseleave", () => item.style.background = "transparent");
                });
            }, 100);

        } else {
            showToast("Failed to fetch history: " + data.message, "error");
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Error fetching history: " + e.message, "error");
    }
  }

export async function showGitCommitDiff(commit) {
    try {
        showGlobalLoading(`Loading diff for ${commit.hash.substring(0, 7)}...`);
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_diff_commit", hash: commit.hash }),
        });
        hideGlobalLoading();

        if (data.success) {
            // We'll reuse the modal but with a large diff view
            const date = new Date(commit.timestamp * 1000).toLocaleString();
            
            // Format diff with some basic coloring
            const lines = data.diff.split("\n");
            const coloredDiff = lines.map(line => {
                let color = "inherit";
                if (line.startsWith("+") && !line.startsWith("+++")) color = "var(--success-color)";
                else if (line.startsWith("-") && !line.startsWith("---")) color = "var(--error-color)";
                else if (line.startsWith("@@")) color = "var(--accent-color)";
                
                return `<div style="color: ${color}; white-space: pre-wrap; font-family: monospace; font-size: 12px; line-height: 1.4;">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
            }).join("");

            showModal({
                title: `Commit: ${commit.hash.substring(0, 7)}`,
                message: `
                    <div style="display: flex; flex-direction: column; height: 70vh;">
                        <div style="padding-bottom: 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 12px;">
                            <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${commit.message}</div>
                            <div style="font-size: 12px; color: var(--text-secondary);">
                                <strong>Author:</strong> ${commit.author} | <strong>Date:</strong> ${date}
                            </div>
                        </div>
                        <div style="flex: 1; overflow: auto; background: var(--bg-primary); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color);">
                            ${coloredDiff || '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No changes to display in this commit</div>'}
                        </div>
                    </div>
                `,
                confirmText: "Back to History",
                onConfirm: () => showGitHistory()
            });
            
            // Make modal wider for diff
            const modal = document.getElementById("modal");
            if (modal) modal.style.maxWidth = "900px";

        } else {
            showToast("Failed to fetch diff: " + data.message, "error");
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Error fetching diff: " + e.message, "error");
    }
  }

export async function gitInit(skipConfirm = false) {
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

              // Ensure branch is named 'main'

              await fetchWithAuth(API_BASE, {

                  method: "POST",

                  headers: { "Content-Type": "application/json" },

                  body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),

              });

              

              // Update state

              gitState.isInitialized = true;

              // Refresh status to be sure

              await gitStatus(); 

              return true;

            }

       else {
        showToast("Failed to init: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Git init failed: " + error.message, "error");
    }
    return false;
  }

export async function giteaInit(skipConfirm = false) {
    if (!skipConfirm) {
        const confirmed = await showConfirmDialog({
          title: "Initialize Gitea Repository",
          message: "Are you sure you want to initialize a new Git repository in the config directory?",
          confirmText: "Initialize",
          cancelText: "Cancel"
        });

        if (!confirmed) return false;
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
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),
        });
        giteaState.isInitialized = true;
        await giteaStatus(); 
        return true;
      } else {
        showToast("Failed to init: " + (data.message || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Gitea init failed: " + error.message, "error");
    }
    return false;
  }

export async function giteaPush() {
    try {
      setButtonLoading(elements.btnGiteaPush, true);
      showToast("Pushing to Gitea...", "info");

      const pushData = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gitea_push_only" }),
      });

      if (pushData.success) {
        setButtonLoading(elements.btnGiteaPush, false);
        showToast(pushData.message || "Successfully pushed to Gitea", "success");
        await giteaStatus();
        return;
      }

      const errorMessage = pushData.message || pushData.error || "Unknown error";

      if (errorMessage.includes("uncommitted changes")) {
        setButtonLoading(elements.btnGiteaPush, false);
        const commitMessage = await showModal({
          title: "Commit & Push to Gitea",
          placeholder: "Commit message",
          value: "Update configuration via Blueprint Studio",
          hint: "You have uncommitted changes. Enter a message to commit and push:",
        });

        if (!commitMessage) return;

        setButtonLoading(elements.btnGiteaPush, true);
        showToast("Committing and pushing changes...", "info");

        const data = await fetchWithAuth(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "gitea_push",
            commit_message: commitMessage,
          }),
        });

        setButtonLoading(elements.btnGiteaPush, false);

        if (data.success) {
          showToast("Successfully pushed to Gitea", "success");
          await giteaStatus();
        } else {
          showToast("Push failed: " + (data.message || data.error), "error");
        }
      } else if (errorMessage.includes("No commits to push")) {
        setButtonLoading(elements.btnGiteaPush, false);
        showToast("No commits to push.", "warning");
      } else {
        setButtonLoading(elements.btnGiteaPush, false);
        showToast("Push failed: " + errorMessage, "error");
      }
    } catch (error) {
      setButtonLoading(elements.btnGiteaPush, false);
      showToast("Gitea push failed: " + error.message, "error");
    }
  }

export async function giteaPull() {
    const confirmed = await showConfirmDialog({
      title: "Pull from Gitea",
      message: "Are you sure you want to pull changes from Gitea? This will update your local files.",
      confirmText: "Pull",
      cancelText: "Cancel"
    });

    if (!confirmed) return;

    try {
      setButtonLoading(elements.btnGiteaPull, true);
      showToast("Pulling from Gitea...", "success");

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gitea_pull" }),
      });

      setButtonLoading(elements.btnGiteaPull, false);

      if (data.success) {
        showToast("Successfully pulled from Gitea", "success");
        await loadFiles();
        await giteaStatus();
        if (state.activeTab) await openFile(state.activeTab.path, true);
      }
    } catch (error) {
      setButtonLoading(elements.btnGiteaPull, false);
      showToast("Gitea pull failed: " + error.message, "error");
    }
  }

export async function giteaCommit() {
    const stagedCount = giteaState.files.staged.length;
    if (stagedCount === 0) return;

    let defaultMessage = "Update via Blueprint Studio";
    if (stagedCount === 1) {
        const filename = giteaState.files.staged[0].split("/").pop();
        defaultMessage = `Update ${filename}`;
    } else if (stagedCount > 1) {
        const filename = giteaState.files.staged[0].split("/").pop();
        defaultMessage = `Update ${filename} and ${stagedCount - 1} others`;
    }

    const commitMessage = await showModal({
      title: "Commit Changes (Gitea)",
      placeholder: "Commit message",
      value: defaultMessage,
      hint: `Committing ${stagedCount} staged file(s)`,
    });

    if (!commitMessage) return;

    try {
      showToast("Committing staged changes...", "success");
      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "git_commit", commit_message: commitMessage }), // Reuse generic commit action as it's local
      });

      if (data.success) {
        showToast("Changes committed successfully", "success");
        await giteaStatus();
      }
    } catch (error) {
      showToast("Commit failed: " + error.message, "error");
    }
  }

export async function giteaStage(files) {
      // Reuse gitStage but refresh gitea status
      await gitStage(files);
      await giteaStatus();
  }

export async function giteaUnstage(files) {
      await gitUnstage(files);
      await giteaStatus();
  }

  // File selection for Gitea panel
export function toggleGiteaFileSelection(file) {
    if (giteaState.selectedFiles.has(file)) {
      giteaState.selectedFiles.delete(file);
    } else {
      giteaState.selectedFiles.add(file);
    }
  }

export async function stageSelectedGiteaFiles() {
    // Robust fallback: if Set is empty, check DOM for checked checkboxes
    if (giteaState.selectedFiles.size === 0) {
        const container = document.getElementById("gitea-files-container");
        if (container) {
            const checked = container.querySelectorAll(".gitea-file-checkbox:checked");
            checked.forEach(cb => {
                const path = cb.getAttribute("data-file-path");
                if (path) giteaState.selectedFiles.add(path);
            });
        }
    }

    const selectedFiles = Array.from(giteaState.selectedFiles);
    if (selectedFiles.length === 0) {
      showToast("No files selected.", "warning");
      return;
    }
    await giteaStage(selectedFiles);
    giteaState.selectedFiles.clear();
  }

export async function stageAllGiteaFiles() {
    const unstagedFiles = [
      ...giteaState.files.modified.filter(f => !giteaState.files.staged.includes(f)),
      ...giteaState.files.added.filter(f => !giteaState.files.staged.includes(f)),
      ...giteaState.files.deleted.filter(f => !giteaState.files.staged.includes(f)),
      ...giteaState.files.untracked
    ];
    if (unstagedFiles.length > 0) await giteaStage(unstagedFiles);
  }

export async function unstageAllGiteaFiles() {
    if (giteaState.files.staged.length > 0) await giteaUnstage(giteaState.files.staged);
  }

export async function giteaAbort() {
    const confirmed = await showConfirmDialog({
        title: "Abort Gitea Sync?",
        message: "This will cancel the current Gitea operation and reset your sync state. Any merge conflicts will be discarded.",
        confirmText: "Abort Sync",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        try {
            showGlobalLoading("Aborting...");
            const data = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "git_abort" }),
            });
            hideGlobalLoading();
            if (data.success) {
                showToast("Sync operation aborted", "success");
                await giteaStatus();
            }
        } catch (error) {
            hideGlobalLoading();
            showToast("Abort failed: " + error.message, "error");
        }
    }
  }

export async function giteaForcePush() {
    const confirmed = await showConfirmDialog({
        title: "Force Push to Gitea?",
        message: "This will OVERWRITE the version on Gitea with your local version. Use with caution!",
        confirmText: "Force Push",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        try {
            showGlobalLoading("Force Pushing...");
            const data = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "git_force_push", remote: "gitea" }),
            });
            hideGlobalLoading();
            if (data.success) {
                showToast("Force pushed to Gitea successfully", "success");
                await giteaStatus();
            }
        } catch (error) {
            hideGlobalLoading();
            showToast("Force push failed: " + error.message, "error");
        }
    }
  }

export async function giteaHardReset() {
    const confirmed = await showConfirmDialog({
        title: "Hard Reset from Gitea?",
        message: "This will PERMANENTLY DELETE your local changes and match the Gitea version exactly.",
        confirmText: "Hard Reset",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        try {
            showGlobalLoading("Hard Resetting...");
            const data = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "git_hard_reset", remote: "gitea", branch: giteaState.currentBranch }),
            });
            hideGlobalLoading();
            if (data.success) {
                showToast("Reset to Gitea version successfully", "success");
                await loadFiles();
                await giteaStatus();
            }
        } catch (error) {
            hideGlobalLoading();
            showToast("Hard reset failed: " + error.message, "error");
        }
    }
  }

  // Gitea Settings Modal
export async function showGiteaSettings() {
    // Get current remotes
    const remotes = await gitGetRemotes();
    const giteaRemote = remotes["gitea"] || "";

    // Get saved credentials
    const credentialsData = await fetchWithAuth(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "gitea_get_credentials" }),
    });

    const savedUsername = credentialsData.has_credentials ? credentialsData.username : "";
    const hasCredentials = credentialsData.has_credentials;

    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    modalTitle.textContent = "Gitea Settings";

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
        <button id="btn-gitea-signout" style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; background: #f44336; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.15s;">
          <span class="material-icons">logout</span>
          <span>Sign Out</span>
        </button>
      `;
    }

    modalBody.innerHTML = `
      <div class="git-settings-content">
        ${remotesHtml}

        <div class="git-settings-section">
          <div class="git-settings-label">Gitea Repository URL</div>
          <input type="text" class="git-settings-input" id="gitea-repo-url"
                 placeholder="https://gitea.example.com/user/repo.git"
                 value="${giteaRemote}"
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="git-settings-buttons">
            <button class="btn-primary" id="btn-save-gitea-remote" style="width: 100%;">Save Remote</button>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px; color: #fa8e14;">emoji_food_beverage</span>
            Gitea Authentication
          </div>

          ${credentialsStatusHtml}

          <input type="text" class="git-settings-input" id="gitea-username"
                 placeholder="Gitea username"
                 value="${savedUsername}"
                 autocomplete="username" autocorrect="off" autocapitalize="off" spellcheck="false"
                 style="margin-bottom: 8px;" />
          <input type="password" class="git-settings-input" id="gitea-token"
                 placeholder="${hasCredentials ? 'Enter new token to update (leave blank to keep current)' : 'Personal Access Token'}"
                 autocomplete="off"
                 style="margin-bottom: 12px;" />

          <div class="git-settings-buttons">
            <button class="btn-secondary" id="btn-test-gitea-connection">Test Connection</button>
            <button class="btn-primary" id="btn-save-gitea-credentials">${hasCredentials ? 'Update' : 'Save'} Credentials</button>
          </div>
        </div>

        <div class="git-settings-section">
          <div class="git-settings-label">Troubleshooting</div>
          <button class="btn-secondary" id="btn-clean-git-locks" style="width: 100%;">
            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">delete_sweep</span>
            Clean Git Lock Files
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add("visible");

    // Set wider modal for Gitea Settings (responsive on mobile via CSS)
    modal.style.maxWidth = "650px";

    // Hide default modal buttons
    if (modalFooter) {
      modalFooter.style.display = "none";
    }

    // Function to clean up and close the Gitea Settings modal
    const closeGiteaSettings = () => {
      modalOverlay.classList.remove("visible");
      resetModalToDefault();
      modalOverlay.removeEventListener("click", overlayClickHandler);
    };

    // Overlay click handler (defined separately so we can remove it)
    const overlayClickHandler = (e) => {
      if (e.target === modalOverlay) {
        closeGiteaSettings();
      }
    };
    modalOverlay.addEventListener("click", overlayClickHandler);
    document.getElementById("modal-close").onclick = closeGiteaSettings;

    document.getElementById("btn-save-gitea-remote")?.addEventListener("click", async () => {
        const url = document.getElementById("gitea-repo-url").value;
        if(!url) return showToast("URL required", "error");
        
        const result = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "gitea_add_remote", url: url }),
        });
        if(result.success) showToast("Gitea remote saved", "success");
        else showToast("Failed: " + result.error, "error");
    });

    document.getElementById("btn-save-gitea-credentials")?.addEventListener("click", async () => {
        const username = document.getElementById("gitea-username").value;
        const token = document.getElementById("gitea-token").value;
        if(!username) return showToast("Username required", "error");
        if(!token && !hasCredentials) return showToast("Token required", "error");

        const result = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "gitea_set_credentials", username, token }),
        });
        if(result.success) {
            showToast("Credentials saved", "success");
            closeGiteaSettings();
        } else {
            showToast("Failed: " + result.message, "error");
        }
    });

    document.getElementById("btn-gitea-signout")?.addEventListener("click", async () => {
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "gitea_clear_credentials" }),
        });
        showToast("Signed out", "success");
        closeGiteaSettings();
    });

    document.getElementById("btn-test-gitea-connection")?.addEventListener("click", async () => {
        const result = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "gitea_test_connection" }),
        });
        if(result.success) showToast("Connection Successful", "success");
        else showToast("Connection Failed: " + result.error, "error");
    });
  }

export async function gitAddRemote(name, url) {
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

export async function githubCreateRepo(repoName, description, isPrivate) {
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

export async function repairBranchMismatch() {
    const confirmed = await showConfirmDialog({
      title: "Repair Branch Mismatch",
      message: `
        <p>This will perform the following actions:</p>
        <ul style="margin: 10px 0 10px 20px; font-size: 13px;">
          <li>Rename your local <b>master</b> branch to <b>main</b></li>
          <li>Synchronize histories with GitHub</li>
          <li>Set up <b>main</b> as your primary tracking branch</li>
        </ul>
        <p>This is recommended for better compatibility with GitHub.</p>
      `,
      confirmText: "Repair Now",
      cancelText: "Not Now"
    });

    if (!confirmed) return;

    try {
        showGlobalLoading("Repairing branch structure...");
        
        // 1. Abort any stuck rebase first
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_abort" }),
        });

        // 2. Rename branch
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_rename_branch", old_name: "master", new_name: "main" }),
        });

        // 3. Merge unrelated histories from origin/main
        await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_merge_unrelated", remote: "origin", branch: "main" }),
        });

        hideGlobalLoading();
        showToast("Branch structure repaired successfully!", "success");
        await gitStatus(true);
    } catch (e) {
        hideGlobalLoading();
        showToast("Repair failed: " + e.message, "error");
    }
  }

export async function abortGitOperation() {
    const confirmed = await showConfirmDialog({
        title: "Abort Git Operation",
        message: "This will abort the current rebase or merge process. Your files will return to their state before the sync began. No data will be lost, but you may need to resolve conflicts manually.",
        confirmText: "Abort Sync",
        cancelText: "Cancel"
    });

    if (!confirmed) return;

    try {
        showGlobalLoading("Aborting operation...");
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_abort" }),
        });
        hideGlobalLoading();
        
        if (data.success) {
            showToast(data.message, "success");
            await gitStatus();
        } else {
            showToast("Failed to abort: " + data.message, "error");
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Error: " + e.message, "error");
    }
  }

export async function forcePush() {
    const confirmed = await showConfirmDialog({
        title: "Force Push to GitHub",
        message: "<p style='color: var(--error-color); font-weight: bold;'>⚠️ WARNING: DANGEROUS OPERATION</p><p>This will overwrite the version on GitHub with your local files. Any changes on GitHub that you don't have locally will be PERMANENTLY LOST.</p>",
        confirmText: "I Understand, Force Push",
        cancelText: "Cancel"
    });

    if (!confirmed) return;

    try {
        showGlobalLoading("Force pushing to GitHub...");
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_force_push" }),
        });
        hideGlobalLoading();
        
        if (data.success) {
            showToast(data.message, "success");
            await gitStatus(true);
        } else {
            showToast("Force push failed: " + data.message, "error");
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Error: " + e.message, "error");
    }
  }

export async function hardReset() {
    const confirmed = await showConfirmDialog({
        title: "Hard Reset to GitHub",
        message: "<p style='color: var(--error-color); font-weight: bold;'>⚠️ WARNING: DANGEROUS OPERATION</p><p>This will delete your local commits and changes to make your files exactly match GitHub. Your local work will be PERMANENTLY LOST.</p>",
        confirmText: "I Understand, Reset My Files",
        cancelText: "Cancel"
    });

    if (!confirmed) return;

    try {
        showGlobalLoading("Resetting local files to match GitHub...");
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_hard_reset", branch: gitState.currentBranch }),
        });
        hideGlobalLoading();
        
        if (data.success) {
            showToast(data.message, "success");
            await loadFiles(); // Refresh file tree
            await gitStatus(true);
        } else {
            showToast("Reset failed: " + data.message, "error");
        }
    } catch (e) {
        hideGlobalLoading();
        showToast("Error: " + e.message, "error");
    }
  }

export async function deleteRemoteBranch(branchName) {
    const confirmed = await showConfirmDialog({
        title: "Delete GitHub Branch",
        message: `<p>Are you sure you want to delete the branch <b>${branchName}</b> from GitHub?</p><p>This cannot be undone.</p>`,
        confirmText: "Delete Branch",
        cancelText: "Cancel"
    });

    if (!confirmed) return;

    try {
        showGlobalLoading(`Deleting branch ${branchName}...`);
        const data = await fetchWithAuth(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "git_delete_remote_branch", branch: branchName }),
        });
        hideGlobalLoading();
        
        if (data.success) {
            showToast(data.message, "success");
            await gitStatus(true);
        }
    } catch (e) {
        hideGlobalLoading();
        let errorMsg = e.message || "Unknown error";
        
        if (errorMsg.includes("refusing to delete the current branch")) {
            const autoFix = await showConfirmDialog({
                title: "Switch Default Branch?",
                message: `
                    <p>GitHub won't let us delete <b>${branchName}</b> because it is currently the <b>Default Branch</b>.</p>
                    <br>
                    <p>Would you like Blueprint Studio to automatically make <b>main</b> the default branch and then delete <b>${branchName}</b> for you?</p>
                `,
                confirmText: "Yes, Fix Automatically",
                cancelText: "No, I'll do it manually"
            });

            if (autoFix) {
                try {
                    showGlobalLoading("Setting 'main' as default branch...");
                    const patchData = await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "github_set_default_branch", branch: "main" }),
                    });

                    if (patchData.success) {
                        showGlobalLoading(`Deleting branch ${branchName}...`);
                        const deleteData = await fetchWithAuth(API_BASE, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "git_delete_remote_branch", branch: branchName }),
                        });
                        
                        hideGlobalLoading();
                        if (deleteData.success) {
                            showToast(`Success! 'main' is now default and '${branchName}' was deleted.`, "success");
                            await gitStatus(true);
                        } else {
                            showToast("Branch was set as default, but deletion failed: " + deleteData.message, "error");
                        }
                    }
                } catch (patchErr) {
                    hideGlobalLoading();
                    showToast("Auto-fix failed: " + patchErr.message, "error");
                }
            }
        } else {
            showToast("Delete failed: " + errorMsg, "error");
        }
    }
  }

export async function gitGetRemotes() {
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

export async function gitSetCredentials(username, token, rememberMe = true) {
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

export async function gitTestConnection() {
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

export async function gitClearCredentials() {
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
export async function githubDeviceFlowStart(clientId) {
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

export async function githubDeviceFlowPoll(clientId, deviceCode) {
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

export async function showGithubDeviceFlowLogin() {
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
            clearTimeout(activePollTimer);
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

        const pollLoop = async () => {
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
          } else {
            // Pending or slow_down
            if (result.status === "slow_down") {
              // Increase interval by 5 seconds if asked to slow down
              pollInterval += 5000;
            }
            // Continue polling
            activePollTimer = setTimeout(pollLoop, pollInterval);
          }
        };

        // Start the loop
        activePollTimer = setTimeout(pollLoop, pollInterval);

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
            // Stop auto-poll to prevent race conditions/rate limiting
            if (activePollTimer) {
                clearTimeout(activePollTimer);
                activePollTimer = null;
            }

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
            } else {
                // Handle non-success states
                if (result.status === "pending") {
                  if (statusDiv) statusDiv.querySelector('p').textContent = "Still waiting for authorization...";
                  showToast("Still waiting for authorization...", "info", 3000);
                } else if (result.status === "slow_down") {
                  if (statusDiv) statusDiv.querySelector('p').textContent = "GitHub requests slower polling. Waiting...";
                  showToast("GitHub requests slower polling...", "warning", 3000);
                  pollInterval += 5000;
                } else if (result.status === "expired") {
                  if (statusDiv) statusDiv.innerHTML = `<span class="material-icons" style="color: #f44336;">error</span><p style="color: #f44336;">Login expired.</p>`;
                  showToast("GitHub login expired", "error");
                  setTimeout(() => closeDeviceFlow(false), 2000);
                  return; // Stop here
                } else if (result.status === "denied") {
                  if (statusDiv) statusDiv.innerHTML = `<span class="material-icons" style="color: #f44336;">error</span><p style="color: #f44336;">Login denied.</p>`;
                  showToast("GitHub login denied", "error");
                  setTimeout(() => closeDeviceFlow(false), 2000);
                  return; // Stop here
                } else {
                    showToast("Error checking status: " + (result.message || "Unknown error"), "error");
                    if (statusDiv) statusDiv.querySelector('p').textContent = "Error checking status. Waiting...";
                }
                
                // Restart auto-poll loop if not terminal
                activePollTimer = setTimeout(pollLoop, pollInterval);
            }
            
            btnCheckAuthNow.disabled = false;
            if (btnTextSpan) btnTextSpan.textContent = "Check Now";
          });
        }
    });
  }

export async function gitStage(files) {
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
export async function handleGitLockAndRetry(files) {
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
export async function gitCleanLocks() {
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
export async function gitRepairIndex() {
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

export async function gitUnstage(files) {
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

export async function gitReset(files) {
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

export async function gitCommit(commitMessage) {
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

export async function gitPull() {
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

export async function gitPush() {
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
export function updateGitPanel() {
    const panel = document.getElementById("git-panel");
    if (!panel) return;
    
    // Do not update or show if git is disabled
    if (!isGitEnabled()) {
        panel.classList.remove("visible");
        panel.style.display = "none";
        return;
    }

    const container = document.getElementById("git-files-container");
    const badge = document.getElementById("git-changes-count");
    const commitBtn = document.getElementById("btn-commit-staged");
    const actions = panel.querySelector(".git-panel-actions");

    if (!container || !badge || !commitBtn || !actions) return;

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

    // Apply saved collapse state
    if (state.gitPanelCollapsed) {
        panel.classList.add("collapsed");
        const icon = elements.btnGitCollapse?.querySelector(".material-icons");
        if (icon) {
            icon.textContent = "expand_more";
            elements.btnGitCollapse.title = "Expand Git Panel";
        }
    } else {
        panel.classList.remove("collapsed");
        const icon = elements.btnGitCollapse?.querySelector(".material-icons");
        if (icon) {
            icon.textContent = "expand_less";
            elements.btnGitCollapse.title = "Collapse Git Panel";
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

    // Branch Mismatch Detection (master vs main)
    let branchWarningHtml = "";
    const onOldBranch = gitState.currentBranch === "master" || gitState.currentBranch === "HEAD" || gitState.currentBranch === "unknown";
    const masterExists = gitState.localBranches.includes("master");
    
    if (onOldBranch && masterExists && gitState.hasRemote) {
        branchWarningHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(255, 152, 0, 0.1); border: 1px solid var(--warning-color); border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--warning-color); font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">warning</span>
                    <span>Branch Mismatch</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local branch is <b>master</b>, but modern GitHub repos use <b>main</b>. This can cause sync errors.</p>
                <button id="btn-repair-branch" style="width: 100%; padding: 6px; background: var(--warning-color); color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                    Repair: Move to main
                </button>
            </div>
        `;
    }

    // Remote Cleanup Detection (Delete remote master if local is main)
    let remoteCleanupHtml = "";
    if (gitState.currentBranch === "main" && gitState.remoteBranches.includes("master")) {
        remoteCleanupHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(33, 150, 243, 0.1); border: 1px solid var(--accent-color); border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--accent-color); font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">cleaning_services</span>
                    <span>Clean up GitHub</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local branch is <b>main</b>, but an old <b>master</b> branch still exists on GitHub.</p>
                <button id="btn-delete-remote-master" style="width: 100%; padding: 6px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                    Delete GitHub "master"
                </button>
            </div>
        `;
    }

    // Diverged Sync Detection
    let divergedWarningHtml = "";
    if (gitState.ahead > 0 && gitState.behind > 0) {
        divergedWarningHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(156, 39, 176, 0.1); border: 1px solid #9c27b0; border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #9c27b0; font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">sync_problem</span>
                    <span>Sync Conflict</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local and GitHub versions have diverged. A normal sync is not possible.</p>
                <div style="display: flex; gap: 8px;">
                    <button id="btn-force-push" style="flex: 1; padding: 6px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
                        Force Push
                    </button>
                    <button id="btn-hard-reset" style="flex: 1; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 11px;">
                        Hard Reset
                    </button>
                </div>
            </div>
        `;
    }

    // Rebase/Merge Stuck Detection
    let stuckWarningHtml = "";
    if (gitState.status && (
        gitState.status.toLowerCase().includes("rebasing") || 
        gitState.status.toLowerCase().includes("merging") || 
        gitState.status.toLowerCase().includes("unmerged") ||
        gitState.status.toLowerCase().includes("conflict")
    )) {
        stuckWarningHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(244, 67, 54, 0.1); border: 1px solid var(--error-color); border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--error-color); font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">error_outline</span>
                    <span>Sync Blocked</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">A previous Pull operation failed or is in progress. You must resolve or abort it.</p>
                <button id="btn-abort-git" style="width: 100%; padding: 6px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                    Abort & Reset Sync
                </button>
            </div>
        `;
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
                        <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" style="fill: white;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                        Connect to GitHub
                    </button>
                </div>
            `;
            commitBtn.disabled = true;
            return;
        }
    }

    if (gitState.totalChanges > 0 || branchWarningHtml || stuckWarningHtml || remoteCleanupHtml || divergedWarningHtml) {
      container.innerHTML = stuckWarningHtml + branchWarningHtml + divergedWarningHtml + remoteCleanupHtml;
      if (gitState.totalChanges > 0) {
        renderGitFiles(container);
      }
      
      // Add event listeners for new buttons
      const btnRepair = document.getElementById("btn-repair-branch");
      if (btnRepair) btnRepair.addEventListener("click", repairBranchMismatch);
      
      const btnAbort = document.getElementById("btn-abort-git");
      if (btnAbort) btnAbort.addEventListener("click", abortGitOperation);

      const btnDeleteRemote = document.getElementById("btn-delete-remote-master");
      if (btnDeleteRemote) btnDeleteRemote.addEventListener("click", () => deleteRemoteBranch("master"));

      const btnForcePush = document.getElementById("btn-force-push");
      if (btnForcePush) btnForcePush.addEventListener("click", forcePush);

      const btnHardReset = document.getElementById("btn-hard-reset");
      if (btnHardReset) btnHardReset.addEventListener("click", hardReset);
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
export function renderGitFiles(container) {
    // Note: We don't clear the container here anymore, 
    // because it might contain branch/stuck warnings.
    // Instead, we build the file list HTML and append it.
    
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

    container.insertAdjacentHTML('beforeend', html);
  }

  // ============================================
  // Gitea Integration Functions
  // ============================================

export async function giteaStatus(shouldFetch = false, silent = false) {
    if (!state.giteaIntegrationEnabled) return;

    try {
      if (!silent) {
          if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.add("pulsing");
      }

      const data = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "gitea_status",
            fetch: shouldFetch 
        }),
      });

      if (!silent) {
          if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.remove("pulsing");
      }

      if (data.success) {
        // Store previous change list string to check for meaningful changes
        const currentChangesList = JSON.stringify(data.files);
        const hasMeaningfulChange = state._lastGiteaChanges && state._lastGiteaChanges !== currentChangesList;
        state._lastGiteaChanges = currentChangesList;

        giteaState.isInitialized = data.is_initialized;
        giteaState.hasRemote = data.has_remote;
        giteaState.currentBranch = data.current_branch || "unknown";
        giteaState.localBranches = data.local_branches || [];
        giteaState.remoteBranches = data.remote_branches || [];
        giteaState.ahead = data.ahead || 0;
        giteaState.behind = data.behind || 0;
        giteaState.status = data.status || "";
        
        giteaState.files = data.files || {
          modified: [],
          added: [],
          deleted: [],
          untracked: [],
          staged: [],
          unstaged: []
        };

        giteaState.totalChanges = [
          ...giteaState.files.modified,
          ...giteaState.files.added,
          ...giteaState.files.deleted,
          ...giteaState.files.untracked
        ].length;

        updateGiteaPanel();

        // SMART NOTIFICATION for Gitea
        if (!silent || (hasMeaningfulChange && giteaState.totalChanges > 0)) {
            if (data.has_changes) {
              showToast(`Gitea: ${giteaState.totalChanges} change(s) detected`, "success");
            } else if (!silent) {
              showToast("Gitea tree clean, no changes", "success");
            }
        }
      }
    } catch (error) {
      if (!silent) {
          if (elements.btnGiteaStatus) elements.btnGiteaStatus.classList.remove("pulsing");
          showToast("Gitea error: " + error.message, "error");
      }
    }
  }
export function updateGiteaPanel() {
    const panel = document.getElementById("gitea-panel");
    if (!panel) return;
    
    if (!state.giteaIntegrationEnabled) {
        panel.classList.remove("visible");
        panel.style.display = "none";
        return;
    }

    const container = document.getElementById("gitea-files-container");
    const badge = document.getElementById("gitea-changes-count");
    const commitBtn = document.getElementById("btn-gitea-commit-staged");
    const actions = panel.querySelector(".git-panel-actions");

    if (!container || !badge || !commitBtn || !actions) return;

    if (badge) badge.textContent = giteaState.totalChanges;

    // Sync indicators
    const oldIndicators = actions.querySelectorAll(".git-sync-indicator");
    oldIndicators.forEach(i => i.remove());

    if (giteaState.isInitialized && giteaState.hasRemote) {
        if (giteaState.ahead > 0) {
            const pushBtn = document.createElement("button");
            pushBtn.className = "git-panel-btn git-sync-indicator";
            pushBtn.id = "btn-gitea-push-sync";
            pushBtn.title = `${giteaState.ahead} commits to push`;
            pushBtn.innerHTML = `
                <span class="material-icons" style="font-size: 18px; color: var(--success-color);">arrow_upward</span>
                <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--success-color);">${giteaState.ahead}</span>
            `;
            actions.insertBefore(pushBtn, actions.firstChild);
        }
        if (giteaState.behind > 0) {
            const pullBtn = document.createElement("button");
            pullBtn.className = "git-panel-btn git-sync-indicator";
            pullBtn.id = "btn-gitea-pull-sync";
            pullBtn.title = `${giteaState.behind} commits to pull`;
            pullBtn.innerHTML = `
                <span class="material-icons" style="font-size: 18px; color: var(--warning-color);">arrow_downward</span>
                <span style="font-size: 10px; margin-left: -2px; font-weight: bold; color: var(--warning-color);">${giteaState.behind}</span>
            `;
            actions.insertBefore(pullBtn, actions.firstChild);
        }
    }

    // Stuck Operation Detection
    let stuckWarningHtml = "";
    if (giteaState.status && (
        giteaState.status.toLowerCase().includes("rebasing") || 
        giteaState.status.toLowerCase().includes("merging") || 
        giteaState.status.toLowerCase().includes("unmerged") ||
        giteaState.status.toLowerCase().includes("conflict")
    )) {
        stuckWarningHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(244, 67, 54, 0.1); border: 1px solid var(--error-color); border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: var(--error-color); font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">error_outline</span>
                    <span>Gitea Sync Blocked</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">A previous Gitea operation failed or is in progress. You must resolve or abort it.</p>
                <button id="btn-gitea-abort" style="width: 100%; padding: 6px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                    Abort & Reset Gitea Sync
                </button>
            </div>
        `;
    }

    // Diverged Sync Detection
    let divergedWarningHtml = "";
    if (giteaState.ahead > 0 && giteaState.behind > 0) {
        divergedWarningHtml = `
            <div style="margin: 8px; padding: 12px; background: rgba(156, 39, 176, 0.1); border: 1px solid #9c27b0; border-radius: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #9c27b0; font-weight: 600;">
                    <span class="material-icons" style="font-size: 18px;">sync_problem</span>
                    <span>Gitea Sync Conflict</span>
                </div>
                <p style="margin-bottom: 10px; color: var(--text-secondary);">Your local and Gitea versions have diverged.</p>
                <div style="display: flex; gap: 8px;">
                    <button id="btn-gitea-force-push" style="flex: 1; padding: 6px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
                        Force Push
                    </button>
                    <button id="btn-gitea-hard-reset" style="flex: 1; padding: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 11px;">
                        Hard Reset
                    </button>
                </div>
            </div>
        `;
    }

    // Toggle visibility state based on content availability logic same as git
    if (giteaState.totalChanges > 0 || giteaState.ahead > 0 || giteaState.behind > 0 || !giteaState.isInitialized || !giteaState.hasRemote || stuckWarningHtml || divergedWarningHtml) {
        panel.classList.add("visible");
        panel.style.display = "flex";
    } else {
        panel.classList.add("visible");
        panel.style.display = "flex";
    }

    // Apply saved collapse state
    if (state.giteaPanelCollapsed) {
        panel.classList.add("collapsed");
        const icon = elements.btnGiteaCollapse?.querySelector(".material-icons");
        if (icon) {
            icon.textContent = "expand_more";
            elements.btnGiteaCollapse.title = "Expand Gitea Panel";
        }
    } else {
        panel.classList.remove("collapsed");
        const icon = elements.btnGiteaCollapse?.querySelector(".material-icons");
        if (icon) {
            icon.textContent = "expand_less";
            elements.btnGiteaCollapse.title = "Collapse Gitea Panel";
        }
    }

    if (!giteaState.isInitialized) {
        container.innerHTML = `
            <div class="git-empty-state">
                <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px; color: #fa8e14;">source</span>
                <p style="margin: 0 0 10px 0; font-weight: 500;">Gitea Not Initialized</p>
                <button class="btn-primary" id="btn-gitea-init-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #fa8e14; color: white;">
                    <span class="material-icons" style="font-size: 18px;">play_circle</span> Initialize Repo
                </button>
            </div>
        `;
        if(commitBtn) commitBtn.disabled = true;
        return;
    }

    if (!giteaState.hasRemote) {
        if (giteaState.totalChanges === 0) {
             container.innerHTML = `
                <div class="git-empty-state">
                    <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 10px; color: #fa8e14;">link_off</span>
                    <p style="margin: 0 0 10px 0; font-weight: 500;">No Gitea Remote</p>
                    <button class="btn-primary" id="btn-gitea-connect-panel" style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #fa8e14; color: white;">
                        <span class="material-icons">link</span> Connect to Gitea
                    </button>
                </div>
            `;
            if(commitBtn) commitBtn.disabled = true;
            return;
        }
    }

    if (giteaState.totalChanges > 0 || stuckWarningHtml || divergedWarningHtml) {
      container.innerHTML = stuckWarningHtml + divergedWarningHtml;
      if (giteaState.totalChanges > 0) {
        renderGiteaFiles(container);
      }
    } else {
      container.innerHTML = `
        <div class="git-empty-state">
          <span class="material-icons" style="color: #fa8e14; font-size: 48px; opacity: 0.5;">check_circle</span>
          <p>No changes detected</p>
          <div class="git-empty-state-actions" style="display: flex; gap: 8px; margin-top: 12px; justify-content: center;">
            <button class="btn-secondary" id="btn-gitea-pull-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
              <span class="material-icons" style="font-size: 16px;">cloud_download</span> Pull
            </button>
            <button class="btn-secondary" id="btn-gitea-refresh-empty-state" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);">
              <span class="material-icons" style="font-size: 16px;">refresh</span> Refresh
            </button>
          </div>
        </div>
      `;
    }

    if(commitBtn) commitBtn.disabled = giteaState.files.staged.length === 0;
  }

export function renderGiteaFiles(container) {
    const groups = [
      { key: "staged", title: "Staged Changes", files: giteaState.files.staged, icon: "inventory_2", color: "success" },
      { key: "modified", title: "Modified", files: giteaState.files.modified.filter(f => !giteaState.files.staged.includes(f)), icon: "edit", color: "modified" },
      { key: "added", title: "Added", files: giteaState.files.added.filter(f => !giteaState.files.staged.includes(f)), icon: "add_circle", color: "added" },
      { key: "deleted", title: "Deleted", files: giteaState.files.deleted.filter(f => !giteaState.files.staged.includes(f)), icon: "delete", color: "deleted" },
      { key: "untracked", title: "Untracked", files: giteaState.files.untracked, icon: "help_outline", color: "untracked" }
    ];

    let html = "";

    for (const group of groups) {
      if (group.files.length === 0) continue;

      html += `
        <div class="git-file-group" data-group="${group.key}">
          <div class="git-file-group-header">
            <span class="git-file-group-icon material-icons ${group.color}" style="font-size: 18px;">${group.icon}</span>
            <span>${group.title}</span>
            <span class="git-file-group-count">(${group.files.length})</span>
            <span class="material-icons git-file-group-chevron">chevron_right</span>
          </div>
          <div class="git-file-list">
      `;

      for (const file of group.files) {
        const isStaged = giteaState.files.staged.includes(file);
        const checked = giteaState.selectedFiles.has(file) ? 'checked' : '';
        
        let diffButton = "";
        if ((group.key === "modified" || group.key === "staged") && isTextFile(file)) {
            diffButton = `
                <button class="btn-icon-only btn-git-diff" data-path="${file}" title="View Diff" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); margin-left: auto; padding: 4px;">
                    <span class="material-icons" style="font-size: 16px;">difference</span>
                </button>
            `;
        }

        html += `
          <div class="git-file-item" data-file="${file}">
            <input type="checkbox" class="gitea-file-checkbox" ${checked} data-file-path="${file}" />
            <span class="git-file-name" title="${file}" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file}</span>
            ${diffButton}
            ${isStaged ? '<span class="git-file-status staged" style="margin-left: 4px; background: var(--success-color); color: var(--bg-primary);">Staged</span>' : ''}
          </div>
        `;
      }
      html += `</div></div>`;
    }
    container.insertAdjacentHTML('beforeend', html);
  }

  // Toggle git file group collapse
export function toggleGitGroup(groupKey) {
    const group = document.querySelector(`.git-file-group[data-group="${groupKey}"]`);
    if (group) {
      group.classList.toggle("collapsed");
    }
  }

  // Toggle file selection
export function toggleFileSelection(file) {
    if (gitState.selectedFiles.has(file)) {
      gitState.selectedFiles.delete(file);
    } else {
      gitState.selectedFiles.add(file);
    }
  }

  // Stage selected files
export async function stageSelectedFiles() {
    // Robust fallback: if Set is empty, check DOM for checked checkboxes
    if (gitState.selectedFiles.size === 0) {
        const container = document.getElementById("git-files-container");
        if (container) {
            const checked = container.querySelectorAll(".git-file-checkbox:checked");
            checked.forEach(cb => {
                const path = cb.getAttribute("data-file-path");
                if (path) gitState.selectedFiles.add(path);
            });
        }
    }

    const selectedFiles = Array.from(gitState.selectedFiles);

    if (selectedFiles.length === 0) {
      showToast("No files selected. Check boxes next to files you want to stage.", "warning");
      return;
    }

    await gitStage(selectedFiles);
    gitState.selectedFiles.clear(); // Clear selection after staging
  }

  // Stage all unstaged files
export async function stageAllFiles() {
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
export async function unstageAllFiles() {
    if (gitState.files.staged.length > 0) {
      await gitUnstage(gitState.files.staged);
    }
  }

  // Commit staged files
export async function commitStagedFiles() {
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
export async function showAppSettings() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    // Get current setting from localStorage
    const gitEnabled = localStorage.getItem("gitIntegrationEnabled") !== "false"; // Default to true;
    const showRecentFiles = state.showRecentFiles;
    const customColors = state.customColors || {};

    modalTitle.textContent = "Blueprint Studio Settings";

    const renderColorInput = (label, key) => {
        const hasValue = customColors.hasOwnProperty(key);
        const colorValue = hasValue ? customColors[key] : '#000000';
        const disabled = !hasValue;
        
        return `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" class="syntax-color-toggle" data-key="${key}" ${hasValue ? 'checked' : ''} style="margin-right: 8px;">
                <span style="font-size: 12px; opacity: ${disabled ? '0.5' : '1'}; transition: opacity 0.2s;">${label}</span>
            </div>
            <input type="color" class="syntax-color-input" data-key="${key}" value="${colorValue}" ${disabled ? 'disabled' : ''} style="cursor: ${disabled ? 'default' : 'pointer'}; height: 24px; width: 40px; border: none; padding: 0; background: transparent; opacity: ${disabled ? '0.2' : '1'}; transition: opacity 0.2s;">
        </div>
    `;
    };

    // Generate theme preset options
    const themePresetOptions = Object.entries(THEME_PRESETS).map(([key, preset]) => 
      `<option value="${key}" ${state.themePreset === key ? 'selected' : ''}>${preset.name}</option>`
    ).join('');

    // Generate accent color options
    const accentColorOptions = ACCENT_COLORS.map(color => 
      `<option value="${color.value}" ${state.accentColor === color.value ? 'selected' : ''}>${color.name}</option>`
    ).join('');

    modalBody.innerHTML = `
      <div class="settings-tabs" style="display: flex; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">
        <button class="settings-tab active" data-tab="general" style="padding: 10px 16px; background: transparent; border: none; color: var(--text-primary); cursor: pointer; border-bottom: 2px solid var(--accent-color); font-size: 13px;">General</button>
        <button class="settings-tab" data-tab="appearance" style="padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; font-size: 13px;">Appearance</button>
        <button class="settings-tab" data-tab="editor" style="padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; font-size: 13px;">Editor</button>
        <button class="settings-tab" data-tab="features" style="padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; font-size: 13px;">Features</button>
      </div>

      <div class="settings-content">
        <!-- General Tab -->
        <div id="settings-tab-general" class="settings-panel active">
          <div class="git-settings-section">
            <div class="git-settings-label">File Management</div>

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
                <div style="font-weight: 500; margin-bottom: 4px;">Recent Files Limit</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Maximum number of recent files to display</div>
              </div>
              <input type="number" id="recent-files-limit" value="${state.recentFilesLimit}" min="5" max="30" style="width: 60px; padding: 6px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-primary); text-align: center;">
            </div>

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
                <div style="font-weight: 500; margin-bottom: 4px;">Gitea Integration</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Push/pull configs to a Gitea server</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="gitea-integration-toggle" ${state.giteaIntegrationEnabled ? 'checked' : ''}>
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
          </div>
        </div>

        <!-- Appearance Tab -->
        <div id="settings-tab-appearance" class="settings-panel" style="display: none;">
          <div class="git-settings-section">
            <div class="git-settings-label">Theme</div>

            <div style="padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="font-weight: 500; margin-bottom: 8px;">Theme Preset</div>
              <select id="theme-preset-select" class="git-settings-input" style="width: 100%;">
                ${themePresetOptions}
              </select>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Choose from pre-defined color schemes</div>
            </div>

            <div style="padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="font-weight: 500; margin-bottom: 8px;">Accent Color</div>
              <select id="accent-color-select" class="git-settings-input" style="width: 100%; margin-bottom: 8px;">
                <option value="">Use Theme Default</option>
                ${accentColorOptions}
              </select>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                ${ACCENT_COLORS.map(color => `
                  <button class="accent-color-btn" data-color="${color.value}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid ${state.accentColor === color.value ? 'var(--text-primary)' : 'transparent'}; background: ${color.value}; cursor: pointer;" title="${color.name}"></button>
                `).join('')}
              </div>
            </div>

            <div class="git-settings-label" style="margin-top: 20px;">File Tree</div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Compact Mode</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Reduce padding in the file tree for a more compact view</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="file-tree-compact-toggle" ${state.fileTreeCompact ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Show File Icons</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Display file type icons in the file tree</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="file-tree-icons-toggle" ${state.fileTreeShowIcons ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="git-settings-label" style="margin-top: 20px;">UI Feedback</div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Toast Notifications</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Show popup notifications for actions (saves, errors, etc.)</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="show-toasts-toggle" ${state.showToasts ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="git-settings-label" style="margin-top: 20px;">Editor Syntax Highlighting</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">Customize the font colors for the code editor.</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                ${renderColorInput("Comment", "comment")}
                ${renderColorInput("Keyword", "keyword")}
                ${renderColorInput("String", "string")}
                ${renderColorInput("Number", "number")}
                ${renderColorInput("Boolean", "boolean")}
                ${renderColorInput("Key / Property", "key")}
                ${renderColorInput("Tag", "tag")}
                ${renderColorInput("Line Numbers", "lineNumberColor")}
                ${renderColorInput("Fold Arrows", "foldColor")}
            </div>
            
            <button class="btn-secondary" id="btn-reset-colors" style="margin-top: 12px; width: 100%; font-size: 12px;">
                Reset to Default Colors
            </button>
          </div>
        </div>

        <!-- Editor Tab -->
        <div id="settings-tab-editor" class="settings-panel" style="display: none;">
          <div class="git-settings-section">
            <div class="git-settings-label">Font</div>

            <div style="padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="font-weight: 500; margin-bottom: 8px;">Font Size</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" id="font-size-slider" min="10" max="24" value="${state.fontSize}" style="flex: 1;">
                <span id="font-size-value" style="min-width: 40px; text-align: center; font-family: monospace;">${state.fontSize}px</span>
              </div>
            </div>

            <div style="padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="font-weight: 500; margin-bottom: 8px;">Font Family</div>
              <select id="font-family-select" class="git-settings-input" style="width: 100%;">
                <option value="'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace" ${state.fontFamily.includes('SF Mono') ? 'selected' : ''}>SF Mono (Default)</option>
                <option value="'Fira Code', 'Fira Mono', monospace" ${state.fontFamily.includes('Fira Code') ? 'selected' : ''}>Fira Code</option>
                <option value="'JetBrains Mono', 'Fira Code', monospace" ${state.fontFamily.includes('JetBrains Mono') ? 'selected' : ''}>JetBrains Mono</option>
                <option value="'Cascadia Code', 'Fira Code', monospace" ${state.fontFamily.includes('Cascadia Code') ? 'selected' : ''}>Cascadia Code</option>
                <option value="'Source Code Pro', 'Fira Code', monospace" ${state.fontFamily.includes('Source Code Pro') ? 'selected' : ''}>Source Code Pro</option>
                <option value="'Ubuntu Mono', monospace" ${state.fontFamily.includes('Ubuntu Mono') ? 'selected' : ''}>Ubuntu Mono</option>
                <option value="monospace" ${state.fontFamily === 'monospace' ? 'selected' : ''}>System Monospace</option>
              </select>
            </div>

            <div class="git-settings-label" style="margin-top: 20px;">Editor Behavior</div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Remember Workspace</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Restore open tabs, active file, and cursor position on restart</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="remember-workspace-toggle" ${state.rememberWorkspace ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Word Wrap</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Wrap long lines to the next line</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="word-wrap-toggle" ${state.wordWrap ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Line Numbers</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Show line numbers in the editor</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="line-numbers-toggle" ${state.showLineNumbers ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Show Whitespace</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Display whitespace characters (spaces, tabs)</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="show-whitespace-toggle" ${state.showWhitespace ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Auto Save</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Automatically save files after a delay</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="auto-save-toggle" ${state.autoSave ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div style="padding: 12px 0; border-bottom: 1px solid var(--divider-color); ${state.autoSave ? '' : 'opacity: 0.5; pointer-events: none;'}" id="auto-save-delay-container">
              <div style="font-weight: 500; margin-bottom: 8px;">Auto Save Delay</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" id="auto-save-delay-slider" min="500" max="5000" step="500" value="${state.autoSaveDelay}" style="flex: 1;">
                <span id="auto-save-delay-value" style="min-width: 60px; text-align: center;">${state.autoSaveDelay}ms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Tab -->
        <div id="settings-tab-features" class="settings-panel" style="display: none;">
          <div class="git-settings-section">
            <div class="git-settings-label">AI Studio Copilot</div>

            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">Enable AI Copilot</div>
                <div style="font-size: 12px; color: var(--text-secondary);">AI-powered automation generation, YAML fixes, and entity insights</div>
              </div>
              <label class="toggle-switch" style="margin-left: 16px;">
                <input type="checkbox" id="ai-integration-toggle" ${state.aiIntegrationEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div id="ai-provider-section" style="display: ${state.aiIntegrationEnabled ? 'block' : 'none'}; padding: 12px 0; border-bottom: 1px solid var(--divider-color);">
              <div style="font-weight: 500; margin-bottom: 8px; font-size: 13px;">AI Provider</div>
              <select id="ai-provider-select" class="git-settings-input" style="width: 100%; margin-bottom: 8px;">
                <option value="local" ${state.aiProvider === 'local' ? 'selected' : ''}>Local (Rule-based Beta)</option>
                <option value="gemini" ${state.aiProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                <option value="openai" ${state.aiProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                <option value="claude" ${state.aiProvider === 'claude' ? 'selected' : ''}>Anthropic Claude</option>
              </select>

              <div id="ai-model-section" style="display: ${state.aiProvider !== 'local' ? 'block' : 'none'}; margin-top: 8px;">
                <div style="font-size: 12px; margin-bottom: 4px;">AI Model</div>
                <div id="gemini-model-container" style="display: ${state.aiProvider === 'gemini' ? 'block' : 'none'};">
                  <select id="gemini-model-select" class="git-settings-input" style="width: 100%;">
                    <option value="gemini-3-pro-preview" ${state.aiModel === 'gemini-3-pro-preview' ? 'selected' : ''}>Gemini 3 Pro (Preview)</option>
                    <option value="gemini-3-flash-preview" ${state.aiModel === 'gemini-3-flash-preview' ? 'selected' : ''}>Gemini 3 Flash (Preview)</option>
                    <option value="gemini-2.5-pro" ${state.aiModel === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro</option>
                    <option value="gemini-2.5-flash" ${state.aiModel === 'gemini-2.5-flash' ? 'selected' : ''}>Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-flash-lite" ${state.aiModel === 'gemini-2.5-flash-lite' ? 'selected' : ''}>Gemini 2.5 Flash-Lite</option>
                  </select>
                </div>
                <div id="openai-model-container" style="display: ${state.aiProvider === 'openai' ? 'block' : 'none'};">
                  <select id="openai-model-select" class="git-settings-input" style="width: 100%;">
                    <option value="gpt-5.2" ${state.aiModel === 'gpt-5.2' ? 'selected' : ''}>GPT-5.2 (Agentic)</option>
                    <option value="gpt-5.2-pro" ${state.aiModel === 'gpt-5.2-pro' ? 'selected' : ''}>GPT-5.2 Pro (Reasoning)</option>
                    <option value="gpt-5.2-chat-latest" ${state.aiModel === 'gpt-5.2-chat-latest' ? 'selected' : ''}>GPT-5.2 Chat Latest</option>
                    <option value="gpt-5.1" ${state.aiModel === 'gpt-5.1' ? 'selected' : ''}>GPT-5.1</option>
                    <option value="gpt-5" ${state.aiModel === 'gpt-5' ? 'selected' : ''}>GPT-5 (Flagship)</option>
                    <option value="gpt-5-mini" ${state.aiModel === 'gpt-5-mini' ? 'selected' : ''}>GPT-5 Mini</option>
                    <option value="gpt-5-nano" ${state.aiModel === 'gpt-5-nano' ? 'selected' : ''}>GPT-5 Nano</option>
                    <option value="gpt-4.1" ${state.aiModel === 'gpt-4.1' ? 'selected' : ''}>GPT-4.1</option>
                    <option value="gpt-4.1-mini" ${state.aiModel === 'gpt-4.1-mini' ? 'selected' : ''}>GPT-4.1 Mini</option>
                    <option value="o3" ${state.aiModel === 'o3' ? 'selected' : ''}>o3</option>
                    <option value="o3-pro" ${state.aiModel === 'o3-pro' ? 'selected' : ''}>o3-pro</option>
                    <option value="o3-deep-research" ${state.aiModel === 'o3-deep-research' ? 'selected' : ''}>o3-deep-research</option>
                    <option value="o4-mini" ${state.aiModel === 'o4-mini' ? 'selected' : ''}>o4-mini</option>
                    <option value="o4-mini-deep-research" ${state.aiModel === 'o4-mini-deep-research' ? 'selected' : ''}>o4-mini-deep-research</option>
                    <option value="o1-pro" ${state.aiModel === 'o1-pro' ? 'selected' : ''}>o1-pro</option>
                  </select>
                </div>
                <div id="claude-model-container" style="display: ${state.aiProvider === 'claude' ? 'block' : 'none'};">
                  <select id="claude-model-select" class="git-settings-input" style="width: 100%;">
                    <option value="claude-sonnet-4-5-20250929" ${state.aiModel === 'claude-sonnet-4-5-20250929' ? 'selected' : ''}>Claude 4.5 Sonnet</option>
                    <option value="claude-haiku-4-5-20251001" ${state.aiModel === 'claude-haiku-4-5-20251001' ? 'selected' : ''}>Claude 4.5 Haiku</option>
                    <option value="claude-opus-4-5-20251101" ${state.aiModel === 'claude-opus-4-5-20251101' ? 'selected' : ''}>Claude 4.5 Opus</option>
                  </select>
                </div>
              </div>
              
              <div id="gemini-api-section" style="display: ${state.aiProvider === 'gemini' ? 'block' : 'none'}; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="font-size: 12px;">Gemini API Key</div>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" style="font-size: 11px; color: var(--accent-color); text-decoration: none; display: flex; align-items: center;">
                    Get Key <span class="material-icons" style="font-size: 12px; margin-left: 2px;">open_in_new</span>
                  </a>
                </div>
                <input type="password" id="gemini-api-key" class="git-settings-input" style="width: 100%;" value="${state.geminiApiKey || ''}" placeholder="Enter Gemini API Key">
              </div>

              <div id="openai-api-section" style="display: ${state.aiProvider === 'openai' ? 'block' : 'none'}; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="font-size: 12px;">OpenAI API Key</div>
                  <a href="https://platform.openai.com/api-keys" target="_blank" style="font-size: 11px; color: var(--accent-color); text-decoration: none; display: flex; align-items: center;">
                    Get Key <span class="material-icons" style="font-size: 12px; margin-left: 2px;">open_in_new</span>
                  </a>
                </div>
                <input type="password" id="openai-api-key" class="git-settings-input" style="width: 100%;" value="${state.openaiApiKey || ''}" placeholder="Enter OpenAI API Key">
              </div>

              <div id="claude-api-section" style="display: ${state.aiProvider === 'claude' ? 'block' : 'none'}; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <div style="font-size: 12px;">Claude API Key</div>
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" style="font-size: 11px; color: var(--accent-color); text-decoration: none; display: flex; align-items: center;">
                    Get Key <span class="material-icons" style="font-size: 12px; margin-left: 2px;">open_in_new</span>
                  </a>
                </div>
                <input type="password" id="claude-api-key" class="git-settings-input" style="width: 100%;" value="${state.claudeApiKey || ''}" placeholder="Enter Claude API Key">
              </div>

              <button class="btn-primary" id="btn-save-ai-settings" style="margin-top: 12px; width: 100%; font-size: 12px; height: 32px;">
                  Apply AI Settings
              </button>
            </div>

            <div class="git-settings-label" style="margin-top: 20px; color: var(--error-color);">Danger Zone</div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">
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

      <div style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: 8px; font-size: 13px;">
        <span class="material-icons" style="font-size: 16px; vertical-align: middle; color: var(--info-color, #2196f3);">info</span>
        <span style="margin-left: 8px;">Changes will take effect immediately</span>
      </div>
    `;

    modalOverlay.classList.add("visible");
    modal.style.maxWidth = "600px";
    modal.style.maxHeight = "85vh";

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

    // Handle Settings Tabs
    const tabButtons = modalBody.querySelectorAll('.settings-tab');
    const tabPanels = modalBody.querySelectorAll('.settings-panel');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.style.color = 'var(--text-secondary)';
          b.style.borderBottomColor = 'transparent';
        });
        btn.classList.add('active');
        btn.style.color = 'var(--text-primary)';
        btn.style.borderBottomColor = 'var(--accent-color)';
        
        // Show active panel
        tabPanels.forEach(panel => {
          panel.style.display = panel.id === `settings-tab-${tabId}` ? 'block' : 'none';
        });
      });
    });

    // Handle Theme Preset selection
    const themePresetSelect = document.getElementById('theme-preset-select');
    if (themePresetSelect) {
      themePresetSelect.addEventListener('change', (e) => {
        setThemePreset(e.target.value);
        showToast(`Theme changed to ${THEME_PRESETS[e.target.value].name}`, "success");
      });
    }

    // Handle Accent Color selection
    const accentColorSelect = document.getElementById('accent-color-select');
    if (accentColorSelect) {
      accentColorSelect.addEventListener('change', (e) => {
        setAccentColor(e.target.value || null);
        showToast(e.target.value ? 'Accent color updated' : 'Using theme default accent', "success");
      });
    }

    // Handle Accent Color buttons
    const accentColorBtns = modalBody.querySelectorAll('.accent-color-btn');
    accentColorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        setAccentColor(color);
        
        // Update button borders
        accentColorBtns.forEach(b => b.style.borderColor = 'transparent');
        btn.style.borderColor = 'var(--text-primary)';
        
        // Update select
        if (accentColorSelect) accentColorSelect.value = color;
      });
    });

    // Handle File Tree settings
    const fileTreeCompactToggle = document.getElementById('file-tree-compact-toggle');
    if (fileTreeCompactToggle) {
      fileTreeCompactToggle.addEventListener('change', (e) => {
        state.fileTreeCompact = e.target.checked;
        applyLayoutSettings();
        saveSettings();
        showToast(e.target.checked ? 'Compact mode enabled' : 'Compact mode disabled', "success");
      });
    }

    const fileTreeIconsToggle = document.getElementById('file-tree-icons-toggle');
    if (fileTreeIconsToggle) {
      fileTreeIconsToggle.addEventListener('change', (e) => {
        state.fileTreeShowIcons = e.target.checked;
        applyLayoutSettings();
        saveSettings();
        renderFileTree();
        showToast(e.target.checked ? 'File icons enabled' : 'File icons hidden', "success");
      });
    }

    const showToastsToggle = document.getElementById('show-toasts-toggle');
    if (showToastsToggle) {
      showToastsToggle.addEventListener('change', (e) => {
        state.showToasts = e.target.checked;
        saveSettings();
        // Always show this toast to confirm the change even if toasts were disabled
        showToast(e.target.checked ? 'Toast notifications enabled' : 'Toast notifications disabled', "success");
      });
    }

    // Handle Recent Files Limit
    const recentFilesLimitInput = document.getElementById('recent-files-limit');
    if (recentFilesLimitInput) {
      recentFilesLimitInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value) || 10;
        state.recentFilesLimit = Math.max(5, Math.min(30, value));
        saveSettings();
        renderFileTree();
        showToast(`Recent files limit set to ${state.recentFilesLimit}`, "success");
      });
    }

    // Handle Font Size slider
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    if (fontSizeSlider && fontSizeValue) {
      fontSizeSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        fontSizeValue.textContent = value + 'px';
      });
      fontSizeSlider.addEventListener('change', (e) => {
        state.fontSize = parseInt(e.target.value);
        applyEditorSettings();
        saveSettings();
        showToast(`Font size set to ${state.fontSize}px`, "success");
      });
    }

    // Handle Font Family selection
    const fontFamilySelect = document.getElementById('font-family-select');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', (e) => {
        state.fontFamily = e.target.value;
        applyEditorSettings();
        saveSettings();
        showToast('Font family updated', "success");
      });
    }

    // Handle Editor settings toggles
    const wordWrapToggle = document.getElementById('word-wrap-toggle');
    if (wordWrapToggle) {
      wordWrapToggle.addEventListener('change', (e) => {
        state.wordWrap = e.target.checked;
        applyEditorSettings();
        saveSettings();
        showToast(e.target.checked ? 'Word wrap enabled' : 'Word wrap disabled', "success");
      });
    }

    const lineNumbersToggle = document.getElementById('line-numbers-toggle');
    if (lineNumbersToggle) {
      lineNumbersToggle.addEventListener('change', (e) => {
        state.showLineNumbers = e.target.checked;
        applyEditorSettings();
        saveSettings();
        showToast(e.target.checked ? 'Line numbers enabled' : 'Line numbers disabled', "success");
      });
    }

    const showWhitespaceToggle = document.getElementById('show-whitespace-toggle');
    if (showWhitespaceToggle) {
      showWhitespaceToggle.addEventListener('change', (e) => {
        state.showWhitespace = e.target.checked;
        applyEditorSettings();
        saveSettings();
        showToast(e.target.checked ? 'Whitespace visualization enabled' : 'Whitespace visualization disabled', "success");
      });
    }

    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const autoSaveDelayContainer = document.getElementById('auto-save-delay-container');
    if (autoSaveToggle) {
      autoSaveToggle.addEventListener('change', (e) => {
        state.autoSave = e.target.checked;
        if (autoSaveDelayContainer) {
          autoSaveDelayContainer.style.opacity = state.autoSave ? '1' : '0.5';
          autoSaveDelayContainer.style.pointerEvents = state.autoSave ? 'auto' : 'none';
        }
        saveSettings();
        showToast(e.target.checked ? 'Auto-save enabled' : 'Auto-save disabled', "success");
      });
    }

    const autoSaveDelaySlider = document.getElementById('auto-save-delay-slider');
    const autoSaveDelayValue = document.getElementById('auto-save-delay-value');
    if (autoSaveDelaySlider && autoSaveDelayValue) {
      autoSaveDelaySlider.addEventListener('input', (e) => {
        autoSaveDelayValue.textContent = e.target.value + 'ms';
      });
      autoSaveDelaySlider.addEventListener('change', (e) => {
        state.autoSaveDelay = parseInt(e.target.value);
        saveSettings();
        showToast(`Auto-save delay set to ${state.autoSaveDelay}ms`, "success");
      });
    }

    // Handle Git integration toggle
    const gitToggle = document.getElementById("git-integration-toggle");
    if (gitToggle) {
      gitToggle.addEventListener("change", (e) => {
        const gitEnabled = e.target.checked;
        state.gitIntegrationEnabled = gitEnabled;
        saveSettings();
        applyVersionControlVisibility();
        
        if (gitEnabled) {
          showToast("Git integration enabled", "success");
          gitStatus(true);
        } else {
          showToast("Git integration disabled", "info");
        }
      });
    }

    const giteaToggle = document.getElementById("gitea-integration-toggle");
    if (giteaToggle) {
      giteaToggle.addEventListener("change", async (e) => {
        state.giteaIntegrationEnabled = e.target.checked;
        saveSettings();
        applyVersionControlVisibility();
        
        if (state.giteaIntegrationEnabled) {
          showToast("Gitea integration enabled", "success");
          await giteaStatus(true);
        } else {
          showToast("Gitea integration disabled", "info");
        }
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

    // Handle Remember Workspace toggle
    const rememberWorkspaceToggle = document.getElementById("remember-workspace-toggle");
    if (rememberWorkspaceToggle) {
      rememberWorkspaceToggle.addEventListener("change", (e) => {
        state.rememberWorkspace = e.target.checked;
        saveSettings();
      });
    }

    // Handle AI integration toggle
    const aiToggle = document.getElementById("ai-integration-toggle");
    const aiProviderSection = document.getElementById("ai-provider-section");
    if (aiToggle) {
      aiToggle.addEventListener("change", (e) => {
        state.aiIntegrationEnabled = e.target.checked;
        if (aiProviderSection) {
          aiProviderSection.style.display = state.aiIntegrationEnabled ? 'block' : 'none';
        }
        saveSettings();
        showToast(state.aiIntegrationEnabled ? "AI Studio Copilot enabled" : "AI Studio Copilot disabled", "success");
        if (typeof updateAIVisibility === "function") {
            updateAIVisibility();
        }
      });
    }

    const aiProviderSelect = document.getElementById("ai-provider-select");
    const aiModelSection = document.getElementById("ai-model-section");
    const geminiModelContainer = document.getElementById("gemini-model-container");
    const openaiModelContainer = document.getElementById("openai-model-container");
    const claudeModelContainer = document.getElementById("claude-model-container");
    const geminiSection = document.getElementById("gemini-api-section");
    const openaiSection = document.getElementById("openai-api-section");
    const claudeSection = document.getElementById("claude-api-section");
    
    if (aiProviderSelect) {
      aiProviderSelect.addEventListener("change", (e) => {
        state.aiProvider = e.target.value;
        if (aiModelSection) aiModelSection.style.display = state.aiProvider !== 'local' ? 'block' : 'none';
        if (geminiModelContainer) geminiModelContainer.style.display = state.aiProvider === 'gemini' ? 'block' : 'none';
        if (openaiModelContainer) openaiModelContainer.style.display = state.aiProvider === 'openai' ? 'block' : 'none';
        if (claudeModelContainer) claudeModelContainer.style.display = state.aiProvider === 'claude' ? 'block' : 'none';
        if (geminiSection) geminiSection.style.display = state.aiProvider === 'gemini' ? 'block' : 'none';
        if (openaiSection) openaiSection.style.display = state.aiProvider === 'openai' ? 'block' : 'none';
        if (claudeSection) claudeSection.style.display = state.aiProvider === 'claude' ? 'block' : 'none';
        
        // Suggest default model
        if (state.aiProvider === 'gemini') {
            state.aiModel = "gemini-2.0-flash-exp";
            const geminiSelect = document.getElementById("gemini-model-select");
            if (geminiSelect) geminiSelect.value = state.aiModel;
        } else if (state.aiProvider === 'openai') {
            state.aiModel = "gpt-4o";
            const openaiSelect = document.getElementById("openai-model-select");
            if (openaiSelect) openaiSelect.value = state.aiModel;
        } else if (state.aiProvider === 'claude') {
            state.aiModel = "claude-sonnet-4-5-20250929";
            const claudeSelect = document.getElementById("claude-model-select");
            if (claudeSelect) claudeSelect.value = state.aiModel;
        }
        saveSettings();
      });
    }

    const geminiModelSelect = document.getElementById("gemini-model-select");
    if (geminiModelSelect) {
        geminiModelSelect.addEventListener("change", (e) => {
            state.aiModel = e.target.value;
            saveSettings();
        });
    }

    const openaiModelSelect = document.getElementById("openai-model-select");
    if (openaiModelSelect) {
        openaiModelSelect.addEventListener("change", (e) => {
            state.aiModel = e.target.value;
            saveSettings();
        });
    }

    const claudeModelSelect = document.getElementById("claude-model-select");
    if (claudeModelSelect) {
        claudeModelSelect.addEventListener("change", (e) => {
            state.aiModel = e.target.value;
            saveSettings();
        });
    }

    // Handle API Key inputs
    const geminiKeyInput = document.getElementById("gemini-api-key");
    if (geminiKeyInput) {
      geminiKeyInput.addEventListener("change", (e) => {
        state.geminiApiKey = e.target.value;
        saveSettings();
      });
    }

    const openaiKeyInput = document.getElementById("openai-api-key");
    if (openaiKeyInput) {
      openaiKeyInput.addEventListener("change", (e) => {
        state.openaiApiKey = e.target.value;
        saveSettings();
      });
    }

    const claudeKeyInput = document.getElementById("claude-api-key");
    if (claudeKeyInput) {
      claudeKeyInput.addEventListener("change", (e) => {
        state.claudeApiKey = e.target.value;
        saveSettings();
      });
    }

    const btnSaveAI = document.getElementById("btn-save-ai-settings");
    if (btnSaveAI) {
        btnSaveAI.addEventListener("click", async () => {
            const geminiKey = document.getElementById("gemini-api-key")?.value;
            const openaiKey = document.getElementById("openai-api-key")?.value;
            const claudeKey = document.getElementById("claude-api-key")?.value;
            const provider = document.getElementById("ai-provider-select")?.value;
            
            let model = "";
            if (provider === 'gemini') {
                model = document.getElementById("gemini-model-select")?.value;
            } else if (provider === 'openai') {
                model = document.getElementById("openai-model-select")?.value;
            } else if (provider === 'claude') {
                model = document.getElementById("claude-model-select")?.value;
            } else {
                model = "local";
            }
            
            state.geminiApiKey = geminiKey;
            state.openaiApiKey = openaiKey;
            state.claudeApiKey = claudeKey;
            state.aiProvider = provider;
            state.aiModel = model;
            
            await saveSettings();
            showToast("AI Settings Applied", "success");
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

    // Handle Syntax Color Toggles (Checkbox)
    const colorToggles = modalBody.querySelectorAll(".syntax-color-toggle");
    colorToggles.forEach(toggle => {
        toggle.addEventListener("change", (e) => {
            const key = e.target.dataset.key;
            const checked = e.target.checked;
            const input = modalBody.querySelector(`.syntax-color-input[data-key="${key}"]`);
            const labelSpan = e.target.nextElementSibling;
            
            if (!state.customColors) state.customColors = {};
            
            if (checked) {
                // Enabled: Set value
                const val = input.value || '#000000';
                state.customColors[key] = val;
                
                input.disabled = false;
                input.style.opacity = '1';
                input.style.cursor = 'pointer';
                labelSpan.style.opacity = '1';
            } else {
                // Disabled: Remove key
                delete state.customColors[key];
                
                input.disabled = true;
                input.style.opacity = '0.2';
                input.style.cursor = 'default';
                labelSpan.style.opacity = '0.5';
            }
            
            applyCustomSyntaxColors();
            applyTheme(); // Update CSS variables for line numbers/fold
            saveSettings();
        });
    });

    // Handle Syntax Color Inputs
    const colorInputs = modalBody.querySelectorAll(".syntax-color-input");
    colorInputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const key = e.target.dataset.key;
            const value = e.target.value;
            
            if (!state.customColors) state.customColors = {};
            
            const toggle = modalBody.querySelector(`.syntax-color-toggle[data-key="${key}"]`);
            if (toggle && !toggle.checked) return;

            state.customColors[key] = value;
            applyCustomSyntaxColors();
            applyTheme(); // Update CSS variables for line numbers/fold
            saveSettings();
        });
    });

    // Handle Reset Colors
    const btnResetColors = document.getElementById("btn-reset-colors");
    if (btnResetColors) {
        btnResetColors.addEventListener("click", () => {
            state.customColors = {};
            applyCustomSyntaxColors();
            applyTheme(); // Reset CSS variables
            saveSettings();
            showToast("Syntax colors reset to default", "success");
            closeSettings();
            showAppSettings();
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
                        <div style="font-weight: 500;">Sign out and clear credentials</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Remove GitHub and Gitea tokens from server</div>
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
                try {
                    await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "git_clear_credentials" }),
                    });
                    await fetchWithAuth(API_BASE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "gitea_clear_credentials" }),
                    });
                } catch (e) {
                    console.error("Failed to clear credentials:", e);
                }
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

            // Reset server-side settings
            try {
                await fetchWithAuth(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        action: "save_settings", 
                        settings: {
                            onboardingCompleted: false
                        } 
                    }),
                });
            } catch (e) {
                console.error("Failed to reset server settings:", e);
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
export async function showGitExclusions() {
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

export function applyVersionControlVisibility() {
    const gitEnabled = state.gitIntegrationEnabled;
    const giteaEnabled = state.giteaIntegrationEnabled;

    // Git Elements
    const gitElements = [
      document.getElementById("btn-git-pull"),
      document.getElementById("btn-git-push"),
      document.getElementById("btn-git-status"),
      document.getElementById("btn-git-settings"),
      document.getElementById("git-panel")
    ];

    gitElements.forEach(el => {
      if (el) el.style.display = gitEnabled ? "flex" : "none";
    });
    
    if (!gitEnabled) {
        document.getElementById("git-panel")?.classList.remove("visible");
    }

    // Gitea Elements
    const giteaElements = [
      document.getElementById("btn-gitea-pull"),
      document.getElementById("btn-gitea-push"),
      document.getElementById("btn-gitea-status"),
      document.getElementById("btn-gitea-settings"),
      document.getElementById("gitea-panel")
    ];

    giteaElements.forEach(el => {
      if (el) el.style.display = giteaEnabled ? "flex" : "none";
    });

    if (!giteaEnabled) {
        document.getElementById("gitea-panel")?.classList.remove("visible");
    }

    // Also handle toolbar groups
    const gitToolbarGroup = document.querySelector(".git-toolbar-group");
    if (gitToolbarGroup) gitToolbarGroup.style.display = gitEnabled ? "flex" : "none";

    const giteaToolbarGroup = document.getElementById("gitea-toolbar-group");
    if (giteaToolbarGroup) giteaToolbarGroup.style.display = giteaEnabled ? "flex" : "none";
  }

export function updateAIVisibility() {
    const btnAI = document.getElementById("btn-ai-studio");
    if (btnAI) {
      btnAI.style.display = state.aiIntegrationEnabled ? "flex" : "none";
    }
    const aiSidebar = document.getElementById("ai-sidebar");
    if (aiSidebar && !state.aiIntegrationEnabled) {
      aiSidebar.classList.add("hidden");
    }
  }

export function toggleAISidebar() {
    const aiSidebar = document.getElementById("ai-sidebar");
    if (!aiSidebar) return;

    const isHidden = aiSidebar.classList.contains("hidden");
    if (isHidden) {
      aiSidebar.classList.remove("hidden");
      document.getElementById("ai-chat-input")?.focus();
    } else {
      aiSidebar.classList.add("hidden");
    }
  }

export function formatAiResponse(text) {
    if (!text) return "";
    
    // Replace code blocks with styled containers
    let formatted = text.replace(/```(?:yaml|yml)?\n([\s\S]*?)\n```/g, (match, code) => {
        return `<div class="ai-code-block"><pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
    });
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // New lines to <br> (only outside of code blocks)
    // This is a simple version, ideally use a markdown library but keeping it local/lightweight
    return formatted.replace(/\n/g, '<br>');
  }

export function copyToClipboard(text) {
    if (!navigator.clipboard) {
        // Fallback for non-secure contexts or browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("Code copied to clipboard", "success");
        } catch (err) {
            console.error("Fallback copy failed:", err);
            showToast("Failed to copy code", "error");
        }
        document.body.removeChild(textArea);
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showToast("Code copied to clipboard", "success");
    }).catch(err => {
        console.error("Async copy failed:", err);
        showToast("Failed to copy code", "error");
    });
  }

export async function sendAIChatMessage() {
    const input = document.getElementById("ai-chat-input");
    const messagesContainer = document.getElementById("ai-chat-messages");
    const query = input.value.trim();

    if (!query) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "ai-message ai-message-user";
    userMsg.textContent = query;
    messagesContainer.appendChild(userMsg);
    
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add assistant loading message
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "ai-message ai-message-assistant";
    loadingMsg.innerHTML = '<span class="ai-loading">Thinking...</span>';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      console.log("AI Copilot: Sending query...", {
        provider: state.aiProvider,
        file: state.activeTab ? state.activeTab.path : null,
        query: query
      });

      const result = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_query",
          query: query,
          current_file: state.activeTab ? state.activeTab.path : null,
          file_content: (state.activeTab && state.editor) ? state.editor.getValue() : null
        })
      });

      console.log("AI Copilot: Received response:", result);

      if (result.success) {
        // Parse markdown code blocks and format them
        const formattedResponse = formatAiResponse(result.response);
        loadingMsg.innerHTML = formattedResponse;
        
        // Add copy buttons to code blocks
        loadingMsg.querySelectorAll(".ai-code-block").forEach(block => {
            const copyBtn = document.createElement("button");
            copyBtn.className = "ai-copy-btn";
            copyBtn.innerHTML = '<span class="material-icons">content_copy</span>';
            copyBtn.title = "Copy to clipboard";
            copyBtn.onclick = () => {
                const code = block.querySelector("code").innerText;
                copyToClipboard(code);
            };
            block.appendChild(copyBtn);
        });
      } else {
        loadingMsg.textContent = "Error: " + (result.message || "Failed to get response from AI");
        loadingMsg.style.color = "var(--error-color)";
      }
    } catch (e) {
      console.error("AI Copilot Error:", e);
      loadingMsg.textContent = "Error connecting to AI service: " + e.message;
      loadingMsg.style.color = "var(--error-color)";
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }


  // ============================================
  // Git Settings
  // ============================================

  // Show Git Settings modal
export async function showGitSettings() {
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
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
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
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
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

export async function showCreateGithubRepoDialog() {
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

export async function showGlobalSearchDialog() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    resetModalToDefault();
    modalTitle.textContent = "Search in All Files";
    
    modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 65vh;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <input type="text" id="global-search-input" class="modal-input" placeholder="Text to find..." style="flex: 1;">
                <button id="btn-global-search" class="btn-primary" style="padding: 0 16px;">Search</button>
            </div>
            <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 12px; color: var(--text-secondary);">
                <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" id="global-search-case" style="width: 14px; height: 14px;"> Case Sensitive
                </label>
                <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" id="global-search-regex" style="width: 14px; height: 14px;"> Regex
                </label>
                <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" id="global-search-entities" style="width: 14px; height: 14px;"> Search Entities
                </label>
            </div>
            <div id="global-search-status" style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; min-height: 18px;"></div>
            <div id="global-search-results" style="flex: 1; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary);"></div>
        </div>
    `;
    
    modal.style.maxWidth = "750px";
    if (modalFooter) modalFooter.style.display = "none";
    modalOverlay.classList.add("visible");

    const input = document.getElementById("global-search-input");
    const btnSearch = document.getElementById("btn-global-search");
    const checkCase = document.getElementById("global-search-case");
    const checkRegex = document.getElementById("global-search-regex");
    const checkEntities = document.getElementById("global-search-entities");
    const resultsContainer = document.getElementById("global-search-results");
    const statusDiv = document.getElementById("global-search-status");

    const performSearch = async () => {
        const query = input.value.trim();
        // Allow empty query for entity search (lists all)
        if (!query && (!checkEntities || !checkEntities.checked)) return;

        statusDiv.textContent = "Searching...";
        resultsContainer.innerHTML = "";
        btnSearch.disabled = true;

        try {
            // ENTITY SEARCH MODE
            if (checkEntities && checkEntities.checked) {
                const data = await fetchWithAuth(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        action: "get_entities", 
                        query: query
                    }),
                });

                if (data.entities) {
                    statusDiv.textContent = `Found ${data.entities.length} entities (limit 1000)`;
                    if (data.entities.length === 0) {
                        resultsContainer.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted);">No entities found</div>`;
                    } else {
                        data.entities.forEach(ent => {
                            const item = document.createElement("div");
                            item.style.padding = "10px 12px";
                            item.style.borderBottom = "1px solid var(--border-color)";
                            item.style.cursor = "pointer";
                            item.style.fontSize = "13px";
                            item.style.display = "flex";
                            item.style.alignItems = "center";
                            item.style.gap = "12px";
                            
                            const iconName = (ent.icon || "mdi:circle-outline").replace("mdi:", "").replace(/-/g, "_");
                            
                            item.innerHTML = `
                                <div style="color: var(--accent-color); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                                    <span class="material-icons" style="font-size: 20px;">${iconName}</span>
                                </div>
                                <div style="flex: 1; overflow: hidden;">
                                    <div style="font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px;">${ent.friendly_name || ent.entity_id}</div>
                                    <div style="font-family: monospace; font-size: 11px; color: var(--text-muted); opacity: 0.8;">${ent.entity_id}</div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="font-size: 11px; padding: 2px 8px; background: var(--bg-tertiary); border-radius: 10px; color: var(--text-secondary); border: 1px solid var(--border-color);">${ent.state}</div>
                                    <span class="material-icons" style="font-size: 18px; color: var(--text-muted); opacity: 0.5;">content_copy</span>
                                </div>
                            `;
                            
                            item.addEventListener("click", () => {
                                const textToCopy = ent.entity_id;
                                copyToClipboard(textToCopy);
                                showToast(`Copied entity ID: ${textToCopy}`, "success");
                                
                                closeDialog();
                                
                                if (state.editor) {
                                    state.editor.replaceSelection(textToCopy);
                                    state.editor.focus();
                                }
                            });
                            
                            item.addEventListener("mouseenter", () => { 
                                item.style.background = "var(--bg-tertiary)";
                                const icon = item.querySelector(".material-icons:last-child");
                                if (icon) {
                                    icon.style.opacity = "1";
                                    icon.style.color = "var(--accent-color)";
                                }
                            });
                            item.addEventListener("mouseleave", () => { 
                                item.style.background = "transparent";
                                const icon = item.querySelector(".material-icons:last-child");
                                if (icon) {
                                    icon.style.opacity = "0.5";
                                    icon.style.color = "var(--text-muted)";
                                }
                            });

                            resultsContainer.appendChild(item);
                        });
                    }
                } else {
                    statusDiv.textContent = "Error searching entities";
                }
                btnSearch.disabled = false;
                return;
            }

            // FILE SEARCH MODE
            const results = await fetchWithAuth(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    action: "global_search", 
                    query: query,
                    case_sensitive: checkCase.checked,
                    use_regex: checkRegex.checked
                }),
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

export function showCommandPalette() {
    if (!elements.commandPaletteOverlay) elements.commandPaletteOverlay = document.getElementById("command-palette-overlay");
    if (!elements.commandPaletteInput) elements.commandPaletteInput = document.getElementById("command-palette-input");
    if (!elements.commandPaletteResults) elements.commandPaletteResults = document.getElementById("command-palette-results");

    if (elements.commandPaletteOverlay.classList.contains("visible")) return;

    const commands = [
        { id: "save", label: "Save Current File", icon: "save", shortcut: "Ctrl+S", action: () => { if (state.activeTab) saveFile(state.activeTab.path, state.activeTab.content); } },
        { id: "save_all", label: "Save All Files", icon: "save_alt", shortcut: "Ctrl+Shift+S", action: saveAllFiles },
        { id: "global_search", label: "Global Search", icon: "search", shortcut: "Ctrl+Shift+F", action: showGlobalSearchDialog },
        { id: "quick_switcher", label: "Go to File...", icon: "find_in_page", shortcut: "Ctrl+E", action: showQuickSwitcher },
        { id: "new_file", label: "New File", icon: "note_add", action: promptNewFile },
        { id: "new_folder", label: "New Folder", icon: "create_new_folder", action: promptNewFolder },
        { id: "generate_uuid", label: "Generate UUID", icon: "fingerprint", shortcut: "Ctrl+Shift+U", action: insertUUID },
        { id: "git_status", label: "Git Status", icon: "sync", action: () => gitStatus(true) },
        { id: "git_push", label: "Git Push", icon: "cloud_upload", action: gitPush },
        { id: "git_pull", label: "Git Pull", icon: "cloud_download", action: gitPull },
        { id: "git_history", label: "Git History", icon: "history", action: showGitHistory },
        { id: "validate_yaml", label: "Validate YAML", icon: "check_circle", action: () => { if (state.activeTab) validateYaml(state.activeTab.content); } },
        { id: "restart_ha", label: "Restart Home Assistant", icon: "restart_alt", action: restartHomeAssistant },
        { id: "toggle_sidebar", label: "Toggle Sidebar", icon: "menu", shortcut: "Ctrl+B", action: toggleSidebar },
        { id: "shortcuts", label: "Show Keyboard Shortcuts", icon: "keyboard", action: showShortcuts },
        { id: "settings", label: "Settings", icon: "settings", action: showAppSettings },
        { id: "report_issue", label: "Report Issue", icon: "bug_report", action: reportIssue },
        { id: "request_feature", label: "Request Feature", icon: "lightbulb", action: requestFeature },
        { id: "clean_git_locks", label: "Clean Git Lock Files", icon: "delete_sweep", action: async () => {
            if (!confirm("Are you sure you want to clean Git lock files? This can fix stuck operations.")) return;
            try {
                const res = await fetchWithAuth(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "git_clean_locks" }) });
                if (res.success) showToast(res.message, "success"); else showToast("Failed to clean locks: " + res.message, "error");
            } catch (e) { showToast("Error: " + e.message, "error"); }
        }},
        { id: "copy_path", label: "Copy Current File Path", icon: "content_copy", action: () => {
            if (state.activeTab) { copyToClipboard(state.activeTab.path); showToast("Path copied to clipboard", "success"); }
        }},
        { id: "download_file", label: "Download Current File", icon: "download", action: () => {
            if (state.activeTab) downloadFileByPath(state.activeTab.path);
        }},
        { id: "toggle_word_wrap", label: "Toggle Word Wrap", icon: "wrap_text", action: () => {
            state.wordWrap = !state.wordWrap;
            if (state.editor) state.editor.setOption('lineWrapping', state.wordWrap);
            saveSettings();
            showToast(`Word wrap ${state.wordWrap ? "enabled" : "disabled"}`, "info");
        }},
        { id: "fold_all", label: "Fold All", icon: "unfold_less", action: () => { if (state.editor) state.editor.execCommand("foldAll"); } },
        { id: "unfold_all", label: "Unfold All", icon: "unfold_more", action: () => { if (state.editor) state.editor.execCommand("unfoldAll"); } },
        { id: "close_others", label: "Close Other Tabs", icon: "close_fullscreen", action: () => { if (state.activeTab) { const tabs = state.openTabs.filter(t => t !== state.activeTab); tabs.forEach(t => closeTab(t)); } } },
        { id: "close_saved", label: "Close Saved Tabs", icon: "save", action: () => { if (state.activeTab) { const tabs = state.openTabs.filter(t => !t.modified && t !== state.activeTab); tabs.forEach(t => closeTab(t)); } } },
        { id: "theme_light", label: "Switch to Light Theme", icon: "light_mode", action: () => setTheme("light") },
        { id: "theme_dark", label: "Switch to Dark Theme", icon: "dark_mode", action: () => setTheme("dark") },
        { id: "theme_auto", label: "Switch to Auto Theme", icon: "brightness_auto", action: () => setTheme("auto") },
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commands];

    const overlay = elements.commandPaletteOverlay;
    const input = elements.commandPaletteInput;
    const results = elements.commandPaletteResults;

    const renderResults = () => {
        results.innerHTML = filteredCommands.map((cmd, index) => `
            <div class="command-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
                <div class="command-item-label">
                    <span class="material-icons command-item-icon">${cmd.icon}</span>
                    <span>${cmd.label}</span>
                </div>
                ${cmd.shortcut ? `<span class="command-item-shortcut">${cmd.shortcut}</span>` : ''}
            </div>
        `).join("");

        const selectedItem = results.querySelector(".command-item.selected");
        if (selectedItem) selectedItem.scrollIntoView({ block: "nearest" });
    };

    const cleanup = () => {
        overlay.classList.remove("visible");
        window.removeEventListener("keydown", handleKeyDown, true);
        overlay.onclick = null;
        input.oninput = null;
        results.onclick = null;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            cleanup();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            e.stopPropagation();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderResults();
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderResults();
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            const cmd = filteredCommands[selectedIndex];
            if (cmd) {
                cleanup();
                setTimeout(() => cmd.action(), 50);
            }
        }
    };

    input.value = "";
    filteredCommands = [...commands];
    selectedIndex = 0;
    renderResults();

    overlay.classList.add("visible");
    setTimeout(() => input.focus(), 10);

    input.oninput = () => {
        const query = input.value.toLowerCase().trim();
        filteredCommands = commands.filter(cmd => 
            cmd.label.toLowerCase().includes(query)
        );
        selectedIndex = 0;
        renderResults();
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) cleanup();
    };

    results.onclick = (e) => {
        const item = e.target.closest(".command-item");
        if (item) {
            const index = parseInt(item.getAttribute("data-index"));
            const cmd = filteredCommands[index];
            if (cmd) {
                cleanup();
                setTimeout(() => cmd.action(), 50);
            }
        }
    };

    window.addEventListener("keydown", handleKeyDown, true);
  }

  // Save git remote
export async function saveGitRemote() {
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
export async function saveGitCredentials() {
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
export async function testGitConnection() {
    await gitTestConnection();
  }

  // ============================================
  // File Operations UI
  // ============================================

export function showInputModal({ title, placeholder, value, hint, confirmText }) {
    return new Promise((resolve) => {
        resetModalToDefault(); // Ensure DOM structure is correct
        
        elements.modalTitle.textContent = title;
        if (elements.modalHint) elements.modalHint.textContent = hint || "";
        
        // Setup Input
        if (elements.modalInput) {
            elements.modalInput.value = value || "";
            elements.modalInput.placeholder = placeholder || "";
            elements.modalInput.style.display = "block";
        }
        
        // Setup Buttons
        elements.modalConfirm.textContent = confirmText || "Confirm";
        elements.modalConfirm.className = "modal-btn primary";
        elements.modalCancel.textContent = "Cancel";

        // Show Modal
        elements.modalOverlay.classList.add("visible");
        
        // Focus Input
        setTimeout(() => {
            if (elements.modalInput) {
                elements.modalInput.focus();
                if (elements.modalInput.value) {
                    const len = elements.modalInput.value.length;
                    elements.modalInput.setSelectionRange(len, len);
                }
            }
        }, 100);

        // Handlers
        const cleanup = () => {
            elements.modalOverlay.classList.remove("visible");
            elements.modalConfirm.removeEventListener("click", handleConfirm);
            elements.modalCancel.removeEventListener("click", handleCancel);
            elements.modalClose.removeEventListener("click", handleCancel);
            
            // Remove Enter key listener added by resetModalToDefault to avoid dupes/conflicts
            // Actually resetModalToDefault adds one that calls confirmModal(). 
            // We should override/replace it or let confirmModal work?
            // confirmModal() reads elements.modalInput.value.
            // Let's rely on our own handlers for this scoped promise.
            
            // To be safe, we clone the input to strip old listeners or just manage ours carefully.
            // But resetModalToDefault already added one.
            // Let's just use the buttons. The global Enter listener might trigger confirmModal
            // which likely does something global? 
            // Let's check confirmModal implementation later. For now, assume button click is primary.
        };

        const handleConfirm = () => {
            const result = elements.modalInput ? elements.modalInput.value : "";
            cleanup();
            resolve(result);
        };

        const handleCancel = () => {
            cleanup();
            resolve(null);
        };

        elements.modalConfirm.addEventListener("click", handleConfirm);
        elements.modalCancel.addEventListener("click", handleCancel);
        elements.modalClose.addEventListener("click", handleCancel);
        
        // Override the global Enter key behavior for this specific modal instance
        if (elements.modalInput) {
             elements.modalInput.onkeydown = (e) => {
                if (e.key === "Enter") {
                    e.stopPropagation(); // Prevent global handler
                    handleConfirm();
                } else if (e.key === "Escape") {
                    e.stopPropagation();
                    handleCancel();
                }
             };
        }
    });
}

export async function promptNewFile(initialPath = null) {
    // Use provided path or fall back to state
    const basePath = initialPath !== null ? initialPath : (state.currentFolderPath || "");
    const defaultValue = basePath ? `${basePath}/` : "";

    const result = await showInputModal({
      title: "New File",
      placeholder: "filename.yaml",
      value: defaultValue,
      hint: "Enter the full path (e.g., automations/my_light.yaml)",
    });

    if (result) {
      if (result === basePath || result.endsWith("/")) {
          showToast("Please enter a file name", "warning");
          return;
      }

      let fullPath = result;
      
      // Auto-append .yaml if no extension is present
      const parts = fullPath.split('/');
      const fileName = parts[parts.length - 1];
      if (fileName.indexOf('.') === -1) {
        fullPath += ".yaml";
      }

      await createFile(fullPath);
    }
  }

export async function promptNewFolder(initialPath = null) {
    // Use provided path or fall back to state
    const basePath = initialPath !== null ? initialPath : (state.currentFolderPath || "");
    const defaultValue = basePath ? `${basePath}/` : "";
    
    const result = await showInputModal({
      title: "New Folder",
      placeholder: "folder_name",
      value: defaultValue,
      hint: "Enter the full path (e.g., config/my_folder)",
    });

    if (result) {
      if (result === basePath || result.endsWith("/")) {
          showToast("Please enter a folder name", "warning");
          return;
      }
      // Result is the full path since we pre-filled it
      await createFolder(result);
    }
  }

export async function promptRename(path, isFolder) {
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

export async function promptCopy(path, isFolder) {
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

export async function duplicateItem(path, isFolder) {
    const currentName = path.split("/").pop();
    const parentPath = path.split("/").slice(0, -1).join("/");
    
    let newName = "";
    let counter = 1;
    let baseName = currentName;
    let ext = "";

    if (!isFolder && currentName.includes(".")) {
        const parts = currentName.split(".");
        ext = "." + parts.pop();
        baseName = parts.join(".");
    }

    // Find a unique name
    while (true) {
        const suffix = counter === 1 ? "_copy" : `_copy_${counter}`;
        newName = `${baseName}${suffix}${ext}`;
        const newPath = parentPath ? `${parentPath}/${newName}` : newName;
        
        const exists = isFolder 
            ? state.folders.some(f => f.path === newPath)
            : state.files.some(f => f.path === newPath);
        
        if (!exists) break;
        counter++;
        if (counter > 100) {
            showToast("Could not generate a unique name", "error");
            return;
        }
    }

    const newPath = parentPath ? `${parentPath}/${newName}` : newName;
    await copyItem(path, newPath);
}

export async function promptDelete(path, isFolder) {
    const name = path.split("/").pop();
    const result = await showConfirmDialog({
      title: isFolder ? "Delete Folder?" : "Delete File?",
      message: `Are you sure you want to delete <b>${name}</b>?${isFolder ? "<br><br>This will permanently delete the folder and all its contents." : ""}`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDanger: true,
    });

    if (result) {
      await deleteItem(path);
    }
  }

  // ============================================
  // File Tree Rendering
  // ============================================

  // Content Search Logic
export let contentSearchTimer = null;

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

        if (results && Array.isArray(results)) {
            // Store matching paths in a Set for O(1) lookup
            state.contentSearchResults = new Set(results.map(r => r.path));
            
            // Auto-expand folders that contain matches
            if (state.contentSearchResults.size > 0 && state.contentSearchResults.size < 50) {
                results.forEach(r => {
                    const parts = r.path.split("/");
                    let currentPath = "";
                    for (let i = 0; i < parts.length - 1; i++) {
                        currentPath += (i > 0 ? "/" : "") + parts[i];
                        state.expandedFolders.add(currentPath);
                    }
                });
            }
        } else {
            state.contentSearchResults = new Set();
        }
    } catch (e) {
        console.error("Content search failed", e);
        state.contentSearchResults = new Set();
    } finally {
        if (elements.fileSearch) elements.fileSearch.style.opacity = "1";
        renderFileTree();
    }
  }

export function renderFileTree() {
    if (!elements.fileTree) return;
    renderRecentFilesPanel(); // Call to render recent files
    renderFavoritesPanel();  // Render favorites next
    elements.fileTree.innerHTML = "";
    renderTreeLevel(state.fileTree, elements.fileTree, 0);
    updateToggleAllButton(); // Update the button state
  }

export function renderTreeLevel(tree, container, depth) {
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
        showContextMenu(e.clientX, e.clientY, { path: folderPath, isFolder: true });
      });

      container.appendChild(item);

      if (isExpanded) {
        renderTreeLevel(folderData, container, depth + 1);
      }
    });

    // Render files
    files.forEach((file) => {
      if (state.contentSearchEnabled && state.contentSearchResults) {
          if (!state.contentSearchResults.has(file.path)) return;
      } else if (query && !file.name.toLowerCase().includes(query)) {
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
            if (state.selectionMode) toggleSelectionMode();
            await loadFiles(true);
            
            // Refresh git status if enabled
            await checkGitStatusIfEnabled();
        } catch (error) {
            hideGlobalLoading();
            showToast("Failed to move items: " + error.message, "error");
        }
    }
}

export async function handleFileDrop(sourcePath, targetFolder) {
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

export function folderMatchesSearch(folder, query) {
    // Content Search Mode
    if (state.contentSearchEnabled && state.contentSearchResults) {
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

export function createTreeItem(name, depth, isFolder, isExpanded, itemPath = null) {
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

export function handleDragLeave(e) {
    const item = e.currentTarget.closest(".tree-item");
    if (item) {
        item.classList.remove("drag-over");
    } else if (e.currentTarget === elements.fileTree) {
        elements.fileTree.classList.remove("drag-over-root");
    }
  }

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
        await processUploads(e.dataTransfer.files, targetFolder);
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

export function toggleFolder(path) {
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

export async function openFile(path, forceReload = false, noActivate = false) {
    const filename = path.split("/").pop();
    const ext = filename.split(".").pop().toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext);
    const isPdf = ext === "pdf";
    const isBinary = !isTextFile(path);

    // If it's a binary file that's not an image or PDF, just download it
    if (isBinary && !isImage && !isPdf) {
      showToast(`Downloading ${filename}...`, "info");
      downloadFileByPath(path);
      return;
    }

    let tab = state.openTabs.find((t) => t.path === path);

    if (tab && forceReload) {
        // If this is the active tab, preserve cursor/scroll from editor before reload
        if (state.activeTab === tab && state.editor && !tab.isBinary) {
            tab.cursor = state.editor.getCursor();
            tab.scroll = state.editor.getScrollInfo();
        }

        try {
            const data = await loadFile(path);
            tab.content = data.content;
            tab.originalContent = data.content;
            tab.mtime = data.mtime;
            tab.modified = false;
            tab.history = null; 
        } catch (e) {
            console.error("Failed to reload file content", e);
        }
    } else if (!tab) {
      try {
        const data = await loadFile(path);
        const content = data.content;

        tab = {
          path,
          content,
          originalContent: content,
          mtime: data.mtime,
          modified: false,
          history: null,
          cursor: null,
          scroll: null,
          isBinary: isBinary,
          isImage: isImage,
          isPdf: isPdf,
          mimeType: data.mime_type
        };
        state.openTabs.push(tab);
      } catch (error) {
        showToast(`Failed to open ${filename}: ${error.message}`, "error");
        return;
      }
    }

    // Update recent files
    state.recentFiles = state.recentFiles.filter(p => p !== path); // Remove if already exists
    state.recentFiles.unshift(path); // Add to the beginning
    const limit = state.recentFilesLimit || MAX_RECENT_FILES;
    if (state.recentFiles.length > limit) {
      state.recentFiles.pop(); // Trim to max size
    }

    if (noActivate) return tab;

    activateTab(tab, forceReload);
    renderTabs();
    renderFileTree();
    saveSettings(); // To save recent files
  }

export function activateTab(tab, skipSave = false) {
    // Hide welcome screen
    if (elements.welcomeScreen) {
      elements.welcomeScreen.style.display = "none";
    }

    // Save current tab state before switching (only for text files)
    if (!skipSave && state.activeTab && state.editor && !state.activeTab.isBinary) {
      state.activeTab.content = state.editor.getValue();
      state.activeTab.history = state.editor.getHistory();
      state.activeTab.cursor = state.editor.getCursor();
      state.activeTab.scroll = state.editor.getScrollInfo();
    }

    state.activeTab = tab;

    // Handle Binary Preview
    if (tab.isBinary) {
        if (state.editor) {
            state.editor.getWrapperElement().style.display = "none";
        }
        if (elements.assetPreview) {
            elements.assetPreview.classList.add("visible");
            renderAssetPreview(tab);
        }
    } else {
        // Handle Text Editor
        if (elements.assetPreview) {
            elements.assetPreview.classList.remove("visible");
            elements.assetPreview.innerHTML = "";
        }
        
        // Create editor if it doesn't exist
        if (!state.editor) {
          createEditor();
        }
        
        state.editor.getWrapperElement().style.display = "block";

        // Update editor content and settings
        const mode = getEditorMode(tab.path);

        // Try to set the mode, fall back to yaml if ha-yaml fails
        try {
          state.editor.setOption("mode", mode);
        } catch (error) {
          console.error("Error setting editor mode:", error);
          if (mode === "ha-yaml") {
            state.editor.setOption("mode", "yaml");
          }
        }

        const isReadOnly = tab.path.endsWith(".gitignore") || tab.path.endsWith(".lock");
        state.editor.setOption("readOnly", isReadOnly);
        state.editor.setOption("lint", (mode === "ha-yaml" || mode === "yaml") ? { getAnnotations: yamlLinter, async: true } : false);

        // Dynamic Indent Detection
        const indent = detectIndentation(tab.content);
        state.editor.setOption("indentWithTabs", indent.tabs);
        state.editor.setOption("indentUnit", indent.size);
        state.editor.setOption("tabSize", indent.size);

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
    }

    debouncedRenderFileTree();
    updateToolbarState();
    updateStatusBar();

    // Show/hide Markdown group
    if (elements.groupMarkdown) {
        elements.groupMarkdown.style.display = tab.path.endsWith(".md") ? "flex" : "none";
        elements.btnMarkdownPreview?.classList.remove("active");
    }

    if (elements.filePath) {
      elements.filePath.textContent = tab.path;
    }

    // Update breadcrumb navigation
    updateBreadcrumb(tab.path);

    // Update current folder path
    state.currentFolderPath = tab.path.split("/").slice(0, -1).join("/");

    // Save state after switching
    saveSettings();
  }

function renderAssetPreview(tab) {
    if (!elements.assetPreview) return;
    
    const filename = tab.path.split("/").pop();
    
    if (tab.isImage) {
        // Calculate neighbors
        const currentDir = tab.path.substring(0, tab.path.lastIndexOf("/"));
        const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg", ".ico"];
        
        // Filter files in the same directory that are images
        const imageFiles = state.files
            .filter(f => {
                const fDir = f.path.substring(0, f.path.lastIndexOf("/"));
                const ext = "." + f.name.split(".").pop().toLowerCase();
                return fDir === currentDir && imageExtensions.includes(ext);
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}));

        const currentIndex = imageFiles.findIndex(f => f.path === tab.path);
        const prevImage = currentIndex > 0 ? imageFiles[currentIndex - 1] : null;
        const nextImage = currentIndex < imageFiles.length - 1 ? imageFiles[currentIndex + 1] : null;

        elements.assetPreview.style.padding = "0";
        const dataUrl = `data:${tab.mimeType};base64,${tab.content}`;
        
        elements.assetPreview.innerHTML = `
            <div class="image-viewer-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--bg-tertiary);">
                <div class="pdf-toolbar" style="padding: 8px 16px; background: var(--bg-secondary); border-bottom: 1px solid var(--borderColor); display: flex; justify-content: space-between; align-items: center; height: 48px; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons" style="color: var(--accent-color);">image</span>
                        <span style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${filename}</span>
                        <span style="color: var(--text-secondary); font-size: 12px; margin-left: 8px;">${tab.mimeType}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <button id="img-prev" class="toolbar-btn" title="Previous Image" ${!prevImage ? 'disabled style="opacity: 0.5; cursor: default;"' : ''}>
                                <span class="material-icons">chevron_left</span>
                            </button>
                            <span style="font-size: 13px; color: var(--text-secondary); min-width: 60px; text-align: center;">${currentIndex + 1} / ${imageFiles.length}</span>
                            <button id="img-next" class="toolbar-btn" title="Next Image" ${!nextImage ? 'disabled style="opacity: 0.5; cursor: default;"' : ''}>
                                <span class="material-icons">chevron_right</span>
                            </button>
                        </div>
                        <div style="width: 1px; height: 24px; background: var(--borderColor);"></div>
                        <button id="img-download" class="toolbar-btn" title="Download Image">
                            <span class="material-icons">download</span>
                        </button>
                    </div>
                </div>
                <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 20px; background: var(--bg-primary);">
                    <div style="position: relative; max-width: 100%; max-height: 100%;">
                        <img src="${dataUrl}" alt="${filename}" style="max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.3); background-image: linear-gradient(45deg, var(--bg-secondary) 25%, transparent 25%), linear-gradient(-45deg, var(--bg-secondary) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--bg-secondary) 75%), linear-gradient(-45deg, transparent 75%, var(--bg-secondary) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
                    </div>
                </div>
            </div>
        `;

        if (prevImage) {
            document.getElementById("img-prev").addEventListener("click", () => {
                openFile(prevImage.path);
            });
        }
        
        if (nextImage) {
            document.getElementById("img-next").addEventListener("click", () => {
                openFile(nextImage.path);
            });
        }

        document.getElementById("img-download").addEventListener("click", async () => {
            const token = await getAuthToken();
            const downloadUrl = `${API_BASE}?action=serve_file&path=${encodeURIComponent(tab.path)}&access_token=${token}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            a.click();
        });
        
        // Keyboard navigation
        const handleKeyNav = (e) => {
            if (!document.body.contains(elements.assetPreview)) {
                document.removeEventListener("keydown", handleKeyNav);
                return;
            }
            if (e.key === "ArrowLeft" && prevImage) openFile(prevImage.path);
            if (e.key === "ArrowRight" && nextImage) openFile(nextImage.path);
        };
        // Remove any existing listener to prevent duplicates (though renderAssetPreview is called once per tab switch)
        // A better way is to attach it to the tab or ensure cleanup, but for now simple attachment works as switching tabs re-renders
        document.addEventListener("keydown", handleKeyNav, { once: true });

    } else if (tab.isPdf) {
        elements.assetPreview.style.padding = "0";
        
        const binaryString = atob(tab.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Setup PDF.js
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        elements.assetPreview.innerHTML = `
            <div class="pdf-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--bg-tertiary);">
                <div class="pdf-toolbar" style="padding: 8px 16px; background: var(--bg-secondary); border-bottom: 1px solid var(--borderColor); display: flex; justify-content: space-between; align-items: center; height: 48px; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons" style="color: var(--error-color);">picture_as_pdf</span>
                        <span style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${filename}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 13px;">
                            <button id="pdf-prev" class="toolbar-btn" style="min-width: 32px; height: 32px; padding: 0;"><span class="material-icons">chevron_left</span></button>
                            <span>Page <span id="pdf-page-num">1</span> / <span id="pdf-page-count">-</span></span>
                            <button id="pdf-next" class="toolbar-btn" style="min-width: 32px; height: 32px; padding: 0;"><span class="material-icons">chevron_right</span></button>
                        </div>
                        <div style="width: 1px; height: 24px; background: var(--borderColor);"></div>
                        <button id="btn-download-pdf" class="toolbar-btn" title="Download"><span class="material-icons">download</span></button>
                    </div>
                </div>
                <div id="pdf-viewer-viewport" style="flex-grow: 1; overflow: auto; display: flex; justify-content: center; align-items: flex-start; padding: 20px; background: var(--bg-primary);">
                    <canvas id="pdf-canvas" style="box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 100%; height: auto; display: block;"></canvas>
                </div>
            </div>
        `;

        let pdfDoc = null;
        let pageNum = 1;
        let pageRendering = false;
        let pageNumPending = null;
        const scale = 1.5;
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');

        async function renderPage(num) {
            pageRendering = true;
            const page = await pdfDoc.getPage(num);
            const dpr = window.devicePixelRatio || 1;
            const viewport = page.getViewport({ scale: scale * dpr });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Set display size
            const styleViewport = page.getViewport({ scale });
            canvas.style.width = styleViewport.width + 'px';
            canvas.style.height = styleViewport.height + 'px';

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);

            await renderTask.promise;
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            document.getElementById('pdf-page-num').textContent = num;
        }

        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        // Load PDF
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        loadingTask.promise.then(pdf => {
            pdfDoc = pdf;
            document.getElementById('pdf-page-count').textContent = pdf.numPages;
            renderPage(pageNum);
        }).catch(err => {
            console.error('PDF.js error:', err);
            elements.assetPreview.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--error-color);">Failed to load PDF: ${err.message}</div>`;
        });

        document.getElementById('pdf-prev').addEventListener('click', () => {
            if (pageNum <= 1) return;
            pageNum--;
            queueRenderPage(pageNum);
        });

        document.getElementById('pdf-next').addEventListener('click', () => {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            queueRenderPage(pageNum);
        });

        document.getElementById("btn-download-pdf")?.addEventListener("click", async () => {
            const token = await getAuthToken();
            const downloadUrl = `${API_BASE}?action=serve_file&path=${encodeURIComponent(tab.path)}&access_token=${token}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            a.click();
        });
    }
}

export function toggleMarkdownPreview() {
    if (!state.activeTab || !state.activeTab.path.endsWith(".md")) return;
    
    const isPreview = elements.btnMarkdownPreview.classList.toggle("active");
    
    if (isPreview) {
        // Show Preview
        if (state.editor) {
            state.editor.getWrapperElement().style.display = "none";
        }
        if (elements.assetPreview) {
            elements.assetPreview.classList.add("visible");
            const content = state.editor ? state.editor.getValue() : state.activeTab.content;
            elements.assetPreview.innerHTML = `<div class="markdown-body">${renderMarkdown(content)}</div>`;
        }
    } else {
        // Show Editor
        if (elements.assetPreview) {
            elements.assetPreview.classList.remove("visible");
            elements.assetPreview.innerHTML = "";
        }
        if (state.editor) {
            state.editor.getWrapperElement().style.display = "block";
            state.editor.refresh();
            state.editor.focus();
        }
    }
}

function renderMarkdown(text) {
    if (!text) return "";
    
    let html = text
        // Headers
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
        // Italic
        .replace(/\*(.*)\*/g, '<i>$1</i>')
        // Blockquotes
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        // Unordered lists
        .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\n<ul>/g, '') // Fix adjacent lists
        // Ordered lists
        .replace(/^\d\. (.*$)/gm, '<ol><li>$1</li></ol>')
        .replace(/<\/ol>\n<ol>/g, '') // Fix adjacent lists
        // Inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Horizontal rules
        .replace(/^---$/gm, '<hr>')
        // Paragraphs (last step)
        .replace(/^\s*(\n)?(.+)/gm, (m, n, p) => {
            return p.startsWith('<') ? m : `<p>${p}</p>`;
        });

    return html;
}

export function detectIndentation(content) {
    if (!content) return { tabs: false, size: 2 };

    const lines = content.split("\n").slice(0, 100); // Check first 100 lines
    let tabs = 0;
    let spaces = 0;
    const spaceCounts = {};

    lines.forEach(line => {
        const indentMatch = line.match(/^(\s+)/);
        if (indentMatch) {
            const indent = indentMatch[1];
            if (indent.includes("\t")) {
                tabs++;
            } else {
                // Ignore lines that are just whitespace
                if (indent.length === line.length) return;
                
                spaces++;
                const count = indent.length;
                if (count > 0) {
                    spaceCounts[count] = (spaceCounts[count] || 0) + 1;
                }
            }
        }
    });

    if (tabs > spaces) {
        return { tabs: true, size: 4 }; // Default tab size 4
    }

    // Find most common indentation jump
    let bestSize = 2;
    let maxFreq = 0;
    for (const [size, freq] of Object.entries(spaceCounts)) {
        if (freq > maxFreq) {
            maxFreq = freq;
            bestSize = parseInt(size);
        }
    }

    // Heuristic: If we detected mostly 4, 8, 12... assume 4.
    // If we detect 2, 4, 6... assume 2.
    // Since 4 is also a multiple of 2, this is tricky.
    // But usually simple frequency is enough.

    // Home Assistant standard is 2, so if it's 0 or weird, default to 2
    return { tabs: false, size: bestSize || 2 };
}

  // ============================================
  // Breadcrumb Navigation
  // ============================================

export function updateBreadcrumb(path) {
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

export function expandFolderInTree(folderPath) {
    // This will expand the folder in the file tree
    // The folder is already rendered, we just need to expand it
    const folderElement = document.querySelector(`[data-path="${folderPath}"]`);
    if (folderElement && folderElement.classList.contains("tree-item")) {
      // Trigger click on the folder to expand it
      folderElement.click();
    }
  }

export function handleEditorChange() {
    if (!state.activeTab || !state.editor) return;

    const currentContent = state.editor.getValue();
    state.activeTab.content = currentContent;
    state.activeTab.modified = currentContent !== state.activeTab.originalContent;
    updateToolbarState();
    renderTabs();
    renderFileTree();
    
    // Handle auto-save
    if (state.autoSave && state.activeTab.modified) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer
      autoSaveTimer = setTimeout(() => {
        // Double-check state before saving
        if (state.autoSave && state.activeTab && state.activeTab.modified) {
          saveCurrentFile(true); // true = isAutoSave
        }
      }, state.autoSaveDelay);
    } else if (autoSaveTimer) {
      // If auto-save disabled OR not modified, clear any pending timer
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

export function selectNextOccurrence(cm) {
    const selections = cm.listSelections();
    if (selections.length === 0) return;

    // Use the last selection (the most recently added one) as the reference
    const lastSelection = selections[selections.length - 1];
    
    // If text is not selected, select the word under cursor
    if (lastSelection.empty()) {
      const word = cm.findWordAt(lastSelection.head);
      // Replace the last empty cursor with the word selection
      const newSelections = selections.slice(0, -1);
      newSelections.push({ anchor: word.anchor, head: word.head });
      cm.setSelections(newSelections);
      return;
    }

    // Get the selection range ordered (important for getRange)
    const anchor = lastSelection.anchor;
    const head = lastSelection.head;
    const isHeadAfterAnchor = (head.line > anchor.line || (head.line === anchor.line && head.ch > anchor.ch));
    const from = isHeadAfterAnchor ? anchor : head;
    const to = isHeadAfterAnchor ? head : anchor;

    // Get the text to match
    const query = cm.getRange(from, to);
    if (!query) return;

    // Check if searchcursor addon is loaded
    if (!cm.getSearchCursor) {
        console.warn("CodeMirror searchcursor addon not loaded");
        return;
    }

    // Find next occurrence starting from the end of the last selection
    const cursor = cm.getSearchCursor(query, to, { caseFold: false });
    
    if (cursor.findNext()) {
      cm.addSelection(cursor.from(), cursor.to());
      cm.scrollIntoView(cursor.to(), 20);
    }
  }

function moveLines(cm, direction) {
    cm.operation(() => {
        const range = cm.listSelections()[0];
        const startLine = Math.min(range.head.line, range.anchor.line);
        const endLine = Math.max(range.head.line, range.anchor.line);
        
        if (direction === -1) { // Up
            if (startLine === 0) return;
            const textToMove = cm.getRange({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
            const textAbove = cm.getLine(startLine - 1);
            
            cm.replaceRange(textToMove + "\n" + textAbove, 
                {line: startLine - 1, ch: 0}, 
                {line: endLine, ch: cm.getLine(endLine).length}
            );
            
            cm.setSelection(
                {line: range.anchor.line - 1, ch: range.anchor.ch},
                {line: range.head.line - 1, ch: range.head.ch}
            );
        } else { // Down
            if (endLine === cm.lastLine()) return;
            const textToMove = cm.getRange({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
            const textBelow = cm.getLine(endLine + 1);
            
            cm.replaceRange(textBelow + "\n" + textToMove, 
                {line: startLine, ch: 0}, 
                {line: endLine + 1, ch: cm.getLine(endLine + 1).length}
            );
            
            cm.setSelection(
                {line: range.anchor.line + 1, ch: range.anchor.ch},
                {line: range.head.line + 1, ch: range.head.ch}
            );
        }
    });
}

function duplicateLines(cm, direction) {
    cm.operation(() => {
        const range = cm.listSelections()[0];
        const startLine = Math.min(range.head.line, range.anchor.line);
        const endLine = Math.max(range.head.line, range.anchor.line);
        const text = cm.getRange({line: startLine, ch: 0}, {line: endLine, ch: cm.getLine(endLine).length});
        
        if (direction === "up") {
            cm.replaceRange(text + "\n", {line: startLine, ch: 0});
            const lineCount = endLine - startLine + 1;
            cm.setSelection(
                {line: range.anchor.line + lineCount, ch: range.anchor.ch},
                {line: range.head.line + lineCount, ch: range.head.ch}
            );
        } else { // Down
            cm.replaceRange("\n" + text, {line: endLine, ch: cm.getLine(endLine).length});
        }
    });
}

export function createEditor() {
    const wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    wrapper.id = "codemirror-wrapper";
    elements.editorContainer.appendChild(wrapper);

    const effectiveTheme = getEffectiveTheme();
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
        "Ctrl-D": (cm) => selectNextOccurrence(cm),
        "Cmd-D": (cm) => selectNextOccurrence(cm),
        "Ctrl-F": () => openSearchWidget(false),
        "Cmd-F": () => openSearchWidget(false),
        "Ctrl-H": () => openSearchWidget(true),
        "Cmd-Option-F": () => openSearchWidget(true),
        "Ctrl-K": () => showCommandPalette(),
        "Cmd-K": () => showCommandPalette(),
        "Ctrl-G": () => state.editor.execCommand("jumpToLine"),
        "Cmd-G": () => state.editor.execCommand("jumpToLine"),
        "Ctrl-/": () => state.editor.execCommand("toggleComment"),
        "Cmd-/": () => state.editor.execCommand("toggleComment"),
        // Line Operations
        "Alt-Up": (cm) => moveLines(cm, -1),
        "Alt-Down": (cm) => moveLines(cm, 1),
        "Shift-Ctrl-Up": (cm) => moveLines(cm, -1),
        "Shift-Cmd-Up": (cm) => moveLines(cm, -1),
        "Shift-Ctrl-Down": (cm) => moveLines(cm, 1),
        "Shift-Cmd-Down": (cm) => moveLines(cm, 1),
        "Shift-Alt-Up": (cm) => duplicateLines(cm, "up"),
        "Shift-Alt-Down": (cm) => duplicateLines(cm, "down"),
        "Ctrl-Alt-Up": (cm) => duplicateLines(cm, "up"),
        "Cmd-Alt-Up": (cm) => duplicateLines(cm, "up"),
        "Ctrl-Alt-Down": (cm) => duplicateLines(cm, "down"),
        "Cmd-Alt-Down": (cm) => duplicateLines(cm, "down"),
        
        "Ctrl-Alt-[": (cm) => cm.execCommand("foldAll"),
        "Cmd-Alt-[": (cm) => cm.execCommand("foldAll"),
        "Ctrl-Alt-]": (cm) => cm.execCommand("unfoldAll"),
        "Cmd-Alt-]": (cm) => cm.execCommand("unfoldAll"),

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
    
    // Apply font settings
    applyEditorSettings();

    // Aggressive Global Capture Listener for Shortcuts (Move/Duplicate Lines)
    const handleGlobalShortcuts = (e) => {
        if (!state.editor || !state.editor.hasFocus()) return;

        const isUp = e.key === "ArrowUp" || e.keyCode === 38;
        const isDown = e.key === "ArrowDown" || e.keyCode === 40;
        
        if (!isUp && !isDown) return;

        let handled = false;

        // Move Line: Alt/Option + Arrow
        if (e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
             moveLines(state.editor, isUp ? -1 : 1);
             handled = true;
        }
        
        // Duplicate Line: Shift + Alt/Option + Arrow
        else if (e.altKey && e.shiftKey && !e.metaKey && !e.ctrlKey) {
             duplicateLines(state.editor, isUp ? "up" : "down");
             handled = true;
        }

        // Backup: Cmd + Shift + Arrow (Mac override)
        else if (e.metaKey && e.shiftKey) {
             moveLines(state.editor, isUp ? -1 : 1);
             handled = true;
        }

        if (handled) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };

    // Remove previous listener if exists
    if (state._globalShortcutHandler) {
        window.removeEventListener("keydown", state._globalShortcutHandler, true);
    }
    state._globalShortcutHandler = handleGlobalShortcuts;
    window.addEventListener("keydown", handleGlobalShortcuts, true);

    // Track changes
    state.editor.on("change", handleEditorChange);

    // Track cursor position
    state.editor.on("cursorActivity", () => {
      updateStatusBar();

      // Debounce saving workspace state (cursor/scroll)
      if (state.rememberWorkspace) {
        if (workspaceSaveTimer) clearTimeout(workspaceSaveTimer);
        workspaceSaveTimer = setTimeout(() => saveSettings(), 2000);
      }
    });

    state.editor.on("scroll", () => {
      if (state.rememberWorkspace) {
        if (workspaceSaveTimer) clearTimeout(workspaceSaveTimer);
        workspaceSaveTimer = setTimeout(() => saveSettings(), 2000);
      }
    });

    // Block Scope Highlighting Logic
    let highlightedLines = [];

    const clearBlockHighlight = () => {
        highlightedLines.forEach(lh => {
            state.editor.removeLineClass(lh, "wrap", "cm-block-highlight-line");
            state.editor.removeLineClass(lh, "wrap", "cm-block-highlight-start");
            state.editor.removeLineClass(lh, "wrap", "cm-block-highlight-end");
        });
        highlightedLines = [];
        if (state.editor) {
            state.editor.getWrapperElement().style.removeProperty("--block-indent");
        }
    };

    state.editor.on("mousedown", (cm, e) => {
        // Clear existing on any click
        if (highlightedLines.length > 0) {
            clearBlockHighlight();
        }

        // Only handle left clicks
        if (e.button !== 0) return;

        const pos = cm.coordsChar({left: e.clientX, top: e.clientY});
        if (!pos) return;
        
        const lineText = cm.getLine(pos.line);
        
        // Robust detection: Any line that looks like a key definition (e.g. "key:", "- key:", "  key:")
        // We ignore comments
        if (lineText.trim().startsWith("#")) return;

        const isKeyLine = /^\s*(- )?[\w_]+:/.test(lineText);

        if (isKeyLine) {
            const lineNum = pos.line;
            
            // Calculate base indentation
            // If it starts with "- ", the block content aligns with the text, not the dash.
            // But for scope calculation, we just want to find lines DEEPER than the current line's start.
            const indentMatch = lineText.match(/^\s*/);
            const baseIndent = indentMatch ? indentMatch[0].length : 0;
            
            const totalLines = cm.lineCount();
            let endLine = lineNum;
            
            // Find scope
            for (let i = lineNum + 1; i < totalLines; i++) {
                const nextLineText = cm.getLine(i);
                
                if (nextLineText.trim().length === 0) {
                    if (i < totalLines - 1) continue; 
                    else break;
                }
                
                const nextIndentMatch = nextLineText.match(/^\s*/);
                const nextIndent = nextIndentMatch ? nextIndentMatch[0].length : 0;
                
                // Block continues if:
                // 1. Indentation is deeper (standard child)
                // 2. Indentation is same, BUT the next line is a list item ("- ") and the current block header wasn't a list item
                //    This handles cases like:
                //    triggers:
                //    - entity_id: ...
                const isNextListItem = /^\s*- /.test(nextLineText);
                const startIsListItem = /^\s*- /.test(lineText);
                
                if (nextIndent > baseIndent || (nextIndent === baseIndent && isNextListItem && !startIsListItem)) {
                    endLine = i;
                } else {
                    break;
                }
            }
            
            // Apply highlight
            if (endLine >= lineNum) {
                clearBlockHighlight(); // Ensure clear
                
                // Set indentation variable
                // Use charCoords to get the exact pixel position of the first character
                const coords = cm.charCoords({line: lineNum, ch: baseIndent}, "local");
                state.editor.getWrapperElement().style.setProperty("--block-indent", `${coords.left}px`);
                
                for (let i = lineNum; i <= endLine; i++) {
                    const lineHandle = cm.addLineClass(i, "wrap", "cm-block-highlight-line");
                    if (i === lineNum) cm.addLineClass(i, "wrap", "cm-block-highlight-start");
                    if (i === endLine) cm.addLineClass(i, "wrap", "cm-block-highlight-end");
                    highlightedLines.push(lineHandle);
                }
            }
        }
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

export function yamlLinter(content, updateLinting) {
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

export function renderTabs() {
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

      tabEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTabContextMenu(e.clientX, e.clientY, tab);
      });

      const closeBtn = tabEl.querySelector(".tab-close");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab);
      });

      elements.tabsContainer.appendChild(tabEl);
    });
  }

export function closeTab(tab, force = false) {
    if (tab.modified && !force) {
      if (!confirm(`${tab.path.split("/").pop()} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    const index = state.openTabs.indexOf(tab);
    
    // Revoke blob URL if it exists (for PDFs)
    if (tab._blobUrl) {
        URL.revokeObjectURL(tab._blobUrl);
    }

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
        if (elements.assetPreview) {
          elements.assetPreview.classList.remove("visible");
          elements.assetPreview.innerHTML = "";
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

export async function saveCurrentFile(isAutoSave = false) {
    // Safety check: if this is an auto-save call but feature is disabled, abort.
    // We check explicitly for boolean true because button clicks pass an Event object.
    const reallyAutoSave = isAutoSave === true;
    
    if (reallyAutoSave && !state.autoSave) return;

    if (!state.activeTab) return;

    const tab = state.activeTab;
    
    // Prevent saving read-only files
    if (tab.path.endsWith(".gitignore") || tab.path.endsWith(".lock")) {
      if (!reallyAutoSave) {
        showToast("This file is read-only and cannot be saved manually.", "warning");
      }
      return;
    }

    const content = tab.content;
    const isYaml = tab.path.endsWith(".yaml") || tab.path.endsWith(".yml");

    // 1. Validate if it's a YAML file (skip validation for auto-save)
    if (isYaml && !reallyAutoSave) {
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
    if (!reallyAutoSave) {
      setButtonLoading(elements.btnSave, true);
    }

    const success = await saveFile(tab.path, content);

    if (!reallyAutoSave) {
      setButtonLoading(elements.btnSave, false);
    }

    if (success) {
      tab.originalContent = content;
      tab.modified = false;
      renderTabs();
      renderFileTree();
      updateToolbarState();
      
      if (reallyAutoSave) {
        // Show subtle auto-save indicator
        showToast(`Auto-saved ${tab.path.split("/").pop()}`, "info", 1500);
      }
    }
  }

export async function saveAllFiles() {
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

export function updateToolbarState() {
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

export function updateStatusBar() {
    const tab = state.activeTab;

    if (tab && state.editor) {
      const cursor = state.editor.getCursor();
      if (elements.statusPosition) {
        elements.statusPosition.innerHTML = `<span>Ln ${cursor.line + 1}, Col ${cursor.ch + 1}</span>`;
      }
      
      if (elements.statusIndent) {
        const tabSize = state.editor.getOption("tabSize") || 2;
        const indentWithTabs = state.editor.getOption("indentWithTabs");
        elements.statusIndent.innerHTML = `<span>${indentWithTabs ? 'Tabs' : 'Spaces'}: ${tabSize}</span>`;
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
        elements.statusIndent.innerHTML = "<span>Spaces: 2</span>";
      }
      if (elements.statusEncoding) {
        elements.statusEncoding.innerHTML = "<span>-</span>";
      }
      if (elements.statusLanguage) {
        elements.statusLanguage.innerHTML = "<span>-</span>";
      }
    }
  }

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

  // ============================================
  // Resize Handle
  // ============================================

export function initResizeHandle() {
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

export function insertUUID() {
    if (!state.editor || !state.editor.hasFocus()) return;
    
    // Generate UUID v4
    const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    state.editor.replaceSelection(uuid);
  }

export function initEventListeners() {
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

    if (elements.btnFormat) {
        // elements.btnFormat.addEventListener("click", formatCode);
        // Temporarily disabled
        elements.btnFormat.style.display = "none";
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

    // Support Modal
    if (elements.btnSupport) {
      elements.btnSupport.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.add("visible");
      });
    }

    if (elements.btnCloseSupport) {
      elements.btnCloseSupport.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
      });
    }
    
    // Support Modal Actions
    if (elements.btnSupportShortcuts) {
      elements.btnSupportShortcuts.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        showShortcuts();
      });
    }

    if (elements.btnSupportFeature) {
      elements.btnSupportFeature.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        requestFeature();
      });
    }

    if (elements.btnSupportIssue) {
      elements.btnSupportIssue.addEventListener("click", () => {
        elements.modalSupportOverlay.classList.remove("visible");
        reportIssue();
      });
    }

    if (elements.btnGithubStar) {
        elements.btnGithubStar.addEventListener("click", async (e) => {
            if (isGitEnabled()) {
                e.preventDefault();
                try {
                    const res = await fetchWithAuth(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "github_star" }) });
                    if (res.success) {
                        showToast("Successfully starred the repository! Thank you!", "success");
                        elements.modalSupportOverlay.classList.remove("visible");
                    } else {
                        // Fallback to link if API fails
                        window.open(elements.btnGithubStar.href, '_blank');
                    }
                } catch (err) { window.open(elements.btnGithubStar.href, '_blank'); }
            }
        });
    }

    if (elements.btnGithubFollow) {
        elements.btnGithubFollow.addEventListener("click", async (e) => {
            if (isGitEnabled()) {
                e.preventDefault();
                try {
                    const res = await fetchWithAuth(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "github_follow" }) });
                    if (res.success) {
                        showToast("Now following soulripper13! Thank you!", "success");
                        elements.modalSupportOverlay.classList.remove("visible");
                    } else {
                        // Fallback to link if API fails
                        window.open(elements.btnGithubFollow.href, '_blank');
                    }
                } catch (err) { window.open(elements.btnGithubFollow.href, '_blank'); }
            }
        });
    }

    // Close support modal on outside click
    if (elements.modalSupportOverlay) {
        elements.modalSupportOverlay.addEventListener("click", (e) => {
            if (e.target === elements.modalSupportOverlay) {
                elements.modalSupportOverlay.classList.remove("visible");
            }
        });
    }

    if (elements.btnToggleSelect) {
      elements.btnToggleSelect.addEventListener("click", toggleSelectionMode);
    }

    if (elements.btnDownloadSelected) {
      elements.btnDownloadSelected.addEventListener("click", downloadSelectedItems);
    }

    if (elements.btnDeleteSelected) {
      elements.btnDeleteSelected.addEventListener("click", deleteSelectedItems);
    }

    if (elements.btnCancelSelection) {
      elements.btnCancelSelection.addEventListener("click", toggleSelectionMode);
    }

    // Refresh (Hard Refresh)
    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener("click", () => loadFiles(true));
    }

    // Restart HA
    if (elements.btnRestartHa) {
      elements.btnRestartHa.addEventListener("click", restartHomeAssistant);
    }

    // App Settings
    if (elements.btnAppSettings) {
      elements.btnAppSettings.addEventListener("click", showAppSettings);
    }

    if (elements.btnMarkdownPreview) {
      elements.btnMarkdownPreview.addEventListener("click", toggleMarkdownPreview);
    }

    // AI Studio button
    const btnAI = document.getElementById("btn-ai-studio");
    if (btnAI) {
      btnAI.addEventListener("click", toggleAISidebar);
    }

    const btnCloseAI = document.getElementById("btn-close-ai");
    if (btnCloseAI) {
      btnCloseAI.addEventListener("click", toggleAISidebar);
    }

    const btnAISend = document.getElementById("btn-ai-send");
    if (btnAISend) {
      btnAISend.addEventListener("click", sendAIChatMessage);
    }

    const aiInput = document.getElementById("ai-chat-input");
    if (aiInput) {
      aiInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendAIChatMessage();
        }
      });
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
      elements.btnNewFile.addEventListener("click", () => promptNewFile());
    }
    if (elements.btnNewFolder) {
      elements.btnNewFolder.addEventListener("click", () => promptNewFolder());
    }
    if (elements.btnNewFileSidebar) {
      elements.btnNewFileSidebar.addEventListener("click", () => promptNewFile());
    }
    if (elements.btnNewFolderSidebar) {
      elements.btnNewFolderSidebar.addEventListener("click", () => promptNewFolder());
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
    if (elements.btnGitHistory) {
      elements.btnGitHistory.addEventListener("click", () => showGitHistory());
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
          panel.classList.toggle("collapsed");
          const isCollapsed = panel.classList.contains("collapsed");
          state.gitPanelCollapsed = isCollapsed;
          saveSettings();
          const icon = elements.btnGitCollapse.querySelector(".material-icons");
          if (icon) {
            icon.textContent = isCollapsed ? "expand_more" : "expand_less";
            elements.btnGitCollapse.title = isCollapsed ? "Expand Git Panel" : "Collapse Git Panel";
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

    // Gitea buttons
    if (elements.btnGiteaStatus) {
      elements.btnGiteaStatus.addEventListener("click", () => giteaStatus(true));
    }
    if (elements.btnGiteaHistory) {
      elements.btnGiteaHistory.addEventListener("click", () => showGitHistory());
    }
    if (elements.btnGiteaPull) {
      elements.btnGiteaPull.addEventListener("click", giteaPull);
    }
    if (elements.btnGiteaPush) {
      elements.btnGiteaPush.addEventListener("click", giteaPush);
    }
    if (elements.btnGiteaSettings) {
      elements.btnGiteaSettings.addEventListener("click", showGiteaSettings);
    }
    if (elements.btnGiteaRefresh) {
      elements.btnGiteaRefresh.addEventListener("click", () => giteaStatus(true));
    }
    if (elements.btnGiteaHelp) {
      elements.btnGiteaHelp.addEventListener("click", () => {
        showModal({
          title: "Gitea Integration",
          message: "Manage your Gitea repository directly from Blueprint Studio. Push, pull, and commit changes just like with GitHub.",
          confirmText: "Close"
        });
      });
    }
    if (elements.btnGiteaCollapse) {
      elements.btnGiteaCollapse.addEventListener("click", () => {
        const panel = document.getElementById("gitea-panel");
        if (panel) {
          panel.classList.toggle("collapsed");
          const isCollapsed = panel.classList.contains("collapsed");
          state.giteaPanelCollapsed = isCollapsed;
          saveSettings();
          const icon = elements.btnGiteaCollapse.querySelector(".material-icons");
          if (icon) {
            icon.textContent = isCollapsed ? "expand_more" : "expand_less";
            elements.btnGiteaCollapse.title = isCollapsed ? "Expand Gitea Panel" : "Collapse Gitea Panel";
          }
        }
      });
    }
    if (elements.btnGiteaStageSelected) {
      elements.btnGiteaStageSelected.addEventListener("click", stageSelectedGiteaFiles);
    }
    if (elements.btnGiteaStageAll) {
      elements.btnGiteaStageAll.addEventListener("click", stageAllGiteaFiles);
    }
    if (elements.btnGiteaUnstageAll) {
      elements.btnGiteaUnstageAll.addEventListener("click", unstageAllGiteaFiles);
    }
    if (elements.btnGiteaCommitStaged) {
      elements.btnGiteaCommitStaged.addEventListener("click", giteaCommit);
    }

    // Git panel header sync indicators (delegation)
    const gitPanelActions = document.getElementById("git-panel-actions");
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

    // Gitea panel header sync indicators (delegation)
    const giteaPanelActions = document.getElementById("gitea-panel-actions");
    if (giteaPanelActions) {
      giteaPanelActions.addEventListener("click", (e) => {
        const target = e.target.closest(".git-sync-indicator");
        if (target) {
          if (target.id === "btn-gitea-push-sync") {
            giteaPush();
          } else if (target.id === "btn-gitea-pull-sync") {
            giteaPull();
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
          return;
        }

        // Handle file row click (toggle checkbox)
        const fileItem = e.target.closest(".git-file-item");
        if (fileItem && !e.target.classList.contains("git-file-checkbox")) {
            const checkbox = fileItem.querySelector(".git-file-checkbox");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                const path = checkbox.getAttribute("data-file-path");
                if (path) {
                    toggleFileSelection(path);
                }
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

    // Gitea panel event delegation
    const giteaFilesContainer = document.getElementById("gitea-files-container");
    if (giteaFilesContainer) {
      giteaFilesContainer.addEventListener("click", (e) => {
        // Handle gitea file group header clicks (toggle collapse)
        const groupHeader = e.target.closest(".git-file-group-header");
        if (groupHeader) {
          const groupElement = groupHeader.closest(".git-file-group");
          if (groupElement) {
            const groupKey = groupElement.getAttribute("data-group");
            toggleGitGroup(groupKey);
          }
          return;
        }

        // Handle Diff Button
        const diffBtn = e.target.closest(".btn-git-diff");
        if (diffBtn) {
            const path = diffBtn.dataset.path;
            showDiffModal(path);
            return;
        }

        // Handle empty state buttons
        const target = e.target.closest('button');
        if (target) {
          if (target.id === "btn-gitea-pull-empty-state") {
            giteaPull();
          } else if (target.id === "btn-gitea-refresh-empty-state") {
            giteaStatus(true);
          } else if (target.id === "btn-gitea-init-panel") {
            gitInit();
          } else if (target.id === "btn-gitea-connect-panel") {
            showGiteaSettings();
          } else if (target.id === "btn-gitea-abort") {
            giteaAbort();
          } else if (target.id === "btn-gitea-force-push") {
            giteaForcePush();
          } else if (target.id === "btn-gitea-hard-reset") {
            giteaHardReset();
          }
          return;
        }

        // Handle file row click (toggle checkbox)
        const fileItem = e.target.closest(".git-file-item");
        if (fileItem && !e.target.classList.contains("gitea-file-checkbox")) {
            const checkbox = fileItem.querySelector(".gitea-file-checkbox");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                const path = checkbox.getAttribute("data-file-path");
                if (path) {
                    toggleGiteaFileSelection(path);
                }
            }
        }
      });

      // Change event delegation for checkboxes
      giteaFilesContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("gitea-file-checkbox")) {
          const path = e.target.getAttribute("data-file-path");
          if (path) {
            toggleGiteaFileSelection(path);
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
        debouncedRenderFileTree();
      });
    }
    
    // Content Search Toggle
    if (elements.btnContentSearch) {
        elements.btnContentSearch.addEventListener("click", () => {
            state.contentSearchEnabled = !state.contentSearchEnabled;
            
            // UI Toggle
            if (state.contentSearchEnabled) {
                elements.btnContentSearch.style.background = "var(--accent-color)";
                elements.btnContentSearch.style.color = "white";
                elements.btnContentSearch.style.borderColor = "var(--accent-color)";
                elements.fileSearch.placeholder = "Search file content...";
                if (state.searchQuery) debouncedContentSearch();
            } else {
                elements.btnContentSearch.style.background = "var(--bg-tertiary)";
                elements.btnContentSearch.style.color = "var(--text-secondary)";
                elements.btnContentSearch.style.borderColor = "var(--border-color)";
                elements.fileSearch.placeholder = "Search files...";
                state.contentSearchResults = null;
                renderFileTree();
            }
        });
    }

    // Welcome screen actions
    if (elements.btnWelcomeNewFile) {
      elements.btnWelcomeNewFile.addEventListener("click", () => promptNewFile());
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
        const theme = item.dataset.theme;
        if (theme === 'auto') {
            setTheme('auto');
        } else {
            // Use preset setter to ensure correct preset + theme mode sync
            setThemePreset(theme);
        }
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

    // File Context menu items
    if (elements.contextMenu) {
        elements.contextMenu.querySelectorAll(".context-menu-item").forEach(item => {
          item.addEventListener("click", async () => {
            const action = item.dataset.action;
            const target = state.contextMenuTarget;
            hideContextMenu();
    
            if (!target) return;
    
            switch (action) {
          case "new_file":
            {
              const targetPath = target.isFolder ? target.path : target.path.split("/").slice(0, -1).join("/");
              state.currentFolderPath = targetPath;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
              await promptNewFile(targetPath);
            }
            break;
          case "new_folder":
            {
              const targetPath = target.isFolder ? target.path : target.path.split("/").slice(0, -1).join("/");
              state.currentFolderPath = targetPath;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
              await promptNewFolder(targetPath);
            }
            break;
          case "rename":
            await promptRename(target.path, target.isFolder);
            break;
          case "copy":
            await promptCopy(target.path, target.isFolder);
            break;
          case "duplicate":
            await duplicateItem(target.path, target.isFolder);
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
    }

    // Tab Context Menu Items
    if (elements.tabContextMenu) {
        elements.tabContextMenu.querySelectorAll(".context-menu-item").forEach(item => {
            item.addEventListener("click", () => {
                const action = item.dataset.action;
                const tab = state.tabContextMenuTarget;
                hideContextMenu();

                if (!tab) return;

                if (action === "close_others") {
                    const tabsToClose = state.openTabs.filter(t => t !== tab);
                    // Close sequentially to handle confirmations if needed
                    tabsToClose.forEach(t => closeTab(t));
                } else if (action === "close_saved") {
                    const tabsToClose = state.openTabs.filter(t => !t.modified && t !== tab);
                    tabsToClose.forEach(t => closeTab(t));
                } else if (action === "copy_path") {
                    copyToClipboard(tab.path);
                    showToast("Path copied to clipboard", "success");
                }
            });
        });
    }

    // Hide context menu on outside click
    document.addEventListener("click", hideContextMenu);

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + E - Quick Switcher
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        showQuickSwitcher();
      }

      // Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        // If inside CodeMirror, let its extraKeys handle it to avoid double-save
        const activeElement = document.activeElement;
        const isEditor = activeElement && (activeElement.classList.contains("CodeMirror-code") || activeElement.closest('.CodeMirror'));
        if (isEditor) return;

        e.preventDefault();
        if (e.shiftKey) {
          saveAllFiles();
        } else {
          saveCurrentFile();
        }
      }

      // Shift + Alt + F - Format Code
      /* 
      if (e.shiftKey && e.altKey && (e.key === "f" || e.key === "F")) {
          e.preventDefault();
          formatCode();
      }
      */

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

      // Ctrl/Cmd + Shift + U - Generate UUID
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        insertUUID();
      }

      // Ctrl/Cmd + Shift + F - Global Search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        showGlobalSearchDialog();
      }

      // Ctrl/Cmd + K - Command Palette
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "k" || e.code === "KeyK")) {
        e.preventDefault();
        e.stopPropagation();
        showCommandPalette();
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
      // Background click handler to deselect items/folders
      elements.fileTree.addEventListener("click", (e) => {
          // Only if clicking the background (not a tree item)
          if (e.target === elements.fileTree) {
              state.currentFolderPath = null;
              document.querySelectorAll(".tree-item.active").forEach(el => el.classList.remove("active"));
          }
      });

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

export async function restartHomeAssistant() {
    const confirmed = await showConfirmDialog({
        title: "Restart Home Assistant?",
        message: "Are you sure you want to restart Home Assistant? Blueprint Studio will be unavailable until the restart completes.",
        confirmText: "Restart",
        cancelText: "Cancel",
        isDanger: true
    });

    if (confirmed) {
        // Save current state before restart
        await saveSettings();

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
  }

  // ============================================
  // Initialization
  // ============================================

export async function restoreOpenTabs() {
    if (!state._savedOpenTabs || state._savedOpenTabs.length === 0) {
      return;
    }

    // Restore tabs
    for (const tabState of state._savedOpenTabs) {
      // Check if file still exists
      const fileExists = state.files.some(f => f.path === tabState.path);
      if (fileExists) {
        const tab = await openFile(tabState.path, false, true);
        if (tab) {
          tab.cursor = tabState.cursor || null;
          tab.scroll = tabState.scroll || null;
        }
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

export async function initWebSocketSubscription() {
    try {
      if (window.parent && window.parent.hassConnection) {
        const result = await window.parent.hassConnection;
        
        // Handle both wrapper object {auth, conn} and direct Connection object
        const conn = result.conn || (typeof result.subscribeMessage === 'function' ? result : null);
        
        if (!conn || typeof conn.subscribeMessage !== 'function') {
            throw new Error("WebSocket connection (subscribeMessage) not found");
        }

        // Subscribe to Blueprint Studio updates
        conn.subscribeMessage(
          (event) => {
            // Debounce updates to avoid multiple simultaneous refreshes
            if (state._wsUpdateTimer) clearTimeout(state._wsUpdateTimer);
            state._wsUpdateTimer = setTimeout(() => {
                checkFileUpdates();
                checkGitStatusIfEnabled(false, true); // silent = true
                
                // If a file was structurally changed (created/deleted/renamed), refresh the tree
                if (event && ["create", "delete", "rename", "create_folder", "upload", "upload_folder"].includes(event.action)) {
                    loadFiles();
                } else {
                    // Just update visual indicators (modified M, untracked U)
                    debouncedRenderFileTree();
                }
            }, 500);
          },
          { type: "blueprint_studio/subscribe_updates" }
        );
        
        console.log("Blueprint Studio: Real-time updates active");
      } else {
        // Fallback to polling if not in HA environment or connection unavailable
        startGitStatusPolling();
      }
    } catch (e) {
      console.error("Blueprint Studio: WebSocket subscription failed", e);
      // Fallback to legacy polling if WS fails
      startGitStatusPolling();
    }
  }

export async function init() {
    initElements();
    await loadSettings();
    applyTheme();
    applyVersionControlVisibility(); // Apply version control visibility setting
    gitStatus(true, true);
    giteaStatus(true, true);
    updateShowHiddenButton();
    initEventListeners();
    initResizeHandle();
    
    // Fetch and display version
    try {
        const versionData = await fetchWithAuth(`${API_BASE}?action=get_version`);
        if (versionData.integration_version && elements.appVersionDisplay) {
            elements.appVersionDisplay.textContent = `v${versionData.integration_version}`;
        }
    } catch (e) {
        console.warn("Failed to fetch version for display");
    }
    
    // Initialize real-time updates via WebSocket
    initWebSocketSubscription();

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

    // Dismiss initial loading screen
    hideGlobalLoading();
  }

export async function startOnboarding() {
    if (state.onboardingCompleted) return;

    let shouldOpenSettings = false;

    // Step 1: Welcome & Git Choice
    const choiceResult = await new Promise((resolve) => {
        const modalBody = document.getElementById("modal-body");
        const modalTitle = document.getElementById("modal-title");
        const modal = document.getElementById("modal");
        const modalFooter = document.querySelector(".modal-footer");

        resetModalToDefault();
        modalTitle.textContent = "Welcome to Blueprint Studio! 🚀";
        if (modalFooter) modalFooter.style.display = "none";

        modalBody.innerHTML = `
            <div style="text-align: center;">
                <p style="margin-bottom: 20px;">The modern, Git-powered file editor for Home Assistant.</p>
                <div style="font-weight: 600; margin-bottom: 16px;">Choose your preferred version control system:</div>
                <div class="git-choice-container" style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="btn-secondary onboarding-choice-btn" data-value="github" style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; background: var(--bg-secondary); cursor: pointer; transition: background 0.2s; width: 100%; color: inherit;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <svg class="octicon" viewBox="0 0 16 16" width="24" height="24" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                            <div>
                                <div style="font-weight: 600;">GitHub</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Connect to GitHub.com</div>
                            </div>
                        </div>
                    </button>
                    <button class="btn-secondary onboarding-choice-btn" data-value="gitea" style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; background: var(--bg-secondary); cursor: pointer; transition: background 0.2s; width: 100%; color: inherit;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span class="material-icons" style="font-size: 24px; color: #fa8e14;">emoji_food_beverage</span>
                            <div>
                                <div style="font-weight: 600;">Gitea</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Connect to self-hosted Gitea</div>
                            </div>
                        </div>
                    </button>
                    <button class="btn-secondary onboarding-choice-btn" data-value="none" style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; text-align: left; background: var(--bg-secondary); cursor: pointer; transition: background 0.2s; width: 100%; color: inherit;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span class="material-icons" style="font-size: 24px;">block</span>
                            <div>
                                <div style="font-weight: 600;">None</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Skip version control</div>
                            </div>
                        </div>
                    </button>
                </div>
                <p style="font-size: 12px; color: var(--text-secondary); margin-top: 20px;">You can change this later in Settings.</p>
            </div>
        `;

        const buttons = modalBody.querySelectorAll('.onboarding-choice-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-value');
                hideModal();
                resolve(val);
            });
        });

        document.getElementById('modal-overlay').classList.add("visible");
    });

    const provider = choiceResult;
    const useGit = provider !== 'none';

    if (useGit) {
        // User chose to enable
        state.gitIntegrationEnabled = (provider === 'github');
        state.giteaIntegrationEnabled = (provider === 'gitea');
        saveSettings();
        applyVersionControlVisibility();

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

        // Step 5: Connect to Provider (Login)
        let isLoggedIn = false;
        if (provider === 'github') {
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
        } else if (provider === 'gitea') {
            // Gitea login is via settings
            shouldOpenSettings = true;
        }

        // Step 6: Create Repository (if logged in and no remote)
        if (provider === 'github' && isLoggedIn && !gitState.hasRemote) {
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
        state.giteaIntegrationEnabled = false;
        saveSettings();
        applyVersionControlVisibility();
    }

    // Final Step: Finish
    const finishMessage = useGit 
        ? `
        <div style="text-align: center;">
          <p>Explore your files on the left.</p>
          <p>Use the <b>${provider === 'gitea' ? 'Gitea' : 'Git'} Panel</b> to stage, commit, and push changes.</p>
          <br>
          <p style="font-size: 12px;">Need help? Click the <span class="material-icons" style="font-size: 14px; vertical-align: middle;">help_outline</span> icon in the panel.</p>
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

    // If they chose to connect Gitea (or GitHub failed login), open the settings modal now
    if (shouldOpenSettings) {
        if (provider === 'gitea') showGiteaSettings();
        else if (provider === 'github') showGitSettings();
    }
  }

  // Periodic git status polling
export let gitStatusPollingInterval = null;

export async function checkFileUpdates() {
    // Only check if window is focused to save resources
    if (document.visibilityState !== 'visible' || !document.hasFocus()) return;
    
    if (!state.activeTab || !state.activeTab.path) return;
    
    try {
        const response = await fetchWithAuth(`${API_BASE}?action=get_file_stat&path=${encodeURIComponent(state.activeTab.path)}&_t=${Date.now()}`);
        if (response.success && response.mtime) {
            // Initialize mtime if missing (first run or legacy tab)
            if (!state.activeTab.mtime) {
                state.activeTab.mtime = response.mtime;
                return;
            }

            // If we have a stored mtime and the new one is different
            if (state.activeTab.mtime !== response.mtime) {
                // If user hasn't modified, auto-reload
                if (!state.activeTab.modified) {
                    showToast(`File updated externally: ${state.activeTab.path.split('/').pop()}`, "info");
                    // We update mtime in openFile(..., true)
                    openFile(state.activeTab.path, true); 
                }
            }
        }
    } catch (e) {
        // Silent fail
    }
  }

export function startGitStatusPolling() {
    // Clear any existing interval
    if (gitStatusPollingInterval) {
      clearInterval(gitStatusPollingInterval);
    }

    // Poll every 5 seconds
    gitStatusPollingInterval = setInterval(async () => {
      // Only poll if window is focused
      if (document.visibilityState !== 'visible' || !document.hasFocus()) return;

      try {
        checkFileUpdates(); // Check for external file changes

        // Poll GitHub if enabled
        if (state.gitIntegrationEnabled) {
            await gitStatus(false, true); // silent = true
        }
        
        // Poll Gitea if enabled
        if (state.giteaIntegrationEnabled) {
            await giteaStatus(false, true); // silent = true
        }
      } catch (error) {
        // Silently fail
      }
    }, 5000); // 5 seconds
  }

export function stopGitStatusPolling() {
    if (gitStatusPollingInterval) {
      clearInterval(gitStatusPollingInterval);
      gitStatusPollingInterval = null;
    }
  }
