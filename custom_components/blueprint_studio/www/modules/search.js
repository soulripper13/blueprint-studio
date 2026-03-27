import { t } from './translations.js';
/** SEARCH.JS | Purpose: * Handles in-editor find and replace functionality within a single file. */
import { state, elements } from './state.js';
import { showToast } from './ui.js';
import { setMinimapSearch, setMinimapActiveLine } from './minimap.js';

/**
 * Build effective search query/pattern based on current search options
 * Returns a string (for CodeMirror getSearchCursor) or RegExp (for regex/whole-word mode)
 */
function buildSearchQuery(rawQuery) {
  if (!rawQuery) return rawQuery;
  if (state.searchUseRegex) {
    try {
      return new RegExp(rawQuery, state.searchCaseSensitive ? "" : "i");
    } catch (e) {
      return null; // Invalid regex
    }
  }
  if (state.searchWholeWord) {
    const escaped = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, state.searchCaseSensitive ? "" : "i");
  }
  return rawQuery;
}


export function updateSearchHighlights(query) {
  if (!state.editor) return;

  if (state.searchOverlay) {
    state.editor.removeOverlay(state.searchOverlay);
    state.searchOverlay = null;
  }

  if (!query) { setMinimapSearch(null, false); return; }

  const pattern = buildSearchQuery(query);
  if (!pattern) return; // Invalid regex

  const caseInsensitive = !state.searchCaseSensitive;

  state.searchOverlay = {
    token: function(stream) {
      if (pattern instanceof RegExp) {
        if (stream.match(pattern)) return "search-match";
        stream.next();
        return null;
      }
      if (stream.match(pattern, true, caseInsensitive)) {
        return "search-match";
      }
      while (stream.next() != null && !stream.match(pattern, false, caseInsensitive)) {}
      return null;
    }
  };

  state.editor.addOverlay(state.searchOverlay);
  setMinimapSearch(pattern, state.searchCaseSensitive);
}

/**
 * Updates match count and highlights current match
 * @param {string} query - Search query
 */
export function updateMatchStatus(query) {
  if (!state.editor || !query) {
    if (elements.searchCount) elements.searchCount.textContent = "";
    if (state.activeMatchMark) {
      state.activeMatchMark.clear();
      state.activeMatchMark = null;
    }
    return;
  }

  const cursor = state.editor.getSearchCursor(buildSearchQuery(query), null, { caseFold: !state.searchCaseSensitive });
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

/**
 * Opens the search widget
 * @param {boolean} replaceMode - Whether to open in replace mode
 */
export function openSearchWidget(replaceMode = false) {
  state.searchWidgetVisible = true;
  
  // Determine which widget to use based on active pane
  const isSecondary = state.splitView?.enabled && state.splitView?.activePane === 'secondary';
  const widget = isSecondary ? elements.secondarySearchWidget : elements.searchWidget;
  const replaceRow = isSecondary ? elements.secondarySearchReplaceRow : elements.searchReplaceRow;
  const findInput = isSecondary ? elements.secondarySearchFindInput : elements.searchFindInput;

  if (!widget) return;
  widget.classList.add("visible");

  if (replaceMode) {
    widget.classList.add("replace-mode");
    if (replaceRow) replaceRow.style.display = "flex";
  } else {
    widget.classList.remove("replace-mode");
    if (replaceRow) replaceRow.style.display = "none";
  }

  if (state.editor) {
    const selection = state.editor.getSelection();
    if (selection && findInput) {
      findInput.value = selection;
      updateSearchHighlights(selection);
      updateMatchStatus(selection);
    } else if (findInput && findInput.value) {
      updateSearchHighlights(findInput.value);
      updateMatchStatus(findInput.value);
    }
  }

  // setTimeout(0): CodeMirror'un keydown handler'ı callback'ten sonra çalışıp
  // focus'u editöre geri çekiyor. Bir tick erteleyince biz kazanıyoruz.
  setTimeout(() => {
    if (findInput) {
        findInput.focus();
        findInput.select();
    }
  }, 0);
}

/**
 * Closes the search widget and clears highlights
 */
export function closeSearchWidget() {
  state.searchWidgetVisible = false;
  
  if (elements.searchWidget) elements.searchWidget.classList.remove("visible");
  if (elements.secondarySearchWidget) elements.secondarySearchWidget.classList.remove("visible");

  // Clear highlights
  if (state.editor && state.searchOverlay) {
    state.editor.removeOverlay(state.searchOverlay);
    state.searchOverlay = null;
  }
  setMinimapSearch(null, false);
  // Clear active mark
  if (state.activeMatchMark) {
    state.activeMatchMark.clear();
    state.activeMatchMark = null;
  }

  if (elements.searchCount) elements.searchCount.textContent = "";
  if (elements.secondarySearchCount) elements.secondarySearchCount.textContent = "";

  if (state.editor) state.editor.focus();
}

/**
 * Finds next/previous occurrence of search query
 * @param {boolean} reverse - Whether to search backwards
 */
export function doFind(reverse = false) {
  if (!state.editor) return;
  
  // Determine which input to use based on active pane
  const isSecondary = state.splitView?.enabled && state.splitView?.activePane === 'secondary';
  const findInput = isSecondary ? elements.secondarySearchFindInput : elements.searchFindInput;
  
  const query = findInput ? findInput.value : "";

  // Update highlights
  updateSearchHighlights(query);

  if (!query) {
    updateMatchStatus(""); // Clear status
    return;
  }

  const pattern = buildSearchQuery(query);
  if (!pattern) {
    showToast(t("toast.invalid_regular_expression"), "warning", 2000);
    return;
  }

  // Determine start position based on direction and current selection
  const startPos = state.editor.getCursor(reverse ? "from" : "to");

  let cursor = state.editor.getSearchCursor(buildSearchQuery(query), startPos, { caseFold: !state.searchCaseSensitive });

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

    cursor = state.editor.getSearchCursor(buildSearchQuery(query), wrapStart, { caseFold: !state.searchCaseSensitive });

    if (reverse) {
      found = cursor.findPrevious();
    } else {
      found = cursor.findNext();
    }

    if (found) {
      showToast(t("toast.search_wrapped"), "info", 1000);
    }
  }

  if (found) {
    state.editor.setSelection(cursor.from(), cursor.to());
    state.editor.scrollIntoView({from: cursor.from(), to: cursor.to()}, 20);
    setMinimapActiveLine(cursor.from().line);
  } else {
    showToast(t("toast.no_match_found"), "info", 1500);
  }

  // Update status/count AFTER selection is set
  updateMatchStatus(query);
}

/**
 * Replaces current match and finds next
 */
export function doReplace() {
  if (!state.editor) return;
  
  // Determine which inputs to use based on active pane
  const isSecondary = state.splitView?.enabled && state.splitView?.activePane === 'secondary';
  const findInput = isSecondary ? elements.secondarySearchFindInput : elements.searchFindInput;
  const replaceInput = isSecondary ? elements.secondarySearchReplaceInput : elements.searchReplaceInput;
  
  const query = findInput ? findInput.value : "";
  const replacement = replaceInput ? replaceInput.value : "";
  if (!query) return;

  // Check if current selection matches query
  const selection = state.editor.getSelection();
  if (selection && (state.searchCaseSensitive ? selection === query : selection.toLowerCase() === query.toLowerCase())) {
    state.editor.replaceSelection(replacement);
    doFind(); // Find next
  } else {
    doFind(); // Find first
  }
  // Update count after replace
  updateMatchStatus(query);
}

/**
 * Replaces all occurrences of search query
 */
export function doReplaceAll() {
  if (!state.editor) return;
  
  // Determine which inputs to use based on active pane
  const isSecondary = state.splitView?.enabled && state.splitView?.activePane === 'secondary';
  const findInput = isSecondary ? elements.secondarySearchFindInput : elements.searchFindInput;
  const replaceInput = isSecondary ? elements.secondarySearchReplaceInput : elements.searchReplaceInput;
  
  const query = findInput ? findInput.value : "";
  const replacement = replaceInput ? replaceInput.value : "";
  if (!query) return;

  const cursor = state.editor.getSearchCursor(buildSearchQuery(query), null, { caseFold: !state.searchCaseSensitive });
  state.editor.operation(() => {
    let count = 0;
    while (cursor.findNext()) {
      cursor.replace(replacement);
      count++;
    }
    showToast(t("toast.replaced_occurrences", { count: count }), "success");
    // Clear highlights/count since they are gone/changed
    updateSearchHighlights(query);
    updateMatchStatus(query);
  });
}