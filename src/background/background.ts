interface SurgeConfig {
  interval: number;
  enabled: boolean;
}

const DEFAULT_INTERVAL = 30; // 30 minutes

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    interval: DEFAULT_INTERVAL,
    enabled: true
  });
  
  setupAlarm(DEFAULT_INTERVAL);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'standUpReminder') {
    showStandUpNotification();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.interval || changes.enabled) {
      chrome.storage.sync.get(['interval', 'enabled'], (result) => {
        const config: SurgeConfig = {
          interval: result.interval || DEFAULT_INTERVAL,
          enabled: result.enabled !== false
        };
        
        if (config.enabled) {
          setupAlarm(config.interval);
        } else {
          chrome.alarms.clear('standUpReminder');
        }
      });
    }
  }
});

function setupAlarm(intervalMinutes: number): void {
  chrome.alarms.clear('standUpReminder', () => {
    chrome.alarms.create('standUpReminder', {
      delayInMinutes: intervalMinutes,
      periodInMinutes: intervalMinutes
    });
  });
}

function showStandUpNotification(): void {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Surge - Time to Stand Up!',
    message: 'It\'s been a while since your last break. Take a moment to stand up and stretch!',
    buttons: [
      { title: 'Done' },
      { title: 'Snooze 5 min' }
    ]
  }, (notificationId) => {
    chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
      if (id === notificationId) {
        if (buttonIndex === 1) { // Snooze
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
}