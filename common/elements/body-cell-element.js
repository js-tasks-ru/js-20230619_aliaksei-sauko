export default class BodyCellElement extends HTMLDivElement {
  constructor(value) {
    super();

    this.value = value;
  }

  connectedCallback() {
    this.innerHTML = this.value;
    this.classList.add('sortable-table__cell');
  }
}

window.customElements.define('body-cell', BodyCellElement, { extends: 'div' });
