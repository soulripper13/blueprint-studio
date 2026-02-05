/**
 * Utility functions for Blueprint Studio
 */
import { state, elements } from './state.js';
import { MOBILE_BREAKPOINT, TEXT_FILE_EXTENSIONS } from './constants.js';

export function isTextFile(filename) {
  if (!filename) return false;
  if (filename.includes(".storage/") || filename.startsWith(".storage/")) return true;
  const ext = filename.split(".").pop().toLowerCase();
  // Using a local copy of extensions for now or passing it
  const extensions = new Set([
    "yaml", "yml", "json", "py", "js", "css", "html", "txt",
    "md", "conf", "cfg", "ini", "sh", "log", "svg", "jinja", "jinja2", "j2",
    "pem", "crt", "key", "cpp", "h", "gitignore", "lock"
  ]);
  return extensions.has(ext);
}

export function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
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
export async function ensureDiffLibrariesLoaded(showGlobalLoading, hideGlobalLoading) {
  if (window.diff_match_patch && CodeMirror.MergeView) return;
  
  if (showGlobalLoading) showGlobalLoading("Initializing Diff viewer...");
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
      if (hideGlobalLoading) hideGlobalLoading();
  }
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
    zip: { icon: "archive", class: "default" },
    tar: { icon: "archive", class: "default" },
    gz: { icon: "archive", class: "default" },
    jpg: { icon: "image", class: "default" },
    jpeg: { icon: "image", class: "default" },
    png: { icon: "image", class: "default" },
    gif: { icon: "image", class: "default" },
    svg: { icon: "image", class: "default" },
    webp: { icon: "image", class: "default" },
    pdf: { icon: "picture_as_pdf", class: "default" }
  };
  return iconMap[ext] || { icon: "insert_drive_file", class: "default" };
}
