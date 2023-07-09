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
    this.element = this.#generateRootElement(this.data, this.templateRender);
  }

  #generateRootElement(data = [], templateRender = () => { }) {
    const template = document.createElement('div');
    template.innerHTML = templateRender(data);
    console.log(template.innerHTML);

    return template.firstElementChild;
  }
}
