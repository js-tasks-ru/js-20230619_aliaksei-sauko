import { generateElement } from "../helpers/element-helper.js";

export default class HeaderCellElement extends HTMLDivElement {
  constructor(options = {}, order = '') {
    super();

    const { id = '', title = '', sortable = false } = options;

    this.title = title;
    this.sortable = sortable;
    this.order = order;
    this.dataset.id = id;
  }

  static get observedAttributes() {
    return ['data-order'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr == 'data-order') {
      if(!this.sortable){
        return;
      }

      const arrowElement = this.querySelector('[data-element="arrow"]');
      if (!this.dataset.order && arrowElement) {
        arrowElement.remove();
        return;
      }

      if (!arrowElement) {
        const sortArrowElement = generateElement(HeaderCellElement.fillSortArrowTemplate());
        this.append(sortArrowElement);
      }
    }
  }

  connectedCallback() {
    this.innerHTML = `<span>${this.title}</span>`;

    this.dataset.order = this.order;
    this.dataset.sortable = this.sortable;

    this.classList.add('sortable-table__cell');
    
    if(this.sortable && this.order){
      const sortArrowElement = generateElement(HeaderCellElement.fillSortArrowTemplate());
      this.append(sortArrowElement);      
    }
  }

  static fillSortArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }
}

window.customElements.define('header-cell', HeaderCellElement, { extends: 'div' });
