import { generateElement } from "./helpers/element-helper.js";

export default class Component {

  constructor() {
    this.element = generateElement();
  }

  get subElements() {
    const dataElements = this.element.querySelectorAll('[data-element]');
    const elements = {};

    dataElements.forEach(e => {
      elements[e.dataset.element] = e;
    });

    return elements;
  }
}
