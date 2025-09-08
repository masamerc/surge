# Surge - Stand Up Reminder Chrome Extension

A TypeScript-powered Chrome extension that reminds you to stand up and take breaks at regular intervals.

## Features

- 🕐 Customizable reminder intervals (5 minutes to 8 hours)
- 🔔 Desktop notifications with snooze functionality
- ⚙️ Easy-to-use popup interface
- 🎛️ Advanced options page for customization
- 💾 Settings persist across browser sessions
- 🎯 Clean, modern UI

## Development

This project uses [Task](https://taskfile.dev/) as a task runner for easy development workflow.

### Prerequisites

- Node.js (v16 or later)
- npm
- Task (install with `sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d`)

### Quick Start

1. **Setup the development environment:**
   ```bash
   task dev-setup
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `./dist` folder
   - The Surge extension should now appear in your extensions!

### Available Tasks

| Command | Description |
|---------|-------------|
| `task install` | Install all dependencies |
| `task build` | Build for production |
| `task dev` | Build and watch for development |
| `task clean` | Clean build artifacts |
| `task type-check` | Run TypeScript type checking |
| `task package` | Package extension for distribution |
| `task validate` | Run all validation checks |
| `task help` | Show all available tasks |

### Development Workflow

1. **Start development mode:**
   ```bash
   task dev
   ```
   This will watch for changes and rebuild automatically.

2. **After making changes:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Surge extension
   - Test your changes

3. **Type checking:**
   ```bash
   task type-check
   ```

4. **Build for production:**
   ```bash
   task build
   ```

## Project Structure

```
surge/
├── src/
│   ├── background/       # Service worker scripts
│   ├── popup/           # Extension popup interface  
│   └── options/         # Options page
├── public/              # Static files (HTML, manifest, icons)
├── dist/                # Built extension files
├── Taskfile.yml         # Task definitions
├── tsconfig.json        # TypeScript configuration
├── webpack.config.js    # Webpack build configuration
└── package.json         # Dependencies and scripts
```

## How It Works

1. **Background Service Worker** (`src/background/background.ts`):
   - Manages alarms and notifications
   - Handles user settings changes
   - Shows stand-up reminders at configured intervals

2. **Popup Interface** (`src/popup/popup.ts`):
   - Quick settings toggle
   - Interval selection
   - Status display

3. **Options Page** (`src/options/options.ts`):
   - Advanced configuration
   - Custom reminder messages
   - Detailed settings

## Configuration

The extension stores settings in Chrome's sync storage:
- `enabled`: Boolean to enable/disable reminders
- `interval`: Number of minutes between reminders
- `customMessage`: Optional custom reminder text

## Publishing

To package the extension for the Chrome Web Store:

```bash
task package
```

This creates `surge-extension.zip` ready for upload to the Chrome Web Store.

## License

MIT