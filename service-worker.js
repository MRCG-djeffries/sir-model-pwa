const CACHE = "sir-app-shell-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./app.json",
  "./manifest.json"
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
  if (event.request.method !== "GET") return;

  // Offline navigation → serve the app shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((res) => res || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        // Runtime cache new GETs
        const respClone = resp.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, respClone));
        return resp;
      });
    })
  );
});
