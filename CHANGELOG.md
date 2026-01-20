# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Branch management (create, switch, merge)
- Diff viewer for file changes
- Conflict resolution UI
- Commit history viewer
- Pull request integration
- Favorite files with persistence
- Default open files on startup
- Configurable editor settings
- Search across all files
- Code snippets and templates

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

- **1.2.0** - GitHub Integration, Pin Favorites & Auto-Refresh
- **1.0.0** - First stable release
- **0.1.0** - Beta version

[Unreleased]: https://github.com/soulripper13/blueprint-studio/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.2.0
[1.0.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v1.0.0
[0.1.0]: https://github.com/soulripper13/blueprint-studio/releases/tag/v0.1.0
