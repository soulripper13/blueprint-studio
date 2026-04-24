/** UTILS.JS | Purpose: * Collection of utility/helper functions used throughout Blueprint Studio. */
import { MOBILE_BREAKPOINT, TEXT_FILE_EXTENSIONS } from './constants.js';

/**
 * ============================================================================
 * PERFORMANCE UTILITIES
 * ============================================================================
 */

/**
 * Debounce function - delays execution until after wait time has elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, wait) {
  let timeout;
  let previous = 0;

  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Request Animation Frame throttle - calls function on next animation frame
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(func) {
  let rafId = null;

  return function executedFunction(...args) {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Memoize function results - caches return values based on arguments
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize(func) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Cached regex compilation - prevents recompiling same patterns
 * @param {string} pattern - Regex pattern
 * @param {string} flags - Regex flags (g, i, m, etc.)
 * @returns {RegExp} Compiled and cached regex
 */
export function getCachedRegex(pattern, flags = '') {
  const key = `${pattern}:::${flags}`;

  if (!window._regexCache) {
    window._regexCache = new Map();
  }

  if (!window._regexCache.has(key)) {
    try {
      window._regexCache.set(key, new RegExp(pattern, flags));
    } catch (e) {
      console.error('Invalid regex pattern:', pattern, e);
      return null;
    }
  }

  return window._regexCache.get(key);
}

/**
 * Clear regex cache (useful for memory management)
 */
export function clearRegexCache() {
  if (window._regexCache) {
    window._regexCache.clear();
  }
}

/**
 * ============================================================================
 * FILE UTILITIES
 * ============================================================================
 */

export function isTextFile(filename) {
  if (!filename) return false;
  if (filename.includes(".storage/") || filename.startsWith(".storage/")) return true;
  const ext = filename.split(".").pop().toLowerCase();
  return TEXT_FILE_EXTENSIONS.has(ext);
}

export function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT ||
    (window.innerWidth <= 1024 && navigator.maxTouchPoints > 0);
}

export function isTouchDevice() {
  return (
    navigator.maxTouchPoints > 0 ||
    ('ontouchstart' in window) ||
    (window.matchMedia && (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(any-pointer: coarse)').matches
    ))
  );
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function lightenColor(hex, percent) {
  if (!hex) return hex;
  const num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
        // Script tag exists, but check if it's loaded successfully
        if (existingScript.hasAttribute('data-loaded')) {
            resolve();
            return;
        }
        // If script exists but not marked as loaded, wait for it or reload
        existingScript.addEventListener('load', () => {
            existingScript.setAttribute('data-loaded', 'true');
            resolve();
        });
        existingScript.addEventListener('error', () => {
            // Remove failed script and try again
            existingScript.remove();
            loadScript(url).then(resolve).catch(reject);
        });
        return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Lazy-load Diff/Merge libraries
export async function ensureDiffLibrariesLoaded(showGlobalLoading, hideGlobalLoading) {
  if (window.diff_match_patch && CodeMirror.MergeView) return;
  
  if (showGlobalLoading) showGlobalLoading("Initializing Diff viewer...");
  try {
      if (!window.diff_match_patch) {
          await loadScript("/local/blueprint_studio/vendor/diff/diff_match_patch.js");
      }
      if (!CodeMirror.MergeView) {
          await loadScript("/local/blueprint_studio/vendor/codemirror/js/merge.min.js");
      }
  } catch (e) {
      console.error("Failed to load Diff libraries", e);
      throw new Error("Could not load Diff components. Please check your internet connection.");
  } finally {
      if (hideGlobalLoading) hideGlobalLoading();
  }
}

// Memoized file icon lookup (theme support reverted)
function _getFileIcon(filename) {
  // Home Assistant .storage entries are JSON
  if (filename && (filename.includes(".storage/") || filename.startsWith(".storage/"))) {
    return { icon: "data_object", class: "json" };
  }

  const ext = filename ? filename.split(".").pop().toLowerCase() : "";

  switch (ext) {
    case "yaml":
    case "yml":
      return { icon: "description", class: "yaml" };
    case "json":
      return { icon: "data_object", class: "json" };
    case "csv":
      return { icon: "table_chart", class: "default" };
    case "py":
      return { icon: "code", class: "python" };
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return { icon: "javascript", class: "js" };
    case "css":
      return { icon: "style", class: "default" };
    case "html":
    case "htm":
      return { icon: "html", class: "default" };
    case "xml":
      return { icon: "code", class: "default" };
    case "md":
    case "rst":
      return { icon: "article", class: "default" };
    case "txt":
      return { icon: "text_snippet", class: "default" };
    case "log":
      return { icon: "receipt_long", class: "default" };
    case "sh":
    case "bash":
    case "zsh":
      return { icon: "terminal", class: "default" };
    case "conf":
    case "cfg":
    case "ini":
    case "toml":
    case "env":
    case "properties":
      return { icon: "settings", class: "default" };
    case "jinja":
    case "jinja2":
    case "j2":
      return { icon: "integration_instructions", class: "default" };
    case "db":
    case "sqlite":
    case "sql":
      return { icon: "storage", class: "default" };
    case "pem":
    case "crt":
    case "der":
      return { icon: "verified_user", class: "default" };
    case "key":
      return { icon: "vpn_key", class: "default" };
    case "bin":
      return { icon: "memory", class: "default" };
    case "zip":
    case "tar":
    case "gz":
      return { icon: "archive", class: "default" };
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "ico":
    case "bmp":
      return { icon: "image", class: "default" };
    case "pdf":
      return { icon: "picture_as_pdf", class: "default" };
    case "mp4":
    case "webm":
    case "mov":
    case "avi":
    case "mkv":
    case "flv":
    case "wmv":
    case "m4v":
      return { icon: "movie", class: "default" };
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "aac":
    case "m4a":
    case "wma":
    case "opus":
      return { icon: "audiotrack", class: "default" };
    case "go":
    case "rs":
    case "c":
    case "java":
    case "kt":
    case "swift":
    case "rb":
    case "php":
    case "lua":
    case "r":
    case "cs":
      return { icon: "code", class: "default" };
    case "gradle":
    case "plist":
    case "service":
    case "dockerignore":
      return { icon: "settings", class: "default" };
    default:
      return { icon: "insert_drive_file", class: "default" };
  }
}

export const getFileIcon = memoize(_getFileIcon);

export function getEditorMode(filename) {
    if (!filename) return null;
    if (filename.includes(".storage/") || filename.startsWith(".storage/")) {
        return { name: "javascript", json: true };
    }
    const ext = filename.split(".").pop().toLowerCase();

    // Toggle for custom HA YAML mode
    const yamlMode = "ha-yaml";

    const modeMap = {
      yaml: yamlMode,
      yml: yamlMode,
      json: { name: "javascript", json: true },
      csv: "csv",
      py: "python",
      js: "javascript",
      ts: "javascript",
      jsx: "javascript",
      tsx: "javascript",
      css: "css",
      html: "htmlmixed",
      htm: "htmlmixed",
      xml: "xml",
      md: "markdown",
      rst: null,
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      txt: null,
      log: null,
      conf: yamlMode,
      cfg: yamlMode,
      ini: "yaml",
      toml: null,
      env: null,
      jinja: yamlMode,
      jinja2: yamlMode,
      j2: yamlMode,
      db: null,
      sqlite: null,
      sql: "sql",
      pem: null,
      crt: null,
      key: null,
      der: null,
      bin: null,
      ota: null,
      cpp: "text/x-c++src",
      h: "text/x-c++src",
      c: "text/x-csrc",
      java: "text/x-java",
      kt: "text/x-java",
      go: "go",
      rb: "ruby",
      php: "php",
      lua: "lua",
      rs: null,
      swift: null,
      r: null,
      cs: null,
      tar: null,
      gz: null,
      gitignore: yamlMode,
      lock: null,
      properties: null,
      gradle: null,
      plist: "xml",
      service: null,
      dockerignore: null,
    };
    return modeMap[ext] || null;
}

export function getLanguageName(filename) {
    if (!filename) return "Plain Text";
    const ext = filename.split(".").pop().toLowerCase();
    const nameMap = {
      yaml: "YAML",
      yml: "YAML",
      json: "JSON",
      csv: "CSV",
      py: "Python",
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "JSX",
      tsx: "TSX",
      css: "CSS",
      html: "HTML",
      htm: "HTML",
      xml: "XML",
      md: "Markdown",
      rst: "reStructuredText",
      sh: "Shell",
      bash: "Bash",
      zsh: "Zsh",
      txt: "Plain Text",
      log: "Log",
      conf: "Config",
      cfg: "Config",
      ini: "INI",
      toml: "TOML",
      env: "Environment",
      jinja: "Jinja",
      jinja2: "Jinja2",
      j2: "Jinja",
      db: "Database",
      sqlite: "Database",
      sql: "SQL",
      pem: "Certificate",
      crt: "Certificate",
      key: "Key",
      der: "Binary Certificate",
      bin: "Binary",
      ota: "OTA Firmware",
      cpp: "C++",
      h: "C/C++ Header",
      c: "C",
      java: "Java",
      kt: "Kotlin",
      go: "Go",
      rs: "Rust",
      swift: "Swift",
      rb: "Ruby",
      php: "PHP",
      lua: "Lua",
      r: "R",
      cs: "C#",
      tar: "Tar Archive",
      gz: "Gzip Archive",
      gitignore: "Git Ignore",
      lock: "Lock File",
      properties: "Properties",
      gradle: "Gradle",
      plist: "Property List",
      service: "Systemd Service",
      dockerignore: "Docker Ignore",
    };
    return nameMap[ext] || "Plain Text";
}

/**
 * Extracts the real file system path from a virtual path (stripping protocol/host)
 * @param {string} path - The virtual path (e.g., sftp://conn/path/to/file)
 * @returns {string} The real path
 */
export function getTruePath(path) {
  if (!path) return "";
  
  if (path.startsWith('sftp://')) {
    const withoutScheme = path.slice('sftp://'.length);
    const slashIdx = withoutScheme.indexOf('/');
    return slashIdx === -1 ? '/' : withoutScheme.slice(slashIdx);
  }
  
  if (path.startsWith('terminal://')) {
    return "/"; // Terminals represent a session, root path is usually /
  }
  
  // Local files: ensure /config/ prefix
  if (!path.startsWith('/config/')) {
    return '/config/' + path.replace(/^\//, '');
  }
  
  return path;
}

/**
 * Copy text to clipboard with fallback for non-secure contexts (HTTP)
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  // 1. Try modern API first (requires secure context: HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Modern clipboard API failed, trying fallback:', err);
    }
  }

  // 2. Fallback to older execCommand method
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure textarea is not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard fallback failed:', err);
    return false;
  }
}

/**
 * Adds long-press (touch) support to elements with context menu listeners
 * Long-press (500ms) on touch devices triggers the context menu
 * @param {HTMLElement} element - The element to add long-press support to
 */
export function enableLongPressContextMenu(element) {
    let longPressTimer = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let contextMenuTriggered = false;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        contextMenuTriggered = false;

        // Start long-press timer (500ms)
        longPressTimer = setTimeout(() => {
            contextMenuTriggered = true;
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Trigger contextmenu event at touch location
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX: touchStartX,
                clientY: touchStartY
            });
            element.dispatchEvent(contextMenuEvent);
            longPressTimer = null;
        }, 500);
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        // Cancel timer if touch ended before 500ms
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        
        // Prevent ghost click if context menu was triggered
        if (contextMenuTriggered && e.cancelable) {
            e.preventDefault();
        }
    }, { passive: false });

    element.addEventListener('touchmove', (e) => {
        // Cancel long-press if user moves finger (more than 10px)
        const moveX = Math.abs(e.touches[0].clientX - touchStartX);
        const moveY = Math.abs(e.touches[0].clientY - touchStartY);
        if (moveX > 10 || moveY > 10) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }
    }, { passive: true });
}


