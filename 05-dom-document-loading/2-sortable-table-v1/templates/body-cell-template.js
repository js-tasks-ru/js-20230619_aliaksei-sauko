import { generateElement } from "../../../common/helpers/element-helper.js";

export class BodyCellTemplate {
  constructor(options = {}) {
    const { value = '' } = options;

    this.value = value;

    this.#render();
  }

  //
  // private

  #render() {
    this.element = generateElement(BodyCellTemplate.fillTemplate(this.value));
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
