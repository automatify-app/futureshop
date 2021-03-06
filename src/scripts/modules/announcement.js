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
      document.body.classList.add('announcement-active');
      this.resize();
      document.body.style.overflowY = 'visible';
      if (this.closer) {
        this.closer.addEventListener('click', this.disable.bind(this));
      }
    }
  }
  disableBar() {
    this.el.classList.remove('announceActive');
    document.body.classList.remove('announcement-active');
    sessionStorage.setItem('announcementDismissed', 'true');
    this.resizeBar()
  }

  resizeBar() {
    this.ht = this.el.getBoundingClientRect().height;
    if (this.el.classList.contains('announceActive')) {
      document.body.style.setProperty('--announcement-height', this.ht + 'px');

      this.el.style.top = -this.ht + 'px';
    } else {
      document.body.style.setProperty('--announcement-height', '0px');
    }
  }
}
