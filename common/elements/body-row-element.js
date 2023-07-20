import BodyCellElement from "./body-cell-element.js";
import TemplatedBodyCellElement from "./custom-cell-element.js";

export class BodyRowElement extends HTMLAnchorElement {
  constructor(options = {}) {
    super();

    const { link = '#', headerConfig = [], rowItem = {} } = options;

    this.link = link;
    this.headerConfig = headerConfig;
    this.rowItem = rowItem;
  }

  connectedCallback() {
    this.#render();
  }

  //
  // private

  #render() {
    this.href = this.link;
    this.classList.add('sortable-table__row');

    this.#appendCellElements(this.headerConfig, this.rowItem);
  }

  #appendCellElements(headerConfig, rowItem) {

    for (const key in rowItem) {
      if (!Object.hasOwnProperty.call(rowItem, key)) {
        continue;
      }

      const value = rowItem[key];
      const headerItem = headerConfig.find(h => h.id === key);

      const templatePropertyName = 'template';
      const sortTypePropertyName = 'sortType';
      const cellElement = headerItem.hasOwnProperty(templatePropertyName) && !headerItem.hasOwnProperty(sortTypePropertyName)
        ? new TemplatedBodyCellElement(value, headerItem[templatePropertyName])
        : new BodyCellElement(value);

      this.append(cellElement);
    }
  }
}

window.customElements.define('body-row', BodyRowElement, { extends: 'a' });
