const CACHE = "sir-app-shell-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./app.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./shinylive/shinylive.js",
  "./shinylive/shinylive.css",
  "./shinylive/style-resets.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Handle navigation (refresh / direct URL) offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((res) => res || caches.match("./"))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
