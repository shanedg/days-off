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

      document.querySelector('.open').addEventListener('click', function(e) {
        e.preventDefault();
        var more = document.querySelector('.more-wrap');
        if (more.className.indexOf(' active') === -1) {
          more.className += ' active';
        } else {
          more.className = more.className.replace(' active', '');
          menuScroll();
        }
      });
      
      window.addEventListener('scroll', (e) => {
        debounce(menuScroll, 5);
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
   *
   */
  var menuScroll = function menuScroll() {
    var windowScroll = window.scrollY;
    var el = document.querySelector('.responsibilities');
    var elScroll = el.offsetTop - 50;
    var openEl = document.querySelector('.offscreen');

    if (windowScroll > elScroll) {
      console.log('windowScroll > elScroll');
      if (openEl.className.indexOf(' min') === -1) {
        var more = document.querySelector('.more-wrap');
        more.className = more.className.replace(' active', '');
        openEl.className += ' min';
      }
    } else {
      console.log('windowScroll <= elScroll');
      if (openEl.className.indexOf(' min') > -1) {
        openEl.className = openEl.className.replace(' min', '');
      }
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