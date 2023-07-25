import Component from "./component.js";
import { BodyRowElement } from "./elements/body-row-element.js";
import HeaderCellElement from "./elements/header-cell-element.js";
import { generateElement } from "./helpers/element-helper.js";
import { pick } from "./helpers/object-helper.js";

export default class BaseSortableTable extends Component {
  static ORDER_ASC = 'asc';
  static ORDER_DESC = 'desc';
  static DEFAULT_PAGE_SIZE = 30;
  
  constructor() {
    super();

    this.isLoading = false;
    this.data = [];
    this.pageSize = BaseSortableTable.DEFAULT_PAGE_SIZE;

    this.#render();
  }

  destroy() {
    this.subElements.header?.removeEventListener('pointerdown', this.#sortHandler);
    this.element?.removeEventListener('scroll', this.#scrollHander);

    super.destroy();
    this.isLoading = null;
    this.data = null;
    this.pageSize = null;
  }

  updateBody() {
    this.subElements.body.innerHTML = '';

    this.appendBodyElements(this.headerConfig, this.data);
  }

  appendHeaderElements(headerConfig, sorted = { id: '', order: '' }) {
    const headerElement = this.subElements.header;

    headerConfig.forEach(column => {
      const order = column.id === sorted.id ? sorted.order : '';
      const cellElement = new HeaderCellElement(column, order);

      headerElement.append(cellElement);
    });
  }

  appendBodyElements(headerConfig = [], tableData = []) {
    const bodyElement = this.subElements.body;

    if (!tableData) {
      this.showEmptyPlaceholder();

      return;
    }

    tableData.forEach(item => {
      const headerIds = headerConfig.map(h => h.id);

      const rowItem = pick(item, headerIds);
      const rowElement = new BodyRowElement({ headerConfig, rowItem });

      bodyElement.append(rowElement);
    });

    this.bodyRowHeight = bodyElement.firstElementChild.getBoundingClientRect().height;

    this.hideEmptyPlaceholder();
  }

  sort(field = '', order = 'asc') {
    return Promise.resolve();
  }

  loadData(take, skip){
    return Promise.resolve([]);
  }

  showLoading() {
    this.element.classList.add('sortable-table_loading');
    this.isLoading = true;
  }

  hideLoading() {
    this.element.classList.remove('sortable-table_loading');
    this.isLoading = false;
  }

  showEmptyPlaceholder() {
    this.element.classList.add('sortable-table_empty');
  }

  hideEmptyPlaceholder() {
    this.element.classList.remove('sortable-table_empty');
  }


  //
  // private

  #render() {
    this.element = generateElement(BaseSortableTable.fillTableTemplate());
    this.#addEventListeners();

    return this.element;
  }

  #sortHandler(e) {
    const headerCell = e.target.closest('.sortable-table__cell');

    if (!headerCell
      || !this.subElements.header.contains(headerCell)
      || !headerCell.sortable) {
      return;
    }

    headerCell.dataset.order = headerCell.dataset.order === BaseSortableTable.ORDER_DESC
      ? BaseSortableTable.ORDER_ASC
      : BaseSortableTable.ORDER_DESC;

    this.sort(headerCell.dataset.id, headerCell.dataset.order);
  }

  #scrollHander(e) {
    const windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

    if (!this.isLoading
      && windowRelativeBottom < document.documentElement.clientHeight + 2*this.bodyRowHeight) {

        this.isLoading = true;

      const skip = this.data.length;
      const take = this.pageSize

      this.loadData(take, skip).then((data) => {
        this.data = this.data.concat(data);

        this.updateBody();
        
        this.isLoading = false;
      });
    }
  }

  #addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.#sortHandler.bind(this), { bubbles: true });
    document.addEventListener('scroll', this.#scrollHander.bind(this));
  }


  //
  // static

  static fillTableTemplate() {
    return `<div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row"></div>
                <div data-element="body" class="sortable-table__body"></div>
                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                    <div>
                        <p>No products satisfies your filter criteria</p>
                        <button type="button" class="button-primary-outline">Reset all filters</button>
                    </div>
                </div>
            </div>`;
  }
}
