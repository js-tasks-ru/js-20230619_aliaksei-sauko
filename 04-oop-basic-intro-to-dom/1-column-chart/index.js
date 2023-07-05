export default class ColumnChart {

  constructor(options = {}) {

    const { data = [], label = '', link = '', value = 0, formatHeading = (text) => text } = options;
    
    this.data = data; 
    this.label = label; 
    this.link = link; 
    this.value = value;
    this.formatHeading = formatHeading;
    
    this.element = this.render();
  }

  //
  // properties
  
  get data() {
    return this._data;
  }
    
  set data(value) {
    this._data = !value ? [] : value.slice();
  
    const maxDataValue = Math.max(...this._data);
    this.chartHeight = maxDataValue && maxDataValue != -Infinity ? maxDataValue : this.defaultMaxDataValue;
  }

  get defaultMaxDataValue () { return 50; }

  //
  // public methods 

  destroy() {
    this.data = null;
    this.label = null;
    this.link = null;
    this.value = null;
  }

  remove() {
    this.element.remove();
  }

  update(data = []) {
    this.data = data;
    this.#renderContainerBody(this.data, this.element);
  }

  render() {
    const columnChartDivElement = document.createElement('div');
    columnChartDivElement.style = `--chart-height: ${this.defaultMaxDataValue}`;
    columnChartDivElement.className = 'column-chart';

    if (!this.hasData()) {
      columnChartDivElement.classList.add('column-chart_loading');
    }

    const titleDivElement = this.#renderTitle(this.label, this.link);
    columnChartDivElement.append(titleDivElement);

    const containerDivElement = this.#renderContainer();
    columnChartDivElement.append(containerDivElement);

    return columnChartDivElement;
  }
  
  hasData() {
    return this.data.length > 0;
  }

  //
  // private methods 

  #formatNumbers(value) {
    return new Intl.NumberFormat('en').format(value); 
  }

  #renderTitle(label, link) {
    const titleDivElement = document.createElement('div');

    titleDivElement.innerHTML = typeof this.value === 'number' && this.data.length > 0 
      ? `Total ${label}` 
      : `${label}`;
    titleDivElement.className = 'column-chart__title';

    if (link) {
      const linkAElement = document.createElement('a');
      linkAElement.className = 'column-chart__link';
      linkAElement.href = link ? link : '#';
      linkAElement.innerText = 'View all';

      titleDivElement.append(linkAElement);
    }
          
    return titleDivElement;
  }

  #renderContainer() {
    const containerDivElement = document.createElement('div');
    containerDivElement.className = 'column-chart__container';

    const formattedValue = this.#formatNumbers(this.value);
    const headerDivElement = document.createElement('div');
    headerDivElement.textContent = this.formatHeading ? this.formatHeading(formattedValue) : formattedValue;
    headerDivElement.className = 'column-chart__header';
    headerDivElement.setAttribute('data-element', 'header');
    containerDivElement.append(headerDivElement);

    const bodyDivElement = this.#renderContainerBody(this.data, containerDivElement);
    containerDivElement.append(bodyDivElement);

    return containerDivElement;
  }

  #removeChildrens(element) {
    if (!element?.children) {
      return;
    }

    const childrenCount = element.children.length;    
    for (let i = 0; i < childrenCount; i++) {
      element.children[0].remove();
    }  
  }

  #renderContainerBody(data, element) {
    let bodyDivElement = element.querySelector('.column-chart__chart');

    if (bodyDivElement) {
      this.#removeChildrens(bodyDivElement);
    } else {
      bodyDivElement = document.createElement('div');
      bodyDivElement.setAttribute('data-element', 'body');
      bodyDivElement.className = 'column-chart__chart';
    }

    const bodyItemDivElements = data.map(item => this.#renderContainerBodyDataItemDiv(item));
    bodyItemDivElements.forEach(element => bodyDivElement.append(element));
    
    return bodyDivElement;
  }

  #renderContainerBodyDataItemDiv(value) {
    const itemDivElement = document.createElement('div');

    const columnProperties = this.#calculateColumnProperties(value, this.chartHeight, this.defaultMaxDataValue);

    itemDivElement.setAttribute('style', `--value: ${columnProperties.value}`);
    itemDivElement.setAttribute('data-tooltip', `${columnProperties.percent}%`);

    return itemDivElement;
  }

  #calculateColumnProperties(value, chartHeight, defaultMaxDataValue) {
    const dataValue = Math.floor(defaultMaxDataValue * (value / chartHeight));
    const percentValue = (value * 100 / chartHeight).toFixed(0);

    return { value: dataValue, percent: percentValue };
  }
}
