importScripts('/serviceworker-cache-polyfill.js');

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(e) {
  if (!PRODUCTION) {
    console.log('install event:', e);
  }

  var now = Date.now();

  var urlsToPrefetch = [
    '/styles.css',
    '/client.js',
    './'
  ];

  if (!PRODUCTION) {
    console.log('install..prefetching urls:\n', urlsToPrefetch);
  }

  e.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
        
        var url = new URL(urlToPrefetch, location.href);
        // cache-bust timestamp for cache-first strategy
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

        var request = new Request(url, {
          // mode: 'no-cors'
          // important to fetch only from server(s) supporting CORs without this option
        });
        return fetch(request).then(function(response) {
          if (response.status >= 400) {
            throw new Error('request for ' + urlToPrefetch +
              ' failed with status ' + response.statusText);
          }

          // Use the original URL without the cache-busting parameter as the key for cache.put().
          return cache.put(urlToPrefetch, response);
        }).catch(function(error) {
          if (!PRODUCTION) {
            console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
          }

        });
      });

      return Promise.all(cachePromises).then(function() {
        if (!PRODUCTION) {
          console.log('Pre-fetching complete.');
        }

      });
    }).catch(function(error) {
      if (!PRODUCTION) {
        console.error('Pre-fetching failed:', error);
      }
    })
  );
});

self.addEventListener('activate', function(e) {
  if (!PRODUCTION) {
    console.log('activate event:', e);
  }

  var asciiGreeting =
  ' _                        _                  _   \n' +
  '| |                      | |                | |  \n' +
  '| |__   ___ _   _   _ __ | | __ _ _ __   ___| |_ \n' +
  '| \'_ \\ / _ \\ | | | | \'_ \\| |/ _\` | \'_ \\ / _ \\ __|\n' +
  '| | | |  __/ |_| | | |_) | | (_| | | | |  __/ |_ \n' +
  '|_| |_|\\___|\\__, | | .__/|_|\\__,_|_| |_|\\___|\\__|\n' +
  '             __/ | | |                           \n' +
  '            |___/  |_|                           \n';
  console.log(asciiGreeting);

  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            if (!PRODUCTION) {
              console.log('Deleting out of date cache:', cacheName);
            }
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (!PRODUCTION) {
    console.log('fetch event:', e);
  }

  // handle same origin requests only
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      // caches.match() will look for a cache entry in all of the caches available to the service worker.
      // It's an alternative to first opening a specific named cache and then matching on that.
      caches.match(e.request).then(function(response) {
        if (response) {
          if (!PRODUCTION) {
            console.log('Found response in cache:', response);
          }
  
          return response;
        }
  
        if (!PRODUCTION) {
          console.log('No response found in cache. About to fetch from network...');
        }
  
        // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
        // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
        return fetch(e.request).then(function(response) {
          if (!PRODUCTION) {
            console.log('Response from network is:', response);
          } 
  
          return response;
        }).catch(function(error) {
          // This catch() will handle exceptions thrown from the fetch() operation.
          // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
          // It will return a normal response object that has the appropriate error code set.
          if (!PRODUCTION) {
            console.error('Fetching failed:', error);
          }

          throw error;
        });
      })
    );
  }
  
});