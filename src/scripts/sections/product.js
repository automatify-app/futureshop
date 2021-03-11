/**
  * Product Template Script
    * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
**/
import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { register } from '@shopify/theme-sections';
import { forceFocus } from '@shopify/theme-a11y';

const classes = {
  hide: 'hide',
};

const keyboardKeys = {
  ENTER: 13,
};

const selectors = {
  submitButton: '[data-submit-button]',
  submitButtonText: '[data-submit-button-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  priceWrapper: '[data-price-wrapper]',
  imageWrapper: '[data-product-image-wrapper]',
  visibleImageWrapper: `[data-product-image-wrapper]:not(.${classes.hide})`,
  imageWrapperById: (id) => `${selectors.imageWrapper}[data-image-id='${id}']`,
  productForm: '[data-product-form]',
  productPrice: '[data-product-price]',
  thumbnail: '[data-product-single-thumbnail]',
  thumbnailById: (id) => `[data-thumbnail-id='${id}']`,
  thumbnailActive: '[data-product-single-thumbnail][aria-current]',
};
register('product', {
  async onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);

    this.product = await this.getProductJson(
      productFormElement.dataset.productHandle,
    )


    if (await this.variantInventory) {
      this.isVariantsActive = true;
    }

    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this),
    });

    this.onThumbnailClick = this.onThumbnailClick.bind(this);
    this.onThumbnailKeyup = this.onThumbnailKeyup.bind(this);

    //  if (await this.product) {
    //    this.variantInventory = await this.getVariantInventory();
    //  }

    // this.checkAvailableVariants = this.checkAvailableVariants.bind(this);
    // this.initializeVariants = this.initializeVariants.bind(this);
    // this.getVariantInventory = this.getVariantInventory.bind(this);

    // this.initializeVariants();
    // this.initializeIsw();


    this.container.addEventListener('click', this.onThumbnailClick);
    this.container.addEventListener('keyup', this.onThumbnailKeyup);

  },


  onUnload() {
    this.productForm.destroy();
    this.removeEventListener('click', this.onThumbnailClick);
    this.removeEventListener('keyup', this.onThumbnailKeyup);
  },

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => {
      return response.json();
    });
  },

  async getVariantInventory() {
    const url = `/admin/api/2020-07/products/${this.product.id}/variants.json`
    const inventory = await fetch(url).then((response) => {
      return response.json();
    }).catch(err=>{console.error(err); return this.isVariantsActive = false;});

    if (await inventory) {
      var myInv = await inventory;
      let invArray = []
      myInv.variants.forEach((variant) => {
        invArray.push({"id": variant.id, "inventory_quantity": variant.inventory_quantity})
      })
      return invArray;
    }
  },


  onFormOptionChange(event) {
    const variant = event.dataset.variant;
    if (variant) {
      var form = document.querySelector(selectors.productForm);
      for (var i = 0; i < variant.options.length; i++) {
        var radioButtonParents = form.querySelectorAll('.swatch')
        for (var j = 0; j < radioButtonParents.length; j++) {
          if (radioButtonParents[j].getAttribute('data-option-index') == i) {
            let radioButtons = radioButtonParents[j].querySelectorAll('.radio-selector');
            for (var k = 0; k < radioButtons.length; k++) {
              if (radioButtons[k].value == variant.options[i]) {
                radioButtons[k].checked = true;
              }
            }
          }
        }

      }
    }


    this.renderImages(variant);
    this.checkAvailableVariants(variant);
    this.checkIsw(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);
    this.updateBrowserHistory(variant);
  },

  initializeVariants() {
    const radios = this.container.querySelectorAll('.radio-selector');
    var swatches = [this.container.querySelector('.swatch[data-option-index="0"]'), this.container.querySelector('.swatch[data-option-index="1"]'), this.container.querySelector('.swatch[data-option-index="2"]')]
    var i = 0;

    if (swatches && radios) {

      this.product.options.forEach(option => {
        var optionString = 'option' + (i + 1);

        if (option.values.length > 1 && swatches.length > 1 && swatches[i]) {
            option.values.forEach(value => {
              var activeButton = swatches[i].querySelector('[value="' + value + '"]');
              var activeVariants = this.product.variants.filter((val, i) => { return (val[optionString] == value && val.available == true) });
              if (activeVariants.length > 0 && activeButton) {
                activeButton.parentNode.classList.add('available')
                activeButton.parentNode.classList.remove('soldout')
                activeButton.removeAttribute('disabled');
              }
            })
            i++;
          }
        })
      }

  },

  initializeIsw() {
    this.iswWrapper = this.container.querySelector('[data-isw]')
    this.iswVisible = this.container.querySelector('[data-isw-visible]')

    if (this.iswWrapper != null && this.iswVisible != null) {
      this.iswThreshold = parseInt(this.iswWrapper.getAttribute('data-threshold'))
      this.iswActive = true
    }
  },

  checkIsw(variant) {
    if (!this.iswActive || !this.variantInventory) return false;
    const invItem = this.variantInventory.find((item) =>{return item.id == variant.id});
    const qty = invItem.inventory_quantity

    //Change values
    this.iswVisible.innerHTML = qty;
    this.iswWrapper.setAttribute('data-isw', qty);
    if (qty > this.iswThreshold) {
      this.iswWrapper.classList.add('visibility--hidden')
    } else {
      this.iswWrapper.classList.remove('visibility--hidden')

    }

  },

  checkAvailableVariants(variant) {
    const lastClickedSwatch = this.container.querySelector('.swatch.last-clicked');
    const swatches = this.container.querySelectorAll('.swatch');
    var radios = this.container.querySelectorAll('.radio-selector');
    if (event.dataset.options && lastClickedSwatch && variant) {
      const optionIndex = parseInt(lastClickedSwatch.getAttribute('data-option-index'));
      // if (optionIndex == 0) {

      // }
      // const idHolder = this.container.querySelector('[name=id]');
      // var activeVariants = idHolder.querySelectorAll('[data-option' + (optionIndex + 1) + '="' + event.dataset.options[optionIndex].value + '"]');

      var availableVariants = this.product.variants.filter((filt) => { return (filt.options.indexOf(variant.options[optionIndex]) == optionIndex) })


      radios.forEach(radio => {
        var radioIndex = parseInt(radio.getAttribute('name').replace('option-', ''));
        if (!radioIndex == optionIndex) {
          var matched = this.product.variants.filter(filt => { return (filt.options[radioIndex] == radio.getAttribute('value') && filt.options[optionIndex] == variant.options[optionIndex] && filt.available == true) });
          if (matched.length > 0) {
            radio.parentNode.classList.add('available');
            radio.parentNode.classList.remove('soldout');
            radio.removeAttribute('disabled');
          } else {
            radio.parentNode.classList.remove('available');
            radio.parentNode.classList.add('soldout');
          }
        }
      })


    } else {

    }

  },

  onThumbnailClick(event) {
    const thumbnail = event.target.closest(selectors.thumbnail);
    if (!thumbnail) {
      return;
    }

    event.preventDefault();

    this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
    this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
  },

  onThumbnailKeyup(event) {
    if (
      event.keyCode !== keyboardKeys.ENTER ||
      !event.target.closest(selectors.thumbnail)
    ) {
      return;
    }

    const visibleFeaturedImageWrapper = this.container.querySelector(
      selectors.visibleImageWrapper,
    );

    forceFocus(visibleFeaturedImageWrapper);
  },

  renderSubmitButton(variant) {

    const submitButton = this.container.querySelector(selectors.submitButton);
    const submitButtonText = this.container.querySelector(
      selectors.submitButtonText,
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = theme.strings.addToCart;
      this.container.querySelector('[name="id"]').value = variant.id;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.soldOut;
    }
  },

  renderImages(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }

    this.renderFeaturedImage(variant.featured_image.id);
    this.renderActiveThumbnail(variant.featured_image.id);
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper,
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerHTML = formatMoney(variant.price, theme.moneyFormat);
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      selectors.comparePrice,
    );
    const compareTextElement = this.container.querySelector(
      selectors.comparePriceText,
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        theme.moneyFormat,
      );
      compareTextElement.classList.remove(classes.hide);
      comparePriceElement.classList.remove(classes.hide);
    } else {
      comparePriceElement.innerText = '';
      compareTextElement.classList.add(classes.hide);
      comparePriceElement.classList.add(classes.hide);
    }
  },

  renderActiveThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      selectors.thumbnailById(id),
    );
    const inactiveThumbnail = this.container.querySelector(
      selectors.thumbnailActive,
    );
    if (activeThumbnail === inactiveThumbnail) {
      return;
    }
    if (inactiveThumbnail) {
      inactiveThumbnail.removeAttribute('aria-current');
    }
    activeThumbnail.setAttribute('aria-current', true);
  },

  renderFeaturedImage(id) {
    const activeImage = this.container.querySelector(
      selectors.visibleImageWrapper,
    );
    if (!activeImage) {
      return false;
    }
    const inactiveImage = this.container.querySelector(
      selectors.imageWrapperById(id),
    );
    activeImage.classList.add(classes.hide);
    inactiveImage.classList.remove(classes.hide);
  },

  updateBrowserHistory(variant) {
    const enableHistoryState = this.productForm.element.dataset
      .enableHistoryState;

    if (!variant || enableHistoryState !== 'true') {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({ path: url }, '', url);
  },
  // Add item using @elkfox/shopify-theme/cart
  onSubmitButtonClick(event) {
    if (window.Cart){
      const submitButton = event.target.closest(selectors.submitButton);

      if (!submitButton) {
        return;
      }

      event.preventDefault();

      const currentVariant = this.productForm.variant();
      const quantity = this.productForm.quantityInputs[0].value;

      item.id = currentVariant.id;
      item.quantity = quantity;

      addItem(item);
    }
  }
});
