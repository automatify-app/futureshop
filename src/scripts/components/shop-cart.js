function whichTransitionEvent() {
  var t,
    el = document.createElement('fakeelement');

  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

function whichAnimationEvent() {
  var t,
    el = document.createElement('fakeelement');

  var animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

var animationEvent = whichAnimationEvent();
var transitionEvent = whichTransitionEvent();

import Handlebars from 'handlebars';
import QuantitySelector from '../modules/quantity-selector';
import * as cart from '@shopify/theme-cart';
import currencies from '../components/currencies';
// import { getVariantFromSerializedArray } from '@shopify/theme-product';
const errorTexts = {
  en: {
    add: {
      default:
        '<h5>Failed to add to cart!</h5><p>Try again, and if this problem persists, contact us!</p>',
      notEnough:
        '<h5>Could not add to cart!</h5><p>You tried to add too many items to your cart, please try a smaller quantity.</p>',
    },
    remove: {
      default:
        '<h5>Could not remove item from cart!</h5><p>This item is not in your cart!</p>',
    },
    update: {
      default:
        '<h5>Failed to update cart!</h5><p>Try again, and if this problem persists, contact us!</p>',
      notEnough:
        '<h5>Added maximum quantity of items!</h5><p>You tried to add too many items to your cart, please try a smaller quantity.</p>',
    },
  },
};

var classes = {
  itemPre: 'itemPre',
  hasItems: 'has-items',
  itemUpdating: 'itemUpdating',
  itemAdding: 'itemAdding',
  itemRemoving: 'itemRemoving',
  base: 'itemTransitioning',
};

var selectors = {
  cartForms: '[data-cart-form]',
  cartTotal: '[data-cart-total]',
  cartItems: '[data-cart-items]',
  cartNumbers: '[data-cart-items-count]',
  cartButton: '[data-cart-button]',
  cartItem: '[data-cart-item]',
  cartItemQuantity: '[data-quantity]',
  cartItemRemove: '[data-remove-item]',
  cartItemTotal: '[data-price-total]',
  cartNote: '[name="note"]',
  cartSubtotal: '[data-cart-subtotal]',
  broadcastEl: '[data-broadcast-wrap]',
  broadcastDismiss: '[data-broadcast-close]',
  broadcastMessage: '[data-broadcast-message]',
  fallbackWrap: '[data-fallback-text]',
};

class ShopCart {
  constructor(el) {
    this.el = el;

    this.ready = {
      currencies: false,
      templates: false,
      listeners: false,
    };
    this.lastState = false;
    this.state = false;
    this.isRendering;
    this.lang = 'en';
    this.itemList = el.querySelector(selectors.cartItems);
    this.listener = false;
    this.watchItem = this.setupSingleListener.bind(this);
  }

  ///INITIALIZERS
  async init() {
    this.initialRender().then(() => {
      this.setupTemplates();
      this.setupCurrency();
      this.setupListeners();
      this.setupNote();
      if (
        this.ready.currencies &&
        this.ready.templates &&
        this.ready.listeners
      ) {
        document.body.classList.add('ajax-cart');
        return true;
      } else {
        return false;
      }
    });
  }

  async initialRender() {
    var self = this;
    return self
      .getCartState()
      .then((resp) => {
        self.lastState = resp; //Setup initial lastState
        return true;
      })
      .catch((err) => {
        self.okay = false;
        return false;
      });
  }

  ///TEMPLATES
  setupTemplates() {
    this.source = document.getElementById('cart-template').innerHTML;
    this.template = Handlebars.compile(this.source);
    if (this.template == false) {
      return (this.ready.templates = false);
    }
    return (this.ready.templates = true);
  }

  ////CURRENCIES
  setupCurrency() {
    this.currency = { active: 'USD', rate: '1.0' };
    if (window.Shopify) {
      if (window.Shopify.currency) {
        this.currency = window.Shopify.currency;
      }
    }
    this.ready.currencies = true;
  }

  renderCurrency(price, activeCurrency) {
    var matchedCurrency = currencies[activeCurrency.active];
    var combinedCurrency =
      '<span class="currency">' + matchedCurrency.symbol_native + '</span>';
    var priceString = price.toString();
    if (priceString.length == 1) {
      priceString += '00';
    }
    if (priceString.length == 2) {
      priceString += '0';
    }

    var renderedPrice = [
      priceString.slice(0, -2),
      '.',
      priceString.slice(-2),
    ].join('');
    return (
      combinedCurrency +
      '<span class="price-number">' +
      renderedPrice +
      '</span>'
    );
  }

  //LISTENERS
  setupListeners() {
    this.listenerCache = [];
    var self = this;
    if (!self.ready.currencies || !self.ready.templates) {
      console.log('somethings not ready!');
      return false;
    }
    self.quantityWatchers = [];
    var cartTotal = this.el.querySelector(selectors.cartTotal);
    var cartItems = this.itemList.querySelectorAll(selectors.cartItem);
    if (cartItems) {
      cartItems.forEach((item, itemIndex) => {
        this.watchItem(item, itemIndex);
      });
    }
    if (self.quantityWatchers.length > 0) {
      self.listenForQuantityChanges();
    }

    this.setupCheckoutButton();
  }

  setupCheckoutButton() {
    this.checkoutButton = this.el.querySelector('button[name="checkout"]');

    this.checkoutButton.addEventListener('click', () => {
      this.checkoutButton.innerHTML = 'Processing...';
    });
  }

  setupSingleListener(item, itemIndex) {
    var quantitySelect = item.querySelector(selectors.cartItemQuantity);
    if (quantitySelect) {
      this.watchQuantity(quantitySelect);
      quantitySelect.parentNode
        .querySelector('.adjust-minus')
        .addEventListener('click', () => {
          item.classList.add(classes.itemPre);
        });
      quantitySelect.parentNode
        .querySelector('.adjust-plus')
        .addEventListener('click', () => {
          item.classList.add(classes.itemPre);
        });
    }

    //Remove button to remove all of an item
    var remover = item.querySelector(selectors.cartItemRemove);
    if (remover) {
      remover.addEventListener('click', (e) => {
        e.preventDefault();
        //Add pre class right away to improve UX
        item.classList.add(classes.itemPre);
        this.removeCartItem({ variantId: item.getAttribute('data-cart-item') });
      });
    }
  }

  //LISTENERS: quantity inputs
  watchQuantity(input) {
    this.quantityWatchers.push({
      id: input.id,
      cachedVal: input.value,
      el: input,
    });
  }
  checkQuantityChange(watcher) {
    if (watcher.el.value != watcher.cachedVal) {
      watcher.cachedVal = watcher.el.value;
      watcher.el.closest(selectors.cartItem).classList.add(classes.itemPre);
      this.updateCartItem(
        {
          variantId: watcher.el
            .closest('[data-cart-item]')
            .getAttribute('data-cart-item'),
          key: watcher.el.id.replace('updates_', ''),
        },
        { quantity: parseInt(watcher.el.value) }
      ).then((resp) => {
        watcher.el.value = resp.quantity;
      });
    }
  }

  listenForQuantityChanges() {
    this.listener = setInterval(() => {
      if (!this.isRendering) {
        this.quantityWatchers.forEach((watcher) => {
          this.checkQuantityChange(watcher);
        });
      }
    }, 50);
  }

  ///CHANGE HANDLERS
  renderUpdates() {
    this.getCartState().then(() => {
      var changes = this.getCartChanges();
      // console.log(changes);
      this.handleCartChange(changes);
      this.renderCartNumbers();
      this.renderCartSubtotal();
    });
  }

  handleCartChange(changes) {
    var self = this;
    if (changes) {
      if (changes.length >= 1) {
        changes.forEach((change) => {
          switch (change.type) {
            case 'add':
              self.renderAddedItem(change.item);
              break;
            case 'update':
              self.renderUpdatedItem(change.item);
              break;
            case 'remove':
              self.renderRemovedItem(change.item);
              break;
          }
        });
        self.renderCartTotal();
      }
    }
    self.renderFallbackMessage();
  }

  getCartChanges() {
    if (!this.state) {
      throw new Error(
        'Error at getCartChanges: Cart not properly initialized!'
      );
    }
    const newItems = this.state.items; //New items for iteration
    const oldItems = this.lastState.items; //New items for iteration
    let changes = [];
    if (newItems && newItems.length > 0) {
      //There are items in the new array, check if they're in the old array
      if (!oldItems) {
        //No items at all, so we'll add all new items
        newItems.forEach((newItem) => {
          changes.push({ type: 'add', item: newItem });
        });
      } else {
        //There are items in the old array, lets see how they match
        newItems.forEach((newItem) => {
          const matchedItem = this.lastState.items.find((oldItem) => {
            return oldItem.variant_id == newItem.variant_id;
          });
          if (matchedItem) {
            if (
              matchedItem.quantity != newItem.quantity ||
              matchedItem.price != newItem.price
            ) {
              //Found a matched item with different quant/price
              changes.push({ type: 'update', item: newItem });
            } else {
              //Cart item has an exact match, so do nothing
            }
          } else {
            //No match found, add item
            changes.push({ type: 'add', item: newItem });
          }
        });
      }

      ///Loop through old items to remove some if they aren't there any more
      oldItems.forEach((oldItem) => {
        var matchedItem = newItems.find((newItem) => {
          return oldItem.variant_id == newItem.variant_id;
        });
        if (!matchedItem) {
          changes.push({ type: 'remove', item: oldItem });
        }
        if (matchedItem) {
          if (matchedItem.variant_id != oldItem.variant_id) {
            changes.push({ type: 'remove', item: oldItem });
          }
        }
      });
    } else {
      //No items in new array
      this.renderClearCart();
    }
    return changes;
  }

  ////RENDERERS

  /////RENDERERS: Helpers
  getTargetItem(itemObj) {
    //Accepts either a variant ID or a line item object
    var targVariant = itemObj;
    if (typeof itemObj != 'string') {
      var targVariant = itemObj.variant_id;
    }
    if (!targVariant) return false;

    return this.el.querySelector('[data-cart-item="' + targVariant + '"]');
  }

  flash(el) {
    el.classList.add('flash');

    el.addEventListener(animationEvent, () => {
      el.classList.remove('flash');
    });
  }

  renderCartNumbers() {
    document.querySelectorAll(selectors.cartNumbers).forEach((num) => {
      num.innerHTML = this.state.item_count;
      this.flash(num.closest(selectors.cartButton));
    });
  }
  renderCartSubtotal() {
    document.querySelectorAll(selectors.cartSubtotal).forEach((sub) => {
      sub.innerHTML = this.renderCurrency(
        this.state.total_price,
        this.currency
      );
      this.flash(sub);
    });
  }

  renderLoop(targEl, newClass) {
    if (!targEl) return false;
    this.isRendering = 'rendering';
    targEl.classList.add(classes.base);
    targEl.classList.add(newClass);
    targEl.classList.remove(classes.itemPre);
    // console.log(animationEvent)
    let timeoutCheck = 0;

    setTimeout(() => {
      targEl.classList.remove(classes.base);
      targEl.classList.remove(newClass);
      targEl.classList.remove(classes.itemPre);
      this.isRendering = false;
    }, 1000);

    targEl.addEventListener(animationEvent, () => {
      clearTimeout(timeoutCheck);

      targEl.classList.remove(classes.base);
      targEl.classList.remove(newClass);
      targEl.classList.remove(classes.itemPre);
      this.isRendering = false;
      // console.log(animationEvent)
    });
    targEl.addEventListener(transitionEvent, () => {
      clearTimeout(timeoutCheck);
      targEl.classList.remove(classes.base);
      targEl.classList.remove(newClass);
      targEl.classList.remove(classes.itemPre);
      this.isRendering = false;
      // console.log(animationEvent)
    });
    //Time based ender
  }

  //////RENDERERS: Specific
  renderRemovedItem(item, delay) {
    var self = this;
    var targetEl = self.getTargetItem(item);
    if (!item || !targetEl) return false;

    targetEl.addEventListener(animationEvent, () => {
      if (targetEl) {
        targetEl.remove();
      }
    });
    targetEl.addEventListener(transitionEvent, () => {
      if (targetEl) {
        targetEl.remove();
      }
    });

    setTimeout(() => {
      self.renderLoop(targetEl, classes.itemRemoving);
    }, delay);
  }

  async prepareAddedItem(item) {
    var indexOfEnding = item.image.indexOf('.png');
    if (indexOfEnding < 0) {
      indexOfEnding = item.image.indexOf('.jpg');
    }
    if (indexOfEnding < 0) {
      indexOfEnding = item.image.indexOf('.gif');
    }
    if (indexOfEnding < 0) {
      indexOfEnding = item.image.indexOf('.jpeg');
    }
    if (indexOfEnding < 0) {
      indexOfEnding = item.image.indexOf('.webm');
    }

    const newImg = [
      item.image.substring(0, indexOfEnding),
      '_200x200',
      item.image.substring(indexOfEnding),
    ].join('');
    let data = {
      itemUrl: item.url,
      itemTitle: item.product_title,
      // variantTitle: item.variant_title,
      itemKey: item.key,
      itemOptions: null,
      itemQuantity: item.quantity,
      itemImage: newImg,
      itemIndex: this.itemList.querySelectorAll(selectors.cartItem).length,
      itemEach: this.renderCurrency(item.line_price, this.currency),
      itemTotal: this.renderCurrency(item.final_line_price, this.currency),
    };

    if (item.options_with_values) {
      var filteredOptions = item.options_with_values.filter((obj) => {
        return  obj.value != 'Default Title'
      })
      if (filteredOptions.length > 0) {
        data.itemOptions = filteredOptions;
      }
      console.log(filteredOptions);
    }

    return this.template(data);
  }

  renderAddedItem(item) {
    if (!item) return false;
    this.prepareAddedItem(item).then((rendered) => {
      var newEl = document.createElement('li');
      newEl.classList.add('cart-drawer-item');
      newEl.setAttribute('data-cart-item', item.variant_id);
      newEl.innerHTML = rendered;
      this.itemList.append(newEl);
      this.watchItem(
        newEl,
        this.itemList.querySelectorAll(selectors.cartItem).length
      );
      this.renderLoop(newEl, classes.itemAdding);
      var newQuant = new QuantitySelector(
        newEl.querySelector('.quantity-select')
      );
      this.listenForQuantityChanges();
    });
  }

  renderUpdatedItem(item) {
    if (!item) return false;
    var targetEl = this.getTargetItem(item);
    this.renderLoop(targetEl, classes.itemUpdating);
    var targQuant = targetEl.querySelector(selectors.cartItemQuantity);
    if (targQuant) {
      targQuant.value = item.quantity;
      targetEl.addEventListener(animationEvent, () => {
        this.flash(targQuant.parentNode.parentNode);
      });
    }
    var targTotal = targetEl.querySelector(selectors.cartItemTotal);
    if (targTotal) {
      targTotal.innerHTML = this.renderCurrency(
        item.final_line_price,
        this.currency
      );
      targetEl.addEventListener(animationEvent, () => {
        this.flash(targTotal.parentNode);
      });
    }
  }
  renderClearCart() {
    if (this.lastState.items) {
      this.lastState.items.forEach((item, index) => {
        this.renderRemovedItem(item, index * 200);
      });
    }
  }

  renderCartTotal(targ, count) {}

  renderFallbackMessage() {
    if (this.state.items.length > 0) {
      this.itemList.classList.add('has-items');
      this.el
        .querySelector(selectors.fallbackWrap)
        .setAttribute('aria-hidden', true);
    } else {
      this.itemList.classList.remove('has-items');
      this.el
        .querySelector(selectors.fallbackWrap)
        .removeAttribute('aria-hidden');
    }
  }

  ///Shopify Cart Fetch Functions

  async getLineItem(args) {
    //Args:
    //line: Number
    //VariantId: number
    if (!this.state) {
      throw new Error('Cart State is not set up!');
    }
    const lineItems = this.state.items;
    const lineItem = lineItems.find((item, index) => {
      return item.variant_id == args.variantId || index == args.line;
    });
    if (lineItem)
      return {
        variantId: args.variantId,
        key: lineItem.key,
        currentQuantity: lineItem.quantity,
        currentProps: lineItem.properties,
      };
    return false;
  }

  async submitFormObject(formObj, args) {
    if (args.type == 'submitItem') {
      this.getLineItem({ variantId: formObj.variantId })
        .then((resp) => {
          if (resp == false) {
            this.addCartItem(formObj);
          } else {
            const newObj = {
              quantity: resp.currentQuantity + formObj.quantity,
              properties: Object.assign(
                {},
                resp.properties,
                formObj.properties
              ),
            };
            this.updateCartItem(resp, newObj);
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }

  async addCartItem(args) {
    var addObj = {
      quantity: args.quantity,
    };
    if (args.properties) {
      addObj.properties = args.properties;
    }

    cart
      .addItem(args.variantId, addObj)
      .then((resp) => {
        this.renderUpdates();
      })
      .catch((err) => {
        this.handleCartError('add', err);
      });
  }

  async updateCartItem(lineItem, args) {
    if (args.quantity === 0) {
      return this.removeCartItem(
        Object.assign({}, args, { variantId: lineItem.variantId })
      );
    }
    return cart
      .updateItem(lineItem.key, args)
      .then((resp) => {
        var updatedItem = resp.items.find((item) => {
          return item.variant_id == lineItem.variantId;
        });
        if (!updatedItem) {
          this.handleCartError('update', 'default');
          return false;
        }
        if (updatedItem.quantity != args.quantity) {
          this.handleCartError('update', 'notEnough');
        }
        this.renderUpdates();
        var returnObj = {
          quantity: updatedItem.quantity,
          properties: updatedItem.properties,
        };
        return returnObj;
      })
      .catch((err) => {
        this.handleCartError('update', err);
        return args;
      });
  }

  async removeCartItem(args) {
    //Args:
    // line: Number
    //VariantId: number
    var self = this;
    if (typeof args.line == 'number' || typeof args.variantId !== 'undefined') {
      return self.getLineItem(args).then((foundItem) => {
        return cart.removeItem(foundItem.key).then((resp) => {
          self.renderUpdates();
          return true;
        });
      });
    } else {
    }
  }

  async updateCartNote(note) {
    cart.updateNote(note).then((resp) => {});
  }

  async getCartState(updateState = true) {
    if (updateState == true) {
      this.lastState = this.state;
    }

    var cartState = await cart
      .getState()
      .then((state) => {
        return state;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
    if (await cartState) {
      this.state = cartState;
    } else {
      this.state = false;
    }
    return await cartState;
  }
  //
  setupNote() {
    var self = this;
    self.cartNote = self.el.querySelector(selectors.cartNote);
    if (self.cartNote) {
      self.cartNote.addEventListener('blur', function() {
        self.updateCartNote(self.cartNote.value);
        self.renderSavedText();
      });
    }
  }

  renderSavedText() {
    this.cartNote.parentNode.classList.add('saved');
    setTimeout(() => {
      this.cartNote.parentNode.classList.remove('saved');
    }, 2000);
  }
  //ERROR HANDLING
  broadcast(args) {
    //Type: string (error|success|alert)
    //Message: string

    if (!this.broadcastEl) {
      this.setupBroadcast();
    }
    this.broadcastRenderLoop(args.message, args.type == 'error');
  }

  setupBroadcast() {
    this.broadcastEl = this.el.querySelector(selectors.broadcastEl);
    this.broadcastDismiss = this.el.querySelector(selectors.broadcastDismiss);
    this.broadcastMessage = this.el.querySelector(selectors.broadcastMessage);
    this.broadcastDismiss.addEventListener(
      'click',
      this.closeBroadcast.bind(this)
    );
  }

  broadcastRenderLoop(message, error = false) {
    if (!this.broadcastEl) {
      this.setupBroadcast();
    }
    this.broadcastMessage.innerHTML = message;
    this.broadcastEl.style.maxHeight =
      this.broadcastMessage.getBoundingClientRect().height + 'px';
    this.broadcastEl.classList.add('broadcastOpen');
    this.flash(this.broadcastEl);
    if (error) this.broadcastEl.classList.add('is-error');

    setTimeout(() => {
      this.closeBroadcast();
    }, 6000);
  }
  closeBroadcast() {
    this.broadcastMessage.innerHTML = '';
    this.broadcastEl.classList.remove('broadcastOpen');
    this.broadcastEl.classList.remove('is-error');
    this.broadcastEl.removeAttribute('style');
  }

  handleCartError(type, error) {
    //REset all pres
    setTimeout(() => {
      var pres = this.el.querySelectorAll('.' + classes.itemPre);
      if (pres.length) {
        pres.forEach((pre) => {
          pre.classList.remove(classes.itemPre);
        });
      }
    }, 200);

    if (typeof error == 'string') {
      return this.broadcast({
        type: 'error',
        message: errorTexts.en[type][error],
      });
    }
    error.json().then((resp) => {
      if (resp.description.indexOf("can't add more") >= 0) {
        this.broadcast({
          type: 'error',
          message: errorTexts.en[type]['notEnough'],
        });
      } else {
        this.broadcast({
          type: 'error',
          message: errorTexts.en[type]['default'],
        });
      }
    });
  }
}

export default ShopCart;
