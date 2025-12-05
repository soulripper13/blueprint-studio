# Blueprint Studio

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/soulripper13/blueprint-studio.svg)](https://github.com/soulripper13/blueprint-studio/releases)
[![License](https://img.shields.io/github/license/soulripper13/blueprint-studio.svg)](LICENSE)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1.0%2B-blue.svg)
![Maintenance](https://img.shields.io/maintenance/yes/2025.svg)

A modern, feature-rich file editor for Home Assistant. Edit your YAML configuration files and other text-based files directly from the Home Assistant UI with a professional VS Code-like experience.

---

## Table of Contents

- [Why Blueprint Studio?](#why-blueprint-studio)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Supported File Types](#supported-file-types)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Support](#support)

---

## Why Blueprint Studio?

- **No External Tools Required** - Edit files directly in Home Assistant without SSH or file shares
- **Professional Editor** - Full-featured code editor with syntax highlighting and linting
- **Safe & Secure** - Built-in protection against path traversal and unauthorized access
- **Multi-File Editing** - Work with multiple files simultaneously using tabs
- **File Management** - Create, delete, rename, copy, upload, and download files and folders

## Features

### Editor Features
- **Syntax Highlighting** - Support for YAML, JSON, Python, JavaScript, HTML, CSS, Markdown, and Shell scripts
- **Code Folding** - Collapse and expand code sections
- **Line Numbers** - Easy navigation with line numbers
- **Active Line Highlighting** - See your cursor position clearly
- **Bracket Matching** - Automatic bracket highlighting
- **Auto-close Brackets** - Automatic bracket completion
- **YAML Linting** - Real-time YAML syntax validation with error highlighting

### UI Features
- **Dark Theme** - VS Code-inspired dark theme
- **File Tree Explorer** - Navigate your config directory with an expandable folder tree
- **File Type Icons** - Different colored icons for various file types
- **Multiple Tabs** - Open and edit multiple files simultaneously
- **Resizable Sidebar** - Drag to resize the file explorer
- **File Search** - Filter files in the explorer
- **Status Bar** - Shows cursor position, file type, and connection status
- **Toast Notifications** - Elegant success/error messages

### File Management
- **Create Files & Folders** - Right-click context menu for creating new items
- **Upload Files** - Drag & drop or click to upload files from your computer
- **Download Files** - Download individual files or entire folders as ZIP
- **Copy & Paste** - Duplicate files and folders
- **Rename & Move** - Rename files or move them to different locations
- **Delete** - Remove files and folders (with protection for critical files)
- **Folder Operations** - Upload/download entire folder structures as ZIP files

### Toolbar
- Save / Save All
- Undo / Redo
- Cut / Copy / Paste
- Search / Replace
- YAML Validation
- Refresh file list
- Collapse/Expand all folders
- Upload/Download files and folders

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Save file |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Save all files |
| `Ctrl+F` / `Cmd+F` | Search in file |
| `Ctrl+H` / `Cmd+H` | Search and replace |
| `Ctrl+G` / `Cmd+G` | Go to line |
| `Ctrl+/` / `Cmd+/` | Toggle comment |
| `Ctrl+W` / `Cmd+W` | Close tab |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Shift+Z` | Redo |

## Installation

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed in your Home Assistant
2. Add this repository as a custom repository:
   - Go to HACS → Integrations → ⋮ (three dots) → Custom repositories
   - Add `https://github.com/soulripper13/blueprint-studio` as an Integration
3. Search for "Blueprint Studio" in HACS and install it
4. Restart Home Assistant
5. Go to Settings → Devices & Services → Add Integration → Blueprint Studio

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/soulripper13/blueprint-studio/releases)
2. Extract the `blueprint_studio` folder to your `custom_components` directory
3. Restart Home Assistant
4. Go to Settings → Devices & Services → Add Integration → Blueprint Studio

## Configuration

Blueprint Studio requires no configuration! After installation:

1. The integration will appear in Settings → Devices & Services
2. A new "Blueprint Studio" menu item will appear in your Home Assistant sidebar
3. Click it to start editing your files

**Note:** Blueprint Studio is admin-only for security reasons. Only users with administrator privileges can access it.

## Usage

### Opening Files
- Click on any file in the file tree to open it in the editor
- Files open in new tabs, allowing you to work with multiple files simultaneously
- Use the file search box to quickly find files

### Editing Files
- Make your changes in the editor
- Press `Ctrl+S` (or `Cmd+S` on Mac) to save
- Use `Ctrl+Shift+S` to save all open files at once

### Creating New Files
- Right-click in the file tree where you want to create the file
- Select "New File" or "New Folder"
- Enter the name and the file will be created

### Uploading Files
- Use the upload button in the toolbar
- Drag and drop files directly into the upload dialog
- Choose whether to overwrite existing files

### Downloading Files
- Right-click on a file or folder
- Select "Download"
- Folders are downloaded as ZIP files

### YAML Validation
- Click the YAML validation button in the toolbar
- Any syntax errors will be highlighted in red
- Hover over errors to see the error message

## Supported File Types

| Extension | Language |
|-----------|----------|
| `.yaml`, `.yml` | YAML |
| `.json` | JSON |
| `.py` | Python |
| `.js` | JavaScript |
| `.html` | HTML |
| `.css` | CSS |
| `.md` | Markdown |
| `.sh` | Shell |
| `.txt`, `.log` | Plain Text |
| `.conf`, `.cfg`, `.ini` | Config |

## Security

Blueprint Studio includes multiple layers of security protection:

- **Path Traversal Protection** - Prevents access to files outside your Home Assistant config directory
- **Admin Only Access** - Only users with administrator privileges can use the editor
- **Allowed File Extensions** - Only text-based configuration files can be edited (see Supported File Types)
- **Excluded Directories** - Sensitive directories like `.storage`, `deps`, and `__pycache__` are hidden
- **Protected Files** - Critical files like `configuration.yaml` and `secrets.yaml` cannot be deleted (but can be edited)
- **Input Validation** - All file operations are validated to prevent malicious input
- **Authentication Required** - All API endpoints require Home Assistant authentication

**Best Practices:**
- Always backup your configuration before making major changes
- Use YAML validation before saving configuration files
- Test changes in a development environment when possible
- Keep regular backups of your Home Assistant configuration

## Troubleshooting

### Integration doesn't appear in sidebar
- Ensure you've restarted Home Assistant after installation
- Check that you're logged in as an administrator
- Clear your browser cache and refresh the page
- Check the Home Assistant logs for any errors

### Files not showing in the tree
- Some directories are excluded for security (`.storage`, `deps`, `.cache`, etc.)
- Hidden files (starting with `.`) are not shown
- Only files with supported extensions are displayed
- Try clicking the refresh button in the toolbar

### Cannot save files
- Ensure you have write permissions on the config directory
- Check that the file extension is in the allowed list
- Verify there's enough disk space
- Check the Home Assistant logs for permission errors

### YAML validation shows errors
- Review the error message by hovering over the red highlighted area
- Common issues: incorrect indentation, missing colons, unquoted special characters
- Use an online YAML validator for complex debugging
- Check the Home Assistant documentation for proper YAML syntax

### Upload/Download not working
- Check browser console for JavaScript errors
- Ensure files are within size limits
- Verify file extensions are allowed
- Try a different browser if issues persist

## FAQ

**Q: Can I edit files outside the Home Assistant config directory?**
A: No. Blueprint Studio is restricted to your Home Assistant config directory for security reasons.

**Q: Why can't I see `.storage` or other hidden directories?**
A: These directories are excluded for security. Editing files in `.storage` can corrupt your Home Assistant installation.

**Q: Can non-admin users access Blueprint Studio?**
A: No. Blueprint Studio requires administrator privileges to ensure only trusted users can edit configuration files.

**Q: Does Blueprint Studio backup files automatically?**
A: No. You should maintain your own backup strategy using Home Assistant's backup features or external tools.

**Q: Can I use Blueprint Studio on mobile devices?**
A: Yes, but the experience is optimized for desktop. A larger screen is recommended for editing.

**Q: Will my changes take effect immediately?**
A: Most configuration changes require reloading the affected integration or restarting Home Assistant. Blueprint Studio only saves files, it doesn't reload configurations.

**Q: Can I install multiple instances?**
A: No. Blueprint Studio allows only one instance per Home Assistant installation.

**Q: Is syntax highlighting available for all file types?**
A: Yes, for all supported file types listed in the Supported File Types section.

**Q: Can I customize the theme or editor settings?**
A: Currently, Blueprint Studio uses a fixed VS Code-inspired dark theme. Customization options may be added in future versions.

## Requirements

- Home Assistant 2024.1.0 or newer
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Administrator access to your Home Assistant instance

## Technical Details

### Architecture
- **Integration Type:** Service integration with config flow
- **IoT Class:** Local Push
- **Frontend:** Custom HTML panel with CodeMirror editor
- **Backend:** Python-based REST API using aiohttp

### API Endpoints
Blueprint Studio exposes the following API endpoints (authentication required):

**GET `/api/blueprint_studio`**
- `action=list_files` - List all editable files
- `action=list_all` - List all files and folders
- `action=read_file&path=<path>` - Read file contents
- `action=download_folder&path=<path>` - Download folder as ZIP

**POST `/api/blueprint_studio`**
- `action=write_file` - Save file contents
- `action=create_file` - Create new file
- `action=create_folder` - Create new folder
- `action=delete` - Delete file or folder
- `action=copy` - Copy file or folder
- `action=rename` - Rename/move file or folder
- `action=check_yaml` - Validate YAML syntax
- `action=upload_file` - Upload file with base64 content
- `action=upload_folder` - Upload ZIP and extract

### File Structure
```
custom_components/blueprint_studio/
├── __init__.py          # Main integration setup
├── config_flow.py       # Configuration flow handler
├── const.py             # Constants and configuration
├── manifest.json        # Integration metadata
└── panels/
    └── panel_custom.html # Frontend UI
```

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues
- Check existing issues before creating a new one
- Include Home Assistant version, browser, and OS information
- Provide steps to reproduce the problem
- Include relevant log entries if available

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly with Home Assistant
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup
1. Clone the repository into your Home Assistant's `custom_components` directory
2. Restart Home Assistant
3. Make changes to the code
4. Restart Home Assistant to test changes
5. Check the Home Assistant logs for any errors

### Code Style
- Follow PEP 8 for Python code
- Use type hints where appropriate
- Add comments for complex logic
- Test all file operations thoroughly

## Roadmap

Planned features for future releases:

- [ ] Light theme option
- [ ] Configurable editor settings (font size, tab size, etc.)
- [ ] File diff viewer
- [ ] Git integration for version control
- [ ] Search across all files
- [ ] Code snippets and templates
- [ ] Multiple theme options
- [ ] Backup/restore functionality
- [ ] File history/versioning
- [ ] Collaborative editing support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have feature requests:
- Open an issue on [GitHub Issues](https://github.com/soulripper13/blueprint-studio/issues)
- Provide as much detail as possible
- Check existing issues first to avoid duplicates

## Acknowledgments

Blueprint Studio is built with and inspired by:

- **[CodeMirror](https://codemirror.net/)** - The powerful code editor that powers the editing experience
- **[Material Icons](https://fonts.google.com/icons)** - Beautiful icons for file types and UI elements
- **[VS Code](https://code.visualstudio.com/)** - Design inspiration for the interface and user experience
- **Home Assistant Community** - For feedback, testing, and feature suggestions

Special thanks to all contributors and users who help make Blueprint Studio better!

## Comparison with Other Solutions

### vs. File Editor (Official Add-on)
- **Blueprint Studio:** Web-based integration, no add-on needed, VS Code-like interface, multiple tabs
- **File Editor:** Requires add-on installation, simpler interface, single file editing

### vs. Studio Code Server Add-on
- **Blueprint Studio:** Lightweight, browser-based, no additional resources, integrated in HA
- **Studio Code Server:** Full VS Code experience, resource-intensive, separate interface

### vs. SSH/SFTP
- **Blueprint Studio:** No external tools needed, accessible anywhere, built-in security
- **SSH/SFTP:** Requires external client, more complex setup, full filesystem access

### vs. Configurator (Deprecated)
- **Blueprint Studio:** Modern replacement with more features, actively maintained
- **Configurator:** Deprecated, no longer maintained

## Screenshots

*Screenshots coming soon! Add your own by editing configuration files and sharing them.*

## Star History

If you find Blueprint Studio useful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=soulripper13/blueprint-studio&type=Date)](https://star-history.com/#soulripper13/blueprint-studio&Date)
