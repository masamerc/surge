interface SurgeConfig {
  interval: number;
  enabled: boolean;
  nextAlarmTime?: number;
  customMessage?: string;
}

const DEFAULT_INTERVAL = 30; // 30 minutes

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    interval: DEFAULT_INTERVAL,
    enabled: true
  });
  
  setupAlarm(DEFAULT_INTERVAL);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'restartAlarm') {
    setupAlarm(request.interval);
    sendResponse({ success: true });
  }
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'standUpReminder') {
    showStandUpNotification();
    // Update next alarm time for the next interval
    chrome.storage.sync.get(['interval'], (result) => {
      const intervalMinutes = result.interval || DEFAULT_INTERVAL;
      const nextAlarmTime = Date.now() + (intervalMinutes * 60 * 1000);
      chrome.storage.sync.set({ nextAlarmTime });
    });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.interval || changes.enabled) {
      chrome.storage.sync.get(['interval', 'enabled'], (result) => {
        // Be explicit about enabled state
        const enabled = result.enabled === undefined || result.enabled === null ? true : result.enabled;
        
        const config: SurgeConfig = {
          interval: result.interval || DEFAULT_INTERVAL,
          enabled: enabled
        };
        
        console.log('Background: config changed, enabled:', config.enabled);
        
        if (config.enabled) {
          console.log('Background: Setting up alarm for', config.interval, 'minutes');
          setupAlarm(config.interval);
        } else {
          console.log('Background: Clearing alarms');
          chrome.alarms.clear('standUpReminder');
          chrome.storage.sync.set({ nextAlarmTime: null });
        }
      });
    }
  }
});

function setupAlarm(intervalMinutes: number): void {
  chrome.alarms.clear('standUpReminder', () => {
    const nextAlarmTime = Date.now() + (intervalMinutes * 60 * 1000);
    chrome.storage.sync.set({ nextAlarmTime });
    
    chrome.alarms.create('standUpReminder', {
      delayInMinutes: intervalMinutes,
      periodInMinutes: intervalMinutes
    });
  });
}

function showStandUpNotification(): void {
  chrome.storage.sync.get(['customMessage'], (result) => {
    const message = result.customMessage || 'Greetings from Surge.';
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Surge - Time to Stand Up!',
      message: message,
      buttons: [
        { title: 'Done' },
        { title: 'Snooze 5 min' }
      ]
    }, (notificationId) => {
    chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
      if (id === notificationId) {
        if (buttonIndex === 1) { // Snooze
          const nextAlarmTime = Date.now() + (5 * 60 * 1000);
          chrome.storage.sync.set({ nextAlarmTime });
          chrome.alarms.create('standUpReminder', {
            delayInMinutes: 5
          });
        }
        chrome.notifications.clear(id);
      }
    });
    
    chrome.notifications.onClicked.addListener((id) => {
      if (id === notificationId) {
        chrome.notifications.clear(id);
      }
    });
    });
  });
}