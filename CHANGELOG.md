# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-01-31

### ✨ New Features
*   **Block Scope Highlighting**: Added a visual vertical line indicator that appears when clicking on Home Assistant keywords (e.g., `automation:`, `trigger:`, `action:`) to clearly show the boundaries of code blocks.


### 🚀 Improvements
*   **Intelligent Scope Detection**: Enhanced the block detection logic to correctly handle complex YAML list structures and shared indentation levels common in `automations.yaml`.
*   **Toolbar Save Button**: Fixed a critical issue where the Save button in the toolbar was unresponsive when auto-save was disabled due to an event parameter conflict.
*   **Code Folding Restoration**: Fixed a regression where configuration blocks could no longer be collapsed in YAML files.


## [2.0.0] - 2026-01-30

### ✨ New Features

#### 🧠 AI Studio Copilot
Bring AI intelligence directly into your Home Assistant workflow with flexible provider support and a powerful local logic engine.
*   **Dual-Mode Intelligence**: Support for Gemini, OpenAI, and a privacy-first Local Engine.
*   **Context-Aware Analysis**: AI reads your active file to provide targeted help.
*   **2024+ Best Practices**: Strictly enforces modern Home Assistant syntax.
*   **Improved Time Parsing**: Better natural language understanding for times like "7pm" and "at 5 am".

#### 🎭 Intelligent Scene & Script Generation
*   **7 Smart Scene Presets**: Morning, Evening, Movie, Reading, Romantic, Party, and Relax.
*   **Multi-Step Script Logic**: Automatically generates `sequence:` blocks with delays from natural language.
*   **Advanced Domain Support**: 100+ synonyms and area-aware entity scoring.

#### 📝 Jinja Template Support
*   **Advanced Editor**: Full syntax highlighting for `.jinja`, `.jinja2`, and `.j2` files.
*   **Visual Clarity**: Distinct coloring for brackets (`{{`, `{%`), keywords, variables, and operators.
*   **Intelligent Validation**: Real-time error detection for common Jinja mistakes.

#### 🔍 Advanced Search & Navigation
*   **Entity Explorer Mode**: New "Search Entities" toggle in Global Search (`Ctrl+Shift+F`) to browse the Home Assistant entity registry, view states, and one-click copy IDs.
*   **Filter by Content**: New toggle in the File Explorer sidebar allows filtering the file tree by text content (e.g., entity IDs).
*   **High-Performance Global Search**: Optimized search engine that skips hidden folders (`.storage`, `.git`) and binary files.

#### 🆔 UUID Generator
*   **Instant Insertion**: Generate and insert random UUIDs v4 instantly with `Ctrl+Shift+U` or via the Command Palette.

#### 🎨 Professional UI Customization
*   **6 Theme Presets**: Dark, Light, High Contrast, Solarized Dark/Light, Ocean, and Dracula.
*   **Custom Accent Colors**: 8 vibrant options with automatic hover color generation.
*   **Editor Personalization**: Adjustable font size, programming font families, word wrap, and **Enhanced Whitespace Visualization**.
*   **Custom Editor Colors**: Ability to customize font colors for **Line Numbers** and **Fold Arrows**.
*   **Full Theme Selector**: Quick-switch menu in the bottom toolbar for all presets, fully synchronized with global settings.

#### 💾 Advanced File Management
*   **Configurable Auto-Save**: Automated saving after typing stops.
*   **Smart Settings Interface**: New tabbed modal for organized configuration.

## [1.5.0] - 2026-01-25

### ✨ New Features
*   **Command Palette**: Access features instantly with `Ctrl+K`.
*   **Commit History**: Browse past changes with full color-coded diffs.
*   **YAML Snippets**: Intelligent templates for common HA patterns.

---

## Version History

- **2.0.1** - Bug Fixes & Stability
- **2.0.0** - AI Copilot, Intelligent Scenes & UI Customization
- **1.5.0** - Command Palette, Commit History & Regex Search
- **1.4.0** - Smart Autocomplete, Global Search & Bug Fixes
- **1.2.0** - GitHub Integration, Pin Favorites & Auto-Refresh
- **1.0.0** - First stable release

[Unreleased]: https://github.com/soulripper13/blueprint-studio/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/soulripper13/blueprint-studio/releases/tag/v2.0.1
[2.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v2.0.0
[1.5.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.5.0
[1.4.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.4.0
[1.2.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.2.0
[1.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.0.0