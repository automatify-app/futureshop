import queryString from 'query-string';

export default class Announcement {
  constructor(el) {
    this.el = el;

    this.fixedHeader = document.querySelector('.header-fixed');
    this.slideIn = this.el.getAttribute('data-slide-in');
    this.closer = this.el.querySelector('[data-close-announcement]');
    this.active = this.checkIfActive();
    this.init();

    this.enable = this.enableBar.bind(this);
    this.disable = this.disableBar.bind(this);
    this.resize = this.resizeBar.bind(this);
  }
  checkIfActive() {
    var parsedString = queryString.parse(window.location.search);

    if (parsedString.showAnnouncement === 'true') {
      return true;
    }
    if (sessionStorage.getItem('announcementDismissed') == 'true') {
      return false;
    }
    return true;
  }
  init() {

    if (!this.active) {
      return false;
    }

    this.ht = this.el.getBoundingClientRect().height;
    setTimeout(() => {
      this.enable();
    }, 500);
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  enableBar() {
    if (this.active) {
      this.el.classList.add('announceActive');
      this.resize();
      document.body.style.overflowY = 'visible';
      if (this.closer) {
        this.closer.addEventListener('click', this.disable.bind(this));
      }
    }
  }
  disableBar() {
    document.body.style.marginTop = '0px';
    document.body.style.setProperty('--mt', '0px');
    document.body.style.overflowY = 'auto';
    this.el.classList.remove('announceActive');
    sessionStorage.setItem('announcementDismissed', 'true');
  }
  resizeBar() {
    this.ht = this.el.getBoundingClientRect().height;
    if (this.el.classList.contains('announceActive')) {
      this.el.style.top = -this.ht + 'px';
      document.body.style.marginTop = this.ht + 'px';
      document.body.style.setProperty('--mt', this.ht + 'px');
    }
  }
}
