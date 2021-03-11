export default class MegaMenu {
  constructor(el) {
    this.el = el;
    this.parentLinks = el.querySelectorAll('.mega-menu__parent');
    this.parentLis = [];
    this.focus = this.focusLi.bind(this);
    this.unfocus = this.unfocusLi.bind(this);
    this.bodyCheck = this.bodyCheckFunc.bind(this);
    this.init();
  }

  init() {
    var self = this;
    this.parentLinks.forEach(element => {
      var parentLi = element.parentNode;
      this.parentLis.push(parentLi);

      element.addEventListener('click', function(e) {
        if (e.target.closest('focused')) {

        } else {

          e.preventDefault();
          self.focus(e.target.parentNode)
        }
      })
    });
  }

  focusLi(el) {
    var self = this;
    this.resetFocus(el);
    el.classList.add('focused')
    el.addEventListener('mouseout', self.unfocus)

    document.body.addEventListener('click', self.bodyCheck);
  }

  bodyCheckFunc(event) {
    if (event.target.closest('.focused') || event.target.classList.contains('focused')) {
    }
    else {
      this.resetFocus();
    }

  }

  resetFocus(el = false) {
     this.parentLis.forEach((li) => {
       if (!el || li !== el) {
         li.classList.remove('focused');
       }
     });
  }

  unfocusLi(event) {
    if (event.target.closest('.focused')) {

    } else {
      this.resetFocus()
    }
  }
}