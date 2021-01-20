import  * as basicLightbox from 'basiclightbox'


////Video Lightbox
//Element with "data-module" is el



export default class LightboxImage {
  constructor(el) {
    this.el = el;
    this.src = this.el.getAttribute('src');
    var dataSrc = this.el.getAttribute('data-src');
    if (dataSrc != null) {
      this.src = dataSrc;
    }
    var newEl = document.createElement('div');
    newEl.classList.add('lightbox-image');
    newEl.setAttribute('style', 'background-image: url("'+ this.src + '");');
    this.el.addEventListener('click', function (event) {
      var instance = basicLightbox.create(newEl.outerHTML);
      event.preventDefault();
      instance.show();
    })
  }
}