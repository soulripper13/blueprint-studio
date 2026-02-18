/**
 * ============================================================================
 * SETTINGS MODULE
 * ============================================================================
 *
 * PURPOSE:
 * Handles loading, saving, and migrating user settings between local storage
 * and server. Manages all application preferences, workspace state, and
 * configuration persistence.
 *
 * EXPORTED FUNCTIONS:
 * - registerSettingsCallbacks(cb) - Register dependencies from app.js
 * - loadSettings() - Load settings from server and local storage
 * - saveSettings() - Save settings to server and local storage
 * - updateShowHiddenButton() - Update show/hide hidden files button state
 *
 * REQUIRED CALLBACKS (from app.js):
 * - applyTheme: Apply theme to UI
 * - applyCustomSyntaxColors: Apply custom syntax colors
 * - updateAIVisibility: Update AI feature visibility
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding a new setting:
 *    - Add to state.js with default value
 *    - Add to loadSettings(): state.newSetting = settings.newSetting || defaultValue
 *    - Add to saveSettings(): newSetting: state.newSetting
 *    - Add UI control in settings-ui.js
 *    - Test migration from old to new versions
 *
 * 2. Migrating settings format:
 *    - Add migration logic in loadSettings()
 *    - Check for old format: if (settings.oldField)
 *    - Convert to new format: state.newField = convertOldToNew(settings.oldField)
 *    - Save migrated settings immediately
 *    - Example: aiProvider → aiType migration (lines 114-133)
 *
 * 3. Adding setting categories:
 *    - Group related settings together in code
 *    - Add comments to separate categories
 *    - Examples: UI, Editor, Git, AI, Performance
 *
 * 4. Adding workspace state:
 *    - Save in saveSettings() if state.rememberWorkspace
 *    - Examples: openTabs, activeTabPath, cursor positions
 *    - Store in _saved prefix: state._savedOpenTabs
 *    - Restore in loadSettings()
 *
 * 5. Adding settings validation:
 *    - Validate in loadSettings() before applying
 *    - Use typeof checks, range checks
 *    - Fall back to defaults if invalid
 *    - Example: parseInt() with || default
 *
 * INTEGRATION POINTS:
 * - state.js: All settings are stored in state object
 * - api.js: fetchWithAuth for server communication
 * - settings-ui.js: Settings UI panel
 * - app.js: Provides callbacks for applying settings
 * - localStorage: Fallback/cache for settings
 *
 * SETTINGS CATEGORIES:
 *
 * 1. UI Customization:
 *    - theme, themePreset, accentColor
 *    - fontSize, fontFamily, sidebarWidth
 *    - tabPosition, breadcrumbStyle
 *    - showToasts, showHidden, showRecentFiles
 *
 * 2. Editor Settings:
 *    - tabSize, indentWithTabs
 *    - wordWrap, showLineNumbers, showMinimap, showWhitespace
 *    - autoSave, autoSaveDelay
 *
 * 3. File Tree Settings:
 *    - fileTreeCompact, fileTreeShowIcons
 *    - recentFilesLimit
 *
 * 4. Git Integration:
 *    - gitIntegrationEnabled, gitConfig
 *    - gitPanelCollapsed, gitCollapsedGroups
 *
 * 5. Gitea Integration:
 *    - giteaIntegrationEnabled
 *    - giteaPanelCollapsed, giteaCollapsedGroups
 *
 * 6. AI Integration:
 *    - aiIntegrationEnabled, aiType
 *    - cloudProvider, aiModel
 *    - geminiApiKey, openaiApiKey, claudeApiKey
 *    - localAiProvider, ollamaUrl, ollamaModel
 *    - lmStudioUrl, lmStudioModel
 *    - customAiUrl, customAiModel
 *
 * 7. Performance:
 *    - pollingInterval, remoteFetchInterval
 *    - fileCacheSize, enableVirtualScroll
 *
 * 8. Workspace State:
 *    - openTabs: Array of open tab states
 *    - activeTabPath: Currently active tab
 *    - rememberWorkspace: Enable workspace restoration
 *    - favoriteFiles, recentFiles
 *
 * 9. Other:
 *    - onboardingCompleted
 *    - customColors: Custom syntax highlighting
 *
 * ARCHITECTURE NOTES:
 * - Settings are synced to server (primary storage)
 * - localStorage is used as fallback/cache
 * - Migration happens from localStorage to server on first load
 * - Tab state includes cursor position, scroll position, modified content
 * - Settings save automatically after changes
 * - Debounced saving prevents excessive API calls
 *
 * STORAGE FLOW:
 * 1. Load: Try server → Fall back to localStorage → Use defaults
 * 2. Migrate: If server empty but localStorage has data → Copy to server
 * 3. Save: Write to both server and localStorage
 * 4. Apply: Call callbacks to update UI (theme, colors, AI visibility)
 *
 * COMMON PATTERNS:
 * - Load setting: state.setting = settings.setting || defaultValue
 * - Save setting: settings object includes setting: state.setting
 * - Validate number: parseInt(settings.value) || defaultValue
 * - Validate boolean: settings.value !== false (for default true)
 * - Migrate: if (settings.oldField) { state.newField = convert(settings.oldField) }
 *
 * TAB STATE PRESERVATION:
 * - Saves cursor position per tab
 * - Saves scroll position per tab
 * - Saves modified content (for unsaved changes)
 * - Restores workspace on reload
 * - Controlled by rememberWorkspace setting
 *
 * MIGRATION EXAMPLE (AI Settings):
 * - Old: aiProvider: "gemini"
 * - New: aiType: "cloud", cloudProvider: "gemini"
 * - Migration checks for old format and converts
 * - Keeps old field for backward compatibility
 *
 * ============================================================================
 */
import { state, elements, gitState, giteaState } from './state.js';
import { fetchWithAuth } from './api.js';
import { API_BASE, STORAGE_KEY } from './constants.js';

// Callbacks for cross-module functions
let callbacks = {
  applyTheme: null,
  applyCustomSyntaxColors: null,
  updateAIVisibility: null
};

export function registerSettingsCallbacks(cb) {
  callbacks = { ...callbacks, ...cb };
}

/**
 * Loads settings from server and local storage
 * Handles migration from local storage to server
 */
export async function loadSettings() {
  try {
    // 1. Fetch from server
    let serverSettings = {};
    try {
      serverSettings = await fetchWithAuth(`${API_BASE}?action=get_settings`);
    } catch (e) {
      // Failed to fetch settings from server, using local fallback
    }

    // 2. Fetch local (legacy/fallback)
    const localStored = localStorage.getItem(STORAGE_KEY);
    const localSettings = localStored ? JSON.parse(localStored) : {};

    // 3. Migration: If server is empty but local exists, migrate to server
    let settings = serverSettings;
    if (Object.keys(serverSettings).length === 0 && (Object.keys(localSettings).length > 0 || localStorage.getItem("onboardingCompleted"))) {
      // Migrating settings to server...
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
    state.syntaxTheme = settings.syntaxTheme || 'custom';
    state.geminiApiKey = settings.geminiApiKey || null;
    state.openaiApiKey = settings.openaiApiKey || null;
    state.claudeApiKey = settings.claudeApiKey || null;

    // New UI customization settings
    state.themePreset = settings.themePreset || "dark";
    state.accentColor = settings.accentColor || null;
    state.fontSize = parseInt(settings.fontSize) || 14;
    state.fontFamily = settings.fontFamily || localSettings.fontFamily || "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace";
    state.tabSize = parseInt(settings.tabSize) || 2;
    state.indentWithTabs = settings.indentWithTabs || false;
    state.sidebarWidth = parseInt(settings.sidebarWidth) || parseInt(localSettings.sidebarWidth) || 320;
    state.tabPosition = settings.tabPosition || localSettings.tabPosition || "top";
    state.wordWrap = settings.wordWrap !== false; // default true
    state.showLineNumbers = settings.showLineNumbers !== false; // default true
    state.showMinimap = settings.showMinimap || false;
    state.showWhitespace = settings.showWhitespace || false;
    state.autoSave = settings.autoSave || false;
    state.autoSaveDelay = parseInt(settings.autoSaveDelay) || 1000;
    state.fileTreeCompact = settings.fileTreeCompact || false;
    state.fileTreeShowIcons = settings.fileTreeShowIcons !== false; // default true
    state.treeCollapsableMode = settings.treeCollapsableMode || false;
    // Apply tree mode to lazyLoadingEnabled
    state.lazyLoadingEnabled = !state.treeCollapsableMode;
    state.recentFilesLimit = parseInt(settings.recentFilesLimit) || 10;
    state.breadcrumbStyle = settings.breadcrumbStyle || "path";
    state.showToasts = settings.showToasts !== false; // default true

    // Experimental features
    state.enableSplitView = settings.enableSplitView || false; // default false (experimental)
    state.onTabMode = settings.onTabMode || false; // default false

    // New state properties for sync
    state.onboardingCompleted = settings.onboardingCompleted ?? (localStorage.getItem("onboardingCompleted") === "true");
    state.gitIntegrationEnabled = settings.gitIntegrationEnabled ?? (localStorage.getItem("gitIntegrationEnabled") !== "false");
    state.giteaIntegrationEnabled = settings.giteaIntegrationEnabled ?? (localStorage.getItem("giteaIntegrationEnabled") === "true");
    state.sftpIntegrationEnabled = settings.sftpIntegrationEnabled ?? true; // Default enabled

    // Restore collapsed groups
    if (settings.gitCollapsedGroups && Array.isArray(settings.gitCollapsedGroups)) {
      gitState.collapsedGroups = new Set(settings.gitCollapsedGroups);
    }
    if (settings.giteaCollapsedGroups && Array.isArray(settings.giteaCollapsedGroups)) {
      giteaState.collapsedGroups = new Set(settings.giteaCollapsedGroups);
    }

    state.gitPanelCollapsed = settings.gitPanelCollapsed || false;
    state.giteaPanelCollapsed = settings.giteaPanelCollapsed || false;
    state.fileTreeCollapsed = settings.fileTreeCollapsed || false;
    state.rememberWorkspace = settings.rememberWorkspace !== false; // default true

    // Performance settings
    state.pollingInterval = parseInt(settings.pollingInterval) || 10000;
    state.remoteFetchInterval = parseInt(settings.remoteFetchInterval) || 30000;
    state.fileCacheSize = parseInt(settings.fileCacheSize) || 10;
    state.enableVirtualScroll = settings.enableVirtualScroll || false;

    // SFTP settings
    state.sftpConnections = settings.sftpConnections || [];
    state.sftpPanelCollapsed = settings.sftpPanelCollapsed || false;
    state.sftpPanelHeight = settings.sftpPanelHeight || 300;

    // Split view settings
    if (settings.splitView) {
      state.splitView.enabled = settings.splitView.enabled || false;
      state.splitView.orientation = settings.splitView.orientation || 'vertical';
      state.splitView.primaryPaneSize = settings.splitView.primaryPaneSize || 50;
      state.splitView.primaryTabs = settings.splitView.primaryTabs || [];
      state.splitView.secondaryTabs = settings.splitView.secondaryTabs || [];
      state._savedPrimaryActiveTabPath = settings.splitView.primaryActiveTabPath;
      state._savedSecondaryActiveTabPath = settings.splitView.secondaryActiveTabPath;
    }

    // AI Settings - with migration from old structure
    state.aiIntegrationEnabled = settings.aiIntegrationEnabled ?? false;

    // Migrate old aiProvider to new aiType structure
    if (settings.aiType) {
      // New structure exists
      state.aiType = settings.aiType;
    } else if (settings.aiProvider) {
      // Migrate from old structure
      const oldProvider = settings.aiProvider;

      if (oldProvider === "local") {
        state.aiType = "rule-based";
      } else if (["gemini", "openai", "claude"].includes(oldProvider)) {
        state.aiType = "cloud";
        state.cloudProvider = oldProvider;
      } else {
        state.aiType = "rule-based";
      }
    } else {
      state.aiType = "rule-based";
    }

    // Legacy field
    state.aiProvider = settings.aiProvider || "local";

    // Local AI settings
    state.localAiProvider = settings.localAiProvider || "ollama";
    state.ollamaUrl = settings.ollamaUrl || "http://localhost:11434";
    state.ollamaModel = settings.ollamaModel || "codellama:7b";
    state.lmStudioUrl = settings.lmStudioUrl || "http://localhost:1234";
    state.lmStudioModel = settings.lmStudioModel || "";
    state.customAiUrl = settings.customAiUrl || "";
    state.customAiModel = settings.customAiModel || "";

    // Cloud AI settings
    state.cloudProvider = settings.cloudProvider || settings.aiProvider || "gemini";
    state.aiModel = settings.aiModel || "gemini-2.0-flash-exp";
    state.geminiApiKey = settings.geminiApiKey || "";
    state.openaiApiKey = settings.openaiApiKey || "";
    state.claudeApiKey = settings.claudeApiKey || "";

    state._savedOpenTabs = settings.openTabs || localSettings.openTabs || [];
    state._savedActiveTabPath = settings.activeTabPath || localSettings.activeTabPath || null;

    if (callbacks.applyTheme) callbacks.applyTheme();
    if (callbacks.applyCustomSyntaxColors) callbacks.applyCustomSyntaxColors();
    if (callbacks.updateAIVisibility) callbacks.updateAIVisibility();

  } catch (e) {
    // Could not load settings
  }
}

/**
 * Saves settings to server and local storage
 * Includes workspace state (open tabs, cursor positions)
 */
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
      openTabsState = state.openTabs.map(tab => {
        // If this is the active tab, it already has the latest cursor/scroll from above.
        // Other tabs have their cursor/scroll preserved from when they were last active.
        const tabState = {
          path: tab.path,
          modified: tab.modified,
          cursor: tab.cursor,
          scroll: tab.scroll
        };

        // Save modified content so it can be restored
        if (tab.modified && tab.content) {
          tabState.content = tab.content;
          tabState.originalContent = tab.originalContent;
        }

        return tabState;
      });
      activeTabPath = state.activeTab ? state.activeTab.path : null;
    }

    const settings = {
      theme: state.theme,
      showHidden: state.showHidden,
      showRecentFiles: state.showRecentFiles,
      favoriteFiles: state.favoriteFiles,
      recentFiles: state.recentFiles,
      customColors: state.customColors,
      syntaxTheme: state.syntaxTheme,
      openTabs: openTabsState,
      activeTabPath: activeTabPath,
      gitConfig: state.gitConfig,
      onboardingCompleted: state.onboardingCompleted,
      gitIntegrationEnabled: state.gitIntegrationEnabled,
      giteaIntegrationEnabled: state.giteaIntegrationEnabled,
      sftpIntegrationEnabled: state.sftpIntegrationEnabled,
      gitCollapsedGroups: Array.from(gitState.collapsedGroups),
      giteaCollapsedGroups: Array.from(giteaState.collapsedGroups),
      aiIntegrationEnabled: state.aiIntegrationEnabled,
      aiType: state.aiType,
      aiProvider: state.aiProvider, // Legacy, for migration
      // Local AI settings
      localAiProvider: state.localAiProvider,
      ollamaUrl: state.ollamaUrl,
      ollamaModel: state.ollamaModel,
      lmStudioUrl: state.lmStudioUrl,
      lmStudioModel: state.lmStudioModel,
      customAiUrl: state.customAiUrl,
      customAiModel: state.customAiModel,
      // Cloud AI settings
      cloudProvider: state.cloudProvider,
      aiModel: state.aiModel,
      geminiApiKey: state.geminiApiKey,
      openaiApiKey: state.openaiApiKey,
      claudeApiKey: state.claudeApiKey,
      // New UI customization settings
      themePreset: state.themePreset,
      accentColor: state.accentColor,
      fontSize: state.fontSize,
      fontFamily: state.fontFamily,
      tabSize: state.tabSize,
      indentWithTabs: state.indentWithTabs,
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
      treeCollapsableMode: state.treeCollapsableMode,
      recentFilesLimit: state.recentFilesLimit,
      breadcrumbStyle: state.breadcrumbStyle,
      gitPanelCollapsed: state.gitPanelCollapsed,
      giteaPanelCollapsed: state.giteaPanelCollapsed,
      fileTreeCollapsed: state.fileTreeCollapsed,
      enableSplitView: state.enableSplitView, // Experimental feature
      onTabMode: state.onTabMode, // One Tab Mode
      rememberWorkspace: state.rememberWorkspace,
      // Performance settings
      pollingInterval: state.pollingInterval,
      remoteFetchInterval: state.remoteFetchInterval,
      fileCacheSize: state.fileCacheSize,
      enableVirtualScroll: state.enableVirtualScroll,
      // SFTP settings
      sftpConnections: state.sftpConnections,
      sftpPanelCollapsed: state.sftpPanelCollapsed,
      sftpPanelHeight: state.sftpPanelHeight,
      // Split view settings
      splitView: state.splitView ? {
        enabled: state.splitView.enabled,
        orientation: state.splitView.orientation,
        primaryPaneSize: state.splitView.primaryPaneSize,
        primaryTabs: state.splitView.primaryTabs || [],
        secondaryTabs: state.splitView.secondaryTabs || [],
        primaryActiveTabPath: state.splitView.primaryActiveTab?.path || null,
        secondaryActiveTabPath: state.splitView.secondaryActiveTab?.path || null,
      } : null
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
    // Could not save settings
    return Promise.resolve();
  }
}

/**
 * Updates the show/hide hidden files button state
 */
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
