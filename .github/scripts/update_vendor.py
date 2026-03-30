#!/usr/bin/env python3
"""
update_vendor.py — Blueprint Studio vendor library updater.

Checks each bundled library against its latest release on npm or cdnjs,
downloads updated files if a newer version is available, and updates
version references in panel_custom.html.

Called by: .github/workflows/vendor-update.yml
"""

import hashlib
import json
import os
import re
import shutil
import sys
import urllib.request
from pathlib import Path

try:
    import requests
    from packaging.version import Version
except ImportError:
    print("ERROR: Install dependencies first: pip install requests packaging")
    sys.exit(1)

# ── Repo root (two levels up from this script) ────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parents[2]
VENDOR_DIR = REPO_ROOT / "custom_components" / "blueprint_studio" / "www" / "vendor"
PANEL_HTML = REPO_ROOT / "custom_components" / "blueprint_studio" / "www" / "panels" / "panel_custom.html"

# ── Library manifest ──────────────────────────────────────────────────────────
# Each entry describes one library.
#
# Keys:
#   name          – display name for log output
#   npm           – npm package name (used to fetch latest version)
#   cdnjs         – cdnjs package name (alternative to npm; used when cdnjs
#                   has better file URLs than unpkg)
#   current       – version string currently bundled (updated by this script)
#   files         – list of { url_template, dest } pairs
#                   url_template may contain {version}
#   version_re    – optional regex to extract current version from panel_custom.html
#                   (used to keep the manifest self-documenting; not strictly required)

LIBRARIES = [
    {
        "name": "CodeMirror",
        "npm": "codemirror",
        "current": "5.65.19",
        "files": [
            # Core CSS/JS
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/codemirror.min.css",
                "dest": "codemirror/css/codemirror.min.css",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/codemirror.min.js",
                "dest": "codemirror/js/codemirror.min.js",
            },
            # Addons — CSS
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/lint/lint.min.css",
                "dest": "codemirror/css/lint.min.css",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/dialog/dialog.min.css",
                "dest": "codemirror/css/dialog.min.css",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/fold/foldgutter.min.css",
                "dest": "codemirror/css/foldgutter.min.css",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/hint/show-hint.min.css",
                "dest": "codemirror/css/show-hint.min.css",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/merge/merge.min.css",
                "dest": "codemirror/css/merge.min.css",
            },
            # Themes
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/theme/material-darker.min.css",
                "dest": "codemirror/css/material-darker.min.css",
            },
            # Addons — JS
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/yaml/yaml.min.js",
                "dest": "codemirror/js/yaml.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/javascript/javascript.min.js",
                "dest": "codemirror/js/javascript.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/python/python.min.js",
                "dest": "codemirror/js/python.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/clike/clike.min.js",
                "dest": "codemirror/js/clike.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/css/css.min.js",
                "dest": "codemirror/js/css.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/xml/xml.min.js",
                "dest": "codemirror/js/xml.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/htmlmixed/htmlmixed.min.js",
                "dest": "codemirror/js/htmlmixed.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/markdown/markdown.min.js",
                "dest": "codemirror/js/markdown.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/mode/shell/shell.min.js",
                "dest": "codemirror/js/shell.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/lint/lint.min.js",
                "dest": "codemirror/js/lint.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/edit/matchbrackets.min.js",
                "dest": "codemirror/js/matchbrackets.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/edit/closebrackets.min.js",
                "dest": "codemirror/js/closebrackets.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/search/search.min.js",
                "dest": "codemirror/js/search.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/search/searchcursor.min.js",
                "dest": "codemirror/js/searchcursor.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/search/jump-to-line.min.js",
                "dest": "codemirror/js/jump-to-line.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/dialog/dialog.min.js",
                "dest": "codemirror/js/dialog.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/fold/foldcode.min.js",
                "dest": "codemirror/js/foldcode.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/fold/foldgutter.min.js",
                "dest": "codemirror/js/foldgutter.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/fold/indent-fold.min.js",
                "dest": "codemirror/js/indent-fold.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/fold/brace-fold.min.js",
                "dest": "codemirror/js/brace-fold.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/comment/comment.min.js",
                "dest": "codemirror/js/comment.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/selection/active-line.min.js",
                "dest": "codemirror/js/active-line.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/hint/show-hint.min.js",
                "dest": "codemirror/js/show-hint.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/hint/anyword-hint.min.js",
                "dest": "codemirror/js/anyword-hint.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/mode/overlay.min.js",
                "dest": "codemirror/js/overlay.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/{version}/addon/merge/merge.min.js",
                "dest": "codemirror/js/merge.min.js",
            },
            # CodeMirror 5 max version is 5.x — npm shows "latest" as 6.x
            # We pin to cdnjs which still has the 5.x series properly tagged.
            # Version resolved via cdnjs API instead (see fetch_latest_version).
        ],
        # CodeMirror 5 is on npm as "codemirror" but v6 is a full rewrite.
        # Fetch via cdnjs API to stay on the 5.x series.
        "cdnjs": "codemirror",
        "max_major": 5,
    },
    {
        "name": "marked",
        "npm": "marked",
        "current": "12.0.0",
        "files": [
            {
                # marked ≥ 13 moved the bundle to lib/marked.umd.min.js
                "url": "https://cdn.jsdelivr.net/npm/marked@{version}/lib/marked.umd.min.js",
                "dest": "marked/marked.min.js",
            },
        ],
    },
    {
        "name": "marked-gfm-heading-id",
        "npm": "marked-gfm-heading-id",
        "current": "3.2.0",
        "files": [
            {
                # moved from src/index.umd.js → lib/index.umd.js
                "url": "https://cdn.jsdelivr.net/npm/marked-gfm-heading-id@{version}/lib/index.umd.js",
                "dest": "marked/marked-gfm-heading-id.umd.js",
            },
        ],
    },
    {
        "name": "marked-mangle",
        "npm": "marked-mangle",
        "current": "1.1.9",
        "files": [
            {
                # moved from src/index.umd.js → lib/index.umd.js
                "url": "https://cdn.jsdelivr.net/npm/marked-mangle@{version}/lib/index.umd.js",
                "dest": "marked/marked-mangle.umd.js",
            },
        ],
    },
    {
        "name": "marked-highlight",
        "npm": "marked-highlight",
        "current": "2.1.4",
        "files": [
            {
                # moved from src/index.umd.js → lib/index.umd.js
                "url": "https://cdn.jsdelivr.net/npm/marked-highlight@{version}/lib/index.umd.js",
                "dest": "marked/marked-highlight.umd.js",
            },
        ],
    },
    {
        "name": "highlight.js",
        "npm": "highlight.js",
        "current": "11.10.0",
        "files": [
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{version}/highlight.min.js",
                "dest": "highlight/highlight.min.js",
            },
            {
                "url": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{version}/styles/github-dark.min.css",
                "dest": "highlight/github-dark.min.css",
            },
        ],
        "cdnjs": "highlight.js",
    },
    {
        "name": "PDF.js",
        "npm": "pdfjs-dist",
        "current": "4.6.82",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/pdfjs-dist@{version}/build/pdf.min.mjs",
                "dest": "pdfjs/pdf.min.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/pdfjs-dist@{version}/build/pdf.worker.min.mjs",
                "dest": "pdfjs/pdf.worker.min.js",
            },
        ],
        # PDF.js major versions can be breaking; only update within same major.
        "max_major": 4,
    },
    {
        "name": "Prettier",
        "npm": "prettier",
        "current": "3.3.3",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/standalone.js",
                "dest": "prettier/standalone.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/babel.js",
                "dest": "prettier/babel.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/estree.js",
                "dest": "prettier/estree.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/yaml.js",
                "dest": "prettier/yaml.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/html.js",
                "dest": "prettier/html.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/markdown.js",
                "dest": "prettier/markdown.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/postcss.js",
                "dest": "prettier/postcss.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/prettier@{version}/plugins/typescript.js",
                "dest": "prettier/typescript.js",
            },
        ],
    },
    {
        "name": "Acorn",
        "npm": "acorn",
        "current": "8.12.1",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/acorn@{version}/dist/acorn.js",
                "dest": "acorn/acorn.js",
            },
        ],
    },
    {
        "name": "diff-match-patch",
        "npm": "diff-match-patch",
        "current": "1.0.5",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/diff-match-patch@{version}/index.js",
                "dest": "diff/diff_match_patch.js",
            },
        ],
    },
    {
        "name": "xterm.js",
        "npm": "@xterm/xterm",
        "current": "5.5.0",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/@xterm/xterm@{version}/lib/xterm.js",
                "dest": "xterm/xterm.js",
            },
            {
                "url": "https://cdn.jsdelivr.net/npm/@xterm/xterm@{version}/css/xterm.css",
                "dest": "xterm/xterm.css",
            },
        ],
    },
    {
        "name": "xterm-addon-fit",
        "npm": "@xterm/addon-fit",
        "current": "0.10.0",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/@xterm/addon-fit@{version}/lib/addon-fit.js",
                "dest": "xterm/addon-fit.js",
            },
        ],
    },
    {
        "name": "xterm-addon-web-links",
        "npm": "@xterm/addon-web-links",
        "current": "0.11.0",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@{version}/lib/addon-web-links.js",
                "dest": "xterm/addon-web-links.js",
            },
        ],
    },
    {
        "name": "Primer Octicons",
        "npm": "@primer/octicons",
        "current": "19.12.0",
        "files": [
            {
                "url": "https://cdn.jsdelivr.net/npm/@primer/octicons@{version}/build/build.css",
                "dest": "octicons/octicons.css",
            },
        ],
    },
]

# ── Version resolution ────────────────────────────────────────────────────────

NPM_REGISTRY = "https://registry.npmjs.org"
CDNJS_API = "https://api.cdnjs.com/libraries"


def fetch_latest_npm(package: str, max_major: int | None = None) -> str | None:
    """Return the latest stable version from npm, respecting max_major if set."""
    try:
        url = f"{NPM_REGISTRY}/{package}"
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        # "dist-tags.latest" gives the current stable release
        latest = data.get("dist-tags", {}).get("latest")
        if latest and max_major is not None:
            v = Version(latest)
            if v.major > max_major:
                # Walk versions descending to find the latest within max_major
                all_versions = sorted(
                    (Version(k) for k in data.get("versions", {}) if not Version(k).is_prerelease),
                    reverse=True,
                )
                for ver in all_versions:
                    if ver.major == max_major:
                        return str(ver)
                return None
        return latest
    except Exception as exc:
        print(f"  [WARN] npm lookup failed for {package}: {exc}")
        return None


def fetch_latest_cdnjs(package: str, max_major: int | None = None) -> str | None:
    """Return the latest version from the cdnjs API."""
    try:
        url = f"{CDNJS_API}/{package}?fields=version,versions"
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        if max_major is not None:
            versions = sorted(
                (Version(v) for v in data.get("versions", []) if not Version(v).is_prerelease),
                reverse=True,
            )
            for ver in versions:
                if ver.major == max_major:
                    return str(ver)
            return None
        return data.get("version")
    except Exception as exc:
        print(f"  [WARN] cdnjs lookup failed for {package}: {exc}")
        return None


def fetch_latest_version(lib: dict) -> str | None:
    """Resolve the latest version for a library entry."""
    max_major = lib.get("max_major")

    # Prefer cdnjs when specified (better for CoedMirror 5.x, highlight.js)
    if "cdnjs" in lib:
        ver = fetch_latest_cdnjs(lib["cdnjs"], max_major)
        if ver:
            return ver

    if "npm" in lib:
        return fetch_latest_npm(lib["npm"], max_major)

    return None


# ── File download ─────────────────────────────────────────────────────────────

def download_file(url: str, dest: Path) -> bool:
    """Download url → dest, return True on success."""
    try:
        resp = requests.get(url, timeout=30, stream=True)
        resp.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as fh:
            for chunk in resp.iter_content(chunk_size=65536):
                fh.write(chunk)
        size = dest.stat().st_size
        if size < 100:
            # Suspiciously small — likely a 404 HTML page slipped through
            content = dest.read_bytes()
            if b"<!DOCTYPE" in content or b"<html" in content:
                dest.unlink()
                print(f"    [ERROR] Got HTML instead of JS/CSS from {url}")
                return False
        return True
    except Exception as exc:
        print(f"    [ERROR] Download failed {url}: {exc}")
        return False


# ── panel_custom.html version string patching ─────────────────────────────────

def _patch_html_versions(updates: dict[str, tuple[str, str]]) -> None:
    """
    Rewrite version strings in panel_custom.html for updated libraries.

    updates = { library_name: (old_version, new_version) }

    We look for the old_version string anywhere inside a vendor URL path and
    replace it with new_version.  This is intentionally broad so we catch
    every occurrence (CSS links, script tags).
    """
    if not PANEL_HTML.exists():
        print("[WARN] panel_custom.html not found — skipping HTML version patch")
        return

    html = PANEL_HTML.read_text(encoding="utf-8")
    changed = False

    for lib_name, (old_v, new_v) in updates.items():
        if old_v == new_v:
            continue
        # Match version inside a vendor path (e.g. /vendor/codemirror/... or
        # cdn.jsdelivr.net/npm/marked@3.0.0/ )
        # Simple string replacement is safe here because version strings like
        # "5.65.19" are unlikely to appear in non-URL context.
        new_html = html.replace(old_v, new_v)
        if new_html != html:
            html = new_html
            changed = True
            print(f"  [HTML] {lib_name}: {old_v} → {new_v}")

    if changed:
        PANEL_HTML.write_text(html, encoding="utf-8")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("=" * 60)
    print("Blueprint Studio — vendor library updater")
    print("=" * 60)

    updated_libs: list[str] = []
    html_updates: dict[str, tuple[str, str]] = {}
    errors: list[str] = []

    for lib in LIBRARIES:
        name = lib["name"]
        current = lib["current"]
        print(f"\n[{name}] current={current}")

        latest = fetch_latest_version(lib)
        if latest is None:
            print(f"  [SKIP] Could not resolve latest version")
            errors.append(f"{name}: version lookup failed")
            continue

        try:
            is_newer = Version(latest) > Version(current)
        except Exception:
            print(f"  [SKIP] Could not compare versions: {current} vs {latest}")
            continue

        if not is_newer:
            print(f"  [OK]   Already at latest ({latest})")
            continue

        print(f"  [UPDATE] {current} → {latest}")
        all_ok = True

        for file_entry in lib["files"]:
            url = file_entry["url"].replace("{version}", latest)
            dest = VENDOR_DIR / file_entry["dest"]
            print(f"    Downloading {file_entry['dest']} ...")
            ok = download_file(url, dest)
            if not ok:
                all_ok = False
                errors.append(f"{name}: download failed for {file_entry['dest']}")

        if all_ok:
            lib["current"] = latest  # Update in-memory for summary
            updated_libs.append(f"{name}: {current} → {latest}")
            html_updates[name] = (current, latest)
        else:
            print(f"  [WARN] Some files failed; keeping old version in HTML")

    # Patch version strings in panel_custom.html
    if html_updates:
        print("\n[Patching panel_custom.html]")
        _patch_html_versions(html_updates)

    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)

    if updated_libs:
        print(f"\nUpdated {len(updated_libs)} librar{'y' if len(updated_libs) == 1 else 'ies'}:")
        for line in updated_libs:
            print(f"  • {line}")
    else:
        print("\nAll libraries are already up to date.")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for line in errors:
            print(f"  ✗ {line}")
        # Exit with non-zero so the workflow doesn't silently open a PR
        # with broken files.  The PR step only runs when git diff detects
        # changes, so partial failures that wrote no files won't trigger it.
        sys.exit(1)


if __name__ == "__main__":
    main()
