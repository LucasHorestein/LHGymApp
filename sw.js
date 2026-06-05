const CACHE = 'gym-v25';
const ASSETS = ['/', '/index.html', '/icon.png', '/pelota.png'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
    );
});

// Water reminder notifications from main page
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'WATER_NOTIF') {
        self.registration.showNotification('💧 ¡Tomá agua dale!', {
            body: 'Hidratate. Tu cuerpo te lo agradece 💪',
            icon: '/icon.png',
            badge: '/icon.png',
            silent: !e.data.sound,
            vibrate: e.data.sound ? [200, 100, 200] : [],
            tag: 'water-reminder',
            renotify: true
        });
    }
});
