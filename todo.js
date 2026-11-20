// The array order is the user's ranking. The first three unfinished tasks are
// the focused dashboard view; the rest remain available behind "Show all".
const STORAGE_KEY = "my-momentum-tasks";
const FOCUS_KEY = "my-momentum-daily-focus";
const priorities = new Set(["high", "medium", "low"]);
let tasks = [];
let activeDrag = null;
let showAllTasks = false;
let animation = null;

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const priorityInput = document.querySelector("#task-priority");
const dueDateInput = document.querySelector("#task-due-date");
const list = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const message = document.querySelector("#message");
const progress = document.querySelector("#task-progress");
const dailySummary = document.querySelector("#daily-summary");
const toggleTasks = document.querySelector("#toggle-tasks");
const focusForm = document.querySelector("#focus-form");
const focusInput = document.querySelector("#focus-input");
const focusStatus = document.querySelector("#focus-status");
const focusText = document.querySelector("#focus-text");
const clearFocus = document.querySelector("#clear-focus");

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTask(task) {
  if (!task || typeof task.id !== "string" || typeof task.text !== "string"
      || typeof task.completed !== "boolean") return null;
  return {
    id: task.id,
    text: task.text,
    completed: task.completed,
    priority: priorities.has(task.priority) ? task.priority : "medium",
    dueDate: typeof task.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)
      ? task.dueDate : "",
    completedAt: typeof task.completedAt === "string" ? task.completedAt : null
  };
}

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedTasks)) throw new Error("Invalid saved tasks");
    const normalized = savedTasks.map(normalizeTask);
    if (normalized.some(task => !task)) throw new Error("Invalid saved tasks");
    tasks = normalized;
    form.querySelector("button[type='submit']").disabled = false;
  } catch {
    message.textContent = "Your tasks could not be loaded. Please reload the page.";
    form.querySelector("button[type='submit']").disabled = true;
  }
  renderTasks();
}

function saveTasks(updatedTasks, nextAnimation = null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    tasks = updatedTasks;
    animation = nextAnimation;
    message.textContent = "";
    renderTasks();
    return true;
  } catch {
    message.textContent = "Could not save your change. Please try again.";
    renderTasks();
    return false;
  }
}

function loadDailyFocus() {
  try {
    const saved = JSON.parse(localStorage.getItem(FOCUS_KEY) || "null");
    const text = saved?.date === localDateKey() && typeof saved.text === "string"
      ? saved.text : "";
    showDailyFocus(text);
  } catch {
    showDailyFocus("");
    focusStatus.textContent = "Your daily focus could not be loaded.";
  }
}

function showDailyFocus(text) {
  focusStatus.textContent = "";
  focusInput.value = text;
  focusText.textContent = text || "Not set yet";
}

focusForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = focusInput.value.trim();
  try {
    localStorage.setItem(FOCUS_KEY, JSON.stringify({ date: localDateKey(), text }));
    showDailyFocus(text);
    focusStatus.textContent = text ? "Today's focus is set." : "Today's focus was cleared.";
  } catch {
    focusStatus.textContent = "Your daily focus could not be saved.";
  }
});

clearFocus.addEventListener("click", () => {
  try {
    localStorage.removeItem(FOCUS_KEY);
    showDailyFocus("");
    focusStatus.textContent = "Today's focus was cleared.";
    focusInput.focus();
  } catch {
    focusStatus.textContent = "Your daily focus could not be cleared.";
  }
});

function visibleTasks() {
  return showAllTasks ? tasks : tasks.filter(task => !task.completed).slice(0, 3);
}

function focusHandle(id) {
  const item = [...list.children].find(candidate => candidate.dataset.taskId === id);
  item?.querySelector(".drag-handle")?.focus();
}

function moveTask(id, direction) {
  const index = tasks.findIndex(task => task.id === id);
  const newIndex = index + direction;
  if (index < 0 || newIndex < 0 || newIndex >= tasks.length) return;
  const reordered = [...tasks];
  [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
  if (saveTasks(reordered, { id, type: "moved" })) {
    message.textContent = `Moved task to position ${newIndex + 1} of ${tasks.length}.`;
  }
  focusHandle(id);
}

function startDrag(event, task, item, handle) {
  const visible = visibleTasks();
  if (event.button !== 0 || visible.length < 2 || activeDrag) return;
  event.preventDefault();
  handle.focus();
  handle.setPointerCapture(event.pointerId);
  activeDrag = {
    id: task.id, item, handle, pointerId: event.pointerId,
    originalIds: visible.map(current => current.id)
  };
  item.classList.add("dragging");
}

function mergeVisibleOrder(ids) {
  const idSet = new Set(ids);
  const positions = tasks.map((task, index) => idSet.has(task.id) ? index : -1)
    .filter(index => index >= 0);
  const byId = new Map(tasks.map(task => [task.id, task]));
  const reordered = [...tasks];
  positions.forEach((position, index) => { reordered[position] = byId.get(ids[index]); });
  return reordered;
}

function finishDrag(cancelled = false) {
  if (!activeDrag) return;
  const { id, handle, pointerId, originalIds } = activeDrag;
  const ids = [...list.children].map(item => item.dataset.taskId);
  activeDrag = null;
  if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
  const changed = ids.some((taskId, index) => taskId !== originalIds[index]);
  if (!cancelled && changed) {
    if (saveTasks(mergeVisibleOrder(ids), { id, type: "moved" })) {
      message.textContent = "Task ranking updated.";
    }
  } else {
    renderTasks();
  }
  focusHandle(id);
}

list.addEventListener("pointermove", event => {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
  event.preventDefault();
  const { item } = activeDrag;
  const following = [...list.children].find(candidate => {
    if (candidate === item) return false;
    const bounds = candidate.getBoundingClientRect();
    return event.clientY < bounds.top + bounds.height / 2;
  });
  if (item.nextElementSibling !== (following || null)) {
    list.insertBefore(item, following || null);
    activeDrag.handle.setPointerCapture(event.pointerId);
  }
  if (event.clientY < 60) window.scrollBy(0, -20);
  else if (event.clientY > window.innerHeight - 60) window.scrollBy(0, 20);
});
list.addEventListener("pointerup", event => {
  if (event.pointerId === activeDrag?.pointerId) finishDrag();
});
list.addEventListener("pointercancel", () => finishDrag(true));
list.addEventListener("lostpointercapture", () => finishDrag(true));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && activeDrag) {
    event.preventDefault();
    finishDrag(true);
  }
});

function createButton(text, description, action, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", description);
  button.disabled = disabled;
  button.addEventListener("click", action);
  return button;
}

function makeSelect(value, label) {
  const select = document.createElement("select");
  select.setAttribute("aria-label", label);
  ["high", "medium", "low"].forEach(priority => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = `${priority[0].toUpperCase()}${priority.slice(1)} priority`;
    option.selected = priority === value;
    select.append(option);
  });
  return select;
}

function editTask(task, row) {
  const editor = document.createElement("form");
  editor.className = "task-editor";
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = task.text;
  editInput.maxLength = 200;
  editInput.required = true;
  editInput.setAttribute("aria-label", "Edit task");
  const editPriority = makeSelect(task.priority, "Edit priority");
  const editDueDate = document.createElement("input");
  editDueDate.type = "date";
  editDueDate.value = task.dueDate;
  editDueDate.setAttribute("aria-label", "Edit due date");
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save";

  function cancelEdit() { renderTasks(); }
  editor.addEventListener("submit", event => {
    event.preventDefault();
    const text = editInput.value.trim();
    if (!text) {
      editInput.setCustomValidity("Please enter a task.");
      editInput.reportValidity();
      return;
    }
    saveTasks(tasks.map(current => current.id === task.id
      ? { ...current, text, priority: editPriority.value, dueDate: editDueDate.value }
      : current));
  });
  editInput.addEventListener("input", () => editInput.setCustomValidity(""));
  editor.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  });
  editor.append(editInput, editPriority, editDueDate, saveButton,
    createButton("Cancel", "Cancel editing", cancelEdit));
  row.replaceChildren(editor);
  editInput.focus();
  editInput.select();
}

function formatDueDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })
    .format(new Date(year, month - 1, day));
}

function renderProgress() {
  const completed = tasks.filter(task => task.completed).length;
  const completedToday = tasks.filter(task => task.completedAt
    && localDateKey(new Date(task.completedAt)) === localDateKey()).length;
  const remaining = tasks.length - completed;
  progress.textContent = `${completed} of ${tasks.length} completed`;
  dailySummary.textContent = completedToday
    ? `${completedToday} completed today · ${remaining} remaining`
    : remaining ? `${remaining} task${remaining === 1 ? "" : "s"} remaining`
      : tasks.length ? "Everything is complete" : "Start with one clear intention.";
}

function renderTasks() {
  activeDrag = null;
  list.replaceChildren();
  emptyMessage.hidden = tasks.length > 0;
  renderProgress();
  const visible = visibleTasks();
  const hiddenCount = tasks.length - visible.length;
  toggleTasks.hidden = tasks.length === 0 || (!showAllTasks && tasks.length <= visible.length);
  toggleTasks.textContent = showAllTasks ? "Show top 3" : `Show ${hiddenCount} more task${hiddenCount === 1 ? "" : "s"}`;

  visible.forEach(task => {
    const item = document.createElement("li");
    item.dataset.taskId = task.id;
    item.className = `task-item priority-${task.priority}`;
    if (task.completed) item.classList.add("is-completed");
    if (animation?.id === task.id) item.classList.add(`task-${animation.type}`);
    const row = document.createElement("div");
    row.className = "task-row";
    const handle = createButton("⠿", `Reorder ${task.text}`, () => {});
    handle.className = "drag-handle";
    handle.title = "Drag to reorder, or use the up and down arrow keys";
    handle.setAttribute("aria-describedby", "reorder-help");
    handle.addEventListener("pointerdown", event => startDrag(event, task, item, handle));
    handle.addEventListener("keydown", event => {
      if (!activeDrag && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        moveTask(task.id, event.key === "ArrowUp" ? -1 : 1);
      }
    });
    const content = document.createElement("div");
    content.className = "task-content";
    const label = document.createElement("label");
    label.className = task.completed ? "task-label completed" : "task-label";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      saveTasks(tasks.map(current => current.id === task.id ? {
        ...current,
        completed: checkbox.checked,
        completedAt: checkbox.checked ? new Date().toISOString() : null
      } : current), { id: task.id, type: checkbox.checked ? "completed" : "updated" });
    });
    const text = document.createElement("span");
    text.textContent = task.text;
    label.append(checkbox, text);
    const meta = document.createElement("div");
    meta.className = "task-meta";
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-badge ${task.priority}`;
    priorityBadge.textContent = `${task.priority[0].toUpperCase()}${task.priority.slice(1)}`;
    meta.append(priorityBadge);
    if (task.dueDate) {
      const due = document.createElement("span");
      due.className = task.dueDate < localDateKey() && !task.completed ? "due-date overdue" : "due-date";
      due.textContent = `${task.dueDate < localDateKey() && !task.completed ? "Overdue" : "Due"} ${formatDueDate(task.dueDate)}`;
      meta.append(due);
    }
    content.append(label, meta);
    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.append(
      createButton("Edit", `Edit ${task.text}`, () => editTask(task, row)),
      createButton("Delete", `Delete ${task.text}`, () => {
        saveTasks(tasks.filter(current => current.id !== task.id));
      })
    );
    row.append(handle, content, actions);
    item.append(row);
    list.append(item);
  });
  animation = null;
}

toggleTasks.addEventListener("click", () => {
  showAllTasks = !showAllTasks;
  renderTasks();
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    message.textContent = "Please enter a task.";
    input.focus();
    return;
  }
  const task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    completedAt: null
  };
  if (saveTasks([...tasks, task], { id: task.id, type: "added" })) {
    form.reset();
    priorityInput.value = "medium";
    input.focus();
  }
});

window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEY || event.key === null) loadTasks();
  if (event.key === FOCUS_KEY || event.key === null) loadDailyFocus();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) loadDailyFocus();
});

loadDailyFocus();
loadTasks();
