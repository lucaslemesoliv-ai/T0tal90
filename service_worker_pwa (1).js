const CACHE_NAME = 't0tal90-cache-v6';
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

### O que fazer para passar no PWABuilder sem erros:
1. Salve esses três arquivos (`index.html`, `manifest.json` e `sw.js`) na **raiz** do seu repositório no GitHub.
2. Certifique-se de que os arquivos de imagem dos ícones (`launchericon-192x192.png` e `launchericon-512x512.png`) também estão na **raiz** (como você já enviou nas imagens anteriores, basta garantir que eles estejam no mesmo commit).
3. Faça o commit e dê `git push`. Aguarde 2 minutos para o GitHub Pages atualizar e teste novamente no PWABuilder!