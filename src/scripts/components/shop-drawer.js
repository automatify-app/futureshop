import debounce from 'lodash.debounce';

class ShopDrawer {
  constructor(el, options) {
    this.drawer = el;

    var defaults = {
      direction: 'Right',
      speed: 500,
    };
    this.props = Object.assign({}, defaults, options);
    this.state = 'closed';
    this.closers = this.drawer.querySelectorAll('[data-drawer-closer]');
    this.animator; //For timeouts
    this.vh = this.setVh.bind(this);

    this.init();
  }

  init() {
    this.setupListeners();
    this.close = this.closeDrawer.bind(this);
    this.open = this.openDrawer.bind(this);
  }

  setupListeners() {
    var self = this;
    if (this.closers.length >= 0) {
      this.drawer.addEventListener('click', function(e) {
        if (e.target.closest('[data-drawer-closer]')) {
          self.close();
          e.preventDefault();
        }
      });
    }

    window.addEventListener('resize', debounce(this.vh, 100));
    window.addEventListener('load', this.vh);
    this.vh();
  }

  closeDrawer() {
    this.drawer.classList.add('transitioning');
    this.drawer.classList.remove('open');
    clearTimeout(this.animator);
    this.animator = setTimeout(() => {
      this.drawer.classList.remove('transitioning');
    }, this.props.speed);
  }
  openDrawer() {
    this.drawer.classList.add('transitioning');
    this.drawer.classList.add('open');
    clearTimeout(this.animator);
    this.animator = setTimeout(() => {
      this.drawer.classList.remove('transitioning');
    }, this.props.speed);
  }

  setVh() {
    let vh = window.innerHeight * 0.01;
    this.drawer.style.setProperty('--vh', `${vh}px`);
  }
}

export default ShopDrawer;
