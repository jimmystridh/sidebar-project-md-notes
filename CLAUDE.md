# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension that provides project-specific markdown note-taking functionality in the sidebar. Notes are stored as `.project-notes.md` files in the workspace root and are automatically synced between the sidebar interface and the file system.

## Development Commands

### Build and Development
- `npm run webpack` - Development build (may have Node.js compatibility issues with newer versions)
- `npm run webpack-dev` - Watch mode for development
- `npm run compile` - TypeScript compilation only (recommended for testing)
- `npm run vscode:prepublish` - Production build (used before publishing)

### Testing and Quality
- `npm run test` - Run extension tests (automatically compiles and lints first)
- `npm run lint` - ESLint with TypeScript support
- `npm run test-compile` - Compile tests only

### Publishing
- `npm run deploy` - Publish to VS Code Marketplace using vsce

## Architecture Overview

### Core Extension Files
- `src/extension.ts` - Main extension entry point, registers commands and webview provider
- `src/webviewProvider.ts` - Implements the sidebar webview with file system operations for reading/writing `.project-notes.md`
- `src/config.ts` - Configuration management for extension settings
- `media/main.js` - Client-side webview logic with simplified single-file state management

### Key Architectural Changes from Original

**File-based Storage**: Unlike the original extension that used VS Code's internal state management, this fork stores notes directly in `.project-notes.md` files in the workspace root.

**Single-file Mode**: Removed multi-page functionality - each workspace has one notes file instead of multiple pages.

**File Watching**: Implements VS Code's FileSystemWatcher to detect external changes to the notes file and update the UI accordingly.

**Workspace Integration**: Handles workspace folder changes and provides appropriate error messages when no workspace is open.

### Key Implementation Details

**File Operations**: Uses Node.js `fs` module for synchronous file read/write operations. The extension creates `.project-notes.md` automatically when notes are first edited.

**Message Passing**: Webview communicates with the extension host using `saveContent` and `loadContent` messages instead of state persistence.

**Error Handling**: Gracefully handles cases where no workspace folder is open or file operations fail.

**View Container Configuration**: Extension supports configurable view location - can appear in either Explorer or Source Control sidebar. Location is controlled by `sidebar-project-md-notes.viewLocation` setting with "scm" as default. View location changes require VS Code reload due to platform limitations.

### Testing

Tests are located in `src/test/` and use Mocha with VS Code's extension testing framework. Run tests with `npm test` which will launch a new VS Code window for integration testing.

### Build System

Uses Webpack for bundling with TypeScript compilation via ts-loader. Note: Current webpack version may have compatibility issues with newer Node.js versions - use `npm run compile` for development testing.

## Dependency Management

### Package Update Process
- `ncu` (npm-check-updates) - Check for available package updates
- `npm audit` - Security vulnerability scanning  
- Update strategy: patch/minor updates first, then major versions individually
- **Selective upgrade approach**: Compatibility and functionality over latest versions
- Always test extension functionality after dependency updates

### Critical Dependencies
- `@types/vscode`: PINNED at 1.50.0 due to VS Code packaging constraint (engines.vscode ^1.50.0)
- `@types/marked`: REMOVED - marked 16.2.1+ provides its own TypeScript types (deprecated dependency)
- `eslint`: Stay on 8.x due to plugin ecosystem compatibility issues with 9.x
- `marked`: Markdown parsing with built-in TypeScript types - test rendering after updates
- `webpack`: Build system - verify bundling works after updates
- `typescript`: Language version affects compilation

### Update Validation Checklist
- [ ] `npm run compile` - TypeScript compilation succeeds
- [ ] `npm run lint` - Code quality checks pass
- [ ] `npm test` - All tests pass
- [ ] Manual testing: Extension loads in VS Code, notes functionality works
- [ ] Bundle size check: Ensure no significant size increase

### Recent Changes (Last 3 Updates)
- 2025-09-12: Removed deprecated @types/marked (marked 16.2.1+ has built-in types), documented skip decisions for @types/vscode and eslint
- 2025-09-12: Added selective dependency upgrade strategy and compatibility constraints documentation
- 2025-09-12: Major dependency update - TypeScript 4.0.5→5.9.2, ESLint 7.12.1→8.57.1, updated all dev dependencies