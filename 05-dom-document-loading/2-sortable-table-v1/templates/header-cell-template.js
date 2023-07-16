import { generateElement } from "../helpers/element-helper.js";

export class HeaderCellTemplate {
  constructor(options = {}, order = '') {
    const { id = '', title = '', sortable = true } = options;

    this.id = id;
    this.title = title;
    this.sortable = sortable;
    this.order = order;

    this.#render();
  }

  //
  // private

  #render() {
    this.element = generateElement(HeaderCellTemplate.fillTemplate(this.id, this.title, this.sortable, this.order));
  }

  //
  // static

  static fillTemplate(id, title, sortable, order = '') {
    const template = HeaderCellTemplate.getTemplate();
    const sortArrowTemplate = order ? generateElement(this.getSortArrowTemplate()) : '';

    return template
      .replace(/__ID__/g, id)
      .replace(/__TITLE__/g, title)
      .replace(/__ORDER__/g, order)
      .replace(/__SORTARROW__/g, sortArrowTemplate)
      .replace(/__SORTABLE__/g, sortable);
  }

  static getTemplate() {
    return `<div class="sortable-table__cell" data-id="__ID__" data-sortable="__SORTABLE__" data-order="__ORDER__">
                <span>__TITLE__</span>
                __SORTARROW__
            </div>`;
  }

  static getSortArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }
}
