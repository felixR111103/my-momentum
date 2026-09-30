// Named time zones let the browser handle daylight saving automatically.
// Add another entry here and a matching <time> element to add more clocks.
const clocks = [
  { id: "portugal-time", timeZone: "Europe/Lisbon" },
  { id: "germany-time", timeZone: "Europe/Berlin" }
].map(clock => ({
  element: document.getElementById(clock.id),
  formatter: new Intl.DateTimeFormat("en-GB", {
    timeZone: clock.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  })
}));

// The greeting follows Lisbon time, regardless of the computer's time zone.
const greetingHour = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Lisbon", hour: "2-digit", hourCycle: "h23"
});

function updateClocks() {
  const now = new Date();
  const hour = Number(greetingHour.format(now));
  const greeting = hour >= 5 && hour < 12 ? "Good Morning"
    : hour >= 12 && hour < 18 ? "Good Afternoon" : "Good Night";
  document.getElementById("greeting-text").textContent = `${greeting} Felix`;
  clocks.forEach(clock => {
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
