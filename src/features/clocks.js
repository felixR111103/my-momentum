// Named time zones let the browser handle daylight saving automatically.
const timezoneLabels = {
  "Europe/Lisbon": ["Portugal", "Lisbon"],
  "Europe/Berlin": ["Germany", "Berlin"],
  "Europe/London": ["United Kingdom", "London"],
  "Europe/Paris": ["France", "Paris"],
  "Europe/Madrid": ["Spain", "Madrid"],
  "America/New_York": ["United States", "New York"],
  "America/Chicago": ["United States", "Chicago"],
  "America/Los_Angeles": ["United States", "Los Angeles"],
  "America/Sao_Paulo": ["Brazil", "São Paulo"],
  "Asia/Dubai": ["United Arab Emirates", "Dubai"],
  "Asia/Kolkata": ["India", "New Delhi"],
  "Asia/Singapore": ["Singapore", "Singapore"],
  "Asia/Tokyo": ["Japan", "Tokyo"],
  "Australia/Sydney": ["Australia", "Sydney"],
  UTC: ["UTC", "Universal time"],
  local: ["Device", "Local timezone"]
};
const clocks = [
  { setting: "clockOne", titleId: "clock-one-title", cityId: "clock-one-city", timeId: "clock-one-time" },
  { setting: "clockTwo", titleId: "clock-two-title", cityId: "clock-two-city", timeId: "clock-two-time" }
].map(clock => ({
  ...clock,
  title: document.getElementById(clock.titleId),
  city: document.getElementById(clock.cityId),
  element: document.getElementById(clock.timeId),
  timezone: null,
  formatter: null
}));

function configureClock(clock, timezone) {
  if (clock.timezone === timezone) return;
  const options = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" };
  if (timezone !== "local") options.timeZone = timezone;
  clock.timezone = timezone;
  clock.formatter = new Intl.DateTimeFormat("en-GB", options);
  const [title, city] = timezoneLabels[timezone] || ["Custom", timezone];
  clock.title.textContent = title;
  clock.city.textContent = city;
}

function getGreetingHour(now, timezone) {
  const options = { hour: "2-digit", hourCycle: "h23" };
  if (timezone !== "local") options.timeZone = timezone;
  return Number(new Intl.DateTimeFormat("en-GB", options).format(now));
}

function makeGreeting(hour, name, style) {
  const timeOfDay = hour >= 5 && hour < 12 ? "morning"
    : hour >= 12 && hour < 18 ? "afternoon" : "evening";
  if (style === "simple") return `${name} · ${timeOfDay}`;
  if (style === "motivational") {
    const encouragement = timeOfDay === "morning" ? "Let's make today count"
      : timeOfDay === "afternoon" ? "Keep the momentum going" : "Finish the day strong";
    return `${encouragement}, ${name}`;
  }
  return `Good ${timeOfDay}, ${name}`;
}

function updateClocks() {
  const now = new Date();
  const settings = window.getMomentumSettings?.() || {
    name: "Felix", timezone: "Europe/Lisbon", greetingStyle: "friendly",
    clockOne: "Europe/Lisbon", clockTwo: "Europe/Berlin"
  };
  const hour = getGreetingHour(now, settings.timezone);
  document.getElementById("greeting-text").textContent =
    makeGreeting(hour, settings.name, settings.greetingStyle);
  clocks.forEach(clock => {
    configureClock(clock, settings[clock.setting]);
    clock.element.textContent = clock.formatter.format(now);
    clock.element.dateTime = now.toISOString();
  });
}

updateClocks();
setInterval(updateClocks, 1000);

// Refresh immediately when returning to a tab that Chrome had put to sleep.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateClocks();
});

window.addEventListener("momentum-settings-changed", updateClocks);
