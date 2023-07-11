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
    this.element = this.#generateRootElement(this.id, this.title, this.sortable, this.order);
  }

  #generateRootElement(id = '', title = '', sortable = true, order = '') {
    const template = document.createElement('div');
    template.innerHTML = HeaderCellTemplate.fillTemplate(id, title, sortable, order);

    return template.firstElementChild;
  }

  //
  // static

  static fillTemplate(id, title, sortable, order = '') {
    const template = HeaderCellTemplate.getTemplate();

    return template
      .replace(/__ID__/g, id)
      .replace(/__TITLE__/g, title)
      .replace(/__ORDER__/g, order)
      .replace(/__SORTABLE__/g, sortable);
  }

  static getTemplate() {
    return `<div class="sortable-table__cell" data-id="__ID__" data-sortable="__SORTABLE__" data-order="__ORDER__">
                <span>__TITLE__</span>
            </div>`;
  }
}
