import  * as basicLightbox from 'basiclightbox'


////Video Lightbox
//Element with "data-module" is el



export default class LightboxImage {
  constructor(el) {
    var  instance = basicLightbox.create('<div class="lightbox-image"><img src="' + el.getAttribute('src') + '"></div>');
    el.addEventListener('click', function (event) {
      event.preventDefault();
      instance.show();
    })
  }
}