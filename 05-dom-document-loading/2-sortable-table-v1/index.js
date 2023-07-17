import { HeaderTemplate } from "./templates/header-template.js";
import { BodyTemplate } from "./templates/body-template.js";
import { compare } from "./helpers/comparer-helper.js";
import { generateElement } from "./helpers/element-helper.js";

export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

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

  sort(field, sortType = 'asc') {
    const headerColumn = this.headerConfig.find(h => h.id == field);

    const sortFunction = sortType === 'desc' 
      ? (s1, s2) => compare(s2[field], s1[field], headerColumn.sortType)
      : (s1, s2) => compare(s1[field], s2[field], headerColumn.sortType);

    this.data.sort(sortFunction);

    this.#update();
  }

  //
  // private
 
  #render() { 
    this.element = this.#generateRootElement(this.headerConfig, this.data);
  }
  
  #update() {
    const parent = this.element.parentElement;
    parent.innerHTML = '';

    this.#render();

    parent.append(this.element);
  }
   
  #generateRootElement(headerConfig = [], data = []) {
    
    const template = generateElement(SortableTable.getTemplate());
  
    const headerElement = new HeaderTemplate(headerConfig);
    template.append(headerElement.element);

    const bodyElement = new BodyTemplate(headerConfig, data); 
    template.append(bodyElement.element);    
        
    return template;
  }

  //
  // static
  
  static getTemplate() {
    return `<div class="sortable-table"></div>`;
  }
}
