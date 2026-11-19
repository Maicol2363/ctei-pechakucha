// Keeps the slide buzzer page available without a connection once it has loaded once.
const name = 'slide-buzzer-v1'
self.addEventListener('install', event => {
  event.waitUntil(caches.open(name).then(cache => cache.add('timer.html')).then(() => self.skipWaiting()))
})
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (!url.pathname.endsWith('/timer.html')) return
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone()
    caches.open(name).then(cache => cache.put(event.request, copy))
    return response
  }).catch(() => caches.match('timer.html')))
})
