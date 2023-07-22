import { generateElement } from "../helpers/element-helper.js";

export default class TemplatedBodyCellElement extends HTMLElement {

  constructor(data = [], templateRender = () => { }) {
    super();

    this.data = data;
    this.templateRender = templateRender;
  }

  connectedCallback() {
    const element = generateElement(this.templateRender(this.data));
    
    this.outerHTML = element.outerHTML;
  }
}

window.customElements.define('templated-body-cell', TemplatedBodyCellElement);
