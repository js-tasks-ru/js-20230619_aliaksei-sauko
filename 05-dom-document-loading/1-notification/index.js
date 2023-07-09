import { NotificationType } from './constants/notification-type.js';

export default class NotificationMessage {
  static defaultDuration = 2000;

  constructor(message = '', options = {}) {
    const { duration = NotificationMessage.defaultDuration, type = NotificationType.success } = options;

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.#render();
  }

  //
  // properties

  set type(value) {
    this._type = (value === NotificationType.success || value === NotificationType.error)
      ? value
      : NotificationType.success;
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

    this.timeout = setTimeout(() => this.remove(), this.duration);
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
    const durationSec = this.#convertMsecToSeconds(this.duration);

    const templateElement = document.createElement('div');
    templateElement.innerHTML = NotificationMessage.fillTemplate(template, this.type, durationSec, this.message);

    return templateElement.querySelector('.notification');         
  }

  #convertMsecToSeconds(msec) {
    return msec / 1000;
  }

  //
  // static

  static replaceCurrentNotification(notification) {
    if (this.currentNotification) {
      this.currentNotification.remove();
    }

    this.currentNotification = notification;
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