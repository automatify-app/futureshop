import Drift from "drift-zoom";
import Swiper,  {Navigation, Pagination, Thumbs, A11y, Lazy} from 'swiper';
// configure Swiper to use modules
Swiper.use([Lazy, Navigation, Pagination, Thumbs, A11y]);

export default class ProductImageWrap {
  constructor(el) {
    this.el = el;
    this.pane = el.querySelector('.product-image');
    this.images = el.querySelectorAll('[data-product-featured-image]');
    this.imageSwiper = el.querySelector('[data-main-image]');
    this.thumbSwiper = el.querySelector('[data-thumbnails]');
    this.init();
  }
  init() {
   if (this.imageSwiper) {
     if (this.images.length > 0) {
       this.initSwiper();
     }
   }

  }

  initSwiper() {
    //REmove shopify hide class.
    this.images.forEach(image=> {
      image.classList.remove('hide');

      if (image.hasAttribute('data-zoom')) {

        let pane = image.closest('.product-images');
        if (window.innerWidth > 720) {
          const parent = image.closest('.product-grid__wrap')
          pane = parent.querySelector('.zoom-pane')
        }
        const imgDrift = new Drift(image, {
          paneContainer: pane,
          zoomFactor: 2.5
        });
      }
    });

    //Thumb stuff first
    let thumbSwipe= false; //Default false
    if (this.thumbSwiper) {
    //If thumbs are here
      //Check for arrows
      let littleNav = false;
      const littleLeft= this.thumbSwiper.querySelector('.swiper-button-prev');
      const littleRight= this.thumbSwiper.querySelector('.swiper-button-next');
      if (littleLeft && littleRight) {
        littleNav = {
          nextEl: littleRight,
          prevEl: littleLeft
        }
      }

      //Init thumb swiper
      thumbSwipe = new Swiper(this.thumbSwiper, {
       slidesPerView: 'auto',
       loop: false,
       spaceBetween: 1,
       threshold: 10,
       effect: 'slide',
       centerInsufficientSlides: true,
       slideToClickedSlide: true,
        navigation: littleNav
     })




    } // ENd thumbnail checker

    //Pagination/Navigation
    let bigNav = false;
    let bigPage = false;
    let bigThumbs = false;
    const bigDots = this.imageSwiper.querySelector('.swiper-pagination')
    const bigLeft = this.imageSwiper.querySelector('.swiper-button-prev');
    const bigRight = this.imageSwiper.querySelector('.swiper-button-next');


    if (bigLeft && bigRight) {
      bigNav = {
        nextEl: bigRight,
        prevEl: bigLeft
      }
    }
    if (bigDots) {
      bigPage = {
        el: bigDots,
        dynamicBullets: true
      }
    }
    if (thumbSwipe) {
      bigThumbs = {
        swiper: thumbSwipe
      }
    }

    this.mainSwiper = new Swiper(this.imageSwiper, {
      slidesPerView:1,
      loop: false,
      centeredSlides: true,
      navigation: bigNav,
      centerInsufficientSlides: true,
      pagination: bigPage,
      thumbs: bigThumbs,
      preloadImages: false,
      lazy: {
        loadPrevNext: true,

        checkInView: true
      },
      a11y: true,
      watchSlidesVisibility: true,

    })

    var classObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type == 'attributes' && mutation.attributeName == 'aria-current') {
          this.slideToActive();
        }
      })
    });

    if (this.thumbSwiper) {
      this.thumbSwiper.querySelectorAll('[data-product-single-thumbnail]').forEach(thumb => {
        classObserver.observe(thumb, {
          attributes: true
        });
      })
    }

    var self = this;

    setTimeout(()=> {
      self.mainSwiper.updateSize();
    } , 200);

    this.mainSwiper.updateSize();
    this.slideToActive();
  }
  slideToActive() {
    if (this.thumbSwiper) {

      var activeThumbIndex = this.thumbSwiper.querySelector('[aria-current="true"]').parentNode.getAttribute('data-index');
      if (activeThumbIndex) {
        this.mainSwiper.slideTo(activeThumbIndex);
      }
    }
  }
}