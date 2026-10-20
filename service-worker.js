const CACHE_NAME = 'trenazer-holka-v1';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE_NAME).map(x => caches.delete(x)))).then(() => self.clients.claim())));
// Stale-while-revalidate: otevře se hned z cache, na pozadí se stáhne novější verze.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => hit || cache.match('./index.html'));
    return hit || net;
  })));
});
