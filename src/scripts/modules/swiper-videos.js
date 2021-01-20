
import Swiper,  {Navigation, Pagination, Autoplay, A11y } from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay, A11y]);


// function loadYoutubeImages() {
//   var toBeLoaded = document.querySelectorAll('.load-img');
//   toBeLoaded.forEach(el=>{

//     if (el.classList.contains('youtubebg-loaded')) {
//       //Do nothing
//     } else {
//       let youtubeId = el.getAttribute('data-youtube-id');
//       el.style.backgroundImage = `url('https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg')`;
//       el.classList.add('youtubebg-loaded');
//     }
//   })
// }

// window.addEventListener('load', loadYoutubeImages);

export default class VideoSwiper {
  constructor(el) {
    this.el = el;
    ////// Swiper for slideshow


    var mySwiper = new Swiper(el, {
      slidesPerView: 1.8 ,
      centeredSlides: true,
      centerInsufficientSlides: true,
      spaceBetween: 30,
      autoHeight: true,
      effect: 'slide',
      threshold: 5,
      breakpointsInverse: {
        700: {
          slidesPerView: 1.35,
          spaceBetween: 30
        },
        1300: {
          slidesPerView: 1.7,
          spaceBetween: 30
        }
      }
    })
  }
}