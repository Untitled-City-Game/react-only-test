// export function registerServiceWorker() {
// 	if ('serviceWorker' in navigator) {
// 		navigator.serviceWorker.register( new URL('/service-worker.js', import.meta.url))
// 			.then(registration => {
// 				console.log('Service Worker registered with scope:', registration.scope);
// 			})
// 			.catch(error => {
// 				console.error('Service Worker registration failed:', error);
// 			});
// 	}
// }

export async function requestNotificationPerms() {
	if (!("Notification" in window)) {
		throw new Error("Notification not supported");
	}
	const permission = await window.Notification.requestPermission();
	if (permission !== "granted") {
		throw new Error("Permission not granted for Notification");
	}
}

export async function showNotification (title : string, options ? : NotificationOptions) {
  if (!("Notification" in window)) {
    throw new Error("Notification not supported");
  }
  if (window.Notification.permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  return new window.Notification(title, options)
};