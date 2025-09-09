# Surge

A TypeScript Chrome extension for customizable recurring alerts.

## Features

- Customizable intervals (1 min - 2 hours)
- Desktop notifications with snooze
- Live countdown timer
- Custom messages
- Dark mode UI with golden accents

## Quick Start

```bash
# Install Task runner
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d

# Setup and build
task dev-setup

# Load in Chrome: chrome://extensions/ → "Load unpacked" → select dist/ folder
```

## Development

| Command | Description |
|---------|-------------|
| `task build` | Build for production |
| `task dev` | Build and watch |
| `task package` | Package for Chrome Web Store |

## Structure

```
src/
├── background/    # Service worker
└── popup/        # UI interface
public/           # Static assets
dist/            # Built files
```

## Developers

* **Main developer**: Claude Code

* **Copilot**: me | Masa Fukui


## License

MIT
