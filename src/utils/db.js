import { openDB } from "idb";

const DB_NAME = "countdown-db";
const STORE_NAME = "events";
const DB_VERSION = 1;

async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        keyPath: "id",
      });
    },
  });
  return db;
}

export async function getEventsFromDB() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function saveEventsToDB(events) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  for (const event of events) {
    await tx.objectStore(STORE_NAME).put(event);
  }
  await tx.done;
}

export async function updateEventInDB(event) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).put(event);
  await tx.done;
}
