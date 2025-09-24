import { useEffect, useRef } from "react";
import { getEventsFromDB, updateEventInDB } from "../utils/db";
import { calcNotifyAt } from "../utils/notify";
import { showLocalNotification } from "../utils/localNotify";
import { CATEGORIES } from "../constants/constans";

const MAX_STEP = 30_000;
const GRACE_BEFORE = 1_000;
const GRACE_AFTER = 120_000;

export function useLocalScheduler(enabled = true) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const load = async () => {
      const events = await getEventsFromDB();
      const now = Date.now();

      const schedule = events
        .filter((e) => e.notifications)
        .map((e) => {
          const at = calcNotifyAt(e);
          return at == null ? null : { e, at };
        })
        .filter(Boolean)
        .filter(({ e, at }) => now <= new Date(e.date).getTime() + GRACE_AFTER)
        .sort((a, b) => a.at - b.at);

      for (const { e, at } of schedule) {
        const key = e.notificationTime || "at_event";
        const already =
          Array.isArray(e.sentNotifications) &&
          e.sentNotifications.includes(key);
        if (!already && now + GRACE_AFTER >= at && now + GRACE_BEFORE >= at) {
          const icon =
            CATEGORIES.find((c) => c.id === e.category)?.icon ?? "⏰";
          await showLocalNotification("Event Reminder", {
            body: `${icon} ${e.name} – ${new Date(e.date).toLocaleString()}`,
            tag: `event-${e.id}-${key}`,
            renotify: false,
          });
          await updateEventInDB({
            ...e,
            sentNotifications: [...(e.sentNotifications ?? []), key],
          });
        }
      }

      const now2 = Date.now();
      const next = schedule.find(({ e, at }) => {
        const key = e.notificationTime || "at_event";
        const already =
          Array.isArray(e.sentNotifications) &&
          e.sentNotifications.includes(key);
        return !already && at > now2 - GRACE_BEFORE;
      });

      if (!next) return;

      const delay = Math.max(0, Math.min(MAX_STEP, next.at - now2));
      timerRef.current = window.setTimeout(tick, delay);
    };

    const tick = async () => {
      clearTimer();
      await load();
    };

    tick();

    const onVis = () => document.visibilityState === "visible" && tick();
    const onFocus = () => tick();
    const onOnline = () => tick();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, [enabled]);
}
