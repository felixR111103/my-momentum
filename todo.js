// Each task has an id, text, and completed status.
// Its position in this array is its rank.
const STORAGE_KEY = "my-momentum-tasks";
let tasks = [];
let activeDrag = null;

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const message = document.querySelector("#message");

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedTasks) || !savedTasks.every(task =>
      task && typeof task.id === "string" && typeof task.text === "string"
      && typeof task.completed === "boolean")) {
      throw new Error("Invalid saved tasks");
    }
    tasks = savedTasks;
    form.querySelector("button").disabled = false;
  } catch (error) {
    message.textContent = "Your tasks could not be loaded. Please reload the page.";
    form.querySelector("button").disabled = true;
  }
  renderTasks();
}

// Save before updating the screen so a failed save does not look successful.
function saveTasks(updatedTasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    tasks = updatedTasks;
    message.textContent = "";
    renderTasks();
    return true;
  } catch (error) {
    message.textContent = "Could not save your change. Please try again.";
    renderTasks();
    return false;
  }
}

function focusHandle(id) {
  const item = [...list.children].find(item => item.dataset.taskId === id);
  item?.querySelector(".drag-handle")?.focus();
}

function moveTask(id, direction) {
  const index = tasks.findIndex(task => task.id === id);
  const newIndex = index + direction;
  if (index < 0 || newIndex < 0 || newIndex >= tasks.length) return;
  const reorderedTasks = [...tasks];
  [reorderedTasks[index], reorderedTasks[newIndex]] =
    [reorderedTasks[newIndex], reorderedTasks[index]];
  if (saveTasks(reorderedTasks)) {
    message.textContent = `Moved task to position ${newIndex + 1} of ${tasks.length}.`;
  }
  focusHandle(id);
}

// Preview the order in the DOM; persist only when the handle is released.
function startDrag(event, task, item, handle) {
  if (event.button !== 0 || tasks.length < 2 || activeDrag) return;
  event.preventDefault();
  handle.focus();
  handle.setPointerCapture(event.pointerId);
  activeDrag = { id: task.id, item, handle, pointerId: event.pointerId };
  item.classList.add("dragging");
}

function finishDrag(cancelled = false) {
  if (!activeDrag) return;
  const { id, handle, pointerId } = activeDrag;
  const ids = [...list.children].map(item => item.dataset.taskId);
  activeDrag = null;
  if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
  if (!cancelled && ids.some((id, index) => id !== tasks[index].id)) {
    const byId = new Map(tasks.map(task => [task.id, task]));
    if (saveTasks(ids.map(id => byId.get(id)))) {
      message.textContent = `Moved task to position ${ids.indexOf(id) + 1} of ${tasks.length}.`;
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
    // Moving the row can release capture; retain it for the rest of the drag.
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

// Temporarily replace a task row with a small editing form.
function editTask(task, row) {
  const editor = document.createElement("form");
  editor.className = "input-row";
  editor.style.flexWrap = "wrap";
  editor.style.width = "100%";

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = task.text;
  editInput.maxLength = 200;
  editInput.required = true;
  editInput.setAttribute("aria-label", "Edit task");

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save";

  function cancelEdit() {
    renderTasks();
  }

  editor.addEventListener("submit", event => {
    event.preventDefault();
    const text = editInput.value.trim();
    if (!text) {
      editInput.setCustomValidity("Please enter a task.");
      editInput.reportValidity();
      return;
    }
    // Keep the task's ranking and completed status when changing its text.
    saveTasks(tasks.map(current => current.id === task.id
      ? { ...current, text }
      : current));
  });
  editInput.addEventListener("input", () => editInput.setCustomValidity(""));
  editInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  });

  editor.append(editInput, saveButton,
    createButton("Cancel", "Cancel editing", cancelEdit));
  row.replaceChildren(editor);
  editInput.focus();
  editInput.select();
}

function renderTasks() {
  // A refresh (including changes from another tab) cancels any pending drag.
  activeDrag = null;
  list.replaceChildren();
  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.dataset.taskId = task.id;
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

    const label = document.createElement("label");
    label.className = task.completed ? "task-label completed" : "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      saveTasks(tasks.map(current => current.id === task.id
        ? { ...current, completed: checkbox.checked }
        : current));
    });

    const text = document.createElement("span");
    // textContent displays user text safely without treating it as HTML.
    text.textContent = task.text;
    label.append(checkbox, text);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.append(
      createButton("Edit", `Edit ${task.text}`, () => editTask(task, row)),
      createButton("Delete", `Delete ${task.text}`, () => {
        saveTasks(tasks.filter(current => current.id !== task.id));
      })
    );

    row.append(handle, label, actions);
    item.append(row);
    list.append(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    message.textContent = "Please enter a task.";
    input.focus();
    return;
  }

  const task = { id: crypto.randomUUID(), text, completed: false };
  if (saveTasks([...tasks, task])) {
    form.reset();
    input.focus();
  }
});

// Keep the list up to date when another open dashboard tab changes it.
window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEY || event.key === null) loadTasks();
});

loadTasks();
