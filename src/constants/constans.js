export const THEME_KEY = "app_theme";

export const CATEGORIES = [
  { id: "birthday", name: "Birthday", icon: "🎂", color: "#FBBF24" },
  { id: "exam", name: "Exam", icon: "📚", color: "#EF4444" },
  { id: "festival", name: "Festival", icon: "🎉", color: "#10B981" },
  { id: "meeting", name: "Meeting", icon: "💼", color: "#3B82F6" },
  { id: "travel", name: "Travel", icon: "✈️", color: "#8B5CF6" },
  { id: "other", name: "Other", icon: "📅", color: "#6B7280" },
];

export const NOTIFICATION_TIMES = [
  { value: "none", label: "No Notification" },
  { value: "at_event", label: "At time of event" },
  { value: "5_min_before", label: "5 minutes before" },
  { value: "15_min_before", label: "15 minutes before" },
  { value: "30_min_before", label: "30 minutes before" },
  { value: "1_hour_before", label: "1 hour before" },
  { value: "1_day_before", label: "1 day before" },
];
