(function () {
  /*
   * everything we want to do right away
   */
  var init = function init() {
    document.addEventListener('DOMContentLoaded', function() {
      noJS();
      setTimeout(function() {
        document.querySelector('.page').className += ' fly-in';
      }, 100);

      window.addEventListener('resize', function(e) {
        // console.log('resized..');
        // setTimeout(function() {
        //   var el = document.querySelector('.page.fly-in');
        //   if (el) {
        //     el.className = el.className.replace(/ ?fly-in/, '');
        //   } else {
        //     console.log('never flew back in');
        //   }
          
        // }, 10);
        // setTimeout(function() {
        //   var el = document.querySelector('.page');
        //   if (el) {
        //     el.className += ' fly-in';
        //   } else {
        //     console.log('not found to fly-in again');
        //   }
          
        // }, 20);
      });
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