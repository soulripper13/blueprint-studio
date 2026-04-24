/** EDITORCONFIG.JS | Reads and applies .editorconfig rules to files. */
import { API_BASE } from './constants.js';

// Cache: directory path → parsed rules object (null = confirmed missing)
const cache = new Map();

/**
 * Get an auth token without throwing on failure.
 */
async function getToken() {
  try {
    if (window.parent?.hassConnection) {
      const conn = await window.parent.hassConnection;
      if (conn?.auth) {
        if (conn.auth.expired) await conn.auth.refreshAccessToken();
        return conn.auth.accessToken;
      }
    }
  } catch {}
  try {
    if (window.pwaAuth?.isAuthenticated()) return await window.pwaAuth.getToken();
  } catch {}
  return null;
}

/**
 * Fetch and parse a single .editorconfig file at the given directory path.
 * Returns null silently if it doesn't exist — no console errors on 404.
 */
async function fetchEditorConfig(dirPath) {
  const filePath = dirPath ? `${dirPath}/.editorconfig` : '.editorconfig';
  try {
    const token = await getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const url = `${API_BASE}?action=read_file&path=${encodeURIComponent(filePath)}&optional=true`;
    const response = await fetch(url, { headers, credentials: 'same-origin' });
    if (!response.ok) return null;
    const result = await response.json();
    if (!result?.content) return null;
    return parseEditorConfig(result.content);
  } catch {
    return null;
  }
}

/**
 * Parse .editorconfig text into a list of { glob, rules } entries.
 * Only handles the subset relevant to indentation.
 */
function parseEditorConfig(text) {
  const sections = [];
  let currentGlob = null;
  let currentRules = {};
  let isRoot = false;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;

    if (line.startsWith('[')) {
      if (currentGlob !== null) {
        sections.push({ glob: currentGlob, rules: currentRules });
      }
      currentGlob = line.slice(1, line.lastIndexOf(']'));
      currentRules = {};
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim().toLowerCase();
    const val = line.slice(eqIdx + 1).trim().toLowerCase();

    if (currentGlob === null) {
      // Top-level (before any section)
      if (key === 'root') isRoot = val === 'true';
    } else {
      if (key === 'indent_style') currentRules.indentStyle = val; // "space" or "tab"
      if (key === 'indent_size') currentRules.indentSize = val === 'tab' ? 'tab' : parseInt(val) || null;
      if (key === 'tab_width') currentRules.tabWidth = parseInt(val) || null;
    }
  }

  if (currentGlob !== null) {
    sections.push({ glob: currentGlob, rules: currentRules });
  }

  return { isRoot, sections };
}

/**
 * Minimal glob matcher supporting * and **.
 * Handles patterns like *.yaml, **.py, {*.yaml,*.yml}
 */
function globMatch(pattern, filename) {
  // Expand brace alternatives: {*.yaml,*.yml} → try each
  const braceMatch = pattern.match(/^\{(.+)\}$/);
  if (braceMatch) {
    return braceMatch[1].split(',').some(p => globMatch(p.trim(), filename));
  }

  // Convert glob to regex
  const re = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex special chars (not * ?)
    .replace(/\\\*/g, '*')                  // unescape * we'll handle
    .replace(/\*\*/g, '<<<DOUBLE>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<<DOUBLE>>>/g, '.*')
    .replace(/\?/g, '[^/]');

  return new RegExp(`^${re}$`).test(filename);
}

/**
 * Given a set of parsed editorconfig sections, find the rules that apply
 * to the given filename (basename only, for simple patterns).
 */
function matchRules(sections, filename) {
  let matched = {};
  for (const { glob, rules } of sections) {
    if (globMatch(glob, filename) || globMatch(glob, `**/${filename}`)) {
      matched = { ...matched, ...rules };
    }
  }
  return matched;
}

/**
 * Look up .editorconfig rules for a given file path by walking up directories.
 * Results are cached per directory.
 * @param {string} filePath - Relative file path, e.g. "automations/test.yaml"
 * @returns {Promise<{tabs: boolean, size: number}|null>} - null if no rules found
 */
export async function getEditorConfigIndent(filePath) {
  if (!filePath) return null;

  const parts = filePath.replace(/\\/g, '/').split('/');
  const filename = parts[parts.length - 1];

  // Build list of directories from file's dir up to root
  const dirs = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    dirs.push(parts.slice(0, i).join('/'));
  }

  // Walk up: collect configs, stop at root=true
  const configs = [];
  for (const dir of dirs) {
    const cacheKey = dir;
    let config;
    if (cache.has(cacheKey)) {
      config = cache.get(cacheKey);
    } else {
      config = await fetchEditorConfig(dir);
      cache.set(cacheKey, config);
    }
    if (config) {
      configs.push(config);
      if (config.isRoot) break;
    }
  }

  // Apply configs from outermost (root) inward (closest wins)
  let merged = {};
  for (const config of configs.reverse()) {
    const rules = matchRules(config.sections, filename);
    merged = { ...merged, ...rules };
  }

  if (!merged.indentStyle) return null;

  const useTabs = merged.indentStyle === 'tab';
  const size = useTabs
    ? (merged.tabWidth || merged.indentSize || 4)
    : (typeof merged.indentSize === 'number' ? merged.indentSize : 2);

  return { tabs: useTabs, size };
}

/**
 * Invalidate cached .editorconfig for a directory (call when a .editorconfig is saved).
 * @param {string} dirPath
 */
export function invalidateEditorConfigCache(dirPath = '') {
  cache.delete(dirPath);
}
