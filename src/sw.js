import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim, skipWaiting } from "workbox-core";
import { openDB } from "idb";

skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const CHECK_INTERVAL = 60 * 1000;
let intervalId = null;
const DB_NAME = "countdown-db";
const STORE_NAME = "events";

const reminderTimes = {
  "5_min_before": 5 * 60 * 1000,
  "15_min_before": 15 * 60 * 1000,
  "30_min_before": 30 * 60 * 1000,
  "1_hour_before": 60 * 60 * 1000,
  "1_day_before": 24 * 60 * 60 * 1000,
};

async function getEventsFromDB() {
  try {
    const db = await openDB(DB_NAME, 1);
    return (await db.getAll(STORE_NAME)) || [];
  } catch (error) {
    console.error("SW: Lỗi khi đọc IndexedDB:", error);
    return [];
  }
}

async function checkEventsAndNotify() {
  console.log("SW: Đang kiểm tra sự kiện...");
  const events = await getEventsFromDB();
  const now = new Date();

  for (const event of events) {
    if (!event.notifications) continue;

    const eventDate = new Date(event.date);
    const timeDiff = eventDate.getTime() - now.getTime();

    if (timeDiff <= 0) continue;

    const atEventTag = `${event.id}-at_event`;
    if (timeDiff <= CHECK_INTERVAL) {
      const existingNotifs = await self.registration.getNotifications({
        tag: atEventTag,
      });
      if (existingNotifs.length === 0) {
        self.registration.showNotification(`"${event.name}" đang diễn ra!`, {
          body: `Sự kiện bạn đang chờ đợi đã bắt đầu.`,
          icon: "/vite.svg",
          tag: atEventTag,
        });
        console.log(
          `SW: Đã gửi thông báo "tại thời điểm" cho sự kiện ${event.name}`
        );
      }
    }

    const reminderType = event.notificationTime;
    if (reminderType && reminderType !== "none") {
      const reminderMillis = reminderTimes[reminderType];
      const reminderTag = `${event.id}-${reminderType}`;

      if (reminderMillis && timeDiff <= reminderMillis) {
        const existingNotifs = await self.registration.getNotifications({
          tag: reminderTag,
        });
        if (existingNotifs.length === 0) {
          self.registration.showNotification(`Nhắc nhở: "${event.name}"`, {
            body: `Sự kiện sẽ diễn ra trong vòng ${reminderType
              .replace("_", " ")
              .replace("before", " tới")}.`,
            icon: "/vite.svg",
            tag: reminderTag,
          });
          console.log(
            `SW: Đã gửi thông báo nhắc trước cho sự kiện ${event.name}`
          );
        }
      }
    }
  }
}

function startTicker() {
  if (intervalId) return;
  intervalId = setInterval(checkEventsAndNotify, CHECK_INTERVAL);
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      clientsClaim();
      await checkEventsAndNotify();
      startTicker();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "kick-check") {
    checkEventsAndNotify();
    startTicker();
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(
        (clientList) => clientList[0]?.focus() ?? self.clients.openWindow("/")
      )
  );
});
