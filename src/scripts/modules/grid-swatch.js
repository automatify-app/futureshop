var getClosest = function (elem, selector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
};

export default class GridSwatch {
  constructor(el) {
    this.el = el
    const swatches = [].slice.call(el.querySelectorAll('.swatch-element'));
    let linkWrap = getClosest(el, '.grid-item');
    var imgWrap = linkWrap.querySelector('.grid-item__image');
    linkWrap.addEventListener('click', function(event) {
      var button = event.target.parentNode;
      if (swatches.includes(event.target) || swatches.includes(button)) {
        if (button.classList.contains('selected')) {
          //Do the normal thing
        } else {
          event.preventDefault();
          imgWrap.classList.remove('variant-image-active');
          swatches.forEach(el=> {
            el.classList.remove('selected')
          })
          setTimeout(() => {
            button.classList.add('selected');
          }, 25);
          linkWrap.setAttribute('href', button.getAttribute('data-url'));
          if (typeof button.getAttribute('data-image') == 'string' && button.getAttribute('data-image') != 'false') {
            imgWrap.classList.add('variant-image-active');
            imgWrap.style.backgroundImage = "url('" + button.getAttribute('data-image') + "')";
          }
        }
      }
    })
  }
}