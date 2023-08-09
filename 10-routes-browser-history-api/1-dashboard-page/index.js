import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import Component from '../../common/component.js';
import { generateElement } from '../../common/helpers/element-helper.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page extends Component {
    #components = {};
    #loadersCount = 0;
    to;
    from;

    constructor() {
        super();

        this.to = new Date();
        this.from = new Date(this.to.getFullYear(), this.to.getMonth() - 1, 1);

        this.render();
    }

    render() {
        this.element = generateElement(this.#getTemplate());

        this.#renderRangePicker();
        this.#renderColumnCharts();
        this.#renderSortableTable();

        return this.element;
    }

    destroy() {
        this.element?.removeEventListener('date-select', this.#handlerDateSelect);

        this.#components.rangePicker.destroy();
        this.#components.ordersChart.destroy();
        this.#components.salesChart.destroy();
        this.#components.customersChart.destroy();
        this.#components.sortableTable.destroy();

        this.remove();

        super.destroy();
    }

    remove() {
        this.element?.remove();
    }

    #renderRangePicker() {
        this.#components.rangePicker = new RangePicker({
            from: this.from,
            to: this.to,
        });

        this.subElements.rangePicker.append(this.#components.rangePicker.element);

        this.element.addEventListener('date-select', this.#handlerDateSelect);
    }

    #handlerDateSelect = ({ detail }) => {
        this.#loadersCount = 0;

        this.#showLoading();

        this.#components.ordersChart.update(detail.from, detail.to);
        this.#components.salesChart.update(detail.from, detail.to);
        this.#components.customersChart.update(detail.from, detail.to);

        this.#components.sortableTable.from = detail.from;
        this.#components.sortableTable.to = detail.to;
        this.#components.sortableTable.render();

        this.#hideLoading();
    }

    #renderColumnCharts() {
        const from = this.#components.rangePicker.selected.from;
        const to = this.#components.rangePicker.selected.to;

        this.#components.ordersChart = new ColumnChart({
            url: 'api/dashboard/orders',
            range: {
                from,
                to
            },
            label: 'orders',
            link: '#',
            startLoadingCallback: this.#showLoading,
            endLoadingCallback: this.#hideLoading,
        });

        this.#components.salesChart = new ColumnChart({
            url: 'api/dashboard/sales',
            range: {
                from,
                to
            },
            label: 'sales',
            formatHeading: data => `$${data}`,
            startLoadingCallback: this.#showLoading,
            endLoadingCallback: this.#hideLoading,
        });

        this.#components.customersChart = new ColumnChart({
            url: 'api/dashboard/customers',
            range: {
                from,
                to
            },
            label: 'customers',
            startLoadingCallback: this.#showLoading,
            endLoadingCallback: this.#hideLoading,
        });

        this.subElements.ordersChart.append(this.#components.ordersChart.element);
        this.subElements.salesChart.append(this.#components.salesChart.element);
        this.subElements.customersChart.append(this.#components.customersChart.element);
    }

    #renderSortableTable() {
        this.#components.sortableTable = new SortableTable(header, {
            url: 'api/dashboard/bestsellers',
            from: this.from,
            to: this.to,
            startLoadingCallback: this.startLoadingCallback,
            endLoadingCallback: this.endLoadingCallback,
        });

        this.subElements.sortableTable.append(this.#components.sortableTable.element);
    }

    #showLoading = () => {
        this.#loadersCount++;

        const mainElement = document.querySelector('main');

        mainElement?.classList.add('is-loading');
    }

    #hideLoading = () => {
        this.#loadersCount--;

        const mainElement = document.querySelector('main');

        if (!this.#loadersCount) {
            mainElement?.classList.remove('is-loading');
        }
    }

    //
    // templates

    #getTemplate() {
        return `<div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <!-- RangePicker component -->
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>
  
        <h3 class="block-title">Best sellers</h3>
  
        <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>`;
    }
}
