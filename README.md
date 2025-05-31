# Workout Plan - Local Development

## Quick Start

### Option 1: Node.js HTTP Server (Recommended)
```bash
npm install
npm run dev
```
This will:
- Install the http-server package
- Start a local server on http://localhost:3000
- Automatically open your browser

### Option 2: Python HTTP Server
```bash
npm run serve
```
This will start a Python server on http://localhost:8000

### Option 3: Manual Browser Opening
Simply open the `index.html` file directly in your browser, though embedded YouTube videos work better with a proper HTTP server.

## Available Scripts

- `npm run dev` - Start development server with auto-browser opening
- `npm run start` - Start server without opening browser
- `npm run serve` - Use Python's built-in HTTP server

## Features

- All YouTube videos are now embedded as iframes for better viewing experience
- Responsive design works on mobile and desktop
- Local development server ensures proper loading of all resources

## Development Workflow

1. Make changes to `index.html`
2. Save the file
3. Refresh your browser to see changes
4. The server will continue running until you stop it (Ctrl+C)
