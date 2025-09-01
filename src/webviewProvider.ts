// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { getConfig } from './config';

export default class SidebarProjectMdNotesProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'sidebarProjectMdNotes.webview';
  private static readonly fileName = '.project-notes.md';

  private _view?: vscode.WebviewView;
  private config = getConfig();
  private _fileWatcher?: vscode.FileSystemWatcher;
  private _isWriting = false;

  constructor(private readonly _extensionUri: vscode.Uri, private _statusBar?: vscode.StatusBarItem) {
    // Set up file watcher for the notes file
    this._setupFileWatcher();

    // Listen for workspace folder changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      this._setupFileWatcher();
      this._refreshWebview();
    });
  }

  private _setupFileWatcher() {
    // Dispose existing watcher
    if (this._fileWatcher) {
      this._fileWatcher.dispose();
    }

    const workspaceFolder = this._getWorkspaceFolder();
    if (workspaceFolder) {
      const pattern = new vscode.RelativePattern(workspaceFolder, SidebarProjectMdNotesProvider.fileName);

      this._fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);

      this._fileWatcher.onDidChange(() => {
        if (!this._isWriting) {
          this._refreshWebview();
        }
      });

      this._fileWatcher.onDidCreate(() => {
        this._refreshWebview();
      });

      this._fileWatcher.onDidDelete(() => {
        this._refreshWebview();
      });
    }
  }

  private _getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0]; // Use first workspace folder
    }
    return undefined;
  }

  private _getNotesFilePath(): string | undefined {
    const workspaceFolder = this._getWorkspaceFolder();
    if (workspaceFolder) {
      return path.join(workspaceFolder.uri.fsPath, SidebarProjectMdNotesProvider.fileName);
    }
    return undefined;
  }

  private async _readNotesFromFile(): Promise<string> {
    const filePath = this._getNotesFilePath();
    if (!filePath) {
      return 'No workspace folder open. Please open a folder to use Project Notes.';
    }

    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      } else {
        return '# Project Notes\n\nStart by typing **markdown**.\n\nYour notes are automatically rendered in the sidebar.\n\nAlso works with GitHub Flavored Markdown ✨✨\n- [ ] Start by  \n- [ ] creating your own  \n- [x] checklists!  \n\nOr any kind of markdown\n\n- Your imagination  \n- Is the limit';
      }
    } catch (error) {
      console.error('Error reading notes file:', error);
      return 'Unable to read notes file. Please check if the workspace is accessible.';
    }
  }

  private async _writeNotesToFile(content: string): Promise<void> {
    const filePath = this._getNotesFilePath();
    if (!filePath) {
      vscode.window.showErrorMessage('No workspace folder open. Cannot save notes.');
      return;
    }

    try {
      this._isWriting = true;
      fs.writeFileSync(filePath, content, 'utf8');
      // Brief delay to ensure the file system event is processed before we reset the flag
      setTimeout(() => {
        this._isWriting = false;
      }, 100);
    } catch (error) {
      this._isWriting = false;
      console.error('Error writing notes file:', error);
      vscode.window.showErrorMessage('Unable to save notes. Please check file permissions and disk space.');
    }
  }

  private _refreshWebview() {
    if (this._view) {
      this._readNotesFromFile().then((content) => {
        if (this._view) {
          this._view.webview.postMessage({ type: 'loadContent', value: content });
        }
      });
    }
  }

  /**
   * Revolves a webview view.
   *
   * `resolveWebviewView` is called when a view first becomes visible. This may happen when the view is
   * first loaded or when the user hides and then shows a view again.
   *
   * @param webviewView Webview view to restore. The provider should take ownership of this view. The
   *    provider must set the webview's `.html` and hook up all webview events it is interested in.
   * @param context Additional metadata about the view being resolved.
   * @param token Cancellation token indicating that the view being provided is no longer needed.
   *
   * @return Optional thenable indicating that the view has been fully resolved.
   */
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
      enableCommandUris: false
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Load initial content
    this._refreshWebview();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      // Input validation
      if (!data || typeof data.type !== 'string') {
        console.error('Invalid message received: missing or invalid type');
        return;
      }

      // Validate and sanitize string inputs
      const sanitizeString = (input: any): string => {
        if (typeof input !== 'string') {
          return '';
        }
        // Limit length to prevent DoS
        if (input.length > 1000000) {
          return input.substring(0, 1000000);
        }
        return input;
      };

      switch (data.type) {
        case 'log': {
          const message = sanitizeString(data.value);
          if (message) {
            vscode.window.showInformationMessage(message);
          }
          break;
        }
        case 'updateStatusBar': {
          const status = sanitizeString(data.value);
          this.updateStatusBar(status);
          break;
        }
        case 'saveContent': {
          const content = sanitizeString(data.value);
          await this._writeNotesToFile(content);
          break;
        }
        case 'loadContent': {
          const content = await this._readNotesFromFile();
          webviewView.webview.postMessage({ type: 'loadContent', value: content });
          break;
        }
        case 'openNotesFile': {
          this.openNotesFile();
          break;
        }
        default: {
          console.error(`Unknown message type: ${data.type}`);
          break;
        }
      }
    });

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('sidebar-project-md-notes')) {
        this.config = getConfig();
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
      }
    });
  }

  public async resetData() {
    const filePath = this._getNotesFilePath();
    if (!filePath) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }

    const response = await vscode.window.showWarningMessage(
      'Are you sure you want to reset the project notes? This will delete the .project-notes.md file.',
      'Yes, reset',
      'Cancel'
    );

    if (response === 'Yes, reset') {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        this._refreshWebview();
        vscode.window.showInformationMessage('Project notes have been reset.');
      } catch (error) {
        console.error('Error resetting notes:', error);
        vscode.window.showErrorMessage('Unable to reset notes. Please check file permissions.');
      }
    }
  }

  public async openNotesFile() {
    const filePath = this._getNotesFilePath();

    if (!filePath) {
      vscode.window.showErrorMessage('No workspace folder open. Cannot open notes file.');
      return;
    }

    try {
      // Ensure the file exists first
      if (!fs.existsSync(filePath)) {
        // Create the file with default content if it doesn't exist
        const defaultContent =
          '# Project Notes\n\nStart by typing **markdown**.\n\nYour notes are automatically rendered in the sidebar.\n\nAlso works with GitHub Flavored Markdown ✨✨\n- [ ] Start by  \n- [ ] creating your own  \n- [x] checklists!  \n\nOr any kind of markdown\n\n- Your imagination  \n- Is the limit';
        fs.writeFileSync(filePath, defaultContent, 'utf8');
      }

      // Open the file in the editor
      const document = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(document);
    } catch (error) {
      console.error('Error opening notes file:', error);
      vscode.window.showErrorMessage('Unable to open notes file. Please check file permissions.');
    }
  }

  public updateStatusBar(content?: string) {
    if (this._statusBar) {
      if (content) {
        this._statusBar.text = `${content}`;
        this._statusBar.show();
      } else {
        this._statusBar.hide();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const purifyUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lib', 'purify.min.js'));

    const markedUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lib', 'marked.min.js'));

    const lodashUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lib', 'lodash.min.js'));

    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const markdownCss = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'markdown.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

    // Use a nonce to only allow a specific script to be run.
    const nonce = this._getNonce();

    const config = JSON.stringify({
      leftMargin: this.config.leftMargin
    });

    const cspContent = `default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';`;

    const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                    Use a content security policy to only allow loading images from https or from our extension directory,
                    and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="${cspContent}">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${markdownCss}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Project Notes</title>
			</head>
      <body>

        <div id="render"></div>
        <div id="content"><textarea id="text-input" name="text-input" placeholder="Start by typing your markdown notes..."></textarea></div>

        <script nonce="${nonce}">
          (function () {
            const renderElement = document.getElementById('render');
            const editorElement = document.getElementById('content');

            renderElement.style.paddingLeft = ${this.config.leftMargin === true ? '"20px"' : '"0px"'};
            editorElement.style.paddingLeft = ${this.config.leftMargin === true ? '"20px"' : '"0px"'};
          })();
        </script>
        <script nonce="${nonce}" src="${lodashUri}"></script>
        <script nonce="${nonce}" src="${purifyUri}"></script>
        <script nonce="${nonce}" src="${markedUri}"></script>
        <script nonce="${nonce}">var config = ${config};</script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;

    return htmlContent;
  }

  private _getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  dispose() {
    if (this._fileWatcher) {
      this._fileWatcher.dispose();
    }
  }
}
