
import Swiper,  {Navigation,  Thumbs, Pagination, Autoplay, A11y } from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Thumbs ,  Autoplay, A11y]);


export default class SwiperThumbs {
  constructor(el) {
    this.el = el


    if (el.getAttribute('data-swiper-type') == 'thumbnails') {
      var mySwiper = new Swiper(el, {
        slidesPerView: 'auto',
        loop: false,
        centeredSlides: false,
        spaceBetween: 5,
        threshold: 10,
        effect: 'slide',
        centerInsufficientSlides: true

      })

      let thumbs = el.querySelectorAll('[data-product-single-thumbnail]');

      thumbs.forEach(element=> {
        element.addEventListener('click', function() {
        })
      })
    } else {

    ////// Swiper for slideshow

    var animType = el.getAttribute('data-swiper-animation');
    var dots = false;
    if (el.getAttribute('data-swiper-dots') == 'true') {
      dots = {
        el: '.swiper-pagination',
          dynamicBullets: true,
      }
    }
    var autoplayObj =  false;
      var delay = el.getAttribute('data-swiper-speed');
    if (delay > 0) {
      autoplayObj = {
          delay: delay*1000
      }
    }
    var mySwiper = new Swiper(el, {
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 0,
      autoplay: autoplayObj,
      autoHeight: true,
      effect: animType,
      threshold: 10,
      pagination : dots
    })

    }
  }
}