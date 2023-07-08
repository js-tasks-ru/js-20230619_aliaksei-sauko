export default class NotificationMessage {

  constructor(message = '', options = {}) {
    const {duration = 2000, type = 'success'} = options;

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.#render();
  }

  //
  // properties

  set type(value) {
    this._type = value !== 'success' && value !== 'error' ? 'success' : value;
  }

  get type() {
    return this._type;
  }

  //
  // methods

  show(targetElement) {        
    NotificationMessage.replaceCurrentNotification(this);

    this.#render();
        
    if (targetElement) {
      targetElement.append(this.element);
    }

    const self = this;
    this.timeout = setTimeout(()=>{ self.remove(); }, this.duration);
  }

  remove() {    
    this.element?.remove();
  }
                    
  destroy() {
    clearTimeout(this.timeout);

    this.timeout = null;
    this.message = null;
    this.duration = null;
    this.durationSec = null;
    this.type = null;
    this.element = null;
  }

  //
  // private

  #render() {
    this.element = this.#generateRootElement();
  }

  #generateRootElement() {
    const template = NotificationMessage.getTemplate();
    const durationSec = this.duration / 1000;

    const templateElement = document.createElement('div');
    templateElement.innerHTML = NotificationMessage.fillTemplate(template, this.type, durationSec, this.message);

    return templateElement.querySelector('.notification');         
  }

  //
  // static

  static replaceCurrentNotification(notification) {
    if (this.notification) {
      this.notification.remove();
    }

    this.notification = notification;
  }

  static fillTemplate(template, type, durationSec, message) {
    return template
                .replace(/__TYPE__/g, type)
                .replace(/__DURATION__/g, durationSec)
                .replace(/__MESSAGE__/g, message);
  }

  static getTemplate() {
    return `<div class="notification __TYPE__" style="--value:__DURATION__s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">__TYPE__</div>
                <div class="notification-body">
                    __MESSAGE__
                </div>
            </div>
        </div>`;
  }
}