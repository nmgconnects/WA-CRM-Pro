/**
 * WA-CRM Pro: Content Script (Transpiled)
 */

console.log('WA-CRM Pro: AI Intelligence v3.0 Loaded');

const UI_CONFIG = {
  SIDEBAR_ID: 'wa-crm-intel-sidebar',
  TOOLBAR_ID: 'wa-crm-header-toolbar',
  INPUT_CHIPS_ID: 'wa-crm-ai-chips'
};

// We will rely on background scripts for heavy AI lifting if needed, 
// or use a simple fetch if possible. For now, we simulate the structure.
let autoReplyRules = [];

function init() {
  const checkInterval = setInterval(() => {
    const app = document.querySelector('#app');
    const paneSide = document.querySelector('#pane-side');
    
    if (app && paneSide) {
      clearInterval(checkInterval);
      console.log('WA-CRM Pro: WhatsApp Ready. Initializing Control Center...');
      injectUI();
      setupMutationObserver();
    }
  }, 2000);
}

function injectUI() {
  createIntelSidebar();
}

function createIntelSidebar() {
  if (document.getElementById(UI_CONFIG.SIDEBAR_ID)) return;

  const sidebar = document.createElement('div');
  sidebar.id = UI_CONFIG.SIDEBAR_ID;
  sidebar.classList.add('wa-crm-sidebar-hidden'); 
  
  const intelStyles = document.createElement('style');
  intelStyles.innerText = `
    #${UI_CONFIG.SIDEBAR_ID} {
       position: fixed; right: 0; top: 0; width: 380px; height: 100vh;
       background: white; z-index: 10000; border-left: 1px solid #e5e7eb;
       box-shadow: -10px 0 50px rgba(0,0,0,0.1); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
       display: flex; flex-direction: column; font-family: 'Inter', system-ui, sans-serif;
    }
    .wa-crm-sidebar-hidden { transform: translateX(100%); }
    .intel-header { padding: 20px 24px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .intel-header h2 { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8; margin: 0; }
    .intel-body { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: none; }
    .intel-body::-webkit-scrollbar { display: none; }
    .intel-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 20px; margin-bottom: 24px; transition: all 0.3s; }
    .intel-card:hover { border-color: #e2e8f0; transform: translateY(-2px); }
    .score-badge { font-size: 32px; font-weight: 900; color: #0e8edc; }
    .ai-pulse { display: inline-block; width: 8px; height: 8px; background: #0e8edc; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
    .status-pill { padding: 6px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; display: inline-block; width: 100%; text-align: center; box-sizing: border-box; color: #64748b; }
    .status-pill.active { background: #0e8edc; color: white; border-color: #0e8edc; }
    .reply-chip { padding: 8px 16px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; display: block; margin-bottom: 8px; text-align: left; transition: all 0.2s; }
    .reply-chip:hover { background: #f1f5f9; border-color: #e2e8f0; color: #0e8edc; }
    .nav-tab { flex: 1; padding: 12px 0; border: none; background: none; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .nav-tab.active { color: #0e8edc; border-bottom-color: #0e8edc; background: #f8fafc; }
    .mini-card { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
    .tool-input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 11px; margin-bottom: 8px; outline: none; box-sizing: border-box; }
    .tool-input:focus { border-color: #0e8edc; }
    .action-btn-sm { width: 100%; padding: 12px; background: #0e8edc; color: white; border: none; border-radius: 12px; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; transition: all 0.2s; }
    .action-btn-sm:hover { opacity: 0.9; transform: scale(0.98); }
  `;
  document.head.appendChild(intelStyles);

  sidebar.innerHTML = `
    <div class="intel-header">
       <div style="display: flex; flex-direction: column;">
          <h2>WA-CRM PRO</h2>
          <span style="font-size: 8px; font-weight: 900; color: #0e8edc; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">Elite Control Center</span>
       </div>
       <button id="close-intel-sidebar" style="background: none; border: none; font-size: 24px; color: #cbd5e1; cursor: pointer; padding: 4px;">×</button>
    </div>
    
    <div style="display: flex; border-bottom: 1px solid #f1f5f9; background: #fff;">
       <button class="nav-tab active" data-tab="intel">🧠 Intel</button>
       <button class="nav-tab" data-tab="sales">📈 Sales</button>
       <button class="nav-tab" data-tab="auto">🤖 Auto</button>
       <button class="nav-tab" data-tab="tools">🛠 Tools</button>
    </div>

    <div class="intel-body" id="sidebar-tab-content"></div>

    <div id="intel-notification" style="position: absolute; bottom: 80px; left: 24px; right: 24px; padding: 16px; background: #0f172a; color: white; border-radius: 16px; font-size: 11px; font-weight: 800; text-align: center; transform: translateY(100px); transition: all 0.4s; opacity: 0; pointer-events: none; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); z-index: 100;">
       Action Completed!
    </div>
    
    <div style="padding: 20px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
       <span>Intelligence v3.0 Ultra</span>
       <span style="color: #10b981;">● Online</span>
    </div>
  `;

  document.body.appendChild(sidebar);

  document.getElementById('close-intel-sidebar').addEventListener('click', () => {
    sidebar.classList.add('wa-crm-sidebar-hidden');
  });

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderTabContent(e.target.getAttribute('data-tab') || 'intel');
    });
  });

  renderTabContent('intel');
}

function renderTabContent(tab) {
    const container = document.getElementById('sidebar-tab-content');
    if (!container) return;

    const header = document.querySelector('#main header');
    const contactName = (header?.querySelector('span[title]'))?.title || 'Selected Contact';

    switch(tab) {
        case 'intel':
            container.innerHTML = `
                <div class="intel-card" style="text-align: center; border: none; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);">
                    <div style="width: 72px; height: 72px; background: #0e8edc; color: white; border-radius: 24px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 28px; box-shadow: 0 20px 25px -5px rgba(14, 142, 220, 0.2);">${contactName[0]}</div>
                    <h3 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0;">${contactName}</h3>
                </div>
                <div id="ai-intelligence-container">
                    <div style="display: flex; justify-content: center; padding: 20px;">
                        <button id="btn-run-analysis" class="action-btn-sm" style="background: #10b981;">⚡ Run AI Analysis</button>
                    </div>
                </div>
                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Response Chips</span>
                    <div id="intel-replies">
                        <div class="reply-chip">"Yes, I can send that over now."</div>
                        <div class="reply-chip">"Is tomorrow good for a 15-min sync?"</div>
                    </div>
                </div>
            `;
            document.getElementById('btn-run-analysis')?.addEventListener('click', runAIIntelligence);
            attachChipListeners();
            break;
        case 'sales':
            container.innerHTML = `
                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Sales Pipeline Stage</span>
                    <div id="pipeline-stages">
                        <div class="status-pill active" data-stage="Lead">Lead</div>
                        <div class="status-pill" data-stage="Meeting">Meeting</div>
                        <div class="status-pill" data-stage="Proposal">Proposal Sent</div>
                        <div class="status-pill" data-stage="Closed">Closed Won</div>
                    </div>
                </div>
                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Deal Details</span>
                    <span style="font-size: 8px; color: #94a3b8; display: block; margin-bottom: 4px;">ESTIMATED VALUE</span>
                    <input type="text" id="deal-value-input" class="tool-input" value="$2500" />
                    <button class="action-btn-sm" id="btn-update-pipeline">Update Deal & Sync</button>
                </div>
            `;
            document.querySelectorAll('.status-pill').forEach(p => {
                p.addEventListener('click', () => {
                    document.querySelectorAll('.status-pill').forEach(s => s.classList.remove('active'));
                    p.classList.add('active');
                });
            });
            document.getElementById('btn-update-pipeline')?.addEventListener('click', () => {
                const activeStage = document.querySelector('.status-pill.active')?.getAttribute('data-stage');
                const value = document.getElementById('deal-value-input').value;
                chrome.runtime.sendMessage({ 
                    type: 'ADD_CONTACT', 
                    payload: { name: contactName, status: activeStage, value } 
                }, () => showNotification('CRM Updated!'));
            });
            break;
        case 'auto':
            const rulesHtml = autoReplyRules.map((rule, idx) => `
                <div class="mini-card" style="position: relative; border-left: 3px solid #10b981;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <span style="font-size: 10px; font-weight: 900; color: #0e8edc;">KEYWORD: ${rule.keyword.toUpperCase()}</span>
                        <button class="delete-rule" data-idx="${idx}" style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 10px; font-weight: 800;">DELETE</button>
                    </div>
                    <p style="font-size: 9px; color: #64748b; margin: 4px 0;">${rule.responses.length} sequence messages</p>
                </div>
            `).join('') || '<p style="font-size: 10px; color: #94a3b8; text-align: center;">No active rules</p>';

            container.innerHTML = `
                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Create Smart Auto-Reply</span>
                    <input type="text" id="auto-reply-keyword" class="tool-input" placeholder="Trigger Keyword (e.g. Price)..." />
                    
                    <div id="responses-container">
                        <div class="response-row" style="margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                            <span style="font-size: 8px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Response 1</span>
                            <textarea class="tool-input response-text" placeholder="Reply text..." style="margin-top: 4px;"></textarea>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 9px; color: #64748b;">Delay:</span>
                                <input type="number" class="tool-input response-delay" placeholder="Sec" style="width: 60px; margin-bottom: 0;" value="2" />
                            </div>
                        </div>
                    </div>
                    
                    <button id="btn-add-response" style="background: none; border: 1px dashed #cbd5e1; color: #64748b; font-size: 10px; font-weight: 700; width: 100%; padding: 8px; border-radius: 8px; cursor: pointer; margin-bottom: 16px;">+ Add Sequence Message</button>
                    <button id="btn-save-auto" class="action-btn-sm" style="background: #10b981;">Save Smart Rule</button>
                </div>

                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Active Automations</span>
                    <div id="saved-rules-list">
                        ${rulesHtml}
                    </div>
                </div>
            `;

            document.getElementById('btn-add-response')?.addEventListener('click', () => {
                const respContainer = document.getElementById('responses-container');
                if (!respContainer) return;
                const count = respContainer.querySelectorAll('.response-row').length + 1;
                const row = document.createElement('div');
                row.className = 'response-row';
                row.style.cssText = 'margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;';
                row.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 8px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Response ${count}</span>
                        <button class="remove-row" style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 14px;">×</button>
                    </div>
                    <textarea class="tool-input response-text" placeholder="Reply text..." style="margin-top: 4px;"></textarea>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 9px; color: #64748b;">Delay:</span>
                        <input type="number" class="tool-input response-delay" placeholder="Sec" style="width: 60px; margin-bottom: 0;" value="2" />
                    </div>
                `;
                row.querySelector('.remove-row')?.addEventListener('click', () => row.remove());
                respContainer.appendChild(row);
            });

            document.getElementById('btn-save-auto')?.addEventListener('click', () => {
                const keyword = document.getElementById('auto-reply-keyword').value;
                const rows = document.querySelectorAll('.response-row');
                const responses = Array.from(rows).map(row => ({
                        text: row.querySelector('.response-text').value,
                        delay: parseInt(row.querySelector('.response-delay').value) || 0
                })).filter(r => r.text.trim() !== '');

                if (!keyword || responses.length === 0) return showNotification('Incomplete Rule');

                chrome.runtime.sendMessage({ type: 'SAVE_AUTO_REPLY_RULE', payload: { keyword, responses } }, () => {
                    showNotification('Rule Saved!');
                    loadAutoReplyRules().then(() => renderTabContent('auto'));
                });
            });

            document.querySelectorAll('.delete-rule').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-idx') || '0');
                    const keyword = autoReplyRules[idx].keyword;
                    chrome.runtime.sendMessage({ type: 'DELETE_AUTO_REPLY_RULE', payload: { keyword } }, () => {
                        showNotification('Rule Deleted');
                        loadAutoReplyRules().then(() => renderTabContent('auto'));
                    });
                });
            });
            break;
        case 'tools':
            container.innerHTML = `
                <div class="intel-card">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 16px;">Chat with Non-contact</span>
                    <p style="font-size: 10px; color: #64748b; margin-bottom: 12px;">Start a chat without saving the number.</p>
                    <input type="text" id="direct-chat-phone" class="tool-input" placeholder="+1234567890" />
                    <button id="btn-direct-chat" class="action-btn-sm">Open Direct Chat</button>
                </div>
            `;
            document.getElementById('btn-direct-chat')?.addEventListener('click', () => {
                const phone = document.getElementById('direct-chat-phone').value;
                if (phone) {
                    window.open(`https://web.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}`, '_blank');
                    showNotification('Redirecting...');
                }
            });
            break;
    }
}

async function runAIIntelligence() {
    const container = document.getElementById('ai-intelligence-container');
    if (!container) return;

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
            <div class="ai-pulse" style="width: 40px; height: 40px; margin-bottom: 20px;"></div>
            <p style="font-size: 12px; font-weight: 800; color: #0e8edc; text-transform: uppercase; letter-spacing: 0.1em;">Analyzing Conversation...</p>
        </div>
    `;

    // Simulated AI response for environment without direct fetch or bundler
    setTimeout(() => {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div class="intel-card" style="margin-bottom: 0;">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Lead Score</span>
                    <p class="score-badge" style="margin: 8px 0 0 0;">85</p>
                </div>
                <div class="intel-card" style="margin-bottom: 0;">
                    <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase;">Sentiment</span>
                    <p style="font-size: 16px; font-weight: 900; color: #10b981; margin: 8px 0 0 0;">Positive</p>
                </div>
            </div>
            <div class="intel-card">
                <span style="font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 12px;">AI Strategy</span>
                <p style="font-size: 12px; color: #475569; line-height: 1.7; font-style: italic; margin: 0;">
                    Prospect shows high interest. Focus on closing the deal with a direct proposal.
                </p>
            </div>
        `;
    }, 2000);
}

function scrapeChat() {
    const messages = [];
    const messageElements = document.querySelectorAll('.message-in, .message-out');
    
    messageElements.forEach((el) => {
        const textEl = el.querySelector('.copyable-text span');
        if (textEl) {
            messages.push({
                sender: el.classList.contains('message-in') ? 'Contact' : 'Me',
                text: textEl.innerText
            });
        }
    });

    return messages.slice(-10);
}

function sendMessage(text) {
    const input = document.querySelector('footer div[contenteditable="true"]');
    if (input) {
        input.focus();
        document.execCommand('insertText', false, text);
        
        setTimeout(() => {
            const sendBtn = document.querySelector('footer button span[data-icon="send"]') || document.querySelector('footer button span[data-icon="label-send-light"]');
            if (sendBtn) {
                sendBtn.closest('button').click();
            }
        }, 100);
    }
}

function showNotification(text) {
    const notification = document.getElementById('intel-notification');
    if (notification) {
        notification.innerText = text;
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(100px)';
        }, 3000);
    }
}

function toggleIntelSidebar() {
  const sidebar = document.getElementById(UI_CONFIG.SIDEBAR_ID);
  if (sidebar) {
    sidebar.classList.toggle('wa-crm-sidebar-hidden');
  }
}

function attachChipListeners() {
    document.querySelectorAll('.reply-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const input = document.querySelector('footer div[contenteditable="true"]');
            if (input) {
                input.focus();
                document.execCommand('insertText', false, chip.innerText.replace(/"/g, ''));
            }
        });
    });
}

let lastChatName = '';

function setupMutationObserver() {
  const observer = new MutationObserver(() => {
    injectHeaderButtons();
    
    // Track chat changes
    const header = document.querySelector('#main header');
    if (header) {
      const currentChat = (header.querySelector('span[title]'))?.title || '';
      if (currentChat !== lastChatName) {
        lastChatName = currentChat;
        updateIntelContent();
      }
    }

    // Auto-Reply detection
    detectIncomingMessages();
  });

  const app = document.querySelector('#app');
  if (app) {
    observer.observe(app, { childList: true, subtree: true });
  }
}

function updateIntelContent() {
  const sidebar = document.getElementById(UI_CONFIG.SIDEBAR_ID);
  if (sidebar && !sidebar.classList.contains('wa-crm-sidebar-hidden')) {
    const activeTab = document.querySelector('.nav-tab.active')?.getAttribute('data-tab') || 'intel';
    renderTabContent(activeTab);
  }
}

async function loadAutoReplyRules() {
    const data = await chrome.storage.local.get('auto_reply_rules');
    autoReplyRules = data.auto_reply_rules || [];
}

let lastMessagedText = '';

function detectIncomingMessages() {
    const inbound = document.querySelectorAll('.message-in');
    if (inbound.length === 0) return;

    const latest = inbound[inbound.length - 1];
    const textEl = latest.querySelector('.copyable-text span');
    if (!textEl) return;

    const text = textEl.innerText.toLowerCase();
    if (text === lastMessagedText) return;
    lastMessagedText = text;

    // Check rules
    autoReplyRules.forEach(rule => {
        if (text.includes(rule.keyword)) {
            let cumulativeDelay = 0;
            rule.responses.forEach((resp, index) => {
                cumulativeDelay += resp.delay;
                setTimeout(() => {
                    sendMessage(resp.text);
                }, cumulativeDelay * 1000);
            });
        }
    });
}

function injectHeaderButtons() {
  const header = document.querySelector('#main header');
  if (!header || header.querySelector('.wa-crm-intel-btn')) return;

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-right: 12px;';

  const intelBtn = document.createElement('button');
  intelBtn.className = 'wa-crm-intel-btn';
  intelBtn.innerHTML = '📊 CRM Control';
  intelBtn.style.cssText = `
    background: #0e8edc; color: white; border: none; padding: 6px 12px;
    border-radius: 8px; font-size: 10px; font-weight: 800; cursor: pointer;
    text-transform: uppercase; box-shadow: 0 4px 6px -1px rgba(14, 142, 220, 0.2);
  `;
  
  intelBtn.onclick = (e) => {
    e.stopPropagation();
    toggleIntelSidebar();
  };

  btnContainer.appendChild(intelBtn);
  header.prepend(btnContainer);
}

loadAutoReplyRules();
init();
