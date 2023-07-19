import fetchJson from './utils/fetch-json.js';
import { generateElement } from '../../common/helpers/element-helper.js';
import Component from '../../common/component.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends Component {

  constructor(options = {}) {
    super();

    const { url = '', range = { from: '', to: '' }, label = '', link = '', value = 0, formatHeading = (text) => text } = options;

    this.url = url;
    this.range = range;
    this.chartData = {};
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = this.render();

    this.update(this.range.from, this.range.to);
  }


  //
  // properties

  get chartDataArray() {
    return Object.values(this.chartData);
  }

  get chartData() {
    return this._data;
  }

  set chartData(value) {
    this._data = !value ? {} : Object.assign({}, value);

    const maxDataValue = Math.max(...Object.values(this._data));
    this.chartHeight = maxDataValue && maxDataValue != -Infinity ? maxDataValue : this.defaultMaxDataValue;
  }

  get defaultMaxDataValue() { return 50; }


  //
  // public methods 

  destroy() {
    this.data = null;
    this.label = null;
    this.link = null;
    this.value = null;
    this.element = null;
  }

  updateChartValues(data = {}) {
    this.chartData = data;
    this.subElements.body.innerHTML = '';

    if (!this.hasData()) {
      return;
    }

    for (const date in this.chartData) {
      if (!Object.hasOwnProperty.call(this.chartData, date)) {
        continue;
      }

      const value = this.chartData[date];

      const column = this.#calculateColumnProperties(value, this.chartHeight, this.defaultMaxDataValue);
      const valueElement = generateElement(ColumnChart.fillValueTemplate(column.value, date));
      this.subElements.body.append(valueElement);
    }
  }

  async update(from, to) {
    this.#showLoading();

    this.chartData = await this.#fetchChartData(from, to);
    this.value = this.chartDataArray.reduce((sum, current) => sum + current, 0);

    this.#updateHeaderValue();
    this.updateChartValues(this.chartData);

    this.#hideLoading();

    return this.chartData;
  }

  render() {
    const formattedValue = this.#formatNumbers(this.value);
    const headerValue = this.formatHeading ? this.formatHeading(formattedValue) : formattedValue;

    const title = typeof this.value === 'number' && this.chartData.length > 0
      ? `Total ${this.label}`
      : `${this.label}`;

    const href = this.link ?? '#';
    const titleLink = this.link ? ColumnChart.fillTilteLinkTemplate(href) : '';

    return generateElement(ColumnChart.fillTemplate(this.chartHeight, headerValue, title, titleLink));
  }

  hasData() {
    return this.chartDataArray.length > 0;
  }


  //
  // private methods 

  #showLoading() {
    this.element.classList.add('column-chart_loading');
  }

  #hideLoading() {
    this.element.classList.remove('column-chart_loading');
  }

  async #fetchChartData(from, to) {
    const endpointUrl = new URL(this.url, BACKEND_URL);

    endpointUrl.searchParams.set('from', from.toISOString());
    endpointUrl.searchParams.set('to', to.toISOString());

    return await fetchJson(endpointUrl);
  }

  #updateHeaderValue() {
    const formattedValue = this.#formatNumbers(this.value);
    const headerValue = this.formatHeading ? this.formatHeading(formattedValue) : formattedValue;

    this.subElements.header.innerHTML = headerValue;
  }

  #formatNumbers(value) {
    return new Intl.NumberFormat('en').format(value);
  }

  #calculateColumnProperties(value, chartHeight, defaultMaxDataValue) {
    const dataValue = Math.floor(defaultMaxDataValue * (value / chartHeight));
    const percentValue = (value * 100 / chartHeight).toFixed(0);

    return { value: dataValue, percent: percentValue };
  }


  //
  // static 

  static fillTemplate(height, headerValue, title, titleLink) {
    return `<div class="column-chart" style="--chart-height: ${height}">
            <div class="column-chart__title">
                ${title}
                ${titleLink}
            </div>
            <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${headerValue}</div>
                    <div data-element="body" class="column-chart__chart"></div>
            </div>
        </div>`;
  }

  static fillTilteLinkTemplate(href) {
    return `<a href="${href}" class="column-chart__link">View all</a>`;
  }

  static fillValueTemplate(value, tooltipValue) {
    return `<div style="--value: ${value}" data-tooltip="${tooltipValue}"></div>`;
  }
}
