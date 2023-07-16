import { BodyRowTemplate } from "./body-row-template.js";
import { pick } from "../../../02-javascript-data-types/2-pick/index.js";
import { generateElement } from "../helpers/element-helper.js";

export class BodyTemplate {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.#render();
  }

  destroy() {
    this.headerConfig = null;
    this.data = null;
    this.element = null;
  }

  //
  // private

  #render() {
    this.element = this.#generateRootElement(this.headerConfig, this.data);
  }

  #generateRootElement(headerConfig = [], data = []) {
    const template = generateElement(BodyTemplate.getTemplate());

    data.forEach(item => {
      const headerIds = headerConfig.map(h => h.id);

      const rowItem = pick(item, headerIds);
      const rowTemplate = new BodyRowTemplate({ headerConfig, rowItem });

      template.append(rowTemplate.element);
    });

    return template;
  }

  //
  // static

  static getTemplate() {
    return `<div data-element="body" class="sortable-table__body"></div>`;
  }
}  
