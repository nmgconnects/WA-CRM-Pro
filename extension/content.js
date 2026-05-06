/**
 * WA-CRM Pro: Content Script
 * Injected into web.whatsapp.com
 */

console.log('WA-CRM Pro: Content script loaded');

const UI_CONFIG = {
  SIDEBAR_ID: 'wa-crm-sidebar-root',
  TAB_BAR_ID: 'wa-crm-smart-tabs',
  TOOLBAR_ID: 'wa-crm-main-toolbar',
  INPUT_BAR_ID: 'wa-crm-input-toolbar'
};

// --- Initialization ---

function init() {
  const checkInterval = setInterval(() => {
    const app = document.querySelector('#app');
    const paneSide = document.querySelector('#pane-side');
    
    if (app && paneSide) {
      clearInterval(checkInterval);
      console.log('WA-CRM Pro: WhatsApp Web detected. Injecting UI...');
      injectSmartTabs();
      injectSidebar();
      setupMutationObserver();
      injectGlobalStyles();
    }
  }, 1000);
}

function injectGlobalStyles() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// --- Injection Logic ---

function injectHeaderToolbar() {
  const header = document.querySelector('#main header');
  if (!header || document.getElementById(UI_CONFIG.TOOLBAR_ID)) return;

  const toolbar = document.createElement('div');
  toolbar.id = UI_CONFIG.TOOLBAR_ID;
  toolbar.innerHTML = `
    <button title="Quick Chat"><div class="wa-icon">⚡</div></button>
    <button title="Broadcast"><div class="wa-icon">📢</div></button>
    <button title="Scheduled"><div class="wa-icon">⏰</div></button>
    <button title="Auto-Reply" class="toggle active">AI</button>
  `;
  
  const iconContainer = header.lastElementChild;
  if (iconContainer) {
    iconContainer.prepend(toolbar);
  }
}

function injectInputToolbar() {
  const inputContainer = document.querySelector('footer');
  if (!inputContainer || document.getElementById(UI_CONFIG.INPUT_BAR_ID)) return;

  const inputToolbar = document.createElement('div');
  inputToolbar.id = UI_CONFIG.INPUT_BAR_ID;
  inputToolbar.innerHTML = `
    <button class="wa-chip blue">Quick Reply</button>
    <button class="wa-chip emerald">AI Compose</button>
    <button class="wa-chip amber">Schedule</button>
    <button class="wa-chip indigo">Translate</button>
  `;

  // Inject above the input area
  const inputRow = inputContainer.querySelector('div')?.parentElement;
  if (inputRow) {
    inputRow.prepend(inputToolbar);
  }
}

function injectSmartTabs() {
  const chatList = document.querySelector('#pane-side');
  if (!chatList) return;

  // Find the search bar container to inject above/below
  const searchBarContainer = document.querySelector('[data-testid="chat-list-search"]')?.closest('div')?.parentElement;
  if (!searchBarContainer) return;

  const tabContainer = document.createElement('div');
  tabContainer.id = UI_CONFIG.TAB_BAR_ID;
  tabContainer.innerHTML = `
    <div class="wa-crm-tabs-inner">
      <button class="active">All</button>
      <button>Unread</button>
      <button>Waiting</button>
      <button>My Turn</button>
      <button>Groups</button>
      <button>+ Custom</button>
    </div>
  `;

  searchBarContainer.after(tabContainer);
  
  // Tab click listeners
  tabContainer.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      tabContainer.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      filterChatList(btn.innerText);
    };
  });
}

function filterChatList(category) {
  console.log('Filtering chat list by:', category);
  // Real implementation would hide/show list items based on data-testid="cell-frame-container"
}

function injectSidebar() {
  const sidePanel = document.createElement('div');
  sidePanel.id = UI_CONFIG.SIDEBAR_ID;
  sidePanel.className = 'wa-crm-sidebar-hidden';
  sidePanel.innerHTML = `
    <div class="wa-crm-sidebar-container">
      <div class="wa-crm-sidebar-header">
        <h2>CRM CONTACT INFO</h2>
        <button id="wa-crm-close-sidebar">×</button>
      </div>
      
      <div class="wa-crm-sidebar-body">
        <div id="wa-crm-profile-view" class="wa-crm-profile-section">
          <div class="wa-crm-avatar-large">?</div>
          <h3 id="wa-crm-contact-name">Select a Chat</h3>
          <span class="wa-crm-badge">Lead</span>
        </div>

        <div class="wa-crm-info-grid">
          <div class="wa-crm-info-item">
            <label>Company</label>
            <p id="wa-crm-company">---</p>
          </div>
          <div class="wa-crm-info-item">
            <label>Deal Value</label>
            <p id="wa-crm-value" class="text-emerald">$0.00</p>
          </div>
        </div>

        <div class="wa-crm-section">
          <label>Tags</label>
          <div class="wa-crm-tags-list" id="wa-crm-tags">
            <span class="wa-crm-tag">Enterprise</span>
            <span class="wa-crm-tag gray">Q4</span>
          </div>
        </div>

        <div class="wa-crm-section">
          <label>Privacy & Security</label>
          <div class="wa-crm-toggle-group">
            <div class="wa-crm-toggle-item">
              <span>Blur Messages</span>
              <input type="checkbox" id="wa-crm-blur-msgs">
            </div>
            <div class="wa-crm-toggle-item">
              <span>Hide Online Status</span>
              <input type="checkbox" id="wa-crm-hide-status">
            </div>
          </div>
        </div>

        <div class="wa-crm-actions">
           <button class="wa-crm-btn-secondary">Add Note</button>
           <button class="wa-crm-btn-secondary">Set Reminder</button>
           <button class="wa-crm-btn-primary" id="wa-crm-sync-btn">Sync to CRM</button>
        </div>

        <div class="wa-crm-history">
          <label>Recent Activity</label>
          <div class="wa-crm-history-list" id="wa-crm-history">
            <div class="wa-crm-history-item">
              <div class="dot emerald"></div>
              <div>
                <p>Chat Detected</p>
                <span>Ready for sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wa-crm-sidebar-footer">
        <span>WA-CRM Pro v2.4</span>
        <span class="status-online">Connected</span>
      </div>
    </div>
  `;
  document.body.appendChild(sidePanel);
  
  document.getElementById('wa-crm-close-sidebar').onclick = () => {
    sidePanel.classList.add('wa-crm-sidebar-hidden');
  };

  // Privacy Toggle Logic
  document.getElementById('wa-crm-blur-msgs').onchange = (e) => {
    const isChecked = e.target.checked;
    const styleId = 'wa-crm-blur-style';
    let style = document.getElementById(styleId);
    
    if (isChecked) {
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.innerText = `
          div[data-testid="msg-container"] { filter: blur(5px); transition: filter 0.2s; }
          div[data-testid="msg-container"]:hover { filter: blur(0); }
        `;
        document.head.appendChild(style);
      }
    } else {
      style?.remove();
    }
  };

  document.getElementById('wa-crm-hide-status').onchange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      alert('Online status hiding mode active. (Client-side simulation)');
    }
  };

  // Sidebar Button Logic
  document.querySelector('.wa-crm-btn-secondary').onclick = () => {
    const note = prompt('Enter a note for this contact:');
    if (note) {
      const contactName = document.getElementById('wa-crm-contact-name').innerText;
      chrome.runtime.sendMessage({ 
        type: 'SAVE_NOTE', 
        payload: { name: contactName, note: note } 
      }, (response) => {
        alert('Note saved to CRM!');
      });
    }
  };

  document.getElementById('wa-crm-sync-btn').onclick = () => {
    const btn = document.getElementById('wa-crm-sync-btn');
    const originalText = btn.innerText;
    btn.innerText = 'Syncing...';
    btn.disabled = true;

    const contactName = document.getElementById('wa-crm-contact-name').innerText;
    chrome.runtime.sendMessage({ 
      type: 'SYNC_CHAT', 
      payload: { name: contactName, timestamp: new Date().toISOString() } 
    }, (response) => {
      setTimeout(() => {
        btn.innerText = 'Synced!';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
        }, 2000);
      }, 1000);
    });
  };
}

// --- DOM Monitoring ---

function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        detectActiveChat();
      }
    }
  });

  const mainPanel = document.querySelector('#main');
  if (mainPanel) {
    observer.observe(mainPanel, { childList: true, subtree: true });
  } else {
    // Retry finding main panel periodically if it's not loaded yet
    setTimeout(setupMutationObserver, 2000);
  }
}

function detectActiveChat() {
  const header = document.querySelector('#main header');
  if (!header) return;

  injectHeaderToolbar();
  injectInputToolbar();

  const nameElement = header.querySelector('[title]');
  if (!nameElement) return;

  const currentChatName = nameElement.getAttribute('title');
  updateSidebar(currentChatName);
}

function updateSidebar(name) {
  const sidebar = document.getElementById(UI_CONFIG.SIDEBAR_ID);
  if (!sidebar) return;

  sidebar.classList.remove('wa-crm-sidebar-hidden');
  document.getElementById('wa-crm-contact-name').innerText = name;
  document.querySelector('.wa-crm-avatar-large').innerText = name.charAt(0);
}

// --- Messaging ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TOGGLE_SIDEBAR') {
    const sidebar = document.getElementById(UI_CONFIG.SIDEBAR_ID);
    sidebar.classList.toggle('wa-crm-sidebar-hidden');
  }
});

init();
