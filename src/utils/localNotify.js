export async function showLocalNotification(title, options) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.showNotification) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (e) {
    try {
      new Notification(title, options);
    } catch {}
  }
}
