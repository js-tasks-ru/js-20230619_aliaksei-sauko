export default class Component {
  element;

  startLoadingCallback;
  endLoadingCallback;

  constructor({ startLoadingCallback = () => { }, endLoadingCallback = () => { } } = {}) {
    this.element = null;
    
    this.startLoadingCallback = startLoadingCallback;
    this.endLoadingCallback = endLoadingCallback;
  }

  get subElements() {
    const dataElements = this.element?.querySelectorAll('[data-element]') ?? [];
    const elements = {};

    dataElements.forEach(e => {
      elements[e.dataset.element] = e;
    });

    return elements;
  }

  destroy(){
    this.element = null;
  }
}
