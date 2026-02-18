/**
 * ============================================================================
 * STATE MODULE
 * ============================================================================
 *
 * PURPOSE:
 * Central state management for Blueprint Studio. This module exports reactive
 * state objects that hold ALL application data including files, tabs, settings,
 * git status, and UI state. This is the single source of truth for the app.
 *
 * EXPORTED OBJECTS:
 * - state: Main application state
 * - elements: DOM element references
 * - gitState: Git-specific state
 * - giteaState: Gitea-specific state
 *
 * HOW TO ADD NEW FEATURES:
 *
 * 1. Adding a new state property:
 *    - Add to appropriate state object (state, gitState, giteaState)
 *    - Set sensible default value
 *    - Document in STATE PROPERTIES section below
 *    - Add to settings.js if it should persist
 *    - Update UI when state changes
 *
 * 2. Adding a new DOM element reference:
 *    - Add to elements object
 *    - Use document.getElementById() or querySelector()
 *    - Initialize in initialization.js
 *    - Access via elements.elementName in other modules
 *
 * 3. Adding git-related state:
 *    - Add to gitState object
 *    - Update in git-operations.js
 *    - Render in git-ui.js
 *    - Persist in settings.js if needed
 *
 * 4. Making state reactive:
 *    - Consider using Proxy for reactivity
 *    - Or implement getter/setter pattern
 *    - Trigger UI updates on changes
 *    - Example: use observers or event emitters
 *
 * 5. Adding computed properties:
 *    - Create getter function
 *    - Derive from existing state
 *    - Example: get activeFileName() { return state.activeTab?.name }
 *
 * INTEGRATION POINTS:
 * - ALL modules import and use state
 * - settings.js: Persists state to storage
 * - initialization.js: Initializes elements
 * - Every module reads/writes state
 *
 * STATE PROPERTIES:
 *
 * FILE SYSTEM:
 * - files: Array of file objects
 * - folders: Array of folder objects
 * - allItems: Combined files + folders
 * - fileTree: Nested tree structure
 * - expandedFolders: Set of expanded folder paths
 * - currentFolderPath: Currently selected folder
 *
 * TABS & EDITOR:
 * - openTabs: Array of open tab objects
 * - activeTab: Currently active tab object
 * - editor: CodeMirror instance
 * - _savedOpenTabs: Persisted tab state
 * - _savedActiveTabPath: Persisted active tab
 *
 * SEARCH:
 * - searchQuery: File tree search query
 * - contentSearchEnabled: Whether content search is active
 * - contentSearchResults: Set of matching file paths
 *
 * UI STATE:
 * - isMobile: Whether on mobile device
 * - sidebarVisible: Sidebar visibility
 * - theme: Current theme ("dark" or "light")
 * - showHidden: Show hidden files
 * - showRecentFiles: Show recent files panel
 *
 * FAVORITES & RECENT:
 * - favoriteFiles: Array of favorited file paths
 * - recentFiles: Array of recently opened files
 * - recentFilesLimit: Max recent files to keep
 *
 * GIT INTEGRATION:
 * - gitIntegrationEnabled: Git feature toggle
 * - gitConfig: Git configuration object
 * - gitPanelCollapsed: Git panel state
 *
 * GITEA INTEGRATION:
 * - giteaIntegrationEnabled: Gitea feature toggle
 * - giteaPanelCollapsed: Gitea panel state
 *
 * AI INTEGRATION:
 * - aiIntegrationEnabled: AI feature toggle
 * - aiType: "cloud", "local", or "rule-based"
 * - cloudProvider: "gemini", "openai", "claude"
 * - aiModel: Selected AI model
 * - geminiApiKey, openaiApiKey, claudeApiKey: API keys
 * - localAiProvider: "ollama", "lmstudio", "custom"
 * - ollamaUrl, ollamaModel: Ollama config
 * - lmStudioUrl, lmStudioModel: LM Studio config
 *
 * EDITOR SETTINGS:
 * - fontSize: Editor font size
 * - fontFamily: Editor font family
 * - tabSize: Tab width in spaces
 * - indentWithTabs: Use tabs vs spaces
 * - wordWrap: Line wrapping
 * - showLineNumbers: Show line numbers
 * - showMinimap: Show minimap
 * - showWhitespace: Show whitespace
 * - autoSave: Auto-save enabled
 * - autoSaveDelay: Auto-save delay (ms)
 *
 * UI CUSTOMIZATION:
 * - themePreset: Theme preset name
 * - accentColor: Custom accent color
 * - sidebarWidth: Sidebar width (px)
 * - tabPosition: Tab bar position
 * - breadcrumbStyle: Breadcrumb display style
 * - fileTreeCompact: Compact file tree
 * - fileTreeShowIcons: Show file icons
 * - showToasts: Show toast notifications
 *
 * PERFORMANCE:
 * - pollingInterval: Status polling interval
 * - remoteFetchInterval: Remote fetch interval
 * - fileCacheSize: File cache size
 * - enableVirtualScroll: Virtual scrolling
 *
 * OTHER:
 * - onboardingCompleted: Onboarding status
 * - customColors: Custom syntax colors
 * - rememberWorkspace: Remember open tabs
 *
 * GIT STATE (gitState object):
 * - branch: Current branch name
 * - ahead: Commits ahead of remote
 * - behind: Commits behind remote
 * - status: Git status object (staged, modified, etc.)
 * - selectedFiles: Set of selected files
 * - collapsedGroups: Set of collapsed groups
 * - lastUpdate: Last status update timestamp
 *
 * GITEA STATE (giteaState object):
 * - Similar to gitState structure
 * - collapsedGroups: Set of collapsed groups
 *
 * ELEMENTS (elements object):
 * All DOM element references cached for performance
 * - Buttons, panels, inputs, containers, etc.
 * - Initialize in initialization.js
 * - Access in all modules
 *
 * ARCHITECTURE NOTES:
 * - State is mutable (not immutable like Redux)
 * - Direct property assignment: state.property = value
 * - No automatic reactivity - must manually trigger UI updates
 * - State persisted via settings.js
 * - Elements cached for performance (no repeated querySelector)
 *
 * COMMON PATTERNS:
 * - Read state: const files = state.files
 * - Update state: state.files = newFiles; renderFileTree()
 * - Access element: elements.fileTree.innerHTML = ...
 * - Check mobile: if (state.isMobile) { ... }
 * - Tab operations: state.openTabs.push(tab); state.activeTab = tab
 *
 * BEST PRACTICES:
 * - Always update UI after changing state
 * - Don't store computed values - compute on demand
 * - Use Set for collections needing fast lookup
 * - Cache elements in elements object, not local variables
 * - Document new state properties in settings.js if persistent
 *
 * ============================================================================
 */
import { MOBILE_BREAKPOINT } from './constants.js';

export const state = {
  files: [],
  folders: [],
  allItems: [],
  fileTree: {},
  openTabs: [],
  activeTab: null,
  expandedFolders: new Set(),
  favoriteFiles: [],
  recentFiles: [],
  searchQuery: "",
  contentSearchEnabled: false,
  contentSearchResults: null,
  isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
  sidebarVisible: window.innerWidth > MOBILE_BREAKPOINT,
  theme: "dark",
  showHidden: false,
  showRecentFiles: true,
  contextMenuTarget: null,
  tabContextMenuTarget: null,
  currentFolderPath: "",
  // Tree display mode: false = folder navigation (default), true = collapsable tree
  treeCollapsableMode: false,
  // Lazy loading state (NEW - for on-demand folder loading)
  lazyLoadingEnabled: true, // Enable lazy loading by default
  loadedDirectories: new Map(), // Cache: path -> {folders: [], files: []}
  loadingDirectories: new Set(), // Track which directories are currently loading
  // Folder navigation (NEW - for browse-style navigation)
  currentNavigationPath: "", // Current folder being viewed (empty = root)
  navigationHistory: [], // History stack for back button
  editor: null,
  gitConfig: null,
  selectionMode: false,
  selectedItems: new Set(),
  customColors: {},

  // AI Configuration (New Structure)
  aiIntegrationEnabled: false,
  aiType: "rule-based", // "none" | "rule-based" | "local-ai" | "cloud"

  // Legacy field for migration
  aiProvider: "local",

  // Local AI Settings
  localAiProvider: "ollama", // "ollama" | "lm-studio" | "custom"
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "codellama:7b",
  lmStudioUrl: "http://localhost:1234",
  lmStudioModel: "",
  customAiUrl: "",
  customAiModel: "",

  // Cloud AI Settings
  cloudProvider: "gemini", // "gemini" | "openai" | "claude"
  aiModel: "gemini-2.0-flash-exp",
  geminiApiKey: "",
  openaiApiKey: "",
  claudeApiKey: "",
  themePreset: "dark",
  accentColor: null,
  fontSize: 14,
  fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
  tabSize: 2,
  indentWithTabs: false,
  sidebarWidth: 320,
  tabPosition: "top",
  wordWrap: true,
  showLineNumbers: true,
  showMinimap: false,
  showWhitespace: false,
  autoSave: false,
  autoSaveDelay: 1000,
  fileTreeCompact: false,
  fileTreeShowIcons: true,
  recentFilesLimit: 10,
  breadcrumbStyle: "path",
  giteaIntegrationEnabled: false,
  sftpIntegrationEnabled: true,
  gitPanelCollapsed: false,
  giteaPanelCollapsed: false,
  fileTreeCollapsed: false,
  rememberWorkspace: true,
  showToasts: true,
  gitIntegrationEnabled: false,
  // Performance settings
  pollingInterval: 10000,        // Git status polling interval (ms)
  remoteFetchInterval: 30000,    // Remote fetch interval (ms)
  fileCacheSize: 10,             // Number of files to cache in memory
  enableVirtualScroll: false,    // Virtual scrolling for large file trees
  enableSplitView: false,        // Enable split view feature (Experimental)
  onTabMode: false,              // One Tab Mode: auto-save & close other tabs on file open
  _lastShowHidden: false,
  _lastGitChanges: null,
  _lastGiteaChanges: null,
  // Internal tracking
  _wsUpdateTimer: null,
  _savedOpenTabs: null,
  _savedActiveTabPath: null,
  // Quick switcher
  quickSwitcherSelectedIndex: 0,
  // Search overlay
  searchOverlay: null,
  activeMatchMark: null,
  searchCaseSensitive: false, // Editor search: match case (exact match)
  searchWholeWord: false,     // Editor search: match whole word
  searchUseRegex: false,      // Editor search: use regular expression
  syntaxTheme: 'custom',      // Pre-defined syntax highlighting theme

  // Split view configuration
  splitView: {
    enabled: false,           // Is split view active?
    orientation: 'vertical',  // 'vertical' or 'horizontal'
    primaryPaneSize: 50,      // Percentage (for resize)
    activePane: 'primary',    // 'primary' or 'secondary'
    primaryTabs: [],          // Tab indices in primary pane
    secondaryTabs: [],        // Tab indices in secondary pane
    primaryActiveTab: null,   // Active tab in primary pane
    secondaryActiveTab: null  // Active tab in secondary pane
  },

  // Secondary editor instance (for split view)
  primaryEditor: null,
  secondaryEditor: null,

  // SFTP
  sftpConnections: [],       // Saved connection profiles
  sftpPanelCollapsed: false, // Panel UI state
  sftpPanelHeight: 300,      // Panel body height in px
  activeSftp: {              // Ephemeral browsing session
    connectionId: null,
    currentPath: "/",
    navigationHistory: [],
    folders: [],
    files: [],
    loading: false,
  },
};

export const elements = {};

// Git state needs to be shared too
export const gitState = {
    files: { modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: [] },
    isInitialized: false,
    hasRemote: false,
    currentBranch: "unknown",
    localBranches: [],
    remoteBranches: [],
    ahead: 0,
    behind: 0,
    selectedFiles: new Set(),
    totalChanges: 0,
    collapsedGroups: new Set(),
};

export const giteaState = {
    files: { modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: [] },
    isInitialized: false,
    hasRemote: false,
    currentBranch: "unknown",
    localBranches: [],
    remoteBranches: [],
    ahead: 0,
    behind: 0,
    selectedFiles: new Set(),
    totalChanges: 0,
    collapsedGroups: new Set(),
};
