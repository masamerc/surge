interface SurgeConfig {
  interval: number;
  enabled: boolean;
  nextAlarmTime?: number;
}

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled') as HTMLInputElement;
  const intervalSelect = document.getElementById('interval') as HTMLSelectElement;
  const statusDiv = document.getElementById('status') as HTMLDivElement;
  const openOptionsLink = document.getElementById('openOptions') as HTMLAnchorElement;
  const countdownDiv = document.getElementById('countdown') as HTMLDivElement;
  const countdownTimeDiv = document.getElementById('countdownTime') as HTMLDivElement;
  
  let countdownInterval: NodeJS.Timeout;

  loadConfigAndUpdateUI();

  function loadConfigAndUpdateUI(): void {
    chrome.storage.sync.get(['interval', 'enabled', 'nextAlarmTime'], (result) => {
      const config: SurgeConfig = {
        interval: result.interval || 30,
        enabled: result.enabled !== false,
        nextAlarmTime: result.nextAlarmTime
      };
      
      enabledToggle.checked = config.enabled;
      intervalSelect.value = config.interval.toString();
      updateStatus(config);
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

  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
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

  function updateStatus(config: SurgeConfig): void {
    if (config.enabled) {
      statusDiv.textContent = `Active - Interval: ${config.interval} minutes`;
      statusDiv.className = 'status active';
    } else {
      statusDiv.textContent = 'Inactive - Reminders are disabled';
      statusDiv.className = 'status inactive';
    }
  }

  // Clean up interval when popup closes
  window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });
});