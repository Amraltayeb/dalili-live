// Register service worker for PWA functionality
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
        .register('/sw.js')
        .then(
          function(registration) {
            console.log(
              'Service Worker registration successful with scope: ',
              registration.scope
            );
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
    });
  }
} 