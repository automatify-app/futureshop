import ShopDrawer from '../components/shop-drawer';

export default class MobileMenu {
  constructor(el) {
    this.el = el;

    this.direction = this.el.getAttribute('menu-direction');
    if (this.direction != 'right' && this.direction != 'left') {
      this.directon = 'right';
    }

    this.menuDrawer = new ShopDrawer(this.el, {direction: this.direction});

    this.setupWatchers();



  }

  setupWatchers() {

    this.toggles = document.querySelectorAll('.mobile-nav-toggle');

    this.toggles.forEach(el=> {
      el.addEventListener('click', this.menuDrawer.open)
    })
  }

}