const SHELL_CACHE = "sir-shell-v2";
const STATIC_CACHE = "sir-static-v2";

const SHELL_ASSETS = [
  "/sir-model-pwa/",
  "/sir-model-pwa/index.html",
  "/sir-model-pwa/app.json",
  "/sir-model-pwa/manifest.json",
  "/sir-model-pwa/icon-192.png",
  "/sir-model-pwa/icon-512.png",
];

const STATIC_PREFIXES = [
  "/sir-model-pwa/shinylive/",
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

  // ✅ only same-origin
  if (url.origin !== self.location.origin) return;

  // ✅ only within your GH Pages scope
  if (!url.pathname.startsWith("/sir-model-pwa/")) return;

  // ✅ Navigations: network-first, offline fallback to cached shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/sir-model-pwa/index.html"))
    );
    return;
  }

  // ✅ Cache-first for shinylive assets, but never cache failures
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(event.request, copy));
          }
          return resp;
        });
      })
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
