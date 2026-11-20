# My Momentum — Product Requirements

**Product:** Chrome new-tab productivity dashboard

**Status:** Current features implemented

**Product goal:** Help the user begin each new tab with a clear daily focus,
their most important tasks, useful world clocks, and a personal visual backdrop.

## 1. Personalized greeting

Show a personal, time-aware greeting at the top of the dashboard.

### Acceptance criteria — implemented

- The greeting displays the user's saved name.
- The user can change their name in the personalization settings.
- The user can select the timezone used to determine the greeting.
- The user can choose a Friendly, Motivational, or Simple greeting style.
- The greeting changes according to the time of day.
- Greeting changes appear immediately after settings are saved.
- Greeting settings persist locally and synchronize across open dashboard tabs.

## 2. Configurable world clocks

Show the current time in two locations selected by the user.

### Acceptance criteria — implemented

- Two clocks are displayed at the top of the dashboard.
- The default clocks show Lisbon, Portugal and Berlin, Germany.
- The left and right clocks can be configured independently.
- Available choices include major European, American, Asian, Australian, UTC,
  and device-local timezones.
- Each clock updates its country and city label when its timezone changes.
- Both clocks use a 24-hour format.
- Both clocks update automatically every second.
- Named timezones handle daylight-saving changes automatically.
- The clocks refresh when the user returns to a previously inactive tab.

## 3. Daily focus

Keep one clear intention visible without adding more controls to the main dashboard.

### Acceptance criteria — implemented

- A compact focus sentence appears directly beneath the clocks.
- The sentence uses the format “Today's main focus is: [focus].”
- When no focus is saved, the sentence displays “Not set yet.”
- Focus-editing controls are located at the bottom of the page.
- The user can save, edit, or clear today's focus.
- The focus is associated with the current calendar date.
- A previous day's focus is not displayed as today's focus.
- Focus changes persist locally and synchronize across open dashboard tabs.

## 4. Ranked task management

Help the user capture, prioritize, rank, and complete tasks from the new-tab page.

### Acceptance criteria — implemented

- The current task list appears above the new-task fields.
- The user can add a task of up to 200 characters.
- Empty or spaces-only tasks cannot be added.
- The user can edit a task and save or cancel the change.
- The user can delete a task.
- The user can mark a task as completed and undo completion.
- Completed tasks are visually quieter and use strikethrough text.
- Each task can have High, Medium, or Low priority.
- Each task can have an optional due date.
- Overdue unfinished tasks are identified visually.
- The user can rank tasks by dragging the reorder handle.
- The user can rank tasks with the keyboard's up and down arrow keys.
- Pressing Escape during a pointer drag cancels the change.
- The focused view shows the first three unfinished tasks in ranked order.
- Less-important and completed tasks can be expanded with a Show More control.
- Task text, order, priority, due date, and completion state persist locally.
- Task changes synchronize across open dashboard tabs.
- Older saved tasks are migrated to the current task format without data loss.

## 5. Progress and daily summary

Show useful progress without turning the dashboard into a complex analytics tool.

### Acceptance criteria — implemented

- The task section shows completed tasks as a fraction of all tasks.
- The dashboard shows how many tasks remain.
- Tasks completed on the current day are counted in the daily summary.
- The summary updates when a task is completed, reopened, added, or deleted.
- When every task is complete, the dashboard communicates that state.

## 6. Personal background library

Allow the user to personalize the dashboard with locally stored photos.

### Acceptance criteria — implemented

- The user can upload and store up to 10 photos.
- JPEG, PNG, and WebP images are accepted.
- Each uploaded file can be up to 10 MB.
- The extension checks that each selected file is a readable image before saving it.
- Multiple valid images can be uploaded together.
- A random saved photo is selected whenever a new dashboard page opens.
- The same photo may be selected again by chance.
- The current background remains stable while the library is being managed.
- The user can see previews and filenames for saved photos.
- The user can remove photos and upload replacements.
- The user can adjust the background-photo darkness from 0% to 70%.
- The dashboard works before any photos have been uploaded.
- Photos persist locally between browser restarts.

## 7. Appearance and responsive behavior

Keep content readable while allowing the selected background to remain visible.

### Acceptance criteria — implemented

- The dashboard uses a dark gradient when no photo is selected.
- Cards, inputs, dropdowns, and secondary controls are translucent.
- Dashboard panels use background blur, rounded corners, and subtle shadows.
- Text remains opaque and readable above translucent surfaces.
- The daily-focus sentence appears in a compact panel matching the dashboard style.
- High, Medium, and Low priorities have distinct visual treatments.
- Completed tasks are visually quieter than active tasks.
- Adding, completing, and reordering tasks uses subtle animation.
- Animations are effectively disabled when reduced motion is requested.
- The layout adapts for tablet and mobile screen widths.
- Task actions and forms remain usable on narrow screens.

## 8. Accessibility and keyboard use

Ensure that core dashboard actions do not depend on pointer input alone.

### Acceptance criteria — implemented

- Form controls have visible or assistive labels.
- Interactive elements have visible keyboard focus indicators.
- Task reordering is available through the keyboard.
- Status and error messages use live status regions where appropriate.
- Task checkboxes are associated with their task text.
- Buttons that require additional context have descriptive accessible names.
- Uploaded-image previews include alternative text.
- Reduced-motion preferences are respected.

## 9. Storage, privacy, and reliability

Keep the extension private, local, and usable without an account or network service.

### Acceptance criteria — implemented

- Tasks, focus, and settings are stored in the current Chrome profile using
  `localStorage`.
- Photo files are stored locally using IndexedDB.
- User content is not uploaded to an external server.
- The extension does not require an account.
- The extension makes no external API calls.
- The manifest requests no additional Chrome permissions.
- Storage and image-processing failures display understandable error messages.
- The extension uses plain HTML, CSS, and JavaScript with no packages or build step.
