
let swatches = document.querySelectorAll('.swatch');
var event = document.createEvent('HTMLEvents');
var formUpdate = document.createEvent('HTMLEvents');
swatches.forEach(element => {
  var swatchParent = element;
  let radios = element.querySelectorAll('input[type=radio]');
  radios.forEach(element => {
    element.addEventListener('change', function () {
      swatches.forEach(element => {
        element.classList.remove('last-clicked');
      });
      let parentSwatch = swatchParent;
      parentSwatch.classList.add('last-clicked');
      let optionIndex = parentSwatch.getAttribute('data-option-index');
      let optionValue = element.value;

      let valueholder = parentSwatch.querySelector('.option-value--holder');
      valueholder.innerHTML = optionValue;

      let parentForm = element.closest('form')
      let selector = parentForm.querySelectorAll('.single-option-selector')[optionIndex];

      selector.value = optionValue;

      event.initEvent('change', true, false);
      selector.dispatchEvent(event);
      formUpdate.initEvent('formUpdate', true, false);
      selector.dispatchEvent(formUpdate);
    })
  })
})

export default class TestModule {
  constructor(el) {
    this.el = el
  }
}