import Swiper,  { Autoplay } from 'swiper';

// configure Swiper to use modules
Swiper.use([ Autoplay]);
export default class BGSwiper {
  constructor(el) {

    this.el = el
    this.children = this.el.querySelectorAll('.swiper-slide');

    if (this.children.length > 1) {
       var mySwiper = new Swiper(el, {
         slidesPerView: 1,
         loop: true,
         threshold: 10,
         effect: 'slide',
         autoplay: {
           delay: 10000,
         },
       });
    }

  }
}