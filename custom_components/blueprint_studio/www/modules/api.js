/**
 * API and WebSocket client for Blueprint Studio
 */
import { state, elements, gitState, giteaState } from './state.js';
import { API_BASE } from './constants.js';

export async function fetchWithAuth(url, options = {}) {
  let headers = { ...options.headers };
  let token = null;
  let isHassEnvironment = false;

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
    if (isHassEnvironment) {
        throw new Error("Auth refresh failed: " + e.message);
    }
  }

  if (token) {
      headers["Authorization"] = `Bearer ${token}`;
  } else if (isHassEnvironment) {
      throw new Error("No authentication token available");
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  if (response.status === 401) {
      try {
          if (window.parent && window.parent.hassConnection) {
              const conn = await window.parent.hassConnection;
              if (conn && conn.auth) {
                  await conn.auth.refreshAccessToken();
                  token = conn.auth.accessToken;
                  if (token) {
                      headers["Authorization"] = `Bearer ${token}`;
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
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function loadSettings() {
    try {
      const settings = await fetchWithAuth(`${API_BASE}?action=get_settings`);
      
      // Map properties to state
      state.theme = settings.theme || "dark";
      state.themePreset = settings.themePreset || "dark";
      state.accentColor = settings.accentColor || null;
      state.fontSize = settings.fontSize || 14;
      state.fontFamily = settings.fontFamily || "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace";
      state.showToasts = settings.showToasts !== false;
      state.rememberWorkspace = settings.rememberWorkspace !== false;
      state.autoSave = settings.autoSave || false;
      state.autoSaveDelay = settings.autoSaveDelay || 1000;
      state.gitIntegrationEnabled = settings.gitIntegrationEnabled ?? true;
      state.giteaIntegrationEnabled = settings.giteaIntegrationEnabled ?? false;
      
      // ... more settings ...
    } catch (e) {
      console.log("Failed to load settings", e);
    }
}

export async function saveSettings() {
    try {
      const settings = {
        theme: state.theme,
        themePreset: state.themePreset,
        accentColor: state.accentColor,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        showToasts: state.showToasts,
        rememberWorkspace: state.rememberWorkspace,
        autoSave: state.autoSave,
        autoSaveDelay: state.autoSaveDelay,
        gitIntegrationEnabled: state.gitIntegrationEnabled,
        giteaIntegrationEnabled: state.giteaIntegrationEnabled,
        // ... more ...
      };

      await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_settings", settings: settings }),
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
}

// These functions will be defined in other modules but we need to trigger them here
// We'll use a registry pattern or global event bus if needed, but for now we'll 
// just import them when main.js ties everything together.
let updateCallbacks = {
    checkFileUpdates: null,
    checkGitStatus: null,
    loadFiles: null
};

export function registerUpdateCallbacks(callbacks) {
    updateCallbacks = { ...updateCallbacks, ...callbacks };
}

export async function initWebSocketSubscription() {
  try {
    if (window.parent && window.parent.hassConnection) {
      const conn = await window.parent.hassConnection;
      
      conn.subscribeMessage(
        (event) => {
          if (state._wsUpdateTimer) clearTimeout(state._wsUpdateTimer);
          state._wsUpdateTimer = setTimeout(() => {
              if (updateCallbacks.checkFileUpdates) updateCallbacks.checkFileUpdates();
              if (updateCallbacks.checkGitStatus) updateCallbacks.checkGitStatus();
              
              if (event && ["create", "delete", "rename", "create_folder", "upload", "upload_folder"].includes(event.action)) {
                  if (updateCallbacks.loadFiles) updateCallbacks.loadFiles();
              }
          }, 500);
        },
        { type: "blueprint_studio/subscribe_updates" }
      );
      console.log("Blueprint Studio: Real-time updates active");
    }
  } catch (e) {
    console.error("Blueprint Studio: WebSocket subscription failed", e);
  }
}
