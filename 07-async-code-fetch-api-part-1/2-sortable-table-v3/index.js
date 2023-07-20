import fetchJson from './utils/fetch-json.js';
import BaseSortableTable from '../../common/sortable-table.js';
import { compare } from '../../common/helpers/comparer-helper.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends BaseSortableTable {

  constructor(headersConfig, { url = '', data = [], isSortLocally = false, sorted = {} } = {}) {
    super();

    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.url = url;
    this.isSortLocally = isSortLocally;   
    
    this.render();
  }
  
  async render() {
    this.appendHeaderElements(this.headerConfig, this.sorted);
    
    return this.sort(this.sorted.id, this.sorted.order);
  }

  sortOnClient(id, order) {
    const headerColumn = this.headerConfig.find(h => h.id == id);

    if (!headerColumn) {
      return;
    }

    this.sorted = { id, order };

    const sortFunction = order === BaseSortableTable.ORDER_DESC
      ? (row1, row2) => compare(row2[id], row1[id], headerColumn.sortType)
      : (row1, row2) => compare(row1[id], row2[id], headerColumn.sortType);

    return this.data.sort(sortFunction);
  }

  async sortOnServer(id, order) {
    this.sorted = { id, order };

    const start = 0;
    const end = start + SortableTable.DEFAULT_PAGE_SIZE;

    return this.#fetchData(id, order, start, end);
  }

  destroy() {
    super.destroy();

    this.headerConfig = null;
    this.data = null;
    this.sorted = null;
    this.url = null;
    this.isSortLocally = null;
  }

  async sort(field = '', order = 'asc') {
    super.sort(field, order);

    this.showLoading();

    if (this.isSortLocally) {
      return this.loadData(SortableTable.DEFAULT_PAGE_SIZE, 0)
        .then(data => {
          this.data = data;
          return this.sortOnClient(field, order);
        })
        .then(data => this.#updateTableData(data))
        .catch(err => {
          console.log(err);
        });
    } else {
      return this.sortOnServer(field, order)
      .then(data => this.#updateTableData(data));
    } 
  }

  async loadData(take, skip) {
    const end = skip + take;

    return this.#fetchData(this.sorted.id, this.sorted.order, skip, end);
  }

  //
  // private

  #updateTableData(data){
    this.data = data;
    this.updateBody();
    this.hideLoading();
  }

  async #fetchData(sortColumnId, order, start, end) {
    const endpointUrl = new URL(this.url, BACKEND_URL);

    endpointUrl.searchParams.set('_sort', sortColumnId);
    endpointUrl.searchParams.set('_order', order);
    endpointUrl.searchParams.set('_start', start);
    endpointUrl.searchParams.set('_end', end);

    return await fetchJson(endpointUrl);
  }
}
