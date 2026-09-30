# My Momentum: to-do list

A small Chrome new-tab extension using plain HTML, CSS, and JavaScript.
No packages or build step are needed.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this `my-momentum` folder.
4. Open a new tab and accept Chrome's new-tab change if prompted.

## Use

- Enter a task and click **Add** (or press Enter).
- Tick its checkbox to finish it; untick it to undo.
- Drag the **⠿** handle to rank tasks, with the highest priority at the top. With the handle focused, use the up/down arrow keys to reorder with a keyboard. Press Escape during a drag to cancel.
- Click **Delete** to remove a task.
- Tasks, order, and completion are saved locally in this Chrome profile.

## Files and future features

- `manifest.json`: registers the extension and its new-tab page.
- `newtab.html`: contains the dashboard sections.
- `styles.css`: controls the appearance.
- `todo.js`: handles only the to-do list and its storage.

Later, add a clocks section and a separate `clocks.js` script to the HTML.
Background selection can use its own `background.js` script and images folder.
Use different storage keys for each feature. Neither feature is implemented yet.

## Manual acceptance checks

- Add two tasks and verify both appear.
- Try a spaces-only task: it should not be added.
- Complete a task and then uncheck it.
- Drag the second task above the first and back down; verify the order survives a reload.
- Focus a drag handle and reorder with the up/down arrow keys.
- Press Escape during a drag and verify the original order returns.
- Delete a task.
- Restart Chrome and check that tasks, ranking, and completion remain.
- Open two dashboard tabs; changes should appear in both.

After editing the extension, click its reload button on `chrome://extensions`
and open a fresh new tab.
