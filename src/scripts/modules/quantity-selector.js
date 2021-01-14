

export default class QuantitySelector {
  constructor(el) {
    this.el = el
    this.init();
  }
  init() {


  // Quantity Selector Script


    var self = this;
    var quantityDown = this.el.querySelector('.adjust-minus');
    var quantityUp = this.el.querySelector('.adjust-plus');
    var quantity = this.el.querySelector('.quantity');

    var quantityVal = parseInt(quantity.value);


    quantityDown.addEventListener('click', function (e) {

    quantityVal = parseInt(quantity.value);
    if (quantityVal >= 1) {
      quantityVal--;
      quantity.value = quantityVal;
      if (document.body.classList.contains('template-cart') && !document.body.classList.contains('ajax-cart')) {
        e.preventDefault();
        self.el.closest('form').submit();
      }
    }
    else {
      let removeItem = this.el.parentNode.querySelector('.remove-item');
      if (removeItem) {
        let remove = this.el.parentNode.querySelector('.remove-item').getAttribute('href');
        window.location.href = remove;
      }
    }
    });

    quantityUp.addEventListener('click', function (e) {
      quantityVal = quantity.value;
      quantityVal++;
      quantity.value = quantityVal;
      if (document.body.classList.contains('template-cart') && !document.body.classList.contains('ajax-cart')) {
        e.preventDefault();
        self.el.closest('form').submit();
      }
    });

  }
} 