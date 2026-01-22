const SHELL_CACHE = "sir-shell-v1";
const STATIC_CACHE = "sir-static-v1";

// App shell: must always be available offline
const SHELL_ASSETS = [
  "/sir-model-pwa/",
  "/sir-model-pwa/index.html",
  "/sir-model-pwa/app.json",
  "/sir-model-pwa/manifest.json",
  "/sir-model-pwa/icon-192.png",
  "/sir-model-pwa/icon-512.png",
];

// Treat these as “big + stable”: cache-first for speed/offline
const STATIC_PREFIXES = [
  "/sir-model-pwa/shinylive/",
  // if your WebR assets live under shinylive/webr, this covers them too
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function isStaticAsset(url) {
  return STATIC_PREFIXES.some((p) => url.pathname.startsWith(p));
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle your GitHub Pages scope
  if (!url.pathname.startsWith("/sir-model-pwa/")) return;

  // Navigation: offline-first app shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/sir-model-pwa/index.html").then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // Static runtime assets: cache-first (fast repeat loads)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          const copy = resp.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(event.request, copy));
          return resp;
        });
      })
    );
    return;
  }

  // Everything else: network-first with offline fallback
  event.respondWith(
    fetch(event.request)
      .then((resp) => resp)
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
