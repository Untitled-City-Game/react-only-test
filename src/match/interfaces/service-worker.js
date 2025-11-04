// service-worker.js
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
  };
  event.waitUntil(
    self.registration.showNotification('Connect Four', options)
  );
});

self.addEventListener("install", (event) => {
	console.warn("installed service worker")
})
