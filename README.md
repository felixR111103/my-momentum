# My Momentum

A private, dependency-free Chrome new-tab dashboard for daily focus, ranked tasks,
world clocks, and personal photo backgrounds. Everything is stored locally in the
current Chrome profile.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this `my-momentum` folder.
4. Open a new tab and accept Chrome's new-tab change if prompted.

After editing the extension, reload it on `chrome://extensions` and open a fresh tab.

## Features

### Daily dashboard

- A time-aware greeting with a configurable name, timezone, and style.
- Two configurable timezone clocks in 24-hour format with automatic daylight
  saving; they default to Lisbon and Berlin.
- A single focus sentence directly beneath the clocks. Its editing and clearing
  controls live at the bottom of the page, and it resets visually the next day.
- A daily summary showing completions and remaining tasks.
- A dark, readable default background when no photo is selected.

### Ranked tasks

- Add, edit, complete, uncomplete, and delete tasks.
- Assign High, Medium, or Low priority and an optional due date.
- Drag the **⠿** handle to rank tasks, or use its up/down arrow keys.
- The focused view shows the first three unfinished tasks; remaining and completed
  tasks can be expanded with **Show all tasks**.
- The current task list is shown above the fields for adding a new task.
- Progress displays the number of completed and total tasks.
- Task order, fields, and completion state survive browser restarts and synchronize
  across open dashboard tabs.

### Background library

- Store up to 10 JPEG, PNG, or WebP images of up to 10 MB each.
- Select a random saved photo for each new tab.
- Preview and remove saved photos.
- Adjust the background-photo darkness in the personalization panel.
- Photos remain on the device in IndexedDB.

### Interface and accessibility

- Responsive desktop and mobile layouts.
- Keyboard task reordering and visible focus indicators.
- Screen-reader labels and live status messages.
- Subtle task animations that respect `prefers-reduced-motion`.
- Translucent, blurred panels and controls that keep text readable while allowing
  photos to remain visible.

## Project files

- `manifest.json` registers the Chrome new-tab override.
- `newtab.html` defines the dashboard structure.
- `styles.css` contains the responsive visual system and animations.
- `todo.js` manages tasks, progress, ranking, and daily focus.
- `settings.js` manages personalization and photo-darkness preferences.
- `clocks.js` manages the clocks and personalized greeting.
- `background.js` manages the local photo library and random background.
- `PM.md` records the product requirements.

## Manual acceptance checks

- Change the name, greeting timezone and style, both clock timezones, and photo
  darkness; reload and verify that each setting persists.
- Add tasks with every priority and with/without due dates; edit them and reload.
- Complete and uncomplete tasks; verify progress and the daily summary.
- Add more than three active tasks and a completed task; verify the focused and
  expanded views.
- Reorder tasks with pointer drag and arrow keys; verify order after reload.
- Save a daily focus and verify it appears in another open dashboard tab.
- Upload valid photos and reject an invalid type, an unreadable image, and a file
  larger than 10 MB.
- Remove all photos and verify the dark default background remains readable.
- Check the layout at narrow mobile widths and with reduced motion enabled.
