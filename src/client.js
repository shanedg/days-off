// TODO: actually import styles here
// and I guess html, etc files as well??

(function () {
  
  /*
   * everything we want to do right away
   */
  var init = function init() {
    document.addEventListener('DOMContentLoaded', function() {
      noJS();
    });
  };

  /*
   * remove 'no-js' body class to have fun when JavaScript enabled
   */
  var noJS = function noJS() {
    if (document.querySelector('body.no-js')) {
      document.querySelector('body.no-js').className = '';
    }
  };

  /*
   * throttle
   */
  var debounce = function debounce(callback, interval) {
    if (window.debounceGlobal == null) {
      window.debounceGlobal = setTimeout(callback, interval);
    } else {
      window.clearTimeout(window.debounceGlobal);
      window.debounceGlobal = null;
    }
  };

  /*
   * regiser service-worker for prefetching and offline experience
   */
  var registerServiceWorker = function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
      .register('./service-worker.js')
      .then(function () {
        if (!PRODUCTION) {
          console.log('Service Worker Registered');
        }
      });
    }
  };

  registerServiceWorker();
  init();
})();