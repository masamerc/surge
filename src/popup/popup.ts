interface SurgeConfig {
  interval: number;
  enabled: boolean;
  nextAlarmTime?: number;
  customMessage?: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled') as HTMLInputElement;
  const intervalSelect = document.getElementById('interval') as HTMLSelectElement;
  const countdownDiv = document.getElementById('countdown') as HTMLDivElement;
  const countdownTimeDiv = document.getElementById('countdownTime') as HTMLDivElement;
  const customMessageTextarea = document.getElementById('customMessage') as HTMLTextAreaElement;
  const refreshButton = document.getElementById('refreshTimer') as HTMLButtonElement;
  
  let countdownInterval: NodeJS.Timeout;

  loadConfigAndUpdateUI();

  function loadConfigAndUpdateUI(): void {
    chrome.storage.sync.get(['interval', 'enabled', 'nextAlarmTime', 'customMessage'], (result) => {
      const config: SurgeConfig = {
        interval: result.interval || 30,
        enabled: result.enabled !== false,
        nextAlarmTime: result.nextAlarmTime,
        customMessage: result.customMessage || ''
      };
      
      enabledToggle.checked = config.enabled;
      intervalSelect.value = config.interval.toString();
      customMessageTextarea.value = config.customMessage || '';
      startCountdown(config);
    });
  }

  enabledToggle.addEventListener('change', () => {
    const enabled = enabledToggle.checked;
    chrome.storage.sync.set({ enabled }, () => {
      loadConfigAndUpdateUI();
    });
  });

  intervalSelect.addEventListener('change', () => {
    const interval = parseInt(intervalSelect.value);
    chrome.storage.sync.set({ interval }, () => {
      loadConfigAndUpdateUI();
    });
  });

  customMessageTextarea.addEventListener('input', () => {
    const customMessage = customMessageTextarea.value.trim();
    chrome.storage.sync.set({ customMessage: customMessage || undefined });
  });

  refreshButton.addEventListener('click', () => {
    refreshButton.disabled = true;
    refreshButton.textContent = '🔄 Restarting...';
    
    chrome.storage.sync.get(['interval', 'enabled'], (result) => {
      if (result.enabled !== false) {
        const interval = result.interval || 30;
        // Force restart the alarm by setting a new nextAlarmTime
        const nextAlarmTime = Date.now() + (interval * 60 * 1000);
        chrome.storage.sync.set({ nextAlarmTime }, () => {
          // Send message to background to restart alarm
          chrome.runtime.sendMessage({ action: 'restartAlarm', interval }, () => {
            setTimeout(() => {
              refreshButton.disabled = false;
              refreshButton.textContent = '🔄 Restart Timer';
              loadConfigAndUpdateUI();
            }, 500);
          });
        });
      } else {
        setTimeout(() => {
          refreshButton.disabled = false;
          refreshButton.textContent = '🔄 Restart Timer';
        }, 500);
      }
    });
  });

  function startCountdown(config: SurgeConfig): void {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    if (!config.enabled || !config.nextAlarmTime) {
      countdownDiv.className = 'countdown';
      countdownTimeDiv.textContent = '--:--';
      return;
    }

    countdownDiv.className = 'countdown active';
    updateCountdownDisplay(config.nextAlarmTime);

    countdownInterval = setInterval(() => {
      updateCountdownDisplay(config.nextAlarmTime!);
    }, 1000);
  }

  function updateCountdownDisplay(nextAlarmTime: number): void {
    const now = Date.now();
    const timeLeft = nextAlarmTime - now;

    if (timeLeft <= 0) {
      countdownTimeDiv.textContent = '00:00';
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      // Refresh config in case alarm fired
      setTimeout(loadConfigAndUpdateUI, 1000);
      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    const displayText = minutes > 0 
      ? `${minutes}:${seconds.toString().padStart(2, '0')}`
      : `${seconds}s`;
    
    countdownTimeDiv.textContent = displayText;
  }


  // Clean up interval when popup closes
  window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });
});