import { generateElement } from "../helpers/element-helper.js";

export class BodyCustomCellTemplate {
  constructor(data = [], templateRender = () => { }) {
    this.data = data;
    this.templateRender = templateRender;

    this.#render();
  }

  destroy() {
    this.data = null;
    this.templateRender = null;
    this.element = null;
  }

  //
  // private

  #render() {
    this.element = generateElement(this.templateRender(this.data));
  }
}
