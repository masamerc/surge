interface ExtendedSurgeConfig {
  interval: number;
  enabled: boolean;
  customMessage?: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled') as HTMLInputElement;
  const intervalInput = document.getElementById('interval') as HTMLInputElement;
  const customMessageTextarea = document.getElementById('customMessage') as HTMLTextAreaElement;
  const saveButton = document.getElementById('saveSettings') as HTMLButtonElement;
  const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;

  loadSettings();

  saveButton.addEventListener('click', saveSettings);

  function loadSettings(): void {
    chrome.storage.sync.get(['interval', 'enabled', 'customMessage'], (result) => {
      const config: ExtendedSurgeConfig = {
        interval: result.interval || 30,
        enabled: result.enabled !== false,
        customMessage: result.customMessage || ''
      };
      
      enabledToggle.checked = config.enabled;
      intervalInput.value = config.interval.toString();
      customMessageTextarea.value = config.customMessage || '';
    });
  }

  function saveSettings(): void {
    const interval = parseInt(intervalInput.value);
    const enabled = enabledToggle.checked;
    const customMessage = customMessageTextarea.value.trim();

    if (interval < 5 || interval > 480) {
      showStatusMessage('Please enter an interval between 5 and 480 minutes.', false);
      return;
    }

    const config: ExtendedSurgeConfig = {
      interval,
      enabled,
      customMessage: customMessage || undefined
    };

    chrome.storage.sync.set(config, () => {
      showStatusMessage('Settings saved successfully!', true);
    });
  }

  function showStatusMessage(message: string, isSuccess: boolean): void {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${isSuccess ? 'success' : 'error'}`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
});