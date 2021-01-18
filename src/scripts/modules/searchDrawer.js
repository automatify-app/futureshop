export default class SearchDrawer {
  constructor(el) {
    this.wrapper = el;
    //Look for form


    this.searchButton = this.wrapper.querySelector('[data-search-button]');
    this.searchForm = this.wrapper.querySelector('form');

    this.searchDrawer = this.initSearchDrawer();

    this.closeSearchBar = this.closeSearchBar.bind(this);
    this.searchBarKeyListener = this.searchBarKeyListener.bind(this);
    this.searchBarClickListener = this.searchBarClickListener.bind(this);
    this.openSearchBar = this.openSearchBar.bind(this);

  }

  initSearchDrawer() {
    if (this.searchDrawer) {
      if (this.searchDrawer.classList.contains('search-drawer')) {
        return this.searchDrawer;
      }
    }
    //Transform the initial form, moving it to the drawer
    var searchDrawer = document.createElement('div');
    searchDrawer.classList.add('search-drawer');

    var searchDrawerOverlay = document.createElement('div')
    searchDrawerOverlay.classList.add('search-drawer-overlay');
    searchDrawer.appendChild(searchDrawerOverlay);

    var searchDrawerInner = document.createElement('div')
    searchDrawerInner.classList.add('search-drawer-inner');
    searchDrawer.appendChild(searchDrawerInner);

    var searchDrawerForm = this.searchForm.cloneNode(true);
    searchDrawerInner.appendChild(searchDrawerForm);


    document.body.appendChild(searchDrawer);


    //Remove form from other thingy
    var newButton = this.searchButton.cloneNode(true);
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(newButton)
    newButton.addEventListener('click', this.openSearchBar.bind(this))
    return searchDrawer;

  }

  openSearchBar() {
    var that = this;
    that.searchDrawer.classList.add('search-form-opening');

    var input = that.searchDrawer.querySelector('input[type=search]');
    input.focus();

    setTimeout(() => {
      that.searchDrawer.classList.add('search-form-opening');
      that.searchDrawer.classList.add('search-form-active');
      this.searchClickOff();
    }, 50);
  }

  closeSearchBar() {
    var that = this;
    that.searchDrawer.classList.remove('search-form-active');
    setTimeout(() => {
      that.searchDrawer.classList.remove('search-form-active');
      that.searchDrawer.classList.remove('search-form-opening');
    }, 400);

    //Clean event listeners
    document.removeEventListener('click', this.searchBarClickListener);
    document.removeEventListener('scroll', this.closeSearchBar);
    document.removeEventListener('keyup', this.searchBarKeyListener);
  }

  searchBarClickListener(event) {
    var that = this;
    if (event.target.closest('.search-drawer') == null || event.target.classList.contains('search-drawer-overlay')) {
      this.closeSearchBar();
    }
  }

  searchBarKeyListener(event) {
    var key = event.key || event.keyCode;
    if (key === 'Escape' || key === 'Esc' || key === 27 || key === 'Tab' || key === 9) {
      this.closeSearchBar();
    }
  }

  searchClickOff() {
    var that = this;

    document.addEventListener('click', this.searchBarClickListener);
    document.addEventListener('keyup', this.searchBarKeyListener);
    document.addEventListener('scroll', this.closeSearchBar);
  }
}