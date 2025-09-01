# Sidebar-Project-MD-Notes

[![Marketplace Version](https://i.imgur.com/uYoZeB8.png 'Current Release')]()

Take markdown notes directly in the sidebar, synced with your project files.

> **Note**: This is a fork of [sidebar-markdown-notes](https://github.com/AssisrMatheus/sidebar-markdown-notes) with enhanced project-based file storage and click-to-edit functionality.

![screenshot](https://i.imgur.com/ZD8pHzF.png)

- **Project-based notes**: Notes are stored as `.project-notes.md` in your workspace root
- **GitHub Flavored Markdown Support**: Full GFM support including checklists
- **Auto-save**: Notes are automatically saved to your project file
- **File watching**: Changes to `.project-notes.md` are automatically reflected in the sidebar
- **Click-to-edit**: Click on rendered markdown to switch to edit mode
- **Open in editor**: Button to open `.project-notes.md` directly in VS Code editor

## How it works

When you open a workspace folder, the extension creates and manages a `.project-notes.md` file in the root of your workspace. This file contains all your project notes and is automatically synced with the sidebar interface.

## Available configurations

- `sidebar-project-md-notes.leftMargin`: Adds a left margin to the entire view so it aligns with other content in the sidebar.

---

Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>