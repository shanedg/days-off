(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function () {
        if (!PRODUCTION) {
          console.log('Service Worker Registered');
        }
      });
  }
})();