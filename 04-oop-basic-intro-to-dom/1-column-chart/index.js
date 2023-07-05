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
    const columnChartDiv = document.createElement('div');
    columnChartDiv.style = `--chart-height: ${this.defaultMaxDataValue}`;
    columnChartDiv.className = 'column-chart';

    if (!this.hasData()) {
      columnChartDiv.classList.add('column-chart_loading');
    }

    const titleDiv = this.#renderTitle(this.label, this.link);
    columnChartDiv.append(titleDiv);

    const containerDiv = this.#renderContainer();
    columnChartDiv.append(containerDiv);

    return columnChartDiv;
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
    const titleDiv = document.createElement('div');

    titleDiv.innerHTML = typeof this.value === 'number' && this.data.length > 0 
      ? `Total ${label}` 
      : `${label}`;
    titleDiv.className = 'column-chart__title';

    if (link) {
      const linkA = document.createElement('a');
      linkA.className = 'column-chart__link';
      linkA.href = link ? link : '#';
      linkA.innerText = 'View all';

      titleDiv.append(linkA);
    }
          
    return titleDiv;
  }

  #renderContainer() {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'column-chart__container';

    const formattedValue = this.#formatNumbers(this.value);
    const headerDiv = document.createElement('div');
    headerDiv.textContent = this.formatHeading ? this.formatHeading(formattedValue) : formattedValue;
    headerDiv.className = 'column-chart__header';
    headerDiv.setAttribute('data-element', 'header');
    containerDiv.append(headerDiv);

    const bodyDiv = this.#renderContainerBody(this.data, containerDiv);
    containerDiv.append(bodyDiv);

    return containerDiv;
  }

  #removeChildrens(element) {
    if (!element?.children) {
      return;
    }
        
    for (let i = 0; i < element.children.length; i++) {
      element.children[i].remove();
    }  
  }

  #renderContainerBody(data, element) {
    let bodyDiv = element.querySelector('.column-chart__chart');

    if (bodyDiv) {
      this.#removeChildrens(bodyDiv);
    } else {
      bodyDiv = document.createElement('div');
      bodyDiv.setAttribute('data-element', 'body');
      bodyDiv.className = 'column-chart__chart';
    }

    const bodyItemDivs = data.map(item => this.#renderContainerBodyDataItemDiv(item));
    bodyItemDivs.forEach(element => bodyDiv.append(element));
    
    return bodyDiv;
  }

  #renderContainerBodyDataItemDiv(value) {
    const itemDiv = document.createElement('div');

    const columnProperties = this.#calculateColumnProperties(value, this.chartHeight, this.defaultMaxDataValue);

    itemDiv.setAttribute('style', `--value: ${columnProperties.value}`);
    itemDiv.setAttribute('data-tooltip', `${columnProperties.percent}%`);

    return itemDiv;
  }

  #calculateColumnProperties(value, chartHeight, defaultMaxDataValue) {
    const dataValue = Math.floor(defaultMaxDataValue * (value / chartHeight));
    const percentValue = (value * 100 / this.chartHeight).toFixed(0);

    return { value: dataValue, percent: percentValue };
  }
}
