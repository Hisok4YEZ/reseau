/* Service worker : permet d'utiliser le site hors-ligne une fois visité.
   - pages, JS, CSS, données : réseau d'abord (toujours la dernière version), cache si pas de réseau
   - images des diapos et PDF : cache d'abord (rapide), mis à jour en arrière-plan */
var CACHE = "mif05-v1";
var CORE = ["./", "index.html", "assets/style.css", "assets/app.js", "data/cms.js",
  "data/ch1-introduction.js", "data/ch2-application.js", "data/ch3-transport.js", "data/ch4-reseau.js",
  "manifest.webmanifest", "icons/icon-192.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE).catch(function () {}); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  var heavy = /\/(slides|pdf)\//.test(req.url);
  if (heavy) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res.ok && res.status === 200) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
  } else {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match("index.html"); }); }));
  }
});
