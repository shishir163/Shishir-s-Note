/* Notes app service worker — offline app shell */
const CACHE = 'notes-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './auth.js',
  './auth.bundle.js',
  './firebase-config.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // only cache reads
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // let Google/Firebase calls hit the network directly
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/admin.bundle.js')) return; // admin is online-only

  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html'))   // offline navigation fallback
    )
  );
});
