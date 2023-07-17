class Tooltip {
  static #instance = null;
  #eventListeners = {};

  constructor() {
    if (!Tooltip.#instance) {
      Tooltip.#instance = this;
    } else {
      return Tooltip.#instance;
    }
  }

  initialize() {    
    const tooltipPointerOutEvent = function (event) {
      if (event.target.dataset.tooltip != undefined) {
        Tooltip.#instance.element?.remove();
      }
    }
    
    const tooltipPointerMoveEvent = function (event) {
      Tooltip.#instance.element.style.left = `${event.clientX + 15}px`;
      Tooltip.#instance.element.style.top = `${event.clientY + 15}px`;
    }
    
    const tooltipPointerOverEvent = function (event) {
      if (event.target.dataset.tooltip != undefined) {
  
        Tooltip.#instance.render(event.target.dataset.tooltip);
  
        document.addEventListener('pointermove', tooltipPointerMoveEvent);
      }
    }

    this.#eventListeners['pointerout'] = tooltipPointerOutEvent;
    this.#eventListeners['pointermove'] = tooltipPointerMoveEvent;
    this.#eventListeners['pointerover'] = tooltipPointerOverEvent;

    document.addEventListener('pointerover', tooltipPointerOverEvent);
    document.addEventListener('pointerout', tooltipPointerOutEvent);
  }

  destroy() {
    for (const listenerType in this.#eventListeners) {
      if (Object.hasOwnProperty.call(this.#eventListeners, listenerType)) {
        const listener = this.#eventListeners[listenerType];
    
        document.removeEventListener(listenerType, listener);
      }
    }

    this.element = null;
  }

  render(text) {
    const tooltipElement = document.createElement('div');

    tooltipElement.className = 'tooltip';
    tooltipElement.innerHTML = text;

    tooltipElement.style.position = 'absolute';
    tooltipElement.style.zIndex = 1000;

    this.element = tooltipElement;

    document.body.append(this.element);
  }
}

export default Tooltip;
