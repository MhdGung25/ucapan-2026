/* eslint-disable no-restricted-globals */

// 1. Force update Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Menggunakan self.clients agar editor mengenali scope Service Worker
  event.waitUntil(self.clients.claim());
});

// 2. Handler untuk klik notifikasi (Membuka aplikasi saat diklik)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// 3. Handler untuk Push Notification (Opsional jika pakai server)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "WAKTUNYA TIBA! 🎉";
  const options = {
    body: data.body || "Gerbang 2026 telah terbuka. Lihat pesanmu sekarang!",
    icon: "/logo192.png", 
    badge: "/logo192.png",
    vibrate: [500, 110, 500],
    requireInteraction: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});