import  * as basicLightbox from 'basiclightbox'
// import AlertDrawer from '../components/alert-drawer';
////Video Lightbox
//Element with "data-module" is el


function getId(url) {
  var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
  var match = url.match(regExp);

  return (match && match[1].length == 11) ? match[1] : url;
}


export default class TestModule {
  constructor(el) {
    this.el = el
    let lbType = el.getAttribute('data-lightbox-type');
    let instance;
    if (lbType == 'video') {
    let theId = getId(el.getAttribute('data-lightbox-target'));
       instance = basicLightbox.create(`<iframe src="https://www.youtube.com/embed/` + theId + `?autoplay=1&rel=0" allowfullscreen frameborder="0" frameborder="0" ></iframe>`);

    } else {
      let target = el.getAttribute('data-lightbox-target');
      let theContentEl = document.querySelector('[data-lightbox-content="' + target + '"]')
       instance = basicLightbox.create(theContentEl.innerHTML);
    }

    el.addEventListener('click', function (event) {
      event.preventDefault();
      instance.show();
    })
  }
}