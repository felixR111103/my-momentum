(() => {
  const STORAGE_KEY = "my-momentum-settings";
  const defaults = {
    name: "Felix",
    timezone: "Europe/Lisbon",
    greetingStyle: "friendly",
    clockOne: "Europe/Lisbon",
    clockTwo: "Europe/Berlin",
    overlay: 35
  };
  const timezoneOptions = [
    ["Europe/Lisbon", "Portugal — Lisbon"],
    ["Europe/Berlin", "Germany — Berlin"],
    ["Europe/London", "United Kingdom — London"],
    ["Europe/Paris", "France — Paris"],
    ["Europe/Madrid", "Spain — Madrid"],
    ["America/New_York", "United States — New York"],
    ["America/Chicago", "United States — Chicago"],
    ["America/Los_Angeles", "United States — Los Angeles"],
    ["America/Sao_Paulo", "Brazil — São Paulo"],
    ["Asia/Dubai", "United Arab Emirates — Dubai"],
    ["Asia/Kolkata", "India — New Delhi"],
    ["Asia/Singapore", "Singapore"],
    ["Asia/Tokyo", "Japan — Tokyo"],
    ["Australia/Sydney", "Australia — Sydney"],
    ["UTC", "UTC"],
    ["local", "Device timezone"]
  ];
  const allowedTimezones = new Set(timezoneOptions.map(([value]) => value));
  const allowedStyles = new Set(["friendly", "motivational", "simple"]);
  const form = document.getElementById("settings-form");
  const nameInput = document.getElementById("setting-name");
  const timezoneInput = document.getElementById("setting-timezone");
  const styleInput = document.getElementById("setting-greeting-style");
  const clockOneInput = document.getElementById("setting-clock-one");
  const clockTwoInput = document.getElementById("setting-clock-two");
  const overlayInput = document.getElementById("setting-overlay");
  const overlayValue = document.getElementById("overlay-value");
  const status = document.getElementById("settings-status");
  let settings = { ...defaults };

  function fillTimezoneSelect(select) {
    timezoneOptions.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    });
  }

  fillTimezoneSelect(timezoneInput);
  fillTimezoneSelect(clockOneInput);
  fillTimezoneSelect(clockTwoInput);

  function sanitize(candidate) {
    const name = typeof candidate?.name === "string" ? candidate.name.trim().slice(0, 40) : "";
    const overlay = Number(candidate?.overlay);
    return {
      name: name || defaults.name,
      timezone: allowedTimezones.has(candidate?.timezone) ? candidate.timezone : defaults.timezone,
      greetingStyle: allowedStyles.has(candidate?.greetingStyle)
        ? candidate.greetingStyle : defaults.greetingStyle,
      clockOne: allowedTimezones.has(candidate?.clockOne) ? candidate.clockOne : defaults.clockOne,
      clockTwo: allowedTimezones.has(candidate?.clockTwo) ? candidate.clockTwo : defaults.clockTwo,
      overlay: Number.isFinite(overlay) ? Math.min(70, Math.max(0, overlay)) : defaults.overlay
    };
  }

  function apply(nextSettings, announce = false) {
    settings = sanitize(nextSettings);
    nameInput.value = settings.name;
    timezoneInput.value = settings.timezone;
    styleInput.value = settings.greetingStyle;
    clockOneInput.value = settings.clockOne;
    clockTwoInput.value = settings.clockTwo;
    overlayInput.value = settings.overlay;
    overlayValue.value = `${settings.overlay}%`;
    document.documentElement.style.setProperty("--overlay-opacity", settings.overlay / 100);
    window.dispatchEvent(new CustomEvent("momentum-settings-changed", { detail: settings }));
    if (announce) status.textContent = "Your dashboard settings were saved.";
  }

  function load() {
    try {
      apply(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch {
      apply(defaults);
      status.textContent = "Your saved settings could not be loaded. Defaults are being used.";
    }
  }

  window.getMomentumSettings = () => ({ ...settings });

  overlayInput.addEventListener("input", () => {
    overlayValue.value = `${overlayInput.value}%`;
    document.documentElement.style.setProperty("--overlay-opacity", Number(overlayInput.value) / 100);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const nextSettings = sanitize({
      name: nameInput.value,
      timezone: timezoneInput.value,
      greetingStyle: styleInput.value,
      clockOne: clockOneInput.value,
      clockTwo: clockTwoInput.value,
      overlay: overlayInput.value
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
      apply(nextSettings, true);
    } catch {
      status.textContent = "Your settings could not be saved. Please try again.";
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === null) load();
  });

  load();
})();
