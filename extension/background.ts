/// <reference types="chrome" />

/**
 * WA-CRM Pro: Background Service Worker
 */

import { createClient } from '@supabase/supabase-js';

// Configuration (To be injected via build process or options)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('WA-CRM Pro: Supabase credentials missing. CRM sync features may be limited.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

chrome.runtime.onInstalled.addListener(() => {
  console.log('WA-CRM Pro Service Worker Installed');
  
  // Set up initial alarms
  chrome.alarms.create('check-reminders', { periodInMinutes: 1 });
});

// Alarm for scheduled messages
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('msg-')) {
    const msgId = alarm.name.split('-')[1];
    processScheduledMessage(msgId);
  } else if (alarm.name === 'check-reminders') {
    checkPendingReminders();
  }
});

async function processScheduledMessage(id: string) {
  console.log('Processing scheduled message:', id);
  
  // Retrieve message from storage
  const key = `scheduled_msg_${id}`;
  const data = await chrome.storage.local.get(key);
  const msgData = data[key] as { recipient: string; text: string; time: string } | undefined;

  if (msgData) {
    console.log('Found message data:', msgData);
    
    // In a real implementation, we would use chrome.scripting.executeScript
    // or send a message to the active WhatsApp tab to perform the send.
    // For now, we'll log it and clear the storage.
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'WA-CRM Pro: Message Ready',
      message: `Scheduled message for ${msgData.recipient} is ready to be sent.`
    });

    await chrome.storage.local.remove(key);
  } else {
    console.warn('No message data found for ID:', id);
  }
}

async function checkPendingReminders() {
  console.log('Checking for active reminders...');
  // Logic to query Supabase for due reminders and fire chrome.notifications
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleAsync = async () => {
    try {
      switch (request.type) {
        case 'SYNC_CHAT':
          await handleChatSync(request.payload);
          return { status: 'synced' };
        case 'SAVE_NOTE':
          await handleSaveNote(request.payload);
          return { status: 'saved' };
        case 'ADD_CONTACT':
          await handleAddContact(request.payload);
          return { status: 'added' };
        case 'SAVE_AUTO_REPLY_RULE':
          await handleSaveAutoReply(request.payload);
          return { status: 'rule_saved' };
        case 'DELETE_AUTO_REPLY_RULE':
          await handleDeleteAutoReply(request.payload);
          return { status: 'rule_deleted' };
        case 'LOG_TRIGGER':
          await handleLogTrigger(request.payload);
          return { status: 'logged' };
        case 'SCHEDULE_MESSAGE':
          await handleScheduleMessage(request.payload);
          return { status: 'scheduled' };
        case 'LAUNCH_CAMPAIGN':
          await handleLaunchCampaign(request.payload);
          return { status: 'campaign_launched' };
        case 'FORCE_SYNC':
          await handleForceSync();
          return { status: 'done' };
        default:
          return null; // Not handled
      }
    } catch (error) {
      console.error(`Error in handleAsync for ${request.type}:`, error);
      throw error;
    }
  };

  handleAsync().then(response => {
    if (response) {
      sendResponse(response);
    }
  }).catch(err => {
    sendResponse({ status: 'error', message: err instanceof Error ? err.message : String(err) });
  });

  return true; // Keep channel open for all handled/unhandled (safe because we eventually call sendResponse or it times out)
});

async function handleChatSync(data: any) {
  console.log('Syncing chat to Supabase:', data);
  // Real implementation:
  // await supabase.from('messages').insert([...])
}

async function handleSaveNote(data: any) {
  console.log('Saving note to CRM:', data);
  // Real implementation:
  // await supabase.from('notes').insert({ contact_name: data.name, content: data.note })
}

async function handleAddContact(data: any) {
  console.log('Adding new contact to CRM:', data);
  try {
    const { error } = await supabase.from('contacts').upsert({
      name: data.name,
      status: data.status || 'Lead',
      last_interaction: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase Error (handleAddContact):', err);
    return false;
  }
}

async function handleForceSync() {
  console.log('Starting explicit full sync...');
  return new Promise(resolve => setTimeout(resolve, 1000));
}

async function handleSaveAutoReply(data: any) {
  console.log('Saving Auto-Reply Rule:', data);
  try {
    // Attempt Supabase save
    await supabase.from('automation_rules').upsert({
      keyword: data.keyword.toLowerCase(),
      responses: data.responses, // Save as JSON array
      is_active: true
    });
    
    // Update local cache for content script immediacy
    const rulesData = await chrome.storage.local.get('auto_reply_rules');
    const existing = (rulesData.auto_reply_rules as any[]) || [];
    await chrome.storage.local.set({
      auto_reply_rules: [
        ...existing.filter((r:any) => r.keyword !== data.keyword.toLowerCase()), 
        { keyword: data.keyword.toLowerCase(), responses: data.responses }
      ]
    });
    
    return true;
  } catch (err) {
    console.error('Error in handleSaveAutoReply:', err);
    return false;
  }
}

async function handleDeleteAutoReply(data: any) {
  console.log('Deleting Auto-Reply Rule:', data);
  try {
    // Supabase delete
    await supabase.from('automation_rules').delete().eq('keyword', data.keyword.toLowerCase());
    
    // Local storage clean
    const rulesData = await chrome.storage.local.get('auto_reply_rules');
    const existing = (rulesData.auto_reply_rules as any[]) || [];
    await chrome.storage.local.set({
        auto_reply_rules: existing.filter((r: any) => r.keyword !== data.keyword.toLowerCase())
    });
    return true;
  } catch (err) {
    console.error('Error in handleDeleteAutoReply:', err);
    return false;
  }
}

async function handleLogTrigger(data: any) {
  console.log('Logging Trigger:', data);
  try {
    await supabase.from('automation_logs').insert({
      keyword: data.keyword,
      contact_name: data.contactName,
      triggered_at: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error handling log trigger:', err);
    return false;
  }
}

async function handleScheduleMessage(data: any) {
  console.log('Scheduling Message:', data);
  const id = Date.now().toString();
  const alarmName = `msg-${id}`;
  
  // Store the message data
  await chrome.storage.local.set({
    [`scheduled_msg_${id}`]: {
      text: data.text,
      recipient: data.recipient,
      time: data.time
    }
  });

  chrome.alarms.create(alarmName, { when: new Date(data.time).getTime() });
  return true;
}

async function handleLaunchCampaign(data: any) {
  console.log('Launching Marketing Campaign:', data);
  // Implementation: iterate through segments and queue messages
  return true;
}
