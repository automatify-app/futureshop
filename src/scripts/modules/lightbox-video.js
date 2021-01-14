import  * as basicLightbox from 'basiclightbox'

////Video Lightbox
//Element with "data-module" is el




export default class TestModule {
  constructor(el) {
    this.el = el;
    let lbType = el.getAttribute('data-lightbox-type');
    let instance;
    let theId = el.getAttribute('data-youtube-id');
    instance = basicLightbox.create(`<iframe src="https://www.youtube.com/embed/` + theId + `?autoplay=1&rel=0" allowfullscreen frameborder="0" frameborder="0" ></iframe>`);

    this.title = this.el.querySelector('[data-title]');
    if (this.title.innerHTML == '') {
      this.getTitle(theId);
    }

    el.addEventListener('click', function(event) {
      event.preventDefault();
      instance.show();
    });
  }
  getTitle() {
    //Sure

  }
}