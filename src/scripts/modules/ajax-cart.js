// import 'unfetch/polyfill';
// import 'es6-promise/auto';
import queryString from 'query-string';

import ShopCart from '../components/shop-cart';
import ShopDrawer from '../components/shop-drawer';

export default class AjaxCart {
  constructor(el) {
    this.el = el;

    this.selectors = {
      cartButton: '[data-cart-button]',
      noteToggle: '[data-note-toggle]',
      noteWrap: '[data-note]',
      cartDrawer: '[data-cart-drawer]',
      productForms: '[data-product-form]',
      formQuantity: '[data-product-quantity]',
      formId: '[name="id"]',
    };
    this.drawer = new ShopDrawer(el, {
      direction: this.el.getAttribute('data-offscreen'),
    });
    this.cartState = false;
    this.noteToggle = this.el.querySelector('[data-note-toggle]');
    this.init();
  }

  init() {
    this.initCart().then((done) => {
      this.checkInitialState();
      this.buttonListeners();
      this.formListeners();
    });
  }

  async initCart() {
    var self = this;
    document.body.classList.add('ajax-cart');
    self.cart = new ShopCart(self.el.querySelector('[data-cart-drawer]'));
    var initDone = await self.cart
      .init()
      .then((resp) => {
        self.checkCartState();
      })
      .catch((err) => {
        self.checkCartState();
      });

    return await initDone;
  }

  checkCartState() {
    if (this.cart.state) {
      this.cartState = 'loaded';
    } else {
      this.cartState = false;
    }
  }

  setupCartButtons() {
    const allAnchors = Array.from(document.getElementsByTagName('a'));
    allAnchors.forEach((myAnchor) => {
      var hrefString = myAnchor.href;
      if (hrefString.indexOf('/cart') >= 0) {
        myAnchor.setAttribute(
          this.cleanSelector(this.selectors.cartButton),
          true
        );
        if (hrefString.indexOf('change?') !== -1) {
          const props = queryString.parse(
            hrefString.slice(hrefString.indexOf('change?') + 7)
          );
          myAnchor.setAttribute('data-line-item', props.line);
          myAnchor.setAttribute('data-line-item-quantity', props.quantity);
        }
      }
    });
  }

  checkInitialState() {
    var parsed = queryString.parse(window.location.search);
    if (parsed.cartOpen) {
      this.drawer.openDrawer();
    }
  }

  cleanSelector(selector) {
    return selector.replace('[', '').replace(']', '');
  }

  handleCartButtonClick(e) {
    e.preventDefault();
    const realButton = this.getRealButton(e.target);
    const buttonType = this.getButtonType(realButton);
    if (buttonType == 'basic') {
      this.drawer.openDrawer();
    } else {
    }
  }

  getRealButton(target) {
    if (
      target.getAttribute(this.cleanSelector(this.selectors.cartButton)) == true
    )
      return target;
    return target.closest(this.selectors.cartButton);
  }
  getButtonType(button) {
    if (
      typeof button.getAttribute('data-line-item') !== 'string' &&
      typeof button.getAttribute('data-line-item') !== 'number'
    ) {
      return 'basic';
    } else {
      if (button.getAttribute('data-line-item-quantity') == 0) {
        return 'remove';
      }
    }
  }

  setupNote() {
    var noteToggle = this.el.querySelector(this.selectors.noteToggle);
    var noteWrap = this.el.querySelector(this.selectors.noteWrap);
    if (noteToggle && noteWrap) {
      noteToggle.addEventListener('click', function() {
        if (noteWrap.classList.contains('active')) {
          noteWrap.classList.remove('active');
        } else {
          noteWrap.classList.add('active');
        }
      });
    }
  }

  buttonListeners() {
    //find cart buttons
    this.setupCartButtons();
    this.setupNote();
    var allCartButtons = document.querySelectorAll('[data-cart-button]');
    allCartButtons.forEach((cartButton) => {
      cartButton.addEventListener(
        'click',
        this.handleCartButtonClick.bind(this)
      );
    });
  }

  async setupFormSubmit(formEl) {
    var toSubmit = {};

    var quantity = 1;
    if (formEl.querySelector(this.selectors.formQuantity)) {
      quantity = parseInt(
        formEl.querySelector(this.selectors.formQuantity).value
      );
    }
    toSubmit = {
      productId: parseInt(
        formEl
          .querySelector(this.selectors.formId)
          .getAttribute('data-productid')
      ),
      variantId: parseInt(formEl.querySelector(this.selectors.formId).value),
      quantity: quantity,
    };
    return toSubmit;
  }

  formListeners() {
    var self = this;
    self.productForms = document.querySelectorAll(self.selectors.productForms);
    //Only override form submit if cartstate is not false
    self.productForms.forEach((form) => {
      form.addEventListener('submit', function(e) {
        self.checkCartState();
        if (self.cartState != false) {
          e.preventDefault();
          self.setupFormSubmit(form).then((resp) => {
            self.changeCart(resp, { type: 'submitItem' });
          });
        }
      });
    });
  }

  changeCart(obj, args) {
    this.drawer.openDrawer();
    this.cart.submitFormObject(obj, args).then((resp) => {});
  }
}
