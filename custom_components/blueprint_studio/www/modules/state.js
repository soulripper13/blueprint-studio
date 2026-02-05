/**
 * Core state management for Blueprint Studio
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
  currentFolderPath: "",
  editor: null,
  gitConfig: null,
  selectionMode: false,
  selectedItems: new Set(),
  customColors: {},
  aiIntegrationEnabled: false,
  aiProvider: "local",
  aiModel: "gemini-2.0-flash-exp",
  geminiApiKey: "",
  openaiApiKey: "",
  claudeApiKey: "",
  themePreset: "dark",
  accentColor: null,
  fontSize: 14,
  fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
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
  gitPanelCollapsed: false,
  giteaPanelCollapsed: false,
  rememberWorkspace: true,
  showToasts: true,
  gitIntegrationEnabled: false,
  // Internal tracking
  _wsUpdateTimer: null,
  _savedOpenTabs: null,
  _savedActiveTabPath: null,
};

export const elements = {};

// Git state needs to be shared too
export const gitState = {
    files: { modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: [] },
    isInitialized: false,
    hasRemote: false,
    ahead: 0,
    behind: 0,
    totalChanges: 0,
};

export const giteaState = {
    files: { modified: [], added: [], deleted: [], untracked: [], staged: [], unstaged: [] },
    isInitialized: false,
    hasRemote: false,
    ahead: 0,
    behind: 0,
    totalChanges: 0,
};
