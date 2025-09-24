import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim, skipWaiting } from "workbox-core";
import { openDB } from "idb";

skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

const DB_NAME = "countdown-db";
const STORE_NAME = "events";
const DB_VERSION = 1;
async function ensureDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

self.addEventListener("install", (evt) => {
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    (async () => {
      await ensureDB();
      clientsClaim();
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => list[0]?.focus() ?? self.clients.openWindow("/"))
  );
});
