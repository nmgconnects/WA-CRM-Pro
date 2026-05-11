// WA-CRM Pro Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('WA-CRM Pro Extension Installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOG_TRIGGER') {
    console.log('Automation Triggered:', message.payload);
  }

  if (message.type === 'SAVE_AUTO_REPLY_RULE') {
    chrome.storage.local.get(['auto_reply_rules', 'SUPABASE_URL', 'SUPABASE_KEY'], (config) => {
      const rules = config.auto_reply_rules || [];
      const index = rules.findIndex(r => r.keyword === message.payload.keyword);
      
      if (index !== -1) {
        rules[index] = message.payload;
      } else {
        rules.push(message.payload);
      }
      
      chrome.storage.local.set({ 'auto_reply_rules': rules }, async () => {
        // Optional: Sync to Supabase if configured
        if (config.SUPABASE_URL && config.SUPABASE_KEY) {
          try {
            await fetch(`${config.SUPABASE_URL}/rest/v1/automation_rules`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': config.SUPABASE_KEY,
                'Authorization': `Bearer ${config.SUPABASE_KEY}`,
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                keyword: message.payload.keyword,
                responses: message.payload.responses,
                is_active: true,
                workspace_id: '1'
              })
            });
          } catch (e) { console.error('Cloud Sync Failed', e); }
        }
        sendResponse({ success: true });
      });
    });
    return true;
  }

  if (message.type === 'FETCH_AUTO_REPLY_RULES') {
    chrome.storage.local.get(['SUPABASE_URL', 'SUPABASE_KEY'], async (config) => {
      if (config.SUPABASE_URL && config.SUPABASE_KEY) {
        try {
          const response = await fetch(`${config.SUPABASE_URL}/rest/v1/automation_rules?select=*`, {
            headers: {
              'apikey': config.SUPABASE_KEY,
              'Authorization': `Bearer ${config.SUPABASE_KEY}`
            }
          });
          const remoteRules = await response.json();
          chrome.storage.local.set({ 'auto_reply_rules': remoteRules });
          sendResponse({ success: true, data: remoteRules });
        } catch (e) {
          sendResponse({ success: false, error: e.message });
        }
      } else {
        chrome.storage.local.get('auto_reply_rules', (data) => {
          sendResponse({ success: true, data: data.auto_reply_rules || [] });
        });
      }
    });
    return true;
  }

  if (message.type === 'DELETE_AUTO_REPLY_RULE') {
    chrome.storage.local.get(['auto_reply_rules', 'SUPABASE_URL', 'SUPABASE_KEY'], (config) => {
      const keyword = message.payload.keyword;
      const rules = (config.auto_reply_rules || []).filter(r => r.keyword !== keyword);
      
      chrome.storage.local.set({ 'auto_reply_rules': rules }, async () => {
        if (config.SUPABASE_URL && config.SUPABASE_KEY) {
          try {
            await fetch(`${config.SUPABASE_URL}/rest/v1/automation_rules?keyword=eq.${keyword}`, {
              method: 'DELETE',
              headers: {
                'apikey': config.SUPABASE_KEY,
                'Authorization': `Bearer ${config.SUPABASE_KEY}`
              }
            });
          } catch (e) { console.error('Cloud Delete Failed', e); }
        }
        sendResponse({ success: true });
      });
    });
    return true;
  }

  if (message.type === 'RUN_AI_ANALYSIS') {
    chrome.storage.local.get('GEMINI_API_KEY', async (data) => {
      const apiKey = data.GEMINI_API_KEY || ''; 
      
      if (!apiKey) {
        sendResponse({ success: false, error: 'API_KEY_MISSING' });
        return;
      }

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `Analyze this WhatsApp conversation and provide a Lead Score (0-100), Sentiment, and a 1-sentence Strategy. Format as JSON with keys leadScore, sentiment, strategy. Conversation: ${JSON.stringify(message.payload.messages)}` }]
            }]
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error?.message || `HTTP ${response.status}`);
        }

        sendResponse({ success: true, data: result });
      } catch (error) {
        console.error('WA-CRM AI Fetch Error:', error);
        sendResponse({ success: false, error: error.message });
      }
    });
    return true;
  }

  if (message.type === 'SYNC_TO_SUPABASE') {
    chrome.storage.local.get(['SUPABASE_URL', 'SUPABASE_KEY'], async (config) => {
        const { table, data } = message.payload;
        const { SUPABASE_URL, SUPABASE_KEY } = config;

        if (!SUPABASE_URL || !SUPABASE_KEY) {
            sendResponse({ success: false, error: 'SUPABASE_CONFIG_MISSING' });
            return;
        }

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `Supabase Error: ${response.status}`);
            }

            const result = await response.json();
            sendResponse({ success: true, data: result });
        } catch (error) {
            console.error('WA-CRM Sync Error:', error);
            sendResponse({ success: false, error: error.message });
        }
    });
    return true;
  }

  if (message.type === 'FETCH_CONTACTS') {
    chrome.storage.local.get(['SUPABASE_URL', 'SUPABASE_KEY'], async (config) => {
        if (config.SUPABASE_URL && config.SUPABASE_KEY) {
            try {
                const response = await fetch(`${config.SUPABASE_URL}/rest/v1/contacts?select=*`, {
                    headers: {
                        'apikey': config.SUPABASE_KEY,
                        'Authorization': `Bearer ${config.SUPABASE_KEY}`
                    }
                });
                const remoteContacts = await response.json();
                sendResponse({ success: true, data: remoteContacts });
            } catch (e) {
                sendResponse({ success: false, error: e.message });
            }
        } else {
            sendResponse({ success: true, data: [] });
        }
    });
    return true;
  }

  if (message.type === 'FETCH_TEMPLATES') {
    chrome.storage.local.get(['SUPABASE_URL', 'SUPABASE_KEY'], async (config) => {
        if (config.SUPABASE_URL && config.SUPABASE_KEY) {
            try {
                const response = await fetch(`${config.SUPABASE_URL}/rest/v1/message_templates?select=*`, {
                    headers: {
                        'apikey': config.SUPABASE_KEY,
                        'Authorization': `Bearer ${config.SUPABASE_KEY}`
                    }
                });
                const remoteTemplates = await response.json();
                sendResponse({ success: true, data: remoteTemplates });
            } catch (e) {
                sendResponse({ success: false, error: e.message });
            }
        } else {
            sendResponse({ success: true, data: [] });
        }
    });
    return true;
  }

  if (message.type === 'START_BROADCAST') {
    const { contacts, message: broadcastText, delay } = message.payload;
    
    (async () => {
        chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, async (tabs) => {
            if (tabs.length === 0) return;
            const targetTab = tabs[0];

            for (let i = 0; i < contacts.length; i++) {
                const phone = contacts[i].replace(/\D/g, '');
                // We pass a special flag in the URL or storage to tell the content script to auto-send
                const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(broadcastText)}#wa-crm-broadcast`;
                
                chrome.tabs.update(targetTab.id, { url });
                
                // Wait for the delay or until content script signals it sent the message
                await new Promise(resolve => setTimeout(resolve, Math.max(delay, 10) * 1000));
            }
        });
    })();

    sendResponse({ success: true });
    return true;
  }
});
