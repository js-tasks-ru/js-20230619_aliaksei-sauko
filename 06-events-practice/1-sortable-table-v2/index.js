import { HeaderTemplate } from "../../05-dom-document-loading/2-sortable-table-v1/templates/header-template.js";
import { BodyTemplate } from "../../05-dom-document-loading/2-sortable-table-v1/templates/body-template.js";
import { compare } from "../../common/helpers/comparer-helper.js";
import { HeaderCellTemplate } from "../../05-dom-document-loading/2-sortable-table-v1/templates/header-cell-template.js";
import { generateElement } from "../../common/helpers/element-helper.js";

export default class SortableTable {
  static ORDER_ASC = 'asc';
  static ORDER_DESC = 'desc';

  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.#render();
  }

  get subElements() {
    const dataElements = this.element.querySelectorAll('[data-element]');
    const elements = {};

    dataElements.forEach(e => {
      elements[e.dataset.element] = e;
    });

    return elements;
  }

  //
  // methods

  destroy() {
    this.headerConfig = null;
    this.data = null;
    this.element = null;
  }

  sort(field, sortType = SortableTable.ORDER_ASC) {
    const headerColumn = this.headerConfig.find(h => h.id == field);

    if (!headerColumn.sortable) {
      return;
    }

    const sortFunction = sortType === SortableTable.ORDER_DESC
      ? (s1, s2) => compare(s2[field], s1[field], headerColumn.sortType)
      : (s1, s2) => compare(s1[field], s2[field], headerColumn.sortType);

    this.data.sort(sortFunction);

    this.#updateHeaderSortArrow(field);
    this.#updateBody();
  }

  //
  // private

  #render() {
    this.element = this.#generateRootElement(this.headerConfig, this.data, this.sorted);
    this.#addEventListeners();
  }

  #addEventListeners() {
    const { children } = this.subElements.header;

    for (const c of children) {
      c.addEventListener('pointerdown', sortHandler, { bubbles: true });
    }

    const self = this;
    function sortHandler(e) {
      switch (e.currentTarget.dataset.order) {
      case SortableTable.ORDER_ASC:
        e.currentTarget.dataset.order = SortableTable.ORDER_DESC;
        break;
      case SortableTable.ORDER_DESC:
        e.currentTarget.dataset.order = SortableTable.ORDER_ASC;
        break;
      case '':
        e.currentTarget.dataset.order = SortableTable.ORDER_DESC;
        break;
      default:
        e.currentTarget.dataset.order = SortableTable.ORDER_ASC;
      }

      self.sort(e.currentTarget.dataset.id, e.currentTarget.dataset.order);
    }
  }

  #update() {
    const parent = this.element.parentElement;
    parent.innerHTML = '';

    this.#render();

    parent.append(this.element);
  }

  #updateBody() {
    const parent = this.subElements.body.parentElement;
    this.subElements.body.remove();

    const bodyElement = this.#generageBodyElement(this.headerConfig, this.data);

    parent.append(bodyElement);
  }

  #updateHeaderSortArrow(field) {
    if (this.subElements.arrow) {
      this.subElements.arrow.remove();
    }
    const arrowElement = generateElement(HeaderCellTemplate.getSortArrowTemplate());

    const fieldElement = this.subElements.header.querySelector(`[data-id=${field}]`);
    fieldElement.append(arrowElement);
  }

  #generateRootElement(headerConfig = [], data = [], sorted = {}) {
    const template = document.createElement('div');
    template.innerHTML = SortableTable.getTemplate();

    const header = new HeaderTemplate(headerConfig, sorted);
    template.firstElementChild.append(header.element);

    const bodyElement = this.#generageBodyElement(headerConfig, data);
    template.firstElementChild.append(bodyElement);

    return template.firstElementChild;
  }

  #generageBodyElement(headerConfig = [], data = []) {
    const template = document.createElement('div');

    const body = new BodyTemplate(headerConfig, data);
    template.append(body.element);

    return template.firstElementChild;
  }

  //
  // static

  static getTemplate() {
    return `<div class="sortable-table"></div>`;
  }
}
