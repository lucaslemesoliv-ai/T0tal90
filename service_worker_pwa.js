const CACHE_NAME = 't0tal90-cache-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './launchericon-192x192.png',
  './launchericon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```
eof

### O que fazer agora:
1. Certifique-se de que o arquivo principal se chama **`index.html`** (e não `dashboard_financeiro_estilo_90_pro.html`).
2. Garanta que `manifest.json`, `pwabuilder-sw.js`, as imagens dos ícones (`launchericon-192x192.png`, `launchericon-512x512.png`, etc.) e o `index.html` estão todos na **raiz** do repositório.
3. Faça o commit e envie para o GitHub. Aguarde 2 minutos e teste o link do seu GitHub Pages no PWABuilder!