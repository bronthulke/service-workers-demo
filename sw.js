"use strict";

importScripts("./content/scripts/lib/async.js");
importScripts("./content/scripts/siteFiles.js");

importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

const SITE_CACHE = "site-v1.11";

firebase.initializeApp({
  'messagingSenderId': '429768347080'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

self.addEventListener("install", (ev) => {
  ev.waitUntil(async.task(function*() {
    const cache = yield caches.open(SITE_CACHE);
    yield cache.addAll(siteFiles);
  }));
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(async.task(function*() {
    const keys = yield caches.keys();
    const promisesToDelete = keys
      .filter(
        key => key !== SITE_CACHE && key.startsWith("site-")
      )
      .map(
        key => caches.delete(key)
      );
    yield Promise.all(promisesToDelete);
  }));
});

self.addEventListener("fetch", (ev) => {
  ev.respondWith(async.task(function*() {
    const response = yield caches.match(ev.request);
    if (response) {
      return response;
    }
    const netResponse = yield fetch(ev.request);
    if (netResponse.status === 404 && ev.request.url.endsWith(".html")) {
      return new Response(`
        <h1>Oh No!</h1>
        <p>Back to <a href="/">index</a></p>
        `, {
        headers: {
          "Content-Type": "text/html" 
        }
      });
    }
    return netResponse;
  }));
});

self.addEventListener("message", ({ data }) => {
  switch (data.action) {
    case "skipWaiting":
      self.skipWaiting();
      break;
  }
});

self.addEventListener("push", function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  var title = 'Quick! Spots are filling up';
  const options = {
    body: 'You should cook for Bron soon',
    icon: './content/images/icon.png',
    badge: './content/images/badge.png',
    actions: [  
      {action: 'book', title: 'Book Now'},  
      {action: 'view', title: 'View Slots'}]  
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = 'Quick! Spots are filling up (FireBase)';
  const notificationOptions = {
    body: 'You should cook for Bron soon',
    icon: './content/images/icon.png',
    badge: './content/images/badge.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
