import { HeaderCellTemplate } from "./header-cell-template.js";

export class HeaderTemplate {
  constructor(headerConfig = []) {
    this.headerConfig = headerConfig;

    this.#render();
  }

  destroy() {
    this.headerConfig = null;
    this.element = null;
  }

  //
  // private

  #render() {
    this.element = this.#generateRootElement(this.headerConfig);
  }

  #generateRootElement(headerConfig = []) {
    const headerCellElements = headerConfig
      .map(h => { return new HeaderCellTemplate(h); })
      .map(t => t.element);

    const template = document.createElement('div');
    template.innerHTML = HeaderTemplate.getTemplate();

    headerCellElements.forEach(element => {
      template.firstElementChild.append(element);
    });

    return template.firstElementChild;
  }

  //
  // static

  static getTemplate() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row"></div>`;
  }
}  
