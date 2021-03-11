import 'babel-polyfill';

import 'lazysizes';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'classlist-polyfill';

import Rellax from 'rellax';
import queryString from 'query-string';
import AlertDrawer from '../components/alert-drawer';

import debounce from 'lodash.debounce';

import '../../styles/theme.scss';
// import '../../styles/theme.scss.liquid';

import { focusHash, bindInPageLinks } from '@shopify/theme-a11y';

import objectFitImages from 'object-fit-images';

//// Fancy Scrolling effects
import AOS from 'aos';
//Headroom
import Headroom from 'headroom.js';

import reframe from 'reframe.js/dist/reframe';

import SmoothScroll from 'smooth-scroll';

class Theme {
  constructor() {
    //Important site sections
    this.main = document.getElementById('MainContent');
    this.header = document.querySelector('.site-header__wrap');
    this.hero = false;
    this.footer = false;

    this.heroActive = false;
    this.bottomActive = false;
    if (this.header) {

      this.bottomActive = this.header.classList.contains('fixed--sticky-bottom');
    }

    this.headerOffset = this.headerOffsetFunc.bind(this);
    this.scrollMark = 0;

    this.utilities();
    this.init();
  }

  init() {
    AOS.init({
      once: true,
      offset: 10,
    });

    // this.mobileMenuInit();
    this.initHeader();

    this.initModules();
    this.reframe();
    this.smoothScroll = new SmoothScroll('a[href*="#"]', {
      speed: 600,
    });

    this.resizeHandler = this.allResize.bind(this);
    this.loadHandler = this.allLoad.bind(this);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('load', this.loadHandler);
    this.loadHandler();
    window.addEventListener('scroll', debounce(this.allScroll.bind(this), 50));
  }

  reframe() {
    reframe('.rte iframe');
    reframe('.type--code iframe');
  }

  utilities() {
    objectFitImages();

    // Common a11y fixes
    focusHash();
    bindInPageLinks();

    // Apply a specific class to the html element for browser support of cookies.
    if (navigator.cookieEnabled) {
      document.documentElement.className = document.documentElement.className.replace(
        'supports-no-cookies',
        'supports-cookies'
      );
    }

    /// Remove focus for non-screen-reader hoverers
    function removeFocus() {
      document.body.classList.add('hover-focus-hidden');
      window.removeEventListener('mouseover', removeFocus);
    }
    window.addEventListener('mouseover', removeFocus);
  }



  checkForHero() {
    var allImages = this.main.querySelectorAll('.image-section');
    if (allImages.length > 0) {
      if (this.main.firstElementChild == allImages[0]) {
        this.hero = allImages[0];

        if (this.hero.querySelector('.page-header__simple') != null) {
          this.hero = false;
        }
      }
    }
    if (this.header && this.hero) {
      this.heroActive = this.header.classList.contains('overlay-header');
    }
  }
  //Headroom stuff
  initHeader() {
    this.offset = 0;
    this.scrollMark = 0;
    this.overlay = false;

    this.headroomCheckOverlay();
    this.headroomHandleOffsets();
    if (this.header && (this.header.classList.contains('fixed--headroom') || this.header.classList.contains('fixed--sticky') || this.bottomActive)) {
      this.headroomInitCheckScroll();
      this.headroomFixHeader();
      this.headroomInit();
    } else if (this.header && !this.header.classList.contains('fixed--none')) {
      var self = this;
      self.headerOffset();
      window.addEventListener('resize', self.headerOffset);
      this;
    }

    this.header.classList.add('loaded');
  }

  headroomCheckOverlay() {
    this.checkForHero();
    if (this.hero) {
      if( this.heroActive) {
      this.overlay = true;
      }
    }
  }

  headroomFixHeader() {
    if (this.header) {
      if (this.overlay == true || this.bottomActive) {
        this.header.classList.add('js-fixed');
      }
    }
  }

  headroomCheckScroll() {

    if (window.scrollY <= this.scrollMark && this.heroActive) {
      this.header.classList.add('overlay-active');
    } else {
      this.header.classList.remove('overlay-active');
    }
  }

  headroomInitCheckScroll() {
    var self = this;
    if (!this.hero ) {
      return false;
    }

    this.scrollMark = 0;
    if (this.hero) {
      this.scrollMark = this.hero.getBoundingClientRect().height;
    }

    if (this.overlay && this.heroActive) {
      window.addEventListener('scroll', debounce(self.headroomCheckScroll.bind(this), 100));
      self.headroomCheckScroll.bind(this);
    } else if (this.header.classList.contains('fixed--sticky-bottom')) {
      this.offset = this.scrollMark;
      this.hero.classList.add('nav--bottom')
    }
  }
  headroomHandleOffsets() {
    if (this.header) {
      this.offset = this.header.getBoundingClientRect().height;
      this.topBar = document.querySelector('.announcement-bar__inner');
      if (this.topBar) {
        this.offset = 0 + this.topBar.getBoundingClientRect().height;
      }
    } else {
      this.offset = 0;
    }

  }
  headroomInit() {
    this.headroomHandleOffsets();
    var myHeadroom = new Headroom(this.header, {
      tolerance: {
        down: 22,
        up: 12,
      },
      offset: this.offset,
    });
    myHeadroom.init();
  }

  headerOffsetFunc() {
    if (this.main && !this.bottomActive && (!this.hero || !this.heroActive)) {


      this.main.style.paddingTop = this.header.getBoundingClientRect().height + this.header.getBoundingClientRect().top + 'px';
    }
    if (this.bottomActive && this.hero) {
      if (document.body.classList.contains('template-index')) {
        this.hero.style.marginBottom = this.header.offsetHeight + 'px';
        this.hero.style.marginBottom = 'var(--header-ht)';
      } else {
        this.hero.style.marginBottom = 'calc(var(--header-ht, 50px) + 40px)';
      }
    }

    if (this.header) {
      document.body.style.setProperty('--header-offset', this.header.getBoundingClientRect().height + this.header.getBoundingClientRect().top + 'px');
      document.body.style.setProperty('--header-ht', this.header.getBoundingClientRect().height - 25 + 'px');
      const brander = this.header.querySelector('.branding-header')
      if (brander) {
        document.body.style.setProperty('--brander-ht', 0 - brander.getBoundingClientRect().height + 'px');
      }
    }

    if (this.hero) {
      document.body.style.setProperty('--hero-ht', this.hero.getBoundingClientRect().height + 'px');
    }


  }

  //Resize handling
  allResize() {
    var self = this;
    setTimeout(() => {
      self.headroomCheckScroll();
      self.headerOffset();
    }, 30);
  }
  allLoad() {
    this.handleURLParams();
     this.initRellaxImages();
    setTimeout(() => {
      this.headroomCheckScroll();
      this.headerOffset();
      this.allScroll();
    }, 100);

    setTimeout(() => {

      //Cheat, but only once
      window.dispatchEvent(new Event('resize'));
    }, 2000);
  }
  allScroll() {
    if (window.scrollY > 0) {
      document.body.classList.add('scrolled');
    }
    else {
      document.body.classList.remove('scrolled');
    }
  }

  //Rellax images
  initRellaxImages() {
    this.rellaxImages = document.querySelectorAll('.rellax-image');
    this.rellaxBgs = document.querySelectorAll('.rellax-bg');
    this.rellaxFloats = document.querySelectorAll('.rellax-float');
    if (this.rellaxImages) {
      if (this.rellaxImages.length > 0) {
        var rellaxImage = new Rellax('.rellax-image', {
          center: true,
          speed: -4,
        });
        window.addEventListener('load', function() {
          rellaxImage.refresh();
        });
      }
    }
    if (this.rellaxBgs) {
      if (this.rellaxBgs.length > 0) {
        this.rellaxBgs.forEach((el) => {
          let offset = el.parentElement.scrollTop;
          var bg = new Rellax(el, {
            center: true,
            speed: -5,
          });
          window.addEventListener('load', function() {
            bg.refresh();
          });
        });
      }
    }
    if (this.rellaxFloats) {
      if (this.rellaxFloats.length > 0) {
        this.rellaxFloats.forEach((el) => {
          let offset = el.parentElement.scrollTop;
          var float = new Rellax(el, {
            center: true,
            speed: 3,
          });
          window.addEventListener('load', function() {
            float.refresh();
          });
        });
      }
    }
  }

  handleURLParams() {
    var parsedURL = queryString.parse(location.search);
    if (parsedURL.customer_posted == 'true') {
      var customerSuccessDrawer = new AlertDrawer({
        type: 'success',
        class: 'email-drawer',
        position: 'top',
        message: window.alertText.customerSuccess,
      });
    } else if (parsedURL.form_type == 'customer') {
      var customerSuccessDrawer = new AlertDrawer({
        type: 'error',
        position: 'top',
        class: 'email-drawer',
        message: window.alertText.customerFailure,
      });
    }
  }

  initModules() {
    Array.from(document.querySelectorAll('[data-module]')).forEach((el) => {
      const name = el.getAttribute('data-module');
      const Module = require(`../modules/${name}`).default;
      new Module(el);
    });
  }
}

var site = new Theme();
