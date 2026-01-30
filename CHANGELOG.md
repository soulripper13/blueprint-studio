# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-01-30

### ✨ New Features

#### 🧠 AI Studio Copilot
Bring AI intelligence directly into your Home Assistant workflow with flexible provider support and a powerful local logic engine.
*   **Dual-Mode Intelligence**:
    *   **Cloud Mode**: Native integration for **Gemini** (defaulting to `gemini-2.0-flash-exp`) and **OpenAI** GPT models. System prompts strictly enforce 2024+ Home Assistant best practices (e.g., plural `triggers:`, mandatory `id:` fields, `metadata: {}` blocks).
    *   **Local Logic Engine**: A robust, privacy-first fallback that parses natural language locally to generate valid YAML without any external API calls.
*   **Context-Aware Analysis**: The AI reads your currently active file to provide suggestions that match your specific configuration structure.
*   **Smart Trigger Detection**: Local parser automatically extracts complex triggers from natural language:
    *   **Time**: Handles AM/PM, "at 5pm", and multiple time slots.
    *   **State**: Detects motion, door/window events, and generic on/off changes.
    *   **Numeric**: Parses "above 25 degrees", "humidity under 50%", etc.
*   **Real-time Structural Analysis**: The "Fix my error" feature uses a custom YAML loader to report exact line numbers for:
    *   Legacy syntax (`service:` vs `action:`, `platform:` triggers).
    *   Singular keys (`trigger:` vs `triggers:`).
    *   Malformed entity IDs and missing automation IDs.

#### 🎭 Intelligent Scene & Script Generation
*   **7 Smart Scene Presets**:
    *   **Morning**: 100% brightness, 4000K (Cool White), `mdi:weather-sunny`.
    *   **Evening**: 40% brightness, 2700K (Warm White), `mdi:weather-night`.
    *   **Movie**: 10% brightness, Deep Blue RGB, `mdi:movie`.
    *   **Reading**: 80% brightness, 4000K, `mdi:book-open`.
    *   **Romantic**: 20% brightness, Soft Pink/Red, `mdi:heart`.
    *   **Party**: 100% brightness, Vibrant Magenta, `mdi:party-popper`.
    *   **Relax**: 50% brightness, 2700K, `mdi:sofa`.
*   **Multi-Step Script Logic**: Automatically detects sequences ("then", "after", "wait") to generate `sequence:` blocks with precise `delay:` actions (hours/minutes/seconds).
*   **Parallel Execution Detection**: Phrases like "turn on all lights" trigger parallel execution mode for optimized performance.
*   **Advanced Domain Support**:
    *   **100+ Synonyms**: Maps terms like "chandelier" -> `light`, "roomba" -> `vacuum`, "deadbolt" -> `lock`.
    *   **Area Awareness**: Entity scoring algorithm boosts matches found in the mentioned room (e.g., "kitchen lights" prioritizes `light.kitchen_main`).

#### 📝 Jinja Template Support
*   **Advanced Editor**: Full syntax highlighting for `.jinja`, `.jinja2`, and `.j2` files.
*   **Distinct Syntax Coloring**: Brackets (`{{`, `{%`), keywords (`if`, `for`), variables, and operators are now colored distinctly from the surrounding YAML or text.
*   **Intelligent Validation**: dedicated validator checks for:
    *   Missing quotes in `states()` (e.g., `states(sensor.temp)` -> `states('sensor.temp')`).
    *   Wrong bracket usage (`{{{` -> `{{`).
    *   Missing filter pipes.
*   **Smart Suggestions**: Context-aware autocomplete for loops (`{% for %}`), time functions (`now()`), and state attributes.

#### 🎨 Professional UI Customization
*   **6 Theme Presets**: Dark (VS Code style), Light, High Contrast, Solarized (Dark/Light), Ocean, and Dracula.
*   **Custom Accent Colors**: 8 vibrant options (Blue, Purple, Pink, Cyan, etc.) with automatic hover color generation.
*   **Editor Personalization**: Adjustable font size (10-24px), 7 programming font families (Fira Code, JetBrains Mono, etc.), word wrap toggle, and whitespace visibility.
*   **File Tree Customization**: Compact mode for dense listings and toggleable file type icons.

#### 💾 Advanced File Management
*   **Configurable Auto-Save**: Automatically save files after typing stops (500ms - 5000ms delay).
*   **Smart Settings Interface**: New tabbed modal for General, Appearance, Editor, and Feature settings.
*   **Recent Files Limit**: Configurable history depth (5-30 files).
*   **Entity Explorer Mode**: New "Search Entities" toggle in Global Search (`Ctrl+Shift+F`) to browse the Home Assistant entity registry, view states, and one-click copy IDs into your configuration.
*   **UUID Generator**: Insert random UUIDs instantly with `Ctrl+Shift+U` or via the Command Palette.
*   **Filter by Content**: New toggle in the File Explorer sidebar allows filtering the file tree by content (e.g., entity IDs) instead of just filenames.
*   **Full Theme Selector**: The bottom toolbar theme menu now includes all presets (High Contrast, Solarized, Ocean, Dracula) for quick switching.
*   **Custom Editor Colors**: Added ability to customize font colors for **Line Numbers** and **Fold Arrows** (collapsible indicators) in the editor.

### 🚀 Improvements
*   **Editor UX**: Fold icons are now 40% larger and scale proportionally with your chosen font size for better visibility and easier clicking.
*   **Theme Synchronization**: The bottom toolbar theme selector is now fully synchronized with the main Settings presets, including correct icons and labels for all specific theme modes.
*   **Slider Visibility**: Improved the visual contrast of settings sliders by updating track colors to ensure they are visible across all light and dark themes.
*   **Global Search Performance**: Engineered a faster search engine that automatically excludes binary files (`.db`, `.sqlite`, `.zip`) and all hidden folders (starting with `.`), including `.storage` and `.git`.
*   **Dynamic CSS Architecture**: All themes and accent colors applied via CSS variables for instant preview without reloading.
*   **Robust Backend API**: New `check_yaml` and `check_jinja` endpoints provide instant feedback to the frontend.
*   **Self-Healing Git**: Sync recovery tools and automated branch mismatch migration.
*   **Entity Scoring Algorithm**: improved fuzzy matching logic considers friendly names, entity IDs, and area context for more accurate device selection.

### 🐛 Bug Fixes
*   **Robust Auto-Save**: Hardened the auto-save feature with background timer cleanup and execution guards to ensure it strictly respects the toggle state and prevents accidental saves after being disabled.
*   **Real-time Color Updates**: Fixed an issue where changing custom line number or fold gutter colors required a page refresh to apply.
*   **Double Save**: Resolved a conflict between editor and global keyboard shortcuts that caused files to be saved twice (and two toast notifications) when pressing Ctrl+S.
*   **Git Toggle Robustness**: Ensured the Git Changes panel and all associated toolbar buttons are completely hidden when the GitHub integration is toggled off.
*   **Drag-and-Drop Reliability**: Fixed an issue where moving files via drag-and-drop triggered duplicate API calls due to event bubbling, resulting in "Invalid path or exists" error toasts despite successful moves.
*   **Zero External Dependencies**: Local mode now strictly keeps configuration 100% private.
*   **Recent Files Logic**: Fixed limit enforcement and persistent storage issues.
*   **Toast Layering**: Corrected an issue where toast notifications were hidden behind modals by moving them to the highest visual layer (z-index).
*   **Editor Font Stability**: Corrected font loading race conditions on editor initialization.
*   **YAML Analysis**: Fixed line/column reporting for complex nested structures.

## [1.5.0] - 2026-01-25

### ✨ New Features
*   **Command Palette**: Access all Blueprint Studio features instantly with `Ctrl+K`.
*   **Commit History**: New panel to browse recent commits with color-coded diffs.
*   **YAML Snippets**: Intelligent templates for common Home Assistant patterns (`snip:`).
*   **Advanced Global Search**: Support for Regular Expressions and Case Sensitivity.

## [1.4.0] - 2026-01-25

### ✨ New Features
*   **Smart Entity Autocomplete**: Intelligent suggestions for Home Assistant entities with icons.
*   **Global Search**: Cross-file text search with context and filtering.

## [1.2.0] - 2026-01-18

### 🌟 Added - GitHub Integration & Advanced Features
*   **GitHub Integration**: Full push/pull/commit/stage workflow with OAuth.
*   **Pin Favorites**: Quick access to frequently used files in the sidebar.
*   **Smart .gitignore**: Automatically excludes large models and lock files.

## [1.0.0] - 2024-12-05

### Added
- Initial release with VS Code-like interface and multi-tab editing.
- Syntax highlighting and real-time YAML validation.

---

## Version History

- **2.0.0** - AI Copilot, Intelligent Scenes, Advanced Scripts & UI Customization
- **1.5.0** - Command Palette, Commit History & Regex Search
- **1.4.0** - Smart Autocomplete, Global Search & Bug Fixes
- **1.2.0** - GitHub Integration, Pin Favorites & Auto-Refresh
- **1.0.0** - First stable release

[Unreleased]: https://github.com/soulripper13/blueprint-studio/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v2.0.0
[1.5.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.5.0
[1.4.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.4.0
[1.2.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.2.0
[1.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.0.0