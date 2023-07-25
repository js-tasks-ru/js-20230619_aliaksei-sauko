import fetchJson from "../../08-forms-fetch-api-part-2/1-product-form-v1/utils/fetch-json.js";

// TODO: use environment variables
const BACKEND_URL = 'https://course-js.javascript.ru';
const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com';

export default class ApiService {

    constructor(options = {}) {

        const {
            clientid = IMGUR_CLIENT_ID,
            backendUrl = BACKEND_URL,
        } = options;

        this.clientId = clientid;
        this.backendUrl = backendUrl;
    }

    async getCategories() {
        const categoriesEndpoint = '/api/rest/categories';

        const endpointUrl = new URL(categoriesEndpoint, BACKEND_URL);

        endpointUrl.searchParams.set('_sort', 'weight');
        endpointUrl.searchParams.set('_refs', 'subcategory');

        return await fetchJson(endpointUrl);
    }

    async sendImage(base64Image) {
        const sendImageEndpoint = '/3/image';
        const sendImageUrl = new URL(sendImageEndpoint, IMGUR_URL);

        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('type', 'base64');

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${this.clientId}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData,
        };

        return await fetchJson(sendImageUrl, options);
    }

    async getProduct(productId) {
        const productsEndpoint = '/api/rest/products';

        const endpointUrl = new URL(productsEndpoint, BACKEND_URL);
        endpointUrl.searchParams.set('id', productId);

        const options = {
            method: 'GET',
        };

        return await fetchJson(endpointUrl, options);
    }

    async addProduct(product) {
        const productsEndpoint = '/api/rest/products';

        const endpointUrl = new URL(productsEndpoint, BACKEND_URL);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: product
        };

        return await fetchJson(endpointUrl, options);
    }

    async updateProduct(product) {
        const productsEndpoint = '/api/rest/products';

        const endpointUrl = new URL(productsEndpoint, BACKEND_URL);
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: product
        };

        return await fetchJson(endpointUrl, options);
    }
}
