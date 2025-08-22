// Service Worker for Techniki Website
// Enables offline functionality and caching

const CACHE_NAME = 'techniki-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/logo.png',
  '/assets/images/logo.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('🔧 Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event - Serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
    );
});

// Activate Service Worker - Clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification handling (if needed in future)
self.addEventListener('push', function(event) {
  const title = 'Techniki Update';
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/assets/images/logo.ico',
    badge: '/assets/images/logo.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/images/logo.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/logo.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Background sync (for form submissions when offline)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle queued form submissions or other background tasks
  return new Promise(function(resolve) {
    console.log('🔄 Background sync executed');
    resolve();
  });
}
