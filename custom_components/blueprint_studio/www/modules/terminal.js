/** TERMINAL.JS | Purpose: * Provides an embedded terminal emulator using xterm.js. */

import { state, elements } from './state.js';
import { eventBus } from './event-bus.js';
import { loadScript } from './utils.js';
import { API_BASE } from './constants.js';
import { showToast, showModal, showConfirmDialog } from './ui.js';
import { saveSettings } from './settings.js';
import { t } from './translations.js';
import { getAuthToken } from './coordinators/TerminalCoordinator.js';

let term = null;
let fitAddon = null;
let terminalContainer = null;
let socket = null;
let isTerminalInTab = false;
let tabBtn = null;
let closeBtn = null;
let sshSelect = null;
let initPromise = null;

function insertTerminalIntoBody() {
  const statusBar = document.querySelector('.status-bar');
  if (statusBar) {
    document.body.insertBefore(terminalContainer, statusBar);
  } else {
    document.body.appendChild(terminalContainer);
  }
}

/**
 * Build SSH command for a host configuration
 * Supports both password and key-based authentication
 * @param {Object} host - SSH host config with {username, host, port, authType, password, privateKey, privateKeyPassphrase}
 * @returns {string} SSH command to send to terminal
 */
function buildSshCommand(host) {
    if (host.authType === 'key') {
        // SSH key authentication - use special marker
        return `__SSH_KEY__${JSON.stringify({
            username: host.username,
            host: host.host,
            port: host.port,
            privateKey: host.privateKey,
            privateKeyPassphrase: host.privateKeyPassphrase
        })}`;
    }

    if (host.authType === 'password' && host.password) {
        // Password authentication - use special marker
        return `__SSH_PASSWORD__${JSON.stringify({
            username: host.username,
            host: host.host,
            port: host.port,
            password: host.password
        })}`;
    }

    // Interactive authentication (no password saved)
    return `ssh ${host.username}@${host.host}${host.port ? ` -p ${host.port}` : ''}`;
}

// Initialize Terminal
export async function initTerminal() {
    if (term) return;
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        // Load xterm.js css
        if (!document.getElementById('xterm-css')) {
            const link = document.createElement('link');
            link.id = 'xterm-css';
            link.rel = 'stylesheet';
            link.href = '/local/blueprint_studio/vendor/xterm/xterm.css';
            document.head.appendChild(link);
        }

        try {
            await loadScript('/local/blueprint_studio/vendor/xterm/xterm.js');
            await loadScript('/local/blueprint_studio/vendor/xterm/xterm-addon-fit.js');

            // Wait a bit and verify Terminal class is available (with retry)
            let retries = 0;
            while (retries < 10) {
                if (typeof Terminal !== 'undefined' && typeof FitAddon !== 'undefined') {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }

            if (typeof Terminal === 'undefined') {
                throw new Error('Terminal class not available after script load.');
            }
        } catch (e) {
            console.error("Failed to load xterm.js", e);
            showToast(`Failed to load terminal libraries: ${e.message}`, "error");
            initPromise = null;
            return;
        }

        // Create container
        terminalContainer = document.createElement("div");
        terminalContainer.id = 'terminal-panel';
        terminalContainer.className = 'terminal-panel';
        terminalContainer.style.cssText = `
            height: 300px;
            min-height: 100px;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            flex-shrink: 0;
            display: ${state.terminalVisible ? 'flex' : 'none'};
            flex-direction: column;
        `;

        // Resize Handle
        const resizeHandle = document.createElement('div');
        resizeHandle.id = 'terminal-resize-handle';
        resizeHandle.style.cssText = `
            height: 4px;
            cursor: row-resize;
            background: transparent;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
        `;
        resizeHandle.addEventListener('mousedown', initDrag);
        resizeHandle.addEventListener('touchstart', initTouchDrag, { passive: false });
        terminalContainer.appendChild(resizeHandle);

        function initDrag(e) {
            e.preventDefault();
            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'row-resize';
            terminalContainer.style.transition = 'none';
        }

        function initTouchDrag(e) {
            e.preventDefault();
            window.addEventListener('touchmove', doDrag, { passive: false });
            window.addEventListener('touchend', stopDrag);
            terminalContainer.style.transition = 'none';
        }

        function doDrag(e) {
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = terminalContainer.getBoundingClientRect();
            const newHeight = rect.bottom - clientY;
            if (newHeight > 100 && newHeight < window.innerHeight - 50) {
                terminalContainer.style.height = newHeight + 'px';
                if (fitAddon) fitAddon.fit();
                if (socket && socket.readyState === WebSocket.OPEN) sendResize();
            }
        }

        function stopDrag() {
            window.removeEventListener('mousemove', doDrag);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', doDrag);
            window.removeEventListener('touchend', stopDrag);
            document.body.style.cursor = '';
            if (fitAddon) {
                fitAddon.fit();
                sendResize();
            }
        }

        // Header
        const header = document.createElement('div');
        header.id = 'terminal-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 12px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            height: 32px;
        `;
        
        const title = document.createElement('span');
        title.innerHTML = '<span class="material-icons" style="font-size:14px; vertical-align:text-bottom; margin-right:6px">terminal</span>Terminal';
        title.style.fontSize = '12px';
        title.style.fontWeight = '500';
        title.style.flex = '1';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.style.display = 'flex';
        actionsDiv.style.gap = '4px';

        tabBtn = document.createElement('button');
        tabBtn.innerHTML = '<span class="material-icons">open_in_new</span>';
        tabBtn.title = t("terminal.move_to_tab");
        tabBtn.className = 'icon-btn';
        tabBtn.style.cssText = 'background:none; border:none; color:var(--text-secondary); cursor:pointer; padding:2px;';
        tabBtn.onclick = () => eventBus.emit('terminal:open-tab');

        closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<span class="material-icons">close</span>';
        closeBtn.title = t("terminal.close_panel");
        closeBtn.className = 'icon-btn';
        closeBtn.style.cssText = 'background:none; border:none; color:var(--text-secondary); cursor:pointer; padding:2px;';
        closeBtn.onclick = () => eventBus.emit('terminal:toggle', false);

        actionsDiv.appendChild(tabBtn);
        actionsDiv.appendChild(closeBtn);

        header.appendChild(title);

        // SSH Dropdown
        const sshDiv = document.createElement('div');
        sshDiv.style.marginRight = '8px';
        sshSelect = document.createElement('select');
        sshSelect.className = 'ssh-select';
        sshSelect.style.cssText = `
            background: var(--input-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 11px;
            min-height: 44px;
            max-width: 150px;
            outline: none;
        `;
        
        sshSelect.onchange = () => {
            const val = sshSelect.value;
            if (!val) return;
            if (val === 'manage') {
                showSshManager();
                sshSelect.value = "";
                return;
            }
            try {
                const host = JSON.parse(val);
                const cmd = buildSshCommand(host);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(cmd + '\r');
                    term.focus();
                } else {
                    showToast(t("toast.terminal_not_connected"), "error");
                }
            } catch(e) { console.error(e); }
            sshSelect.value = "";
        };
        
        sshDiv.appendChild(sshSelect);
        updateSshDropdown();

        header.appendChild(sshDiv);
        header.appendChild(actionsDiv);
        terminalContainer.appendChild(header);

        // Terminal Div
        const termDiv = document.createElement('div');
        termDiv.id = 'xterm-container';
        termDiv.style.cssText = 'flex: 1; padding: 4px; overflow: hidden; background: var(--bg-primary);';
        terminalContainer.appendChild(termDiv);

        insertTerminalIntoBody();

        // Init xterm
        const style = getComputedStyle(document.documentElement);
        term = new Terminal({
            cursorBlink: true,
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            theme: {
                background: style.getPropertyValue('--bg-primary').trim() || '#1e1e1e',
                foreground: style.getPropertyValue('--text-primary').trim() || '#d4d4d4',
                cursor: style.getPropertyValue('--accent-color').trim() || '#ffffff',
                selectionBackground: style.getPropertyValue('--accent-color-transparent')?.trim() || 'rgba(255, 255, 255, 0.3)'
            },
            convertEol: true,
        });

        fitAddon = new FitAddon.FitAddon();
        term.loadAddon(fitAddon);
        term.open(termDiv);
        
        await connectSocket();

        term.onData(data => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            }
        });

        term.attachCustomKeyEventHandler((e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'k') && e.type === 'keydown') {
                e.preventDefault();
                term.clear();
                return false;
            }
            return true;
        });

        window.addEventListener('resize', () => {
            if ((state.terminalVisible || isTerminalInTab) && fitAddon) {
                fitAddon.fit();
                sendResize();
            }
        });
        
        setTimeout(() => {
            if (fitAddon) {
                fitAddon.fit();
                sendResize();
            }
        }, 100);
        
        return true;
    })();

    return initPromise;
}

async function connectSocket() {
    if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        socket.onopen = null;
        try {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        } catch (e) {}
        socket = null;
    }

    const token = await getAuthToken();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${API_BASE}/terminal_ws?token=${token || ''}`;

    socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
        term.write('\x1b[1;32mConnected to Terminal.\x1b[0m\r\n');
        if (fitAddon) {
            fitAddon.fit();
            sendResize();
        }

        if (state.defaultSshHost && state.defaultSshHost !== 'local' && !socket._hasAutoConnected) {
            socket._hasAutoConnected = true;
            try {
                const host = JSON.parse(state.defaultSshHost);
                const cmd = buildSshCommand(host);
                term.write(`\x1b[1;34mAuto-connecting to ${host.name}...\x1b[0m\r\n`);
                setTimeout(() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(cmd + '\r');
                        term.focus();
                    }
                }, 500);
            } catch (e) {
                console.error("Failed to auto-connect to SSH host:", e);
            }
        }
    };

    socket.onmessage = (event) => {
        if (typeof event.data === 'string') {
            term.write(event.data);
        } else {
            const text = new TextDecoder().decode(event.data);
            term.write(text);
        }
    };

    socket.onclose = () => {
        term.write('\r\n\x1b[1;31mConnection closed. Reconnecting in 3s...\x1b[0m\r\n');
        setTimeout(connectSocket, 3000);
    };

    socket.onerror = (error) => {
        console.error('Terminal WebSocket error:', error);
    };
}

function sendResize() {
    if (socket && socket.readyState === WebSocket.OPEN && term) {
        const dims = { cols: term.cols, rows: term.rows };
        socket.send(JSON.stringify({ type: 'resize', ...dims }));
    }
}

export function getTerminalContainer() {
    return terminalContainer;
}

export function fitTerminal() {
    if (fitAddon) {
        fitAddon.fit();
        sendResize();
    }
    if (term) term.focus();
}

export function setTerminalMode(mode) {
    if (!terminalContainer) return;
    
    isTerminalInTab = (mode === 'tab');
    
    const header = document.getElementById('terminal-header');
    const resizeHandle = document.getElementById('terminal-resize-handle');

    if (mode === 'tab') {
        terminalContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            background: var(--bg-primary);
            display: flex;
            flex-direction: column;
            border-top: none;
            box-shadow: none;
        `;
        
        if (header) header.style.display = 'flex';
        if (resizeHandle) resizeHandle.style.display = 'none';

        if (tabBtn) {
            tabBtn.innerHTML = '<span class="material-icons">vertical_align_bottom</span>';
            tabBtn.title = "Move to Bottom Panel";
            tabBtn.onclick = () => eventBus.emit('terminal:close-tab');
        }
        if (closeBtn) closeBtn.style.display = 'none';

    } else {
        terminalContainer.style.cssText = `
            height: 300px;
            min-height: 100px;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            flex-shrink: 0;
            display: ${state.terminalVisible ? 'flex' : 'none'};
            flex-direction: column;
        `;
        
        if (header) header.style.display = 'flex';
        if (resizeHandle) resizeHandle.style.display = 'block';
        
        if (tabBtn) {
            tabBtn.innerHTML = '<span class="material-icons">open_in_new</span>';
            tabBtn.title = "Move to Editor Tab";
            tabBtn.onclick = () => eventBus.emit('terminal:open-tab');
        }
        if (closeBtn) closeBtn.style.display = '';

        if (terminalContainer.parentNode !== document.body) {
            insertTerminalIntoBody();
        }
    }
    setTimeout(fitTerminal, 50);
}

export async function toggleTerminal(forceState = null) {
    if (!state.terminalIntegrationEnabled) return;
    if (!term) await initTerminal();
    
    if (isTerminalInTab) {
        // If in tab, just focus it
        eventBus.emit('tab:activate', { tab: state.openTabs.find(t => t.isTerminal) });
        return;
    }

    if (forceState !== null) {
        state.terminalVisible = forceState;
    } else {
        state.terminalVisible = !state.terminalVisible;
    }

    if (terminalContainer) {
        terminalContainer.style.display = state.terminalVisible ? 'flex' : 'none';
        if (state.terminalVisible) {
            if (terminalContainer.parentNode !== document.body) {
                insertTerminalIntoBody();
            }
            setTimeout(fitTerminal, 50);
        }
    }
    saveSettings();
}

export async function runCommand(cmd) {
    if (!term) await initTerminal();
    if (!state.terminalVisible && !isTerminalInTab) eventBus.emit('terminal:toggle', true);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(cmd + '\r');
    }
}

export function updateTerminalTheme() {
    if (!term) return;
    const style = getComputedStyle(document.documentElement);
    term.options.theme = {
        background: style.getPropertyValue('--bg-primary').trim(),
        foreground: style.getPropertyValue('--text-primary').trim(),
        cursor: style.getPropertyValue('--accent-color').trim(),
        selectionBackground: style.getPropertyValue('--accent-color-transparent')?.trim()
    };
    if (terminalContainer) {
        terminalContainer.style.background = style.getPropertyValue('--bg-primary').trim();
        const termDiv = document.getElementById('xterm-container');
        if (termDiv) termDiv.style.background = style.getPropertyValue('--bg-primary').trim();
    }
}

export function updateSshDropdown() {
    if (!sshSelect) return;
    sshSelect.innerHTML = "";
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = t("ssh.connect");
    sshSelect.appendChild(defaultOption);
    if (state.sshHosts) {
        state.sshHosts.forEach(host => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(host);
            opt.text = host.name || `${host.username}@${host.host}`;
            sshSelect.appendChild(opt);
        });
    }
    const manageOption = document.createElement('option');
    manageOption.value = "manage";
    manageOption.text = t("ssh.manage");
    sshSelect.appendChild(manageOption);
}

async function showSshManager() {
    const hosts = state.sshHosts || [];
    let listHtml = '<div style="max-height: 300px; overflow-y: auto; margin-bottom: 16px; border: 1px solid var(--border-color); border-radius: 4px;">';
    if (hosts.length === 0) {
        listHtml += `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">${t("ssh.none_saved")}</div>`;
    } else {
        hosts.forEach((host, index) => {
            const authLabel = host.authType === 'key' ? '🔑 Key' : '🔐 Password';
            listHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid var(--border-color);">
                <div style="display: flex; flex-direction: column; flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-weight: 500; font-size: 13px;">${host.name}</span>
                        <span style="font-size: 10px; background: var(--bg-secondary); padding: 2px 6px; border-radius: 2px; color: var(--text-secondary);">${authLabel}</span>
                    </div>
                    <span style="font-size: 11px; color: var(--text-secondary);">${host.username}@${host.host}:${host.port}</span>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="icon-btn edit-ssh-btn" data-index="${index}" style="color: var(--accent-color); cursor: pointer; padding: 4px;"><span class="material-icons" style="font-size: 18px;">edit</span></button>
                    <button class="icon-btn delete-ssh-btn" data-index="${index}" style="color: var(--error-color); cursor: pointer; padding: 4px;"><span class="material-icons" style="font-size: 18px;">delete</span></button>
                </div>
            </div>`;
        });
    }
    listHtml += `</div><button id="btn-add-ssh-host" class="btn-primary" style="width: 100%; padding: 8px; border-radius: 4px; cursor: pointer;">${t("ssh.add_new")}</button>`;

    const modalPromise = showModal({ title: t("ssh.hosts_title"), message: listHtml, confirmText: t("modal.ok"), cancelText: null });
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.onclick = async (e) => {
            if (e.target.closest('#btn-add-ssh-host')) { await addSshHost(null); showSshManager(); }
            const editBtn = e.target.closest('.edit-ssh-btn');
            if (editBtn) { const index = parseInt(editBtn.dataset.index); await addSshHost(index); showSshManager(); }
            const delBtn = e.target.closest('.delete-ssh-btn');
            if (delBtn) { 
                const index = parseInt(delBtn.dataset.index);
                if (await showConfirmDialog({ title: "Delete Host", message: "Are you sure?", isDanger: true })) {
                    state.sshHosts.splice(index, 1); saveSettings(); updateSshDropdown(); showSshManager();
                }
            }
        };
    }
    await modalPromise;
}

async function addSshHost(editIndex = null) {
    const isEdit = editIndex !== null;
    const existingHost = isEdit ? state.sshHosts[editIndex] : null;
    const formHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 4px;">
            <div><label style="font-size: 12px;">Name</label><input type="text" id="ssh-name" class="modal-input" value="${isEdit ? existingHost.name : ''}"></div>
            <div style="display: flex; gap: 12px;">
                <div style="flex: 2;"><label style="font-size: 12px;">Host</label><input type="text" id="ssh-host" class="modal-input" value="${isEdit ? existingHost.host : ''}"></div>
                <div style="flex: 1;"><label style="font-size: 12px;">Port</label><input type="number" id="ssh-port" class="modal-input" value="${isEdit ? existingHost.port : '22'}"></div>
            </div>
            <div><label style="font-size: 12px;">User</label><input type="text" id="ssh-user" class="modal-input" value="${isEdit ? existingHost.username : 'root'}"></div>
            <div>
                <label style="font-size: 12px;">Auth</label>
                <select id="ssh-auth-type" class="modal-input">
                    <option value="password" ${(!isEdit || existingHost.authType === 'password') ? 'selected' : ''}>Password</option>
                    <option value="key" ${isEdit && existingHost.authType === 'key' ? 'selected' : ''}>Key (PEM)</option>
                </select>
            </div>
            <div id="ssh-password-section" style="${(!isEdit || existingHost.authType === 'password') ? '' : 'display:none'}">
                <label style="font-size: 12px;">Password</label><input type="password" id="ssh-password" class="modal-input" value="${isEdit && existingHost.password ? existingHost.password : ''}">
            </div>
            <div id="ssh-key-section" style="${isEdit && existingHost.authType === 'key' ? '' : 'display:none'}">
                <label style="font-size: 12px;">Key</label><textarea id="ssh-private-key" class="modal-input" rows="4">${isEdit && existingHost.privateKey ? existingHost.privateKey : ''}</textarea>
            </div>
        </div>`;

    const result = await showModal({ title: isEdit ? "Edit SSH Host" : "Add SSH Host", message: formHtml, confirmText: "Save", cancelText: "Cancel" });
    if (result !== null) {
        const host = {
            name: document.getElementById('ssh-name').value,
            host: document.getElementById('ssh-host').value,
            port: document.getElementById('ssh-port').value,
            username: document.getElementById('ssh-user').value,
            authType: document.getElementById('ssh-auth-type').value,
            password: document.getElementById('ssh-password')?.value || '',
            privateKey: document.getElementById('ssh-private-key')?.value || ''
        };
        if (isEdit) state.sshHosts[editIndex] = host;
        else { state.sshHosts = state.sshHosts || []; state.sshHosts.push(host); }
        saveSettings(); updateSshDropdown();
    }
}

export function applyTerminalVisibility() {
    if (elements.btnTerminal) elements.btnTerminal.style.display = state.terminalIntegrationEnabled ? 'flex' : 'none';
    if (!state.terminalIntegrationEnabled) {
        if (terminalContainer) terminalContainer.style.display = 'none';
        state.terminalVisible = false;
        if (socket) { socket.close(); socket = null; }
    } else if (terminalContainer && !isTerminalInTab) {
        terminalContainer.style.display = state.terminalVisible ? 'flex' : 'none';
    }
}

export function openTerminalTab() {
    let tab = state.openTabs.find(t => t.isTerminal);
    if (!tab) {
      tab = { path: "terminal://local", name: "Terminal", isTerminal: true, modified: false, isBinary: false };
      state.openTabs.push(tab);
    }
    state.terminalVisible = false;
    if (terminalContainer) terminalContainer.style.display = 'none';
    eventBus.emit('tab:activate', { tab });
    eventBus.emit('ui:refresh-tabs');
}

export function onTerminalTabClosed() {
    isTerminalInTab = false;
    state.terminalVisible = false;
    if (terminalContainer) {
        terminalContainer.style.display = 'none';
        setTerminalMode('panel');
    }
}

export function closeTerminalTab() {
    const tab = state.openTabs.find(t => t.isTerminal);
    if (tab) {
      eventBus.emit('tab:close', { tab, force: true });
      onTerminalTabClosed();
      state.terminalVisible = true;
      toggleTerminal(true);
    }
}
