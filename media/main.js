/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // Gets the vs code api
  const vscode = acquireVsCodeApi();

  const log = (message) => vscode.postMessage({ type: 'log', value: message });

  const updateStatusBar = (message) => vscode.postMessage({ type: 'updateStatusBar', value: message });
  updateStatusBar('');

  let timeoutId;
  const updateStatusForSeconds = (message, secondsToHide) => {
    updateStatusBar(message);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    timeoutId = setTimeout(() => {
      updateStatusBar('');
    }, secondsToHide || 3000);
  };

  // Current state - simplified for single file mode
  let currentState = {
    state: 'render',
    content: ''
  };

  // Set the options for the marked markdown parser
  marked.setOptions({
    gfm: true,
    breaks: true
  });

  // Creates custom renderers for the marked markdown
  const renderer = {
    // Ref: https://github.com/markedjs/marked/blob/master/src/Renderer.js
    list(body, ordered, start) {
      const type = ordered ? 'ol' : 'ul',
        startatt = ordered && start !== 1 ? ' start="' + start + '"' : '',
        hasTodo = body.match(/checkbox/i) ? ' class="todoList"' : ''; // If there's a checkbox, adds a "todoList" class
      return '<' + type + startatt + hasTodo + '>\n' + body + '</' + type + '>\n';
    },
    checkbox(checked) {
      return '<input ' + (checked ? 'checked="" ' : '') + 'type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
    }
  };

  // Use the created renderer
  marked.use({ renderer });

  // This method will render the webview
  const renderView = () => {
    // Grabs the elements
    const renderElement = document.getElementById('render');
    const editorElement = document.getElementById('content');

    switch (currentState.state) {
      case 'render': {
        // If we want to render the markdown

        // Grab the html for the markdown
        renderElement.innerHTML = DOMPurify.sanitize(marked(currentState.content || ''));

        if (renderElement.classList.contains('hidden')) {
          renderElement.classList.remove('hidden');
        }
        editorElement.classList.add('hidden');

        document.querySelectorAll(`input[type='checkbox']`).forEach((check) => {
          // So we can lookup the checkbox in the markdown content
          const content = check.parentElement.textContent.trim();
          const getIsChecked = () => currentState.content.includes(`- [x] ${content}`);

          // Ensure the checkbox state matches what is in the latest markdown
          check.checked = getIsChecked();

          check.addEventListener('click', (event) => {
            // Prevent the click from bubbling up to trigger edit mode
            event.stopPropagation();
            
            const checked = getIsChecked();

            // Update the markdown to use the new checked state
            // Best to just rely on the markdown as the source of truth rather
            // than trying to juggle some internal state for the checkbox
            const newContent = checked
              ? // Was checked - should now uncheck
                currentState.content.replaceAll(`- [x] ${content}`, `- [ ] ${content}`)
              : // Was not checked - should now check
                currentState.content.replaceAll(`- [ ] ${content}`, `- [x] ${content}`);

            currentState.content = newContent;
            saveContentToFile();
            renderView();
          });
        });

        // Add click event listener to render element to switch to edit mode
        renderElement.addEventListener('click', () => {
          currentState.state = 'editor';
          renderView();
          // Focus the text input after switching to edit mode
          setTimeout(() => {
            const textInput = document.getElementById('text-input');
            if (textInput) {
              textInput.focus();
            }
          }, 0);
        });
        break;
      }
      case 'editor': {
        // If we want to render the text editor

        // Grabs the text input
        const editorTextArea = document.getElementById('text-input');

        // Put the value in the input
        editorTextArea.value = currentState.content || '';

        if (editorElement.classList.contains('hidden')) {
          editorElement.classList.remove('hidden');
        }
        renderElement.classList.add('hidden');
        break;
      }
    }
  };

  const saveContentToFile = () => {
    // Save current content to file via extension
    vscode.postMessage({ type: 'saveContent', value: currentState.content });
  };

  const getCurrentContent = () => {
    if (currentState.state === 'editor') {
      const editorTextArea = document.getElementById('text-input');
      return editorTextArea.value;
    }
    return currentState.content;
  };

  const debouncedSaveContent = _.debounce(() => {
    const newContent = getCurrentContent();
    // Only save if content has actually changed
    if (currentState.content !== newContent) {
      currentState.content = newContent;
      saveContentToFile();
    }
  }, 500, {
    maxWait: 1000
  });


  const loadContent = (content) => {
    // Only update if content has actually changed
    if (currentState.content === content) {
      return; // Skip update if content is identical
    }

    // Preserve cursor position and selection if in editor mode
    let cursorStart = 0;
    let cursorEnd = 0;
    let shouldRestoreCursor = false;
    
    if (currentState.state === 'editor') {
      const editorTextArea = document.getElementById('text-input');
      if (editorTextArea === document.activeElement) {
        cursorStart = editorTextArea.selectionStart;
        cursorEnd = editorTextArea.selectionEnd;
        shouldRestoreCursor = true;
      }
    }

    currentState.content = content;
    renderView();

    // Restore cursor position after update
    if (shouldRestoreCursor && currentState.state === 'editor') {
      const editorTextArea = document.getElementById('text-input');
      // Use setTimeout to ensure the DOM has been updated
      setTimeout(() => {
        editorTextArea.setSelectionRange(cursorStart, cursorEnd);
        editorTextArea.focus();
      }, 0);
    }
  };

  const resetData = () => {
    currentState.content = '';
    renderView();
  };

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'loadContent': {
        // Load content from file
        loadContent(message.value);
        break;
      }
      case 'resetData': {
        resetData();
        break;
      }
    }
  });

  document.getElementById('text-input').addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      // prevent the focus lose on tab press
      event.preventDefault();
    }
  });

  document.getElementById('text-input').addEventListener('input', () => {
    debouncedSaveContent();
  });

  document.getElementById('text-input').addEventListener('blur', () => {
    // Switch back to render mode when the text input loses focus
    if (currentState.state === 'editor') {
      currentState.content = getCurrentContent();
      currentState.state = 'render';
      renderView();
    }
  });

  // Load initial content from extension
  vscode.postMessage({ type: 'loadContent' });

  // Runs the render for the first time
  renderView();
})();