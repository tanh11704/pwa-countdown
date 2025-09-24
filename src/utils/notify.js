export const REMINDER_MS = {
  "5_min_before": 5 * 60 * 1000,
  "15_min_before": 15 * 60 * 1000,
  "30_min_before": 30 * 60 * 1000,
  "1_hour_before": 60 * 60 * 1000,
  "1_day_before": 24 * 60 * 60 * 1000,
};

export function calcNotifyAt(event) {
  const t = (event.notificationTime ?? "").trim();
  if (t === "none") return null; // không nhắc
  const eventMs = new Date(event.date).getTime();
  if (t === "at_event" || !t) return eventMs;
  const offset = REMINDER_MS[t];
  return typeof offset === "number" ? eventMs - offset : eventMs;
}
