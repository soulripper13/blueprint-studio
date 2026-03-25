/** USER-GUIDE.JS | Purpose: Interactive User Guide for Blueprint Studio */

import { state, elements } from './state.js';
import { t } from './translations.js';

const guideContent = [
    {
        id: 'getting-started',
        group: 'Basics',
        title: 'Getting Started',
        icon: 'rocket_launch',
        content: `
            <h1>Welcome to Blueprint Studio! 🚀</h1>
            <p>Blueprint Studio is a modern, professional-grade IDE for Home Assistant. Edit your configuration files with the same power as VS Code — directly in your browser, with deep HA integration.</p>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">security</span> Admin Only</div>
                Blueprint Studio is <strong>admin-only</strong>. Only Home Assistant users with administrator privileges can access it.
            </div>

            <h2>Interface Layout</h2>
            <ul>
                <li><strong>Activity Bar (Left Edge):</strong> Switch between Explorer, Search, and SFTP panels. Click any icon to toggle the corresponding sidebar view.</li>
                <li><strong>Sidebar (Left):</strong> The active panel — file tree, global search results, or SFTP connections.</li>
                <li><strong>Toolbar (Top):</strong> Context-sensitive buttons for Save, Format, Git, Split View, and more.</li>
                <li><strong>Tab Bar:</strong> Open files as tabs. Right-click any tab for more options. Drag tabs between panes in split view.</li>
                <li><strong>Breadcrumb Bar:</strong> Shows the current file's path. Click the copy icon to copy the full path to clipboard.</li>
                <li><strong>Editor (Center):</strong> Your primary workspace. Supports split view — two files side-by-side or stacked.</li>
                <li><strong>Status Bar (Bottom):</strong> Shows cursor position (Ln, Col), file type, indent mode, and encoding.</li>
            </ul>

            <h2>First Steps</h2>
            <ol>
                <li>Click any file in the file tree to open it in the editor.</li>
                <li>Make your edits — changes are tracked and the tab shows a dot (•) when unsaved.</li>
                <li>Press <code>Ctrl+S</code> to save. A toast notification confirms success.</li>
                <li>If Git is configured, commit and push your changes from the Git panel.</li>
            </ol>

            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-card-icon"><span class="material-icons">folder</span></div>
                    <div class="feature-card-title">File Explorer</div>
                    <div class="feature-card-desc">Navigate, create, rename, and organize your configuration files. Right-click for all file operations.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-card-icon"><span class="material-icons">psychology</span></div>
                    <div class="feature-card-title">AI Copilot</div>
                    <div class="feature-card-desc">Get intelligent help writing automations, debugging YAML errors, and understanding HA concepts.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-card-icon"><span class="material-icons">developer_mode</span></div>
                    <div class="feature-card-title">Developer Tools</div>
                    <div class="feature-card-desc">Test actions, render templates, explore entity states — all without leaving your editor.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-card-icon"><span class="material-icons">account_tree</span></div>
                    <div class="feature-card-title">Git Integration</div>
                    <div class="feature-card-desc">Version control your config with GitHub or Gitea. Visual diffs, staging, commits, and push/pull.</div>
                </div>
            </div>
        `
    },
    {
        id: 'editor-features',
        group: 'Basics',
        title: 'The Editor',
        icon: 'edit',
        content: `
            <h1>A Professional Editing Experience</h1>
            <p>The editor is built on <strong>CodeMirror 5</strong>, optimized for Home Assistant configuration. It's fast, reliable, and packed with productivity features.</p>

            <h2>Syntax Highlighting</h2>
            <p>Automatically detects and highlights YAML, JSON, Python, Jinja2 templates, Markdown, and more. Home Assistant-specific extensions add color to:</p>
            <ul>
                <li><strong>HA include tags:</strong> <code>!include</code>, <code>!secret</code>, <code>!env_var</code>, <code>!input</code></li>
                <li><strong>Domain references:</strong> e.g., <code>light</code>, <code>switch</code>, <code>automation</code></li>
                <li><strong>Jinja2 blocks:</strong> <code>{% %}</code>, <code>{{ }}</code> with keyword and operator coloring</li>
            </ul>

            <h2>Real-time YAML Validation</h2>
            <p>The editor lints your YAML as you type. Errors appear as <strong>red marks</strong> in the gutter and red underlines in the code. Click the gutter mark to see the error message. The Validate button in the toolbar runs a full structural check.</p>

            <h2>Smart HA Autocomplete</h2>
            <p>Press <code>Ctrl+Space</code> or start typing to trigger intelligent suggestions:</p>
            <ul>
                <li>Type <code>light.</code> or <code>switch.</code> to see a list of your real Home Assistant entity IDs.</li>
                <li>Suggestions appear for common YAML keys like <code>service:</code>, <code>entity_id:</code>, <code>condition:</code>, and <code>trigger:</code>.</li>
                <li>Entity data is pulled live from your HA instance — it's always up to date.</li>
            </ul>

            <h2>Format &amp; Indent</h2>
            <p>Press <code>Shift+Alt+F</code> or click the Format button to clean up indentation and structure. The formatter respects your tab size setting (2 spaces by default — the HA standard). Works on the full file or a selected region.</p>

            <h2>Code Folding</h2>
            <p>Click the chevron (<span class="material-icons" style="font-size:14px;vertical-align:middle;">chevron_right</span>) icon in the gutter next to any block to collapse it. This is especially useful for long automation files — fold sections you're not actively editing.</p>

            <h2>Block Scope Highlighting</h2>
            <p>When your cursor is inside a YAML block, a subtle vertical line and background tint shows you the full scope of that block — like bracket matching in VS Code.</p>

            <h2>Whitespace Visualization</h2>
            <p>Enable "Show Whitespace" in Settings → Editor to see space dots and tab arrows. Essential for debugging YAML indentation issues.</p>

            <h2>Split View</h2>
            <p>Edit two files simultaneously. Press <code>Ctrl+\\</code> (or click the Split icon) to toggle split view. Orientation switches between <strong>vertical</strong> (side-by-side) and <strong>horizontal</strong> (stacked). Right-click any tab to move it between panes.</p>

            <h2>Asset Preview</h2>
            <p>Open image files (PNG, JPG, SVG, GIF) and PDFs directly in the editor — they render as a visual preview instead of raw binary.</p>

            <h2>Markdown Preview</h2>
            <p>When a <code>.md</code> file is active, a preview toggle appears in the toolbar. Click it to render the Markdown as formatted HTML alongside the source.</p>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">tips_and_updates</span> UUID Insertion</div>
                Press <strong>Ctrl+Shift+U</strong> to instantly insert a new random UUID at the cursor. Perfect for automation IDs.
            </div>
        `
    },
    {
        id: 'shortcuts',
        group: 'Basics',
        title: 'Keyboard Shortcuts',
        icon: 'keyboard',
        content: `
            <h1>Boost Your Productivity ⚡</h1>
            <p>Blueprint Studio supports professional keyboard shortcuts that match VS Code conventions. All Mac users can substitute <code>Cmd</code> for <code>Ctrl</code>.</p>

            <h2>File Operations</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Action</th>
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Shortcut</th>
                </tr>
                <tr><td style="padding: 8px 12px;">Save Current File</td><td style="padding: 8px 12px;"><code>Ctrl+S</code></td></tr>
                <tr><td style="padding: 8px 12px;">Save All Files</td><td style="padding: 8px 12px;"><code>Ctrl+Shift+S</code></td></tr>
                <tr><td style="padding: 8px 12px;">Quick Open File</td><td style="padding: 8px 12px;"><code>Ctrl+E</code> or <code>Ctrl+P</code></td></tr>
                <tr><td style="padding: 8px 12px;">Close Tab</td><td style="padding: 8px 12px;"><code>Alt+W</code></td></tr>
                <tr><td style="padding: 8px 12px;">Next Tab</td><td style="padding: 8px 12px;"><code>Ctrl+Shift+]</code></td></tr>
                <tr><td style="padding: 8px 12px;">Previous Tab</td><td style="padding: 8px 12px;"><code>Ctrl+Shift+[</code></td></tr>
            </table>

            <h2>Editing</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Action</th>
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Shortcut</th>
                </tr>
                <tr><td style="padding: 8px 12px;">Undo</td><td style="padding: 8px 12px;"><code>Ctrl+Z</code></td></tr>
                <tr><td style="padding: 8px 12px;">Redo</td><td style="padding: 8px 12px;"><code>Ctrl+Y</code></td></tr>
                <tr><td style="padding: 8px 12px;">Format YAML</td><td style="padding: 8px 12px;"><code>Shift+Alt+F</code></td></tr>
                <tr><td style="padding: 8px 12px;">Insert UUID</td><td style="padding: 8px 12px;"><code>Ctrl+Shift+U</code></td></tr>
                <tr><td style="padding: 8px 12px;">Trigger Autocomplete</td><td style="padding: 8px 12px;"><code>Ctrl+Space</code></td></tr>
            </table>

            <h2>Navigation &amp; Panels</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Action</th>
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Shortcut</th>
                </tr>
                <tr><td style="padding: 8px 12px;">Command Palette</td><td style="padding: 8px 12px;"><code>Ctrl+K</code></td></tr>
                <tr><td style="padding: 8px 12px;">Toggle Sidebar</td><td style="padding: 8px 12px;"><code>Ctrl+B</code></td></tr>
                <tr><td style="padding: 8px 12px;">Toggle Split View</td><td style="padding: 8px 12px;"><code>Ctrl+\\</code></td></tr>
                <tr><td style="padding: 8px 12px;">Toggle Terminal</td><td style="padding: 8px 12px;"><code>Ctrl+\`</code></td></tr>
            </table>

            <h2>Search</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Action</th>
                    <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Shortcut</th>
                </tr>
                <tr><td style="padding: 8px 12px;">Find in File</td><td style="padding: 8px 12px;"><code>Ctrl+F</code></td></tr>
                <tr><td style="padding: 8px 12px;">Find &amp; Replace in File</td><td style="padding: 8px 12px;"><code>Ctrl+H</code></td></tr>
                <tr><td style="padding: 8px 12px;">Global Search</td><td style="padding: 8px 12px;"><code>Ctrl+Shift+F</code></td></tr>
            </table>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">bolt</span> Command Palette</div>
                Press <strong>Ctrl+K</strong> to open the Command Palette. It's the fastest way to run any command — convert to Blueprint, change themes, open Developer Tools, manage Git, or navigate to any feature without touching your mouse.
            </div>
        `
    },
    {
        id: 'search-replace',
        group: 'Management',
        title: 'Search &amp; Replace',
        icon: 'search',
        content: `
            <h1>Find Everything, Change Everything</h1>
            <p>Blueprint Studio offers three levels of search to help you navigate and edit with precision.</p>

            <h2>1. Quick File Open (Ctrl+E)</h2>
            <p>The fastest way to jump between files. Press <code>Ctrl+E</code> (or <code>Ctrl+P</code>), start typing a part of any filename, and press <code>Enter</code> to open it instantly. Searches by filename, not content.</p>

            <h2>2. Local Search (Ctrl+F)</h2>
            <p>Search within the active file. The search bar slides in from the top of the editor. Features include:</p>
            <ul>
                <li><strong>Match Case:</strong> Toggle case-sensitive matching.</li>
                <li><strong>Whole Word:</strong> Only match complete words.</li>
                <li><strong>Regex:</strong> Use regular expressions for advanced pattern matching.</li>
                <li><strong>Replace:</strong> Press <code>Ctrl+H</code> to reveal the replace field. Replace one or all matches at once.</li>
                <li>Use <code>Enter</code> / <code>Shift+Enter</code> to jump between matches. The active match is highlighted in orange, others in yellow.</li>
            </ul>

            <h2>3. Global Search (Ctrl+Shift+F)</h2>
            <p>Search across your <strong>entire</strong> configuration directory. Results are grouped by file with line numbers. Click any result to jump directly to that line.</p>
            <ul>
                <li><strong>Content Search:</strong> Click the "Match File Content" icon next to the search bar for full-text search.</li>
                <li><strong>Filter by Extension:</strong> Use glob patterns like <code>*.yaml</code> or <code>*.py</code> to restrict search scope.</li>
                <li><strong>Exclude Paths:</strong> Prefix a pattern with <code>!</code> (e.g., <code>!blueprints/</code>) to exclude those paths.</li>
            </ul>

            <h2>Global Replace</h2>
            <p>Need to rename an entity ID or service call across your entire config?</p>
            <ol>
                <li>Open Global Search (<code>Ctrl+Shift+F</code>) and search for the text.</li>
                <li>Click the Replace toggle to open the replace field.</li>
                <li>Type your replacement text.</li>
                <li>Preview all changes, then confirm to apply them across all matching files at once.</li>
            </ol>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">tips_and_updates</span> Regex Power</div>
                Use regex in Global Search to do powerful refactors — e.g., rename all occurrences of <code>sensor.temp_\\w+</code> to a new naming scheme. Enable Regex mode and type your capture-group pattern.
            </div>
        `
    },
    {
        id: 'file-management',
        group: 'Management',
        title: 'File Management',
        icon: 'folder_copy',
        content: `
            <h1>Your Configuration, Organized</h1>
            <p>Blueprint Studio gives you full control over your Home Assistant configuration directory with a rich file management system.</p>

            <h2>Creating Files &amp; Folders</h2>
            <ul>
                <li>Click the <strong>New File</strong> (+) or <strong>New Folder</strong> icons in the toolbar.</li>
                <li>Or <strong>right-click</strong> anywhere in the file tree to open the context menu and select New File / New Folder.</li>
                <li>The new item appears in the tree with its name field ready to type.</li>
            </ul>

            <h2>Right-Click Context Menu</h2>
            <p>Right-click any file or folder for a full set of operations:</p>
            <ul>
                <li><strong>Rename:</strong> Edit the item's name in-place.</li>
                <li><strong>Move:</strong> Relocate the file to another folder (opens a path picker dialog).</li>
                <li><strong>Duplicate:</strong> Create a copy with a <code>_copy</code> suffix.</li>
                <li><strong>Download:</strong> Download the file directly to your browser's Downloads folder.</li>
                <li><strong>Delete:</strong> Permanently delete the file or folder (with confirmation).</li>
                <li><strong>Upload:</strong> Upload files into the selected folder.</li>
                <li><strong>Run in Terminal:</strong> Opens a terminal and navigates to the file's directory (requires Terminal integration).</li>
            </ul>

            <h2>Drag &amp; Drop</h2>
            <p>Move files between folders by dragging them in the file tree. Drop onto a folder to move the file inside it. Drag tabs between split-view panes to reorganize your workspace.</p>

            <h2>Favorites</h2>
            <p>Right-click any file and select <strong>"Pin to Favorites"</strong> to add it to a special Favorites section at the top of the file tree. Perfect for frequently edited files like <code>configuration.yaml</code> or your main automation file. Right-click a favorite to remove it.</p>

            <h2>Multi-Select Mode</h2>
            <p>Click the selection icon in the toolbar to enter Multi-Select mode. Check the boxes next to multiple files, then:</p>
            <ul>
                <li><strong>Download Selected:</strong> Download all checked files as a ZIP archive.</li>
                <li><strong>Delete Selected:</strong> Delete all checked files at once (with confirmation).</li>
            </ul>

            <h2>Upload &amp; Download</h2>
            <ul>
                <li><strong>Upload File(s):</strong> Click the Upload button or drag files from your desktop onto the file tree. Supports <code>.yaml</code>, <code>.json</code>, <code>.py</code>, <code>.md</code>, images, <code>.pdf</code>, and <code>.zip</code> files.</li>
                <li><strong>Upload Folder (ZIP):</strong> Upload a ZIP archive; it will be extracted into the selected directory.</li>
                <li><strong>Download File:</strong> Downloads the currently active file to your browser.</li>
                <li><strong>Download Folder (ZIP):</strong> Downloads the selected folder and all its contents as a ZIP archive.</li>
            </ul>

            <h2>Show Hidden Files</h2>
            <p>Click the "Show Hidden Files" button in the toolbar to toggle visibility of dot-files (e.g., <code>.storage</code>, <code>.gitignore</code>). Hidden by default to reduce clutter.</p>

            <h2>Recent Files</h2>
            <p>The Command Palette (<code>Ctrl+K</code>) shows your recently opened files at the top, so you can quickly reopen files you've been editing without hunting through the tree.</p>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">folder_zip</span> Bulk Import</div>
                To migrate a large configuration from another machine, zip the config folder, upload the ZIP via "Upload Folder", and choose how to handle conflicts (merge or overwrite).
            </div>
        `
    },
    {
        id: 'sftp',
        group: 'Management',
        title: 'SFTP / Remote Files',
        icon: 'cloud_sync',
        content: `
            <h1>Edit Remote Servers via SFTP</h1>
            <p>Blueprint Studio includes a full SFTP file browser. Connect to any SSH server and edit its files just like local ones — no separate SFTP client needed.</p>

            <h2>Opening the SFTP Panel</h2>
            <p>Click the SFTP cloud icon in the Activity Bar (left edge of the sidebar). The SFTP panel shows all your saved connections.</p>

            <h2>Adding a Connection</h2>
            <ol>
                <li>Click <strong>"Add Connection"</strong> in the SFTP panel.</li>
                <li>Fill in the server details: name, host, port (default: 22), username, and authentication (password or SSH key).</li>
                <li>Save the connection — it's stored securely on your HA instance.</li>
            </ol>

            <h2>Browsing &amp; Editing Remote Files</h2>
            <ul>
                <li>Click a connection to connect and browse its directory tree.</li>
                <li>Click any file to open it in the editor — it streams the content over SFTP on demand.</li>
                <li>Save with <code>Ctrl+S</code> to write the changes back to the remote server immediately.</li>
                <li>Remote file tabs are visually distinguished from local ones.</li>
            </ul>

            <h2>Multiple Connections</h2>
            <p>You can have multiple SFTP connections configured at once and switch between them in the SFTP panel. Useful for managing multiple Home Assistant instances or remote servers.</p>

            <h2>Session Restore</h2>
            <p>If you had an SFTP session open when you last closed Blueprint Studio, it will automatically attempt to reconnect when you reload.</p>

            <h2>Setting a Default SSH Host for Terminal</h2>
            <p>In <strong>Settings → Integrations</strong>, you can set a default SSH host for the integrated terminal. When you open the terminal, it will automatically connect to that host instead of the local shell.</p>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">info</span> Use Cases</div>
                Great for editing config files on a secondary HA instance, a Pi-hole, a NAS, or any remote Linux server — without leaving Blueprint Studio.
            </div>
        `
    },
    {
        id: 'ai-copilot',
        group: 'Advanced',
        title: 'AI Studio Copilot',
        icon: 'psychology',
        content: `
            <h1>Your AI Pairing Partner 🧠</h1>
            <p>AI Copilot is a Home Assistant expert built into your sidebar. It understands your specific entities and configuration context, and can write, explain, and debug your automations.</p>

            <h2>Opening the Copilot</h2>
            <p>Click the AI brain icon in the toolbar (right side). If you don't see it, enable AI integration in <strong>Settings → Integrations</strong>.</p>

            <h2>What It Can Do</h2>
            <ul>
                <li><strong>Write automations</strong> from a plain-English description.</li>
                <li><strong>Debug YAML errors</strong> — paste your code and ask what's wrong.</li>
                <li><strong>Explain concepts</strong> — ask how <code>choose</code>, <code>trigger_id</code>, or blueprints work.</li>
                <li><strong>Refactor existing code</strong> — paste a section and ask it to optimize or restructure.</li>
                <li><strong>Generate templates</strong> — create Jinja2 template expressions for complex conditions.</li>
            </ul>

            <h2>Example Prompts</h2>
            <ul>
                <li><em>"Write an automation that turns on light.living_room when motion is detected after sunset."</em></li>
                <li><em>"This automation isn't triggering — what's wrong? [paste YAML]"</em></li>
                <li><em>"Create a scene that dims all lights to 20% and sets the TV to Netflix input."</em></li>
                <li><em>"How do I use the wait_for_trigger action in a script?"</em></li>
                <li><em>"Write a template sensor that shows the number of lights currently on."</em></li>
            </ul>

            <h2>AI Providers</h2>
            <ul>
                <li><strong>Rule-based (Built-in):</strong> Pattern matching templates. No setup, no internet, no API key needed. Good for basic tasks.</li>
                <li><strong>Local AI:</strong> Connect to a locally-running model server. Completely private — no data leaves your network.
                    <ul>
                        <li><strong>Ollama:</strong> Default URL <code>http://localhost:11434</code>. Run <code>ollama run codellama:7b</code> to get started.</li>
                        <li><strong>LM Studio:</strong> Default URL <code>http://localhost:1234</code>. Load any model in LM Studio and start the local server.</li>
                        <li><strong>Custom Endpoint:</strong> Any server with an OpenAI-compatible <code>/v1/chat/completions</code> API.</li>
                    </ul>
                </li>
                <li><strong>Cloud AI:</strong> High-performance models for complex tasks.
                    <ul>
                        <li><strong>Google Gemini:</strong> Gemini 2.5 Pro/Flash</li>
                        <li><strong>OpenAI:</strong> GPT-4 and newer models</li>
                        <li><strong>Anthropic Claude:</strong> Claude Opus, Sonnet, Haiku</li>
                    </ul>
                </li>
            </ul>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">lock</span> API Key Security</div>
                Your API keys are stored locally within your Home Assistant instance. They are never transmitted to Blueprint Studio's servers. If you use Local AI, no data ever leaves your network at all.
            </div>
        `
    },
    {
        id: 'dev-tools',
        group: 'Advanced',
        title: 'Developer Tools',
        icon: 'developer_mode',
        content: `
            <h1>Built-in HA Developer Tools 🛠️</h1>
            <p>Blueprint Studio includes a floating Developer Tools panel. Test actions, render templates, explore entity states, and check your config — all without leaving your editor.</p>

            <h2>Opening Developer Tools</h2>
            <p>Click the <strong>developer icon</strong> in the toolbar, or use the Command Palette (<code>Ctrl+K</code> → "Developer Tools"). The panel is a floating window — drag its header to move it anywhere on screen. Keep it open while you write code.</p>

            <h2>Actions Tab</h2>
            <p>Call any Home Assistant service action interactively:</p>
            <ul>
                <li>Type in the search box to find actions by name, domain, or description (e.g., <code>light.turn_on</code>, <code>climate</code>, <code>notify</code>).</li>
                <li>Select an action from the grouped dropdown to load its input fields.</li>
                <li><strong>Target:</strong> Type an entity ID manually or pick from the autocomplete list — which is filtered to entities in the action's domain.</li>
                <li><strong>Form fields:</strong> Each field shows a description, required status, and an example. Numeric fields with min/max use a slider for easy input.</li>
                <li><strong>YAML Mode:</strong> Toggle from Form to YAML to write the action call directly as YAML.</li>
                <li>Click <strong>"Perform Action"</strong> to execute it live against your HA instance.</li>
            </ul>

            <h2>Template Tab</h2>
            <p>A real-time Jinja2 template editor:</p>
            <ul>
                <li>Type your template in the left panel — e.g., <code>{{ states('sensor.temperature') }}</code>.</li>
                <li>The rendered output updates live on the right as you type.</li>
                <li>Great for testing complex templates before embedding them in your automations.</li>
            </ul>

            <h2>States Tab</h2>
            <p>Browse all your Home Assistant entities:</p>
            <ul>
                <li>Search by entity ID, friendly name, or state value.</li>
                <li>The table shows entity ID, friendly name, current state, and a summary of key attributes.</li>
                <li>Click any row to expand a full table of all attributes with their current values.</li>
                <li>Filter by domain using the search box (e.g., type <code>sensor</code> to see only sensor entities).</li>
            </ul>

            <h2>Config Tab</h2>
            <ul>
                <li><strong>Configuration Check:</strong> Validates your entire HA configuration without restarting. Shows errors with file paths and line numbers.</li>
                <li><strong>Reload YAML:</strong> Selectively reload only specific domains — Automations, Scripts, Scenes, Groups, Input Booleans, Input Selects, and more. Much faster than a full HA restart.</li>
            </ul>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">drag_indicator</span> Floating &amp; Dockable</div>
                The Developer Tools panel floats over your editor. Drag it by the header bar to any corner of the screen. Its position is remembered across sessions.
            </div>
        `
    },
    {
        id: 'git-integration',
        group: 'Advanced',
        title: 'Git &amp; GitHub',
        icon: 'account_tree',
        content: `
            <h1>Version Control Made Easy 🔗</h1>
            <p>Version control your entire Home Assistant configuration. Roll back mistakes, track your history, and back up to GitHub — all from within Blueprint Studio.</p>

            <h2>Setup</h2>
            <p>Click <strong>Git Settings</strong> in the toolbar to configure. You'll need:</p>
            <ul>
                <li>A GitHub account and a repository (can be private) where your config will be stored.</li>
                <li>A Personal Access Token (PAT) with <code>repo</code> scope. Create one at GitHub → Settings → Developer Settings → Tokens.</li>
                <li>Your name and email for commit authorship.</li>
            </ul>

            <h2>The Standard Workflow</h2>
            <ol>
                <li><strong>Pull</strong> (<span class="material-icons" style="font-size:14px;vertical-align:middle;">download</span>): Fetch the latest changes from GitHub to make sure you're up to date.</li>
                <li><strong>Edit:</strong> Make your changes in the editor. Modified files appear highlighted in the Git panel.</li>
                <li><strong>Stage (+):</strong> Click the <code>+</code> icon next to changed files to stage them for the next commit.</li>
                <li><strong>Commit:</strong> Write a short commit message (e.g., "Add motion light automation") and click Commit to save a snapshot.</li>
                <li><strong>Push</strong> (<span class="material-icons" style="font-size:14px;vertical-align:middle;">upload</span>): Upload your local commits to GitHub.</li>
            </ol>

            <h2>Visual Diff</h2>
            <p>Click any modified file in the Git panel to open a <strong>side-by-side diff view</strong>. Red lines are removed, green lines are added. The diff view is read-only for review — switch back to the editor tab to make further edits.</p>

            <h2>Gitea Support</h2>
            <p>Prefer self-hosted? Blueprint Studio also supports <strong>Gitea</strong> instances. In Settings → Integrations, enable Gitea and enter your Gitea server URL and access token. The Gitea toolbar group replaces the GitHub toolbar.</p>

            <h2>Git Exclusions (.gitignore)</h2>
            <p>Git Exclusions let you control which files are <strong>never committed</strong> to version control. This is critical for keeping passwords and tokens out of GitHub.</p>
            <p>Click <strong>Git Settings → Manage Exclusions</strong> to open the exclusions editor. It's a simple UI that writes to your <code>.gitignore</code> file. You can add:</p>
            <ul>
                <li><strong>Specific files:</strong> <code>secrets.yaml</code>, <code>.storage/auth</code></li>
                <li><strong>Wildcard patterns:</strong> <code>*.log</code>, <code>*.db</code></li>
                <li><strong>Entire folders:</strong> <code>.cloud/</code>, <code>deps/</code></li>
            </ul>
            <p>Files matching any exclusion pattern will appear greyed-out in the Git panel and will never be staged or committed — even if you accidentally modify them.</p>
            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">warning</span> Always Exclude</div>
                Add <code>secrets.yaml</code> to your exclusions before your very first commit. If a secret is ever committed and pushed to a public repo, rotate the key immediately — git history is permanent.
            </div>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">history</span> Rollback</div>
                Made a breaking change? Run <code>git log</code> in the terminal to find the last good commit, then use <code>git checkout &lt;hash&gt; -- configuration.yaml</code> to restore just that file from history.
            </div>
        `
    },
    {
        id: 'blueprint-generator',
        group: 'Advanced',
        title: 'Blueprint Tools',
        icon: 'architecture',
        content: `
            <h1>The Complete Blueprint Toolkit 📐</h1>
            <p>Blueprint Studio gives you end-to-end tools for both consuming and creating Home Assistant Blueprints.</p>

            <h2>1. Use a Blueprint</h2>
            <p>When you open any Blueprint file (<code>blueprints/automation/*.yaml</code>), the toolbar shows a <strong>"Use Blueprint"</strong> button. Click it to:</p>
            <ul>
                <li>See a fully rendered configuration form based on the blueprint's <code>input</code> fields.</li>
                <li>All form fields use your real Home Assistant data — entity pickers show your actual devices, area pickers show your areas.</li>
                <li>Fill in the form and click <strong>Generate</strong> to instantly create a ready-to-use automation YAML, written to a new file.</li>
            </ul>

            <h2>2. Convert Automation to Blueprint</h2>
            <p>Have a great automation you want to make reusable or share with the community? Convert it in seconds.</p>
            <ul>
                <li><strong>Full File:</strong> Open your automation file, press <code>Ctrl+K</code>, and run <strong>"Convert to Blueprint"</strong>.</li>
                <li><strong>Selection:</strong> Highlight just the automation block you want, press <code>Ctrl+K</code>, and run <strong>"Convert to Blueprint (Selection)"</strong>.</li>
            </ul>
            <p>Blueprint Studio analyzes the YAML, identifies hard-coded entity IDs, areas, and devices, and converts them into <code>input:</code> fields. The result is a new file in <code>blueprints/automation/blueprint_studio/</code>.</p>

            <h2>3. New Blueprint Template</h2>
            <p>Starting a blueprint from scratch? Use the Command Palette (<code>Ctrl+K</code> → "New Blueprint") to insert a complete boilerplate with all required Home Assistant metadata fields:</p>
            <ul>
                <li><code>blueprint:</code> header with <code>name</code>, <code>description</code>, <code>domain</code>, <code>source_url</code></li>
                <li>Example <code>input:</code> fields for entity, text, boolean, and select types</li>
                <li>A minimal automation trigger and action block ready to customize</li>
            </ul>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">share</span> Sharing Blueprints</div>
                Once your blueprint is in <code>blueprints/automation/</code>, push it to a public GitHub repo. Anyone can import it using the HA blueprint import URL from that raw file link.
            </div>
        `
    },
    {
        id: 'ha-tools',
        group: 'Advanced',
        title: 'Home Assistant Tools',
        icon: 'settings_remote',
        content: `
            <h1>Integrated HA Power Tools</h1>
            <p>Blueprint Studio is deeply integrated with Home Assistant's core operations — restart, reload, and validate without leaving your editor.</p>

            <h2>Config Check &amp; Reload (Developer Tools)</h2>
            <p>Open the <strong>Developer Tools</strong> panel → <strong>Config</strong> tab to:</p>
            <ul>
                <li><strong>Check Configuration:</strong> Validates your entire HA config and reports any errors with file and line references.</li>
                <li><strong>Reload YAML:</strong> Reload specific domains without a full restart — Automations, Scripts, Scenes, Groups, Templates, Input Booleans, Input Selects, Input Numbers, Input Datetimes, Helpers, and Customize.</li>
            </ul>

            <h2>Restart Home Assistant</h2>
            <p>Click the Restart button in the toolbar to trigger a full Home Assistant restart. A confirmation dialog appears first. Use this after changes that require a restart (e.g., adding new integrations or modifying the <code>homeassistant:</code> block).</p>

            <h2>Terminal (SSH)</h2>
            <p>The integrated terminal gives you a full shell session:</p>
            <ul>
                <li>Enable Terminal integration in <strong>Settings → Integrations</strong>.</li>
                <li>Press <code>Ctrl+\`</code> or click the terminal icon to open/close the terminal panel.</li>
                <li>Supports multiple <strong>SSH host profiles</strong> — configure multiple servers and switch between them in the terminal dropdown.</li>
                <li>Right-click any file in the tree and select <strong>"Run in Terminal"</strong> to open a terminal navigated to that file's directory.</li>
                <li>Set a <strong>default SSH host</strong> in Settings so the terminal connects automatically to your preferred server on open.</li>
            </ul>

            <h2>YAML Validation</h2>
            <p>Click the Validate button to run a structural YAML check on the current file. Errors are listed with line numbers in a panel below. Inline red gutter markers and underlines show errors in real-time as you type.</p>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">tips_and_updates</span> Workflow Tip</div>
                Instead of restarting HA every time you change automations, use <strong>Developer Tools → Config → Reload Automations</strong>. It's instant and applies your changes in seconds.
            </div>
        `
    },
    {
        id: 'privacy-connectivity',
        group: 'Advanced',
        title: '100% Local &amp; Privacy',
        icon: 'security',
        content: `
            <h1>100% Local-First Philosophy</h1>
            <p>Blueprint Studio is designed to work completely offline. All essential components run on your Home Assistant instance — no external CDNs, no cloud dependencies, no tracking.</p>

            <h2>Zero External Dependencies</h2>
            <p>All libraries, fonts, and icons are served from your local HA instance:</p>
            <ul>
                <li><strong>Editor:</strong> CodeMirror 5 (locally hosted)</li>
                <li><strong>PDF Viewer:</strong> PDF.js (locally hosted)</li>
                <li><strong>Syntax Highlighting:</strong> Highlight.js (locally hosted)</li>
                <li><strong>Icons:</strong> Material Icons (locally hosted WOFF2 fonts)</li>
                <li><strong>Code Fonts:</strong> JetBrains Mono, Fira Code, DM Mono, Source Code Pro, and more (all locally hosted)</li>
            </ul>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">lan</span> Offline Support</div>
                Blueprint Studio works perfectly in completely offline environments or air-gapped local networks. Not a single resource is fetched from the internet during normal use.
            </div>

            <h2>What Stays 100% Local</h2>
            <ul>
                <li>All file reading, writing, and management</li>
                <li>YAML parsing and validation (runs in your browser)</li>
                <li>All editor libraries, fonts, and UI components</li>
                <li>Developer Tools (talks directly to your HA API)</li>
                <li>Local AI (Ollama / LM Studio) — stays entirely within your network</li>
            </ul>

            <h2>What Requires Internet</h2>
            <p>Only features that are inherently remote require a connection:</p>
            <ul>
                <li><strong>Remote Git:</strong> Pushing to / pulling from GitHub or a remote Gitea instance.</li>
                <li><strong>Cloud AI:</strong> Sending prompts to Google Gemini, OpenAI, or Anthropic Claude APIs.</li>
            </ul>

            <p>If you use <strong>Local AI (Ollama)</strong> and a <strong>local Gitea</strong> instance, Blueprint Studio becomes a completely self-contained, air-gapped HA development environment.</p>

            <h2>API Key Storage</h2>
            <p>AI API keys are stored in your HA configuration storage on your server. They are never sent to Blueprint Studio's servers (which don't exist — this is a local custom component). Keys are transmitted only directly to the chosen AI provider's API.</p>
        `
    },
    {
        id: 'customization',
        group: 'Settings',
        title: 'Personalization',
        icon: 'palette',
        content: `
            <h1>Make It Yours 🎨</h1>
            <p>Configure every visual and behavioral detail in <strong>Settings</strong> (<code>Ctrl+K</code> → Settings, or click the gear icon). Settings are organized into five tabs.</p>

            <h2>General Tab</h2>
            <ul>
                <li><strong>Language:</strong> Switch the UI language (if translations are available).</li>
                <li><strong>Remember Workspace:</strong> Automatically restores your open tabs, cursor positions, and split-view layout on reload.</li>
                <li><strong>Virtual Scrolling:</strong> Essential for large configs with many files. Renders only visible items in the file tree for snappy performance.</li>
                <li><strong>Show Welcome on Start:</strong> Toggle whether the welcome screen appears on first load.</li>
            </ul>

            <h2>Appearance Tab</h2>
            <ul>
                <li><strong>App Theme:</strong> Choose from built-in presets — Ocean, Dracula, Glass, Legacy — or use your HA theme colors.</li>
                <li><strong>Accent Color:</strong> Customizes buttons, active states, and highlights across the entire UI.</li>
                <li><strong>File Tree Options:</strong> Toggle file icons, compact mode, and sort order (files first vs. folders first).</li>
            </ul>

            <h2>Editor Tab</h2>
            <ul>
                <li><strong>Font Family:</strong> Choose from 12+ professional coding fonts: JetBrains Mono, Fira Code, DM Mono, Source Code Pro, Roboto Mono, Ubuntu Mono, Azeret Mono, Libertinus Mono, Reddit Mono, and system fallbacks.</li>
                <li><strong>Font Size:</strong> Adjust from 10px to 24px. Changes apply instantly to the editor.</li>
                <li><strong>Tab Size:</strong> 2 spaces (HA standard), 4 spaces, or 8 spaces.</li>
                <li><strong>Indent with Tabs:</strong> Use tab characters instead of spaces (off by default).</li>
                <li><strong>Line Numbers:</strong> Toggle gutter line numbers.</li>
                <li><strong>Word Wrap:</strong> Wrap long lines instead of scrolling horizontally.</li>
                <li><strong>Show Whitespace:</strong> Visualize spaces (dots) and tabs (arrows) in the editor.</li>
                <li><strong>Auto-Save:</strong> Enable to automatically save files after a delay (configurable in milliseconds).</li>
                <li><strong>One Tab Mode:</strong> Focused workflow — opening a new file auto-saves and closes all other tabs.</li>
                <li><strong>Syntax Theme:</strong> Choose a code highlighting preset (Material, Monokai, GitHub, Solarized, etc.) or create a <strong>Custom Syntax Theme</strong> by setting individual token colors.</li>
            </ul>

            <h2>Integrations Tab</h2>
            <ul>
                <li><strong>VCS (Version Control):</strong> Enable GitHub or Gitea integration and configure credentials.</li>
                <li><strong>Terminal:</strong> Enable SSH terminal integration and configure default SSH host profiles.</li>
                <li><strong>Git Exclusions:</strong> Manage <code>.gitignore</code> through a simple UI.</li>
                <li><strong>AI Integration:</strong> Enable and configure your AI provider (Rule-based, Local AI, or Cloud AI).</li>
            </ul>

            <h2>Advanced Tab</h2>
            <p><strong>Performance</strong></p>
            <ul>
                <li><strong>Git Polling Interval:</strong> How often Blueprint Studio checks for local git changes (10–60 seconds). Lower values give faster status updates but use more resources. Only active when Git integration is enabled.</li>
                <li><strong>Remote Fetch Interval:</strong> How often it checks for new commits on the remote (GitHub/Gitea). Range is 15 seconds to 5 minutes. Only active when Git integration is enabled.</li>
                <li><strong>File Cache Size:</strong> Number of recently opened files kept in memory (5–20). Larger cache means faster switching between files you've recently visited.</li>
                <li><strong>Virtual Scrolling:</strong> Only renders visible items in the file tree. Essential for large configurations with hundreds of files — keeps the UI fast and responsive. Requires a reload to apply.</li>
            </ul>
            <p><strong>Experimental</strong></p>
            <ul>
                <li><strong>Split View <span style="font-size:11px;padding:2px 5px;background:var(--warning-color,#f59e0b);color:#000;border-radius:3px;">BETA</span>:</strong> Enable the split editor feature. When active, you can open two files side-by-side or stacked. Toggle orientation with the split button in the toolbar.</li>
                <li><strong>Clear PWA Token:</strong> Resets the authentication token used by the installed PWA (Progressive Web App). Use this if you're having login issues with the installed app version.</li>
            </ul>
            <p><strong>Danger Zone</strong></p>
            <ul>
                <li><strong>Reset Application:</strong> Clears all Blueprint Studio settings and returns it to factory defaults. A dialog lets you choose exactly what to reset — settings only, the git repository, or both.</li>
            </ul>

            <div class="user-guide-tip">
                <div class="user-guide-tip-title"><span class="material-icons">tips_and_updates</span> Settings Sync</div>
                Use <strong>Export Settings</strong> to back up your configuration (theme, fonts, AI keys, git settings) and <strong>Import Settings</strong> to restore them — or apply them to a new Blueprint Studio installation.
            </div>
        `
    }
];

/**
 * Shows the User Guide modal
 */
export function showUserGuide() {
    let modalOverlay = document.getElementById('modal-user-guide-overlay');

    if (!modalOverlay) {
        modalOverlay = createUserGuideModal();
    }

    modalOverlay.classList.add('visible');

    // Select first item by default
    const firstItem = modalOverlay.querySelector('.user-guide-nav-item');
    if (firstItem) firstItem.click();
}

/**
 * Creates the User Guide modal DOM
 */
function createUserGuideModal() {
    const overlay = document.createElement('div');
    overlay.id = 'modal-user-guide-overlay';
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
        <div class="modal user-guide-modal">
            <div class="modal-header">
                <div class="modal-title">Blueprint Studio User Guide</div>
                <button class="modal-close" id="btn-close-user-guide">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="user-guide-container">
                <div class="user-guide-sidebar">
                    <div class="user-guide-search">
                        <input type="text" id="user-guide-search-input" placeholder="Search guide...">
                    </div>
                    <div class="user-guide-nav" id="user-guide-nav">
                        <!-- Nav items will be injected here -->
                    </div>
                </div>
                <div class="user-guide-content" id="user-guide-content">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    overlay.querySelector('#btn-close-user-guide').addEventListener('click', () => {
        overlay.classList.remove('visible');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('visible');
    });

    const navContainer = overlay.querySelector('#user-guide-nav');
    renderNav(navContainer);

    const searchInput = overlay.querySelector('#user-guide-search-input');
    searchInput.addEventListener('input', (e) => {
        renderNav(navContainer, e.target.value);
    });

    return overlay;
}

/**
 * Renders the navigation sidebar
 */
function renderNav(container, filter = '') {
    container.innerHTML = '';

    const filtered = guideContent.filter(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.group.toLowerCase().includes(filter.toLowerCase())
    );

    let currentGroup = '';

    filtered.forEach(item => {
        if (item.group !== currentGroup) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'user-guide-nav-group';
            groupDiv.textContent = item.group;
            container.appendChild(groupDiv);
            currentGroup = item.group;
        }

        const navItem = document.createElement('div');
        navItem.className = 'user-guide-nav-item';
        navItem.innerHTML = `
            <span class="material-icons" style="font-size: 18px;">${item.icon}</span>
            <span>${item.title}</span>
        `;

        navItem.addEventListener('click', () => {
            // Update active state
            container.querySelectorAll('.user-guide-nav-item').forEach(el => el.classList.remove('active'));
            navItem.classList.add('active');

            // Render content
            renderContent(item);
        });

        container.appendChild(navItem);
    });
}

/**
 * Renders the content area
 */
function renderContent(item) {
    const contentArea = document.getElementById('user-guide-content');
    contentArea.innerHTML = item.content;

    // Scroll to top
    contentArea.scrollTop = 0;
}
