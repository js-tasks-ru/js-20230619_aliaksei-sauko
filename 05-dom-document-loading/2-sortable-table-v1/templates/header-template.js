import { HeaderCellTemplate } from "./header-cell-template.js";
import { generateElement } from "../helpers/element-helper.js";

export class HeaderTemplate {
  constructor(headerConfig = [], sorted = {}) {
    this.headerConfig = headerConfig;
    this.sorted = sorted; // { id, order }

    this.#render();
  }

  destroy() {
    this.headerConfig = null;
    this.element = null;
  }

  //
  // private

  #render() {
    const headerCellElements = this.headerConfig
    .map(h => { return new HeaderCellTemplate(h, h.id === this.sorted.id ? this.sorted.order : ''); })
    .map(h => h.element);

    const template = generateElement(HeaderTemplate.getTemplate());

    headerCellElements.forEach(element => {
      template.append(element);
    });

    this.element = template;
  }

  //
  // static

  static getTemplate() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row"></div>`;
  }
}  
