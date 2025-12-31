// 1. Force update Service Worker
self.addEventListener('install', () => {
  // Menghapus error 'event is defined but never used' dengan tidak menulis (event)
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Menggunakan self.clients agar Linter tahu 'clients' berasal dari scope SW
  event.waitUntil(self.clients.claim());
});

// 2. Handler untuk klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Cek apakah tab sudah terbuka
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika belum ada tab yang buka, buka baru
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// 3. Handler untuk Push Notification
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      data = { title: "Pesan Baru", body: event.data.text() };
    }
  }

  const title = data.title || "WAKTUNYA TIBA! 🎉";
  const options = {
    body: data.body || "Gerbang 2026 telah terbuka. Lihat pesanmu sekarang!",
    icon: "/logo192.png", 
    badge: "/logo192.png",
    vibrate: [500, 110, 500],
    requireInteraction: true,
    data: { url: "/" }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});