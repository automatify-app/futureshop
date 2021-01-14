import  * as basicLightbox from 'basiclightbox'
import '../../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import Cookies from 'js-cookie';
////Video Lightbox
//Element with "data-module" is el




export default class AutoSignup {
  constructor(el) {
    this.el = el
    this.popup;
    this.init();

  }
  init() {

    this.target = this.el.querySelector('.popup-content');
    this.popup = basicLightbox.create(this.target.innerHTML, {
      onClose: () => {
        this.handleClose()
      }
    });
    this.time = this.el.getAttribute('data-delay');
    this.startTimer()
  }
  startTimer() {
    if (this.time == 0) {;
      this.showPopup();
    } else {
      setTimeout(() => {
        this.showPopup();
      }, this.time * 1000);
    }
  }
  showPopup() {
    if (Cookies.get('newsletterDismissed') != 'true') {
      this.popup.show();
    }
  }

  handleClose() {
    Cookies.set('newsletterDismissed', 'true', {expires: 1});
  }
}