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
    chrome.storage.local.get('auto_reply_rules', (data) => {
      const rules = data.auto_reply_rules || [];
      const index = rules.findIndex(r => r.keyword === message.payload.keyword);
      
      if (index !== -1) {
        rules[index] = message.payload;
      } else {
        rules.push(message.payload);
      }
      
      chrome.storage.local.set({ 'auto_reply_rules': rules }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Keep channel open for async response
  }

  if (message.type === 'DELETE_AUTO_REPLY_RULE') {
    chrome.storage.local.get('auto_reply_rules', (data) => {
      const rules = (data.auto_reply_rules || []).filter(r => r.keyword !== message.payload.keyword);
      chrome.storage.local.set({ 'auto_reply_rules': rules }, () => {
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
});
