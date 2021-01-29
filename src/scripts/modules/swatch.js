
// let swatches = document.querySelectorAll('.swatch');
// var event = document.createEvent('HTMLEvents');
// var formUpdate = document.createEvent('HTMLEvents');
// swatches.forEach(element => {
//   var swatchParent = element;
//   let radios = element.querySelectorAll('input[type=radio]');
//   radios.forEach(element => {
//     element.addEventListener('change', function () {
//       swatches.forEach(element => {
//         element.classList.remove('last-clicked');
//       });
//       let parentSwatch = swatchParent;
//       parentSwatch.classList.add('last-clicked');
//       let optionIndex = parentSwatch.getAttribute('data-option-index');
//       let optionValue = element.value;

//       let valueholder = parentSwatch.querySelector('.option-value--holder');
//       valueholder.innerHTML = optionValue;

//       let parentForm = element.closest('form')
//       let selector = parentForm.querySelectorAll('.single-option-selector')[optionIndex];

//       selector.value = optionValue;

//       event.initEvent('change', true, false);
//       selector.dispatchEvent(event);
//       formUpdate.initEvent('formUpdate', true, false);
//       selector.dispatchEvent(formUpdate);
//     })
//   })
// })

 var event = document.createEvent('HTMLEvents');
 var formUpdate = document.createEvent('HTMLEvents');

export default class Swatch {
  constructor(el) {
    this.el = el;
    this.createEvent();
    this.activate();
    this.hideSelectors();

  }

  createEvent() {

  }

  activate() {


    const parentForm = this.el.closest('form');
    const swatches = parentForm.querySelectorAll('.swatch');
    const radios = this.el.querySelectorAll('input[type=radio]');
    radios.forEach((radio) => {
      radio.addEventListener('change', function() {

        console.log("this is working")

        //REmove last-clicked from all parent swatches
        swatches.forEach((element) => {
          element.classList.remove('last-clicked');
        });

        //Re-add last-clicked
        const parentSwatch = radio.closest('.swatch');
        parentSwatch.classList.add('last-clicked');

        //Get option index
        let optionIndex = parentSwatch.getAttribute('data-option-index');
        let optionValue = radio.value;

        let valueHolder = parentSwatch.querySelector('.option-value--holder');
        if (valueHolder) {
          valueHolder.innerHTML = optionValue;
        }


        let selector = parentForm.querySelectorAll('.single-option-selector')[
          optionIndex
        ];

        selector.value = optionValue;
        event.initEvent('change', true, true);
        selector.dispatchEvent(event);
        formUpdate.initEvent('formUpdate', true, true);
        selector.dispatchEvent(formUpdate);
      });
    });
  }

  hideSelectors(){
    const parent = this.el.parentNode;
    const sibling = parent.querySelector('.selector-wrapper');
    if (sibling) {
      sibling.style.display = 'none';
    }
  }
}