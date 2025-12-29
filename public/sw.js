// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "WAKTUNYA TIBA! 🎉";
  const options = {
    body: data.body || "Gerbang 2026 telah terbuka. Lihat pesanmu sekarang!",
    icon: "/logo192.png", // pastikan ikon ada di folder public
    badge: "/logo192.png",
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});