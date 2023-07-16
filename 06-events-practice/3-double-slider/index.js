export default class DoubleSlider {
  constructor(options = {}) {
    const { min = 0, max = 0, formatValue = (value) => value, selected = { from: null, to: null } } = options;

    this.min = min < max ? min : 0;
    this.max = min < max ? max : 0;
    this.formatValue = formatValue;
    this.selected = selected;

    this.selected.from = this.selected.from ?? this.min;
    this.selected.to = this.selected.to ?? this.max;

    this.render();
  }

  //
  // properties

  get subElements() {
    const dataElements = this.element.querySelectorAll('[data-element]');
    const elements = {};

    dataElements.forEach(e => {
      elements[e.dataset.element] = e;
    });

    return elements;
  }

  get sliderLength() {
    return this.max - this.min;
  }

  // 
  // public 

  render() {
    this.element = this.#generateSliderElement();

    this.#updateRangeSliderElements();
    this.#initializeListeners();
  }

  destroy() {
    this.min = null;
    this.max = null;
    this.formatValue = null;
    this.selected = null;
    this.element = null;
  }

  //
  // private 

  #getLeftPercent() {
    const percentValue = 100 * (this.selected.from - this.min) / this.sliderLength;

    return percentValue.toFixed(0);
  }

  #getRightPercent() {
    const percentValue = 100 * (this.max - this.selected.to) / this.sliderLength;

    return percentValue.toFixed(0);
  }

  #updateRangeSliderElements() {
    const progressElement = this.element.querySelector('.range-slider__progress');
    const thumbLeftElement = this.element.querySelector('.range-slider__thumb-left');
    const thumbRightElement = this.element.querySelector('.range-slider__thumb-right');

    const left = this.#getLeftPercent();
    const right = this.#getRightPercent();
    this.#setElementStyle(progressElement, { left, right });
    this.#setElementStyle(thumbLeftElement, { left });
    this.#setElementStyle(thumbRightElement, { right });

    this.subElements.from.innerHTML = this.formatValue(this.selected.from);
    this.subElements.to.innerHTML = this.formatValue(this.selected.to);
  }

  #setElementStyle(element, { left, right } = {}) {
    element.style.left = left + '%';
    element.style.right = right + '%';
  }

  //
  // events

  #dispatchResult() {
    const rangeResult = { from: this.selected.from, to: this.selected.to };
    const rangeSelectEvent = new CustomEvent('range-select', { bubbles: true, detail: rangeResult });

    this.element.dispatchEvent(rangeSelectEvent);
  }

  #initializeListeners() {
    this.#initializeThumbLeftListeners();
    this.#initializeThumbRightListeners();
  }

  #initializeThumbLeftListeners() {
    const self = this;

    const thumbLeftPointerMove = function (event) {
      const innerElement = self.element.querySelector('.range-slider__inner');
      const innerRect = innerElement.getBoundingClientRect();
      const newLeft = event.clientX - innerRect.left;
      const delta = +Math.floor(self.sliderLength * newLeft / innerRect.width).toFixed(0);

      self.selected.from = self.min + delta;

      if (self.selected.from < self.min) {
        self.selected.from = self.min;
      }

      if (self.selected.from > self.selected.to) {
        self.selected.from = self.selected.to;
      }

      self.#updateRangeSliderElements();
      self.#dispatchResult();
    };

    const thumbLeftPointerUp = function (event) {
      thumbLeftElement.removeEventListener('pointermove', thumbLeftPointerMove);
      thumbLeftElement.removeEventListener('pointerup', thumbLeftPointerUp);
    };

    const thumbLeftPointerDown = function (event) {
      if (event.isTrusted) {
        thumbLeftElement.setPointerCapture(event.pointerId);
      }

      thumbLeftElement.addEventListener('pointermove', thumbLeftPointerMove);
      thumbLeftElement.addEventListener('pointerup', thumbLeftPointerUp);
    };

    const thumbLeftElement = this.element.querySelector('.range-slider__thumb-left');
    thumbLeftElement.addEventListener('pointerdown', thumbLeftPointerDown);
  }

  #initializeThumbRightListeners() {
    const self = this;
    const thumbRightPointerMove = function (event) {
      const innerElement = self.element.querySelector('.range-slider__inner');
      const innerRect = innerElement.getBoundingClientRect();
      let newRight = innerRect.right - event.clientX;
      let delta = +Math.floor(self.sliderLength * newRight / innerRect.width).toFixed(0);

      self.selected.to = self.max - delta;

      if (self.selected.to > self.max) {
        self.selected.to = self.max;
      }

      if (self.selected.to < self.selected.from) {
        self.selected.to = self.selected.from;
      }

      self.#updateRangeSliderElements();
      self.#dispatchResult();
    };

    const thumbRightPointerUp = function (event) {
      thumbRightElement.removeEventListener('pointermove', thumbRightPointerMove);
      thumbRightElement.removeEventListener('pointerup', thumbRightPointerUp);
    };

    const thumbRightPointerDown = function (event) {
      const thumbRightElement = event.currentTarget;
      if (event.isTrusted) {
        thumbRightElement.setPointerCapture(event.pointerId);
      }

      thumbRightElement.addEventListener('pointermove', thumbRightPointerMove);
      thumbRightElement.addEventListener('pointerup', thumbRightPointerUp);
    };

    const thumbRightElement = this.element.querySelector('.range-slider__thumb-right');
    thumbRightElement.addEventListener('pointerdown', thumbRightPointerDown);
  }

  #generateSliderElement() {
    const template = document.createElement('div');
    template.innerHTML = DoubleSlider.TEMPLATE;

    return template.firstElementChild;
  }

  //
  // static

  static get TEMPLATE() {
    return `<div class="range-slider">
        <span data-element="from"></span>
        <div class="range-slider__inner">
          <span class="range-slider__progress"></span>
          <span class="range-slider__thumb-left"></span>
          <span class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to"></span>
      </div>`;
  }
}
