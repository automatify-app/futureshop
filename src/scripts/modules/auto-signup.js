import * as basicLightbox from 'basiclightbox';
import '../../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import exitIntent from 'exit-intent-mobile-bugfix';
import Cookies from 'js-cookie';
import QueryString from 'query-string';

export default class AutoSignup {
  constructor(el) {
    this.el = el;
    const target = el.querySelector('[data-popup-content]');

    this.timeout = this.el.getAttribute('data-ap-timeout');
    this.behavior = this.el.getAttribute('data-ap-behavior');

    this.instance = basicLightbox.create(target.outerHTML, {
      onClose: () => {
        Cookies.set('auto-dismissed', 'true', { expires: 5 });
      },
    });

    this.isTest = QueryString.parse(window.location.search).testPopup == 'true';
    // const isTest = true;

    if (this.behavior == 'time') {
      if (!this.isTest) {
        setTimeout(() => {
          this.tryToShow();
        }, this.timeout * 1000);
      } else {
        this.tryToShow();
      }
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
      this.setupClose();
      // this.removeExitIntent();
    }
  }

  setupClose() {
    var closeButtons = document.querySelectorAll(
      '[data-close-popup="auto-popup"]'
    );

    var self = this;
    console.log(closeButtons);
    console.log(self.instance);
    closeButtons.forEach((button) => {
      button.addEventListener('click', function() {
        console.log('Clicked close button');
        if (self.instance) {
          self.instance.close();
        }
      });
    });
  }
}
