class AlertDrawer {
  constructor(props) {
    //Defaults
    const defaults = {
      class: 'global-alert-drawer',
      type: 'default',
      message: '<p>This is the default message</p>',
      duration: 4000,
      position: 'bottom',
      speed: 300,
      openNow: true,
      onClose: false,
      onOpen: false,
      destroyOnClose: true
    }
    //Assign defaults to new object
    let opts = Object.assign({}, defaults, props);
    
    this.class = opts.class;
    this.type = opts.type;
    this.message = opts.message;
    this.duration = opts.duration;
    this.position = opts.position;
    this.speed = opts.speed;
    this.openNow = opts.openNow;
    this.onClose = opts.onClose;
    this.onOpen = opts.onOpen;
    this.destroyOnClose = opts.destroyOnClose;
    
    this.drawer = this.initDrawer();
    
    if(this.openNow == true) {
      this.openDrawer();
    }
    
  }
  initDrawer() {
    var newDrawer = document.createElement('div');
    newDrawer.classList.add('alert-drawer', 'type--' + this.type, 'position--' + this.position, this.class);
    newDrawer.style.transitionDuration = this.speed;
    document.body.appendChild(newDrawer);
    
    var alertDrawerInner = document.createElement('div');
    alertDrawerInner.classList.add('alert-drawer__inner');
    alertDrawerInner.innerHTML = this.message;
    newDrawer.appendChild(alertDrawerInner);
    
    var drawerCloser = document.createElement('div');
    drawerCloser.innerHTML = '<span>x</span>';
    drawerCloser.classList.add('drawer-closer');
    newDrawer.appendChild(drawerCloser);
    drawerCloser.addEventListener('click', this.closeDrawer.bind(this));
    return newDrawer;
  }
  closeDrawer() {
    this.drawer.classList.remove('drawer--open');
    
    if (this.onClose != false) {
      if (  typeof(this.onClose) === "function") {
        this.onClose();
      }
    }
    if (this.destroyOnClose == true) {
      setTimeout(() => {
        document.body.removeChild(this.drawer)
        this.drawer = null;
      }, 1000);
    }
  }
  openDrawer() {
    this.drawer.classList.add('drawer--open');
    
    if (this.duration > -1 || this.duration !== 'infinite') {
      setTimeout(() => {
        this.closeDrawer();
      }, this.duration);
    }
    if (this.onOpen != false) {
      if(typeof (this.onOpen) === "function") {
        this.onOpen();
      }
    } 
  }
}

export default AlertDrawer;