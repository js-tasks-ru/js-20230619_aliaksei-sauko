import { BodyCellTemplate } from "./body-cell-template.js";
import { BodyCustomCellTemplate } from "./body-custom-cell-template.js";
import { generateElement } from "../../../common/helpers/element-helper.js";

export class BodyRowTemplate {
  constructor(options = {}) {
    const { href = '#', headerConfig = [], rowItem = {} } = options;

    this.href = href;
    this.headerConfig = headerConfig;
    this.rowItem = rowItem;

    this.#render();
  }

  //
  // private

  #render() {
    const cellElements = this.#generateCellElements(this.headerConfig, this.rowItem);

    this.element = this.#generateRootElement(this.href, cellElements);
  }

  #generateRootElement(href, columnElements = []) {
    const template = generateElement(BodyRowTemplate.fillTemplate(href));

    columnElements.forEach(element => {
      template.append(element);
    });

    return template;
  }

  #generateCellElements(headerConfig, rowItem) {
    const columnElements = [];

    for (const key in rowItem) {
      if (!Object.hasOwnProperty.call(rowItem, key)) {
        continue;
      }

      const value = rowItem[key];
      const headerItem = headerConfig.find(h => h.id === key);

      const templatePropertyName = 'template';
      const template = headerItem.hasOwnProperty(templatePropertyName) && !headerItem.hasOwnProperty('sortType') // && (typeof value !== 'string' || typeof value !== 'number')
        ? new BodyCustomCellTemplate(value, headerItem[templatePropertyName])
        : new BodyCellTemplate({ value });

      columnElements.push(template.element);
    }

    return columnElements;
  }

  //
  // static

  static fillTemplate(href) {
    const template = BodyRowTemplate.getTemplate();

    return template
      .replace(/__HREF__/g, href);
  }

  static getTemplate() {
    return `<a href="__HREF__" class="sortable-table__row"></a>`;
  }
}
