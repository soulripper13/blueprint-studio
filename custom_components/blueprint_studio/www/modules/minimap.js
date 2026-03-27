/** MINIMAP.JS | Purpose: * Renders a VS Code-style minimap for CodeMirror editors. */

const MINIMAP_WIDTH = 110;
const FONT_SIZE = 3;
const LINE_H = 4;
const PADDING = 2;

const MATCH_COLOR         = 'rgba(255, 197, 61, 0.6)';   // VS Code yellow
const MATCH_ACTIVE_COLOR  = 'rgba(255, 160, 0, 0.9)';    // brighter for active match

function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    bg:      style.getPropertyValue('--bg-secondary').trim()   || '#1e1e2e',
    text:    style.getPropertyValue('--text-primary').trim()   || '#cdd6f4',
    keyword: style.getPropertyValue('--syntax-keyword').trim() || '#89b4fa',
    string:  style.getPropertyValue('--syntax-string').trim()  || '#a6e3a1',
    comment: style.getPropertyValue('--syntax-comment').trim() || '#585b70',
    number:  style.getPropertyValue('--syntax-number').trim()  || '#fab387',
  };
}

function tokenColor(type, colors) {
  if (!type) return colors.text;
  if (type.includes('comment'))                                                   return colors.comment;
  if (type.includes('string'))                                                    return colors.string;
  if (type.includes('keyword') || type.includes('def') || type.includes('tag'))  return colors.keyword;
  if (type.includes('number')  || type.includes('atom'))                         return colors.number;
  return colors.text;
}

/**
 * Collects all match positions for a query using CodeMirror's getSearchCursor.
 * Returns array of { line, fromCh, toCh }.
 */
function collectMatches(cm, pattern, caseSensitive) {
  const matches = [];
  if (!pattern || !cm.getSearchCursor) return matches;
  try {
    const cursor = cm.getSearchCursor(pattern, { line: 0, ch: 0 }, { caseFold: !caseSensitive });
    let limit = 10000; // safety cap for huge files
    while (cursor.findNext() && limit-- > 0) {
      matches.push({ line: cursor.from().line, fromCh: cursor.from().ch, toCh: cursor.to().ch });
    }
  } catch { /* ignore invalid patterns */ }
  return matches;
}

class MinimapInstance {
  constructor(canvas, viewportEl, editor) {
    this.canvas      = canvas;
    this.viewport    = viewportEl;
    this.editor      = editor;
    this.ctx         = canvas.getContext('2d');
    this._raf        = null;
    this._dirty      = true;
    this._offscreen  = document.createElement('canvas');
    this._offCtx     = this._offscreen.getContext('2d');
    // Search state
    this._searchPattern   = null;
    this._searchMatches   = [];  // [{ line, fromCh, toCh }]
    this._activeLine      = -1;  // line of the currently selected match

    this._onUpdate = () => this._scheduleRender();
    this._onScroll = () => this._blit();

    editor.on('change',         this._onUpdate);
    editor.on('swapDoc',        this._onUpdate);
    editor.on('viewportChange', this._onUpdate);
    editor.on('scroll',         this._onScroll);

    this._bindPointer();
    this._scheduleRender();
  }

  _scheduleRender() {
    this._dirty = true;
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      if (this._dirty) this._render();
    });
  }

  /** Re-collect matches and re-render. Called when search query changes. */
  setSearch(pattern, caseSensitive, activeLine) {
    this._searchPattern = pattern || null;
    this._activeLine    = activeLine !== undefined ? activeLine : -1;
    this._searchMatches = [];

    if (pattern) {
      // Defer match collection to next tick so CodeMirror's overlay/cursor
      // operations from the search widget have fully settled first.
      setTimeout(() => {
        this._searchMatches = collectMatches(this.editor, pattern, caseSensitive);
        this._scheduleRender();
      }, 0);
    } else {
      this._scheduleRender();
    }
  }

  /** Update the active match line and re-render to show the new highlight. */
  setActiveLine(line) {
    this._activeLine = line;
    this._scheduleRender();
  }

  _render() {
    this._dirty = false;
    const cm     = this.editor;
    const colors = getThemeColors();
    const total  = cm.lineCount();
    const dpr    = window.devicePixelRatio || 1;

    const bufferH = Math.max(total * LINE_H, 1);
    this._offscreen.width  = MINIMAP_WIDTH * dpr;
    this._offscreen.height = bufferH * dpr;
    const offCtx = this._offCtx;
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    offCtx.fillStyle = colors.bg;
    offCtx.fillRect(0, 0, MINIMAP_WIDTH, bufferH);

    // Text
    offCtx.font         = `${FONT_SIZE}px monospace`;
    offCtx.textBaseline = 'top';

    for (let i = 0; i < total; i++) {
      const y = i * LINE_H;
      try {
        let x = PADDING;
        for (const tok of cm.getLineTokens(i)) {
          if (x >= MINIMAP_WIDTH - PADDING) break;
          offCtx.fillStyle = tokenColor(tok.type, colors);
          offCtx.fillText(tok.string, x, y, MINIMAP_WIDTH - x - PADDING);
          x += offCtx.measureText(tok.string).width;
        }
      } catch {
        offCtx.fillStyle = colors.text;
        offCtx.fillText(cm.getLine(i) || '', PADDING, y, MINIMAP_WIDTH - PADDING * 2);
      }
    }

    // Search match highlights drawn on top of text
    if (this._searchMatches.length > 0) {
      offCtx.font         = `${FONT_SIZE}px monospace`;
      offCtx.textBaseline = 'top';

      for (const m of this._searchMatches) {
        const y      = m.line * LINE_H;
        const isActive = m.line === this._activeLine;

        // Measure x positions using the line tokens to stay pixel-accurate
        const lineText = cm.getLine(m.line) || '';
        // Approximate char-to-x by measuring the prefix string
        const xFrom = PADDING + offCtx.measureText(lineText.slice(0, m.fromCh)).width;
        const xTo   = PADDING + offCtx.measureText(lineText.slice(0, m.toCh)).width;
        const w     = Math.max(xTo - xFrom, 2);

        offCtx.fillStyle = isActive ? MATCH_ACTIVE_COLOR : MATCH_COLOR;
        offCtx.fillRect(xFrom, y, Math.min(w, MINIMAP_WIDTH - xFrom - 1), LINE_H);
      }
    }

    this._blit();
  }

  _blit() {
    const cm         = this.editor;
    const canvas     = this.canvas;
    const ctx        = this.ctx;
    const scrollInfo = cm.getScrollInfo();
    const containerH = canvas.parentElement.clientHeight || 400;
    const dpr        = window.devicePixelRatio || 1;
    const total      = cm.lineCount();
    const totalH     = total * LINE_H;

    if (canvas.width !== MINIMAP_WIDTH * dpr || canvas.height !== containerH * dpr) {
      canvas.width        = MINIMAP_WIDTH * dpr;
      canvas.height       = containerH   * dpr;
      canvas.style.width  = MINIMAP_WIDTH + 'px';
      canvas.style.height = containerH   + 'px';
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const maxEditorScroll = Math.max(0, scrollInfo.height - scrollInfo.clientHeight);
    const scrollRatio     = maxEditorScroll > 0 ? scrollInfo.top / maxEditorScroll : 0;
    const maxBufferScroll = Math.max(0, totalH - containerH);
    const srcY            = scrollRatio * maxBufferScroll;

    ctx.clearRect(0, 0, MINIMAP_WIDTH, containerH);

    if (this._offscreen.width > 0 && this._offscreen.height > 0) {
      const srcH = Math.min(containerH, totalH - srcY);
      if (srcH > 0) {
        ctx.drawImage(
          this._offscreen,
          0, srcY * dpr,
          this._offscreen.width, srcH * dpr,
          0, 0,
          MINIMAP_WIDTH, srcH
        );
      }
    }

    // Viewport highlight overlay
    const vpHeightMinimap = (scrollInfo.clientHeight / Math.max(scrollInfo.height, 1)) * totalH;
    const vpHeight        = Math.max(vpHeightMinimap, 8);
    const vpTopInBuffer   = scrollRatio * (totalH - vpHeight);
    const vpTopVisible    = vpTopInBuffer - srcY;

    this.viewport.style.top    = Math.max(0, vpTopVisible).toFixed(1) + 'px';
    this.viewport.style.height = Math.min(vpHeight, containerH).toFixed(1) + 'px';
  }

  _bindPointer() {
    let dragging = false;
    const scrollTo = (clientY) => {
      const rect       = this.canvas.getBoundingClientRect();
      const ratio      = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const scrollInfo = this.editor.getScrollInfo();
      this.editor.scrollTo(null, ratio * (scrollInfo.height - scrollInfo.clientHeight));
    };
    this.canvas.addEventListener('mousedown', (e) => { dragging = true; scrollTo(e.clientY); });
    document.addEventListener('mousemove',    (e) => { if (dragging) scrollTo(e.clientY); });
    document.addEventListener('mouseup',      ()  => { dragging = false; });
    this.canvas.addEventListener('touchstart', (e) => scrollTo(e.touches[0].clientY), { passive: true });
    this.canvas.addEventListener('touchmove',  (e) => scrollTo(e.touches[0].clientY), { passive: true });
  }

  destroy() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    this.editor.off('change',         this._onUpdate);
    this.editor.off('swapDoc',        this._onUpdate);
    this.editor.off('viewportChange', this._onUpdate);
    this.editor.off('scroll',         this._onScroll);
  }
}

const _instances = {};

export function attachMinimap(canvasId, editor) {
  detachMinimap(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !editor) return;

  const container = canvas.parentElement;
  container.classList.add('minimap-visible');
  canvas.style.display = 'block';

  let viewport = container.querySelector(`.minimap-viewport[data-for="${canvasId}"]`);
  if (!viewport) {
    viewport = document.createElement('div');
    viewport.className   = 'minimap-viewport';
    viewport.dataset.for = canvasId;
    container.appendChild(viewport);
  }
  viewport.style.display = 'block';

  _instances[canvasId] = new MinimapInstance(canvas, viewport, editor);
}

export function detachMinimap(canvasId) {
  if (_instances[canvasId]) {
    _instances[canvasId].destroy();
    delete _instances[canvasId];
  }
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const container = canvas.parentElement;
  container.classList.remove('minimap-visible');
  canvas.style.display = 'none';

  const viewport = container.querySelector(`.minimap-viewport[data-for="${canvasId}"]`);
  if (viewport) viewport.style.display = 'none';
}

export function applyMinimapState(primaryEditor, secondaryEditor, showMinimap, activeTab) {
  const isTextTab = activeTab && !activeTab.isBinary && !activeTab.isTerminal;
  const show = showMinimap && isTextTab;

  if (show) {
    if (primaryEditor)   attachMinimap('minimap',           primaryEditor);
    if (secondaryEditor) attachMinimap('secondary-minimap', secondaryEditor);
  } else {
    detachMinimap('minimap');
    detachMinimap('secondary-minimap');
  }
}

/**
 * Updates search highlights on all active minimap instances.
 * Called from search.js whenever the query changes or is cleared.
 *
 * @param {string|RegExp|null} pattern  - The built search pattern (same as passed to getSearchCursor)
 * @param {boolean} caseSensitive
 * @param {number} activeLine           - Line number of the currently selected match (-1 if none)
 */
export function setMinimapSearch(pattern, caseSensitive, activeLine = -1) {
  for (const instance of Object.values(_instances)) {
    instance.setSearch(pattern, caseSensitive, activeLine);
  }
}

/**
 * Updates only the active match line (e.g. when navigating next/prev).
 * Cheaper than a full re-render — just reblits with the new active line.
 *
 * @param {number} activeLine
 */
export function setMinimapActiveLine(activeLine) {
  for (const instance of Object.values(_instances)) {
    instance.setActiveLine(activeLine);
  }
}
