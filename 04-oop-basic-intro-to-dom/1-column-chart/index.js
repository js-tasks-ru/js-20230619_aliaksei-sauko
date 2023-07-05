export default class ColumnChart {

  constructor(options = {}) {

    const { data = [], label = '', link = '', value = 0, formatHeading = (text) => text } = options;
    
    this.data = data; 
    this.label = label; 
    this.link = link; 
    this.value = value;
    this.formatHeading = formatHeading;
    
    const maxDataValue = Math.max(...this.data);

    this.chartHeight = maxDataValue && maxDataValue != -Infinity ? maxDataValue : this.defaultMaxDataValue;

    this.element = this.render();
  }

  //
  // properties
  
  get data() {
    return this._data;
  }
    
  set data(value) {
    this._data = !value ? [] : value.slice();
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
    this.renderContainerBody(this.data);
  }

  render() {
    const columnChartDiv = document.createElement('div');
    columnChartDiv.style = `--chart-height: ${this.defaultMaxDataValue}`;
    columnChartDiv.className = 'column-chart';

    if (!this.hasData()) {
      columnChartDiv.classList.add('column-chart_loading');
    }

    const titleDiv = this.renderTitle(this.label);
    columnChartDiv.append(titleDiv);

    const containerDiv = this.renderContainer();
    columnChartDiv.append(containerDiv);

    return columnChartDiv;
  }

  //
  // private methods 

  hasData = function() {
    return this.data.length > 0;
  }

  formatNumbers = function (value) {
    return new Intl.NumberFormat('en').format(value); 
  }

  renderTitle = function (label) {
    const titleDiv = document.createElement('div');

    titleDiv.innerHTML = typeof this.value === 'number' && this.data.length > 0 
      ? `Total ${label}` 
      : `${label}`;
    titleDiv.className = 'column-chart__title';

    if (this.link) {
      const linkA = document.createElement('a');
      linkA.className = 'column-chart__link';
      linkA.href = this.link ? this.link : '#';
      linkA.innerText = 'View all';

      titleDiv.append(linkA);
    }
          
    return titleDiv;
  }

  renderContainer = function() {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'column-chart__container';

    const formattedValue = this.formatNumbers(this.value);
    const headerDiv = document.createElement('div');
    headerDiv.textContent = this.formatHeading ? this.formatHeading(formattedValue) : formattedValue;
    headerDiv.className = 'column-chart__header';
    headerDiv.setAttribute('data-element', 'header');
    containerDiv.append(headerDiv);

    const bodyDiv = this.renderContainerBody(this.data);
    containerDiv.append(bodyDiv);

    return containerDiv;
  }

  removeChildrens = function (element) {
    if (element.children === undefined || !element.children) {
      return;
    }
        
    for (let i = 0; i < element.children.length; i++) {
      element.children[i].remove();
    }  
  }

  renderContainerBody = function(data) {
    let bodyDiv = document.querySelector('.column-chart__chart');
    if (bodyDiv) {
      this.removeChildrens(bodyDiv);
    } else {
      bodyDiv = document.createElement('div');
      bodyDiv.setAttribute('data-element', 'body');
      bodyDiv.className = 'column-chart__chart';
    }

    const bodyItemDivs = this.renderContainerBodyDataDivs(data);
    bodyItemDivs.forEach(element => bodyDiv.append(element));
      
    return bodyDiv;
  }

  renderContainerBodyDataDivs = function(data) {
    return data.map(item => this.renderContainerBodyDataItemDiv(item));
  }

  renderContainerBodyDataItemDiv = function(value) {
    const itemDiv = document.createElement('div');

    const columnProperties = this.calculateColumnProperties(value, this.chartHeight, this.defaultMaxDataValue);

    itemDiv.setAttribute('style', `--value: ${columnProperties.value}`);
    itemDiv.setAttribute('data-tooltip', `${columnProperties.percent}%`);

    return itemDiv;
  }

  calculateColumnProperties = function (value, chartHeight, defaultMaxDataValue) {
    const dataValue = Math.floor(defaultMaxDataValue * (value / chartHeight));
    const percentValue = (value * 100 / this.chartHeight).toFixed(0);

    return { value: dataValue, percent: percentValue };
  }
}
