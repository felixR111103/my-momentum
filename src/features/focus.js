(() => {
  const STORAGE_KEY = "my-momentum-daily-focus";
  const form = document.querySelector("#focus-form");
  const input = document.querySelector("#focus-input");
  const status = document.querySelector("#focus-status");
  const focusText = document.querySelector("#focus-text");
  const clearButton = document.querySelector("#clear-focus");

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function showFocus(text) {
    status.textContent = "";
    input.value = text;
    focusText.textContent = text || "Not set yet";
  }

  function loadFocus() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const text = saved?.date === localDateKey() && typeof saved.text === "string"
        ? saved.text : "";
      showFocus(text);
    } catch {
      showFocus("");
      status.textContent = "Your daily focus could not be loaded.";
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: localDateKey(), text }));
      showFocus(text);
      status.textContent = text ? "Today's focus is set." : "Today's focus was cleared.";
    } catch {
      status.textContent = "Your daily focus could not be saved.";
    }
  });

  clearButton.addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      showFocus("");
      status.textContent = "Today's focus was cleared.";
      input.focus();
    } catch {
      status.textContent = "Your daily focus could not be cleared.";
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === null) loadFocus();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadFocus();
  });

  loadFocus();
})();
