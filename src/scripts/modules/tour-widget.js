import Bit from '../components/bandsintown';
export default class TestModule {
  constructor(el) {
    this.el = el;
    this.args = {}
    this.init()
  }
  
  init() {
    this.setupArgs();
    this.bitWidget = new Bit(this.el, this.args)
  }
  setupArgs() {
    if (this.el.getAttribute('data-artist') != false && this.el.getAttribute('data-artist') != null) {
      this.args.artist = this.el.getAttribute('data-artist');
    }
    if (this.el.getAttribute('data-app-id') != false && this.el.getAttribute('data-app-id') != null) {
      this.args.appId = this.el.getAttribute('data-app-id');
    }
    if (this.el.getAttribute('data-limit') != false && this.el.getAttribute('data-limit') != null) {
      this.args.limit = this.el.getAttribute('data-limit');
    }
    if (this.el.getAttribute('data-filter') != false && this.el.getAttribute('data-filter') != null) {
      this.args.filterString = this.el.getAttribute('data-filter');
    }
    if (this.el.getAttribute('data-show-lineup') != false && this.el.getAttribute('data-show-lineup') != null && this.el.getAttribute('data-show-lineup') != 'false') {
      this.args.showLineup = this.el.getAttribute('data-show-lineup');
    }
    if (this.el.getAttribute('data-year') != false && this.el.getAttribute('data-year') != null && this.el.getAttribute('data-year') != 'false') {
      this.args.showYear = this.el.getAttribute('data-year');
    }
    if (this.el.getAttribute('data-date-format') != false && this.el.getAttribute('data-date-format') != null) {
      this.args.dateFormat = this.el.getAttribute('data-date-format');
    }
    if (this.el.getAttribute('data-date-format') != false && this.el.getAttribute('data-date-format') != null) {
      this.args.dateFormat = this.el.getAttribute('data-date-format');
    }
  }
}