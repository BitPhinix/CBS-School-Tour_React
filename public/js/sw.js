const usedCaches = [
  'cache-v1'
];

self.addEventListener('activate', (event) => {
   event.waitUntil(
       caches.keys().then(cacheNames => {
           return Promis.all(
               cacheNames.map(cacheName => {
                   if(!usedCaches.includes(cacheName)){
                       return caches.delete(cacheName);
                   }
               })
           );
       })
    );
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('cache-v1')
            .then(cache => cache.addAll([
                '../favicon.ico',
                '../icon.png',

                '../index.html',
                './bundle.js',

                '../svg/icon/poi.svg',
                '../svg/1.svg'
            ]))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => respons || fetch(event.request))
            .catch(() => {
                if(event.request.mode == 'navigate'){
                    return caches.match('../index.html');
                }
            })
    );
});