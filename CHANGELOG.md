# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.2] - 2026-01-25

### ✨ New Features
*   **Onboarding Wizard**: A guided tour for new users to initialize their repo, configure ignores, and connect to GitHub.
*   **Git Integration Choice**: The onboarding wizard now asks if you want to enable Git integration upfront, allowing users to opt-out if they don't need version control.
*   **Bulk File Operations**: New selection mode allows you to pick multiple files and folders to download as a single, compressed ZIP archive.
*   **Explorer-Integrated Diff**: Modified files now feature a "Difference" icon directly in the file tree, allowing for instant side-by-side code reviews without leaving the explorer.
*   **Visual Diff Viewer**: Powerful side-by-side comparison of local changes versus the last Git commit with color-coded highlighting.
*   **Enhanced Search Experience**: 
    *   **Live Match Counting**: Instantly see "X of Y" matches as you navigate.
    *   **Distinct Active Highlight**: The current match stands out in vivid orange for maximum visibility.
    *   **Smart Search Wrapping**: Navigation now loops between the top and bottom of files with helpful feedback.
*   **Professional Search & Replace**: A new floating search widget with dedicated Next/Prev and Replace/All functionality (`Ctrl+F`, `Ctrl+H`).
*   **Optimized .gitignore Manager**: Intelligence added to filter redundant paths (e.g., ignoring a folder automatically prunes individual file rules), keeping your configuration clean.
*   **Intelligent Git Integration**: UI feedback and background tasks now fully respect the "Enable Git Integration" setting, ensuring a silent experience when disabled.
*   **Performance & UI Polish**: Optimized diff scrolling, enhanced checkbox logic for cascading selections, and refined theme colors for better readability.

## [1.3.1] - 2026-01-24

### ✨ New Features
*   **Drag & Drop Reorganization**: Move files and folders by dragging them in the file tree. Supports dropping into folders and back to the root directory, with visual feedback and safety confirmations.
*   **Drag & Drop Upload**: Upload files from your computer by simply dragging them into the file explorer.
*   **Quick File Switcher**: Press `Ctrl+P` (or `Cmd+P`) to instantly search and open files by name using fuzzy matching.
*   **Toggle Sidebar Shortcut**: Use `Ctrl+B` (or `Cmd+B`) to quickly show/hide the file explorer sidebar.
*   **Tab Switching Shortcuts**: Navigate open tabs with `Ctrl+Tab` (Next) and `Ctrl+Shift+Tab` (Previous).

### 🐞 Bug Fixes
*   **Copy Naming**: Fixed auto-naming when copying files to preserve the extension (e.g., `file_copy.yaml`).
*   **macOS App Compatibility**: Resolved an issue where file clicks were unresponsive in the Home Assistant macOS app due to conflicting touch event handlers.

## [1.3.0] - 2026-01-22

### ✨ New Features
*   **Onboarding Wizard**: A guided tour for new users to initialize their repo, configure ignores, and connect to GitHub.
*   **Reset Application**: A "Danger Zone" option in Settings to reset app state, clear credentials, or delete the local repo.
*   **Visual Sync Status**: Real-time arrows (↑/↓) in the Git panel header showing ahead/behind commit counts.
*   **Advanced .gitignore Editor**: Full interactive tree view with collapsible folders, cascading selection, and file sizes.
*   **Total Size Calculator**: Real-time calculation of selected files' size in the ignore manager, warning if >100MB.
*   **Remove Remote**: Ability to delete configured remotes from the Settings UI.
*   **Restart Home Assistant**: A dedicated button in the toolbar to restart HA with safety confirmation.
*   **Smart Commit Messages**: Auto-generates default commit messages based on staged files.
*   **Folder Sizes**: File explorer now displays the size of directories.

### 🚀 Improvements
*   **Robust Git Operations**: Fixed "not a full refname" and "no tracking info" errors by explicitly targeting branches.
*   **Auto-Repair**: Detects "index.lock" and corrupt index errors, offering one-click "Clean" or "Repair" buttons.
*   **Safety Checks**: Proactively prompts to commit staged changes before pushing.
*   **Clearer Terminology**: Added beginner-friendly tooltips to all Git buttons.
*   **Persistent Errors**: Error toasts now remain visible until dismissed.

### 🐞 Bug Fixes
*   **Ignore Manager**: Fixed "File type not allowed" and cascading checkbox logic.
*   **Hidden Files**: Ensure `.ha_run.lock` and other hidden files are visible for ignoring.
*   **Upload Z-Index**: Fixed confirmation dialog appearing behind loading overlay.

## [1.2.1] - 2026-01-19

### ✨ New Features
*   **Pre-Save YAML Validation**: Blueprint Studio now automatically validates your YAML files when you click "Save". If an error is found, you'll be shown a confirmation dialog with the details and an option to "Save Anyway".
*   **User-Friendly YAML Errors**: Technical YAML error messages are now translated into simple, helpful advice for common issues, improving clarity during validation checks.
*   **Recent Files Panel**: A new section at the top of the file explorer provides quick access to recently opened files, with a toggle in settings to show/hide it.

### 🚀 Improvements
*   **File Size Display**: File sizes are now displayed next to filenames in the file explorer.
*   **Smart "Toggle All" Button**: The "Collapse All" and "Expand All" buttons have been merged into a single dynamic toggle in the file tree header.
*   **Enhanced Login Flow**: The GitHub login process is more responsive with a "Check Now" button added to the authorization popup.
*   **Contextual Toast Actions**: Toast notifications now include action buttons (e.g., "Clean & Retry" for Git locks, "Open Git Panel" for no-commits warnings).
*   **Improved Empty States**: Enhanced the welcome screen with "Create New File" and "Upload File" buttons, and the Git panel's empty state with "Pull" and "Refresh" actions.
*   **Consistent Confirmation Dialogs**: Replaced native browser `confirm()` with styled modals for Git Reset, Init, and Pull actions.
*   **Toggle Switch Visibility**: Improved the visibility of toggle switches in their "off" state.
*   **Pixel-Perfect Icon Centering**: Adjusted CSS to ensure the 'x' icon in toast notifications is perfectly centered.
*   **Modal Close Button Styling**: The close button in modal headers now blends with the modal background until hovered.
*   **Toast Action Button Styling**: The background and text color of action buttons in toast notifications have been updated for better visibility and consistency.

### 🐞 Bug Fixes
*   **OAuth Background Polling**: Fixed a bug where OAuth polling could continue in the background, causing "slow down" errors, especially after navigating away from the panel.
*   **"Unstage All" Crash**: Resolved an issue causing a crash when using "Unstage All" in new Git repositories without prior commits.
*   **Cache Invalidation**: Implemented a cache-busting mechanism for `blueprint_studio.js` to ensure the latest updates are loaded.

## [1.2.0] - 2026-01-18

### 🌟 Added - GitHub Integration & Advanced Features

- **Automatic Git Status Refresh** - Git panel updates automatically without manual refresh ⚡
  - Auto-refresh after file save operations
  - Auto-refresh after file create operations
  - Auto-refresh after file delete operations
  - Auto-refresh after file rename operations
  - Auto-refresh after file copy operations
  - Auto-refresh after file upload operations
  - Auto-refresh after folder upload operations
  - Git Changes panel appears/disappears automatically based on changes
- **Periodic Git Polling** - Detects changes made outside Blueprint Studio 🔄
  - Polls git status every 30 seconds automatically
  - Catches changes from terminal, other editors, or Home Assistant
  - Only runs when Git features are enabled
  - Silent background operation with no UI interruption
- **Pin Favorites** - Quick access to frequently used files 📌
  - Pin any file to the top of the sidebar for instant access
  - Click the pin icon next to any file to add/remove from favorites
  - Favorites persist across restarts in localStorage
  - Visual indicator with orange pin icon for pinned files
  - Dedicated favorites panel at the top of the file tree
- **Smart .gitignore Template** - Prevents large files from being committed 🛡️
  - Automatically excludes `piper/` directory (TTS model files)
  - Automatically excludes `*.onnx` files (large ML models)
  - Automatically excludes `.ha_run.lock` (runtime lock file)
  - Prevents GitHub file size limit errors (100 MB limit)
  - Applied when initializing new git repositories
- **Create GitHub Repository** - One-click repository creation directly from Blueprint Studio
  - New "Create New GitHub Repository" button in Git Settings modal
  - Modal dialog for entering repository name, description, and visibility
  - Automatic repository creation on GitHub via API
  - Auto-initialization of local git repository
  - Auto-configuration of remote origin
  - Input validation for repository names
  - Error handling for existing repositories
- **Smart Sidebar Resize** - Automatic sidebar width adjustment for Git integration
  - Sidebar auto-resizes to 360px when Git panel becomes visible (if currently < 340px)
  - Ensures stage buttons ("Stage Selected", "Stage All", "Unstage All", "Commit") fit cleanly
  - Increased default sidebar width from 280px to 320px for better content display
  - Only applies on desktop (respects mobile responsive behavior)
  - Respects user's manual resize preferences (no auto-resize if already ≥ 340px)
- **GitHub Logo Integration** - Professional GitHub branding in UI 🎨
  - GitHub logo in Git Settings modal header
  - GitHub logo on OAuth login button
  - Consistent GitHub branding throughout Git features
- **New API endpoint:** `github_create_repo` for repository creation
- **New API endpoint:** `git_push_only` for pushing without committing
- **Complete GitHub Integration** - Full push/pull/commit/stage workflow
  - GitHub OAuth device flow authentication
  - Personal Access Token (PAT) support
  - Stage/unstage individual files or all changes
  - Commit with custom messages
  - Push to remote repositories
  - Detailed error messages from GitHub API
  - Real-time git status updates

### 📚 Documentation

- Updated README with Git Integration and Pin Favorites features
- Updated CHANGELOG with comprehensive v1.2.0 release notes
- Added details about periodic polling and smart .gitignore
- Added comprehensive release notes (`RELEASE_NOTES_v1.2.0.md`)

### Community Requests

- ✅ GitHub integration for push/pull (Most requested feature)
- ✅ Lightweight alternative to VSCode
- ✅ Mobile-friendly interface
- ✅ Pin frequently used files for quick access

## [1.0.0] - 2024-12-05

### Added
- Initial release
- VS Code-like file editor interface
- Multi-tab file editing
- File tree explorer with expandable folders
- Syntax highlighting for YAML, JSON, Python, JavaScript, HTML, CSS, Markdown, Shell
- Real-time YAML validation and linting
- File management operations (create, delete, rename, copy)
- Upload and download files
- Folder download as ZIP
- Folder upload from ZIP
- Search and replace functionality
- Keyboard shortcuts (Ctrl+S, Ctrl+F, Ctrl+H, etc.)
- Auto-close brackets
- Code folding
- Line numbers
- Active line highlighting
- Bracket matching
- Dark theme
- Status bar with cursor position and file type
- Toast notifications
- Resizable sidebar
- File search in explorer
- Path traversal protection
- Admin-only access
- Protected files feature
- Allowed file extensions validation

### Security
- Path traversal protection
- Admin authentication required
- File extension whitelist
- Protected paths for critical files
- Directory exclusion for sensitive folders

## [0.1.0] - Beta

### Added
- Beta testing version
- Core editor functionality
- Basic file operations

---

## Version History

- **1.2.1** - Enhanced UX, YAML Validation & Bug Fixes
- **1.2.0** - GitHub Integration, Pin Favorites & Auto-Refresh
- **1.0.0** - First stable release
- **0.1.0** - Beta version

[Unreleased]: https://github.com/soulripper13/blueprint-studio/compare/v1.2.1...HEAD
[1.2.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.2.0
[1.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.0.0
[0.1.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v0.1.0
