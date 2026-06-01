const CACHE_NAME = "kulungi-prototype-v56";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./lounge-data.js",
  "./college-major.csv",
  "./seat-simulation.json",
  "./gamasot_nurungji.mp3",
  "./seating-plans/10001-C.png",
  "./seating-plans/10001-T.png",
  "./seating-plans/10001-E.png",
  "./blueprint/10001-C.csv",
  "./blueprint/10001-T.csv",
  "./blueprint/10001-E.csv",
  "./blueprint/10001-O.csv",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./objects/C1_03.png",
  "./objects/C1_03-00.png",
  "./objects/C1_03-01.png",
  "./objects/C1_03-02.png",
  "./objects/C1_06.png",
  "./objects/C1_06-00.png",
  "./objects/C1_06-01.png",
  "./objects/C1_06-02.png",
  "./objects/C1_09.png",
  "./objects/C1_09-00.png",
  "./objects/C1_09-01.png",
  "./objects/C1_09-02.png",
  "./objects/C1_12.png",
  "./objects/C1_12-00.png",
  "./objects/C1_12-01.png",
  "./objects/C1_12-02.png",
  "./objects/C2_03.png",
  "./objects/C2_03-00.png",
  "./objects/C2_03-01.png",
  "./objects/C2_03-02.png",
  "./objects/C2_06.png",
  "./objects/C2_06-00.png",
  "./objects/C2_06-01.png",
  "./objects/C2_06-02.png",
  "./objects/C2_09.png",
  "./objects/C2_09-00.png",
  "./objects/C2_09-01.png",
  "./objects/C2_09-02.png",
  "./objects/C2_12.png",
  "./objects/C2_12-00.png",
  "./objects/C2_12-01.png",
  "./objects/C2_12-02.png",
  "./objects/T1x1.png",
  "./objects/T1x1-00.png",
  "./objects/T1x1-02.png",
  "./objects/TH.png",
  "./objects/TH-00.png",
  "./objects/TH-01.png",
  "./objects/TH-02.png",
  "./objects/T2x1h.png",
  "./objects/T2x1h-00.png",
  "./objects/T2x1h-02.png",
  "./objects/T2x1v.png",
  "./objects/T2x1v-00.png",
  "./objects/T2x1v-02.png",
  "./objects/T2x2.png",
  "./objects/T2x2-00.png",
  "./objects/T2x2-02.png",
  "./objects/E1.png",
  "./objects/E1-00.png",
  "./objects/E1-01.png",
  "./objects/E1-02.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
