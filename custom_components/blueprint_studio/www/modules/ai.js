/**
 * AI Copilot module for Blueprint Studio
 */
import { state, elements } from './state.js';
import { API_BASE } from './constants.js';
import { fetchWithAuth } from './api.js';
import { showToast } from './ui.js';
import { copyToClipboard } from './utils.js';

export function toggleAISidebar() {
    const aiSidebar = document.getElementById("ai-sidebar");
    if (!aiSidebar) return;

    const isHidden = aiSidebar.classList.contains("hidden");
    if (isHidden) {
      aiSidebar.classList.remove("hidden");
      document.getElementById("ai-chat-input")?.focus();
    } else {
      aiSidebar.classList.add("hidden");
    }
}

export function formatAiResponse(text) {
    if (!text) return "";
    
    // Replace code blocks with styled containers
    let formatted = text.replace(/```(?:yaml|yml)?\n([\s\S]*?)\n```/g, (match, code) => {
        return `<div class="ai-code-block"><pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
    });
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // New lines to <br> (only outside of code blocks)
    return formatted.replace(/\n/g, '<br>');
}

export async function sendAIChatMessage() {
    const input = document.getElementById("ai-chat-input");
    const messagesContainer = document.getElementById("ai-chat-messages");
    if (!input || !messagesContainer) return;

    const query = input.value.trim();
    if (!query) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "ai-message ai-message-user";
    userMsg.textContent = query;
    messagesContainer.appendChild(userMsg);
    
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add assistant loading message
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "ai-message ai-message-assistant";
    loadingMsg.innerHTML = '<span class="ai-loading">Thinking...</span>';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const result = await fetchWithAuth(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_query",
          query: query,
          current_file: state.activeTab ? state.activeTab.path : null,
          file_content: (state.activeTab && state.editor) ? state.editor.getValue() : null
        })
      });

      if (result.success) {
        const formattedResponse = formatAiResponse(result.response);
        loadingMsg.innerHTML = formattedResponse;
        
        // Add copy buttons to code blocks
        loadingMsg.querySelectorAll(".ai-code-block").forEach(block => {
            const copyBtn = document.createElement("button");
            copyBtn.className = "ai-copy-btn";
            copyBtn.innerHTML = '<span class="material-icons">content_copy</span>';
            copyBtn.title = "Copy to clipboard";
            copyBtn.onclick = () => {
                const code = block.querySelector("code").innerText;
                copyToClipboard(code);
            };
            block.appendChild(copyBtn);
        });
      } else {
        loadingMsg.textContent = "Error: " + (result.message || "Failed to get response from AI");
        loadingMsg.style.color = "var(--error-color)";
      }
    } catch (e) {
      console.error("AI Copilot Error:", e);
      loadingMsg.textContent = "Error connecting to AI service: " + e.message;
      loadingMsg.style.color = "var(--error-color)";
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
