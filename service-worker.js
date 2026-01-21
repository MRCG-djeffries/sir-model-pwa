const CACHE = "sir-app-shell-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./app.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  // Core Shinylive bootstrap files
  "./shinylive/shinylive.js",
  "./shinylive/shinylive.css",
  "./shinylive/style-resets.css",
  "./shinylive/load-shinylive-sw.js",
  // WebR core files (critical for R execution)
  "./shinylive/webr/webr.mjs",
  "./shinylive/webr/R.bin.js",
  "./shinylive/webr/libRlapack.so",
  // Workers
  "./shinylive/lzstring-worker.js",
  // Note: Other files will be runtime-cached on first load
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
