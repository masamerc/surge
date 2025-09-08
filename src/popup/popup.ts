interface SurgeConfig {
  interval: number;
  enabled: boolean;
}

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled') as HTMLInputElement;
  const intervalSelect = document.getElementById('interval') as HTMLSelectElement;
  const statusDiv = document.getElementById('status') as HTMLDivElement;
  const openOptionsLink = document.getElementById('openOptions') as HTMLAnchorElement;

  chrome.storage.sync.get(['interval', 'enabled'], (result) => {
    const config: SurgeConfig = {
      interval: result.interval || 30,
      enabled: result.enabled !== false
    };
    
    enabledToggle.checked = config.enabled;
    intervalSelect.value = config.interval.toString();
    updateStatus(config);
  });

  enabledToggle.addEventListener('change', () => {
    const enabled = enabledToggle.checked;
    chrome.storage.sync.set({ enabled }, () => {
      updateStatusFromStorage();
    });
  });

  intervalSelect.addEventListener('change', () => {
    const interval = parseInt(intervalSelect.value);
    chrome.storage.sync.set({ interval }, () => {
      updateStatusFromStorage();
    });
  });

  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  function updateStatusFromStorage(): void {
    chrome.storage.sync.get(['interval', 'enabled'], (result) => {
      const config: SurgeConfig = {
        interval: result.interval || 30,
        enabled: result.enabled !== false
      };
      updateStatus(config);
    });
  }

  function updateStatus(config: SurgeConfig): void {
    if (config.enabled) {
      statusDiv.textContent = `Active - Next reminder in ${config.interval} minutes`;
      statusDiv.className = 'status active';
    } else {
      statusDiv.textContent = 'Inactive - Reminders are disabled';
      statusDiv.className = 'status inactive';
    }
  }
});