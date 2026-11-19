const CACHE = "4h-effingham-v1";
const PAGE = "/4H-codes/Effingham.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add(PAGE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode !== "navigate") return;
  if (new URL(req.url).pathname !== PAGE) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(PAGE, copy));
        return res;
      })
      .catch(() => caches.match(PAGE))
  );
});
