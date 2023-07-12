export class BodyCellTemplate {
  constructor(options = {}) {
    const { value = '' } = options;

    this.value = value;

    this.#render();
  }

  destroy() {
    this.value = null;
    this.element = null;
  }

  //
  // private

  #render() {
    this.element = this.#generateRootElement(this.value);
  }

  #generateRootElement(value = '') {
    const template = document.createElement('div');
    template.innerHTML = BodyCellTemplate.fillTemplate(value);

    return template.firstElementChild;
  }

  //
  // static

  static fillTemplate(value) {
    const template = BodyCellTemplate.getTemplate();

    return template.replace(/__VALUE__/g, value);
  }

  static getTemplate() {
    return `<div class="sortable-table__cell">__VALUE__</div>`;
  }
}
