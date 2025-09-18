// Service Worker for Techniki Website
// Enables offline functionality and caching

const CACHE_NAME = 'techniki-v20250919011604';
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

// Fetch Event - Network first strategy for HTML, cache first for assets
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // For HTML pages, use network-first strategy
  if (request.destination === 'document' || 
      request.headers.get('Accept').includes('text/html') ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    
    event.respondWith(
      fetch(request)
        .then(function(response) {
          // If network request is successful, cache it and return
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(request, responseClone);
              });
            return response;
          }
          // If network fails, try cache
          return caches.match(request);
        })
        .catch(function() {
          // Network failed, try cache
          return caches.match(request);
        })
    );
  } 
  // For other assets (CSS, JS, images), use cache-first strategy
  else {
    event.respondWith(
      caches.match(request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          
          // Clone the request because it's a stream
          const fetchRequest = request.clone();
          
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
                  cache.put(request, responseToCache);
                });
              
              return response;
            }
          );
        })
    );
  }
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
