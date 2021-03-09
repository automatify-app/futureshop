import Swiper,  {Navigation, Pagination, Autoplay, A11y, EffectFade } from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay, A11y, EffectFade]);

export default class MySwiper {
  constructor(el) {

    this.el = el
    this.parent = this.el.parentNode.parentNode;


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

      const thumbs = this.el.querySelectorAll('[data-product-single-thumbnail]');
      const images = this.parent.querySelectorAll('[data-product-image-wrapper]');
      this.el.addEventListener('click' , function(event) {

        if (thumbs.contains(event.target)) {
          event.preventDefault();
          images.forEach(image => {
            if (image.getAttribute('data-image-id') == event.target.getAttribute('data-thumb-id')) {
              image.classList.remove('hide')
            }
            else {
              image.classList.add('hide')

            }
          })

        }
      })

    } else {

      ////// Swiper for slideshow

      var animType = this.el.getAttribute('data-swiper-animation');
      var animSpeed = 500;
      if (animType == 'fade') {
        animSpeed = 1000
      }
      var dots = false;
      if (el.getAttribute('data-swiper-dots') == 'true') {
        dots = {
          el: '.swiper-pagination',
          dynamicBullets: true,
        }
      }
      var navObject = false;
      if (el.getAttribute('data-swiper-arrows') == 'true') {
        navObject = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      }
      var autoplayObj = {
        disableOnInteraction: true
      };
      var delay = parseInt(el.getAttribute('data-swiper-speed'));
      if (delay >= 1) {
        autoplayObj.delay = delay * 500
      } else {
        autoplayObj = false;
      }

      var autoHt = true;
      if (el.getAttribute('data-auto-height') == 'false') {
        autoHt = false;
      }
      var mySwiper = new Swiper(el, {
        speed: animSpeed,
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 0,
        autoplay: autoplayObj,
        autoHeight: autoHt,
        effect: animType,
        threshold: 10,
        pagination: dots,
        navigation: navObject
      });

      console.log(mySwiper);


      window.addEventListener('load', () => {
        mySwiper.updateSize();
      })
     setTimeout( () => {
        mySwiper.updateSize();
      }, 600)
    }
  }
}