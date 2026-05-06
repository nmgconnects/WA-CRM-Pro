// WA-CRM Pro Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('WA-CRM Pro Extension Installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOG_TRIGGER') {
    console.log('Automation Triggered:', message.payload);
    // Here you could sync with Supabase or show a notification
  }
});
