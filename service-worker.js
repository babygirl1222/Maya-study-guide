
const CACHE = 'maya-hub-purple-v1';
const ASSETS = [
  './','./index.html','./style.css','./app.js','./manifest.webmanifest',
  './icon-192.png','./icon-512.png',
  './assets/Dispatcher_Deck1_Basics_and_Call_Flow.pdf',
  './assets/Dispatcher_Deck2_Radio_Procedures.pdf',
  './assets/Dispatcher_Deck3_Geography_and_Jurisdiction.pdf',
  './assets/Dispatcher_Deck4_Legal_and_Documentation.pdf',
  './assets/Dispatcher_Deck5_Practice_Scenarios.pdf',
  './assets/Dispatcher_Deck6_Exam_Review.pdf',
];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy)); return resp;
    }).catch(()=>r))
  );
});
