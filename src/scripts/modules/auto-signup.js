import * as basicLightbox from 'basiclightbox';
import '../../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import exitIntent from 'exit-intent-mobile-bugfix';
import Cookies from 'js-cookie';
import QueryString from 'query-string';

export default class AutoSignup {
  constructor(el) {
    this.el = el;

    const target = el.querySelector('[data-popup-content]');
    const closeButton = el.querySelector('[data-close-popup="auto-popup"]');
    this.timeout = this.el.getAttribute('data-ap-timeout')
    this.behavior = this.el.getAttribute('data-ap-behavior')

    this.instance = basicLightbox.create(target.outerHTML, {
      onClose: () => {
        Cookies.set('auto-dismissed', 'true', { expires: 5 });
      },
    });

    closeButton.addEventListener('click', function() {
      if (this.instance) {
        this.instance.close();
      }
    });
    this.isTest =
      QueryString.parse(window.location.search).testPopup == 'true';
    // const isTest = true;

    if (this.behavior == 'time') {
      setTimeout(() => {
        this.tryToShow()
      }, this.timeout* 1000);
    } else if (this.behavior == 'exit-intent') {
      let myExitSeconds = 30;
      let myExitSecondsMobile = 12;
      let myShowAgainSeconds = 20;

      if (this.isTest) {
        myExitSeconds = 5;
        myExitSecondsMobile = 5;
        myShowAgainSeconds = 1;
      }
      const self = this;
      this.removeExitIntent = exitIntent({
        maxDisplays: 1,
        eventThrottle: 300,
        threshold: 100,
        debug: this.isTest,
        showAfterInactiveSecondsDesktop: myExitSeconds,
        showAfterInactiveSecondsMobile: myExitSecondsMobile,
        onExitIntent: self.tryToShow.bind(self),
      });
    }
  }

  tryToShow() {
    if (Cookies.get('exit-dismissed') !== 'true' || this.isTest) {
      this.instance.show();
      this.removeExitIntent();
    }
  }
}
