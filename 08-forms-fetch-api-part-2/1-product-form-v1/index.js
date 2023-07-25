import Component from '../../common/component.js';
import { generateElement } from '../../common/helpers/element-helper.js';
import ApiService from '../../common/services/api-service.js';
import escapeHtml from './utils/escape-html.js';


export default class ProductForm extends Component {
  constructor(productId, options = {}) {
    super();

    const { apiService = new ApiService(), } = options;
    this.apiService = apiService;

    this.productId = productId;
  }

  async render() {
    const formElement = generateElement(ProductForm.fillTemplate());
    this.element = formElement;

    const categories = await this.apiService.getCategories();
    this.#fillCategories(categories);

    if (this.productId) {
      this.apiService
        .getProduct(this.productId)
        .then(product => {
          this.#fillForm(product[0]);
        })
        .catch(error => { console.log(error.message); });
    }

    this.#addEventListeners();

    return this.element;
  }

  destroy() {
    this.remove();

    this.apiService = null;
  }

  remove() {
    this.#removeEventListeners();

    this.element.remove();
  }

  async save() {
    const product = { images: [] };

    const imageElements = this.subElements.imageListContainer.querySelectorAll('.products-edit__imagelist-item');
    imageElements.forEach((el) => {
      product.images.push(
        {
          source: el.querySelector('[name="source"]').value,
          url: el.querySelector('[name="url"]').value
        });
    });

    const productFormData = new FormData(this.subElements.productForm);
    for (const [name, value] of productFormData) {
      if (name === 'url' || name === 'source') {
        continue;
      }
      product[name] = escapeHtml(value);
    }

    if (this.productId) {
      product.id = this.productId;
      await this.apiService.updateProduct(product);
      const productUpdatedEvent = new CustomEvent('product-updated');
      this.element.dispatchEvent(productUpdatedEvent);

      return;
    }

    const productResult = await this.apiService.addProduct(product);
    const productSavedEvent = new CustomEvent('product-saved', productResult);
    this.element.dispatchEvent(productSavedEvent);
  }


  //
  // private 

  #fillCategories(categories) {
    const subCategoryElement = this.element.querySelector('[name="subcategory"]');

    categories.forEach(category => {
      category.subcategories?.forEach(sc => subCategoryElement.append(new Option(`${category.title} > ${sc.title}`, sc.id)));
    });
  }

  #fillForm(product) {
    for (const key in product) {
      if (Object.hasOwnProperty.call(product, key)) {
        const formElement = this.subElements.productForm.elements[key];
        if (key === 'images') {
          product[key].forEach((image) => {
            this.#appendImageElement(image.url, image.source);
          });

          continue;
        }

        if (formElement) {
          formElement.value = product[key];
        }
      }
    }
  }

  #addEventListeners() {
    this.#addUploadImageEventListeners();

    const submitElement = this.element.querySelector('button[type="submit"]');
    submitElement.addEventListener('click', this.#handleSubmitClick);

    this.subElements.imageListContainer.addEventListener('click', this.#handleRemoveImageClick, { bubbles: true });
  }

  #removeEventListeners() {
    this.#removeUploadImageEventListeners();

    const submitElement = this.element.querySelector('button[type="submit"]');
    submitElement.removeEventListener('click', this.#handleSubmitClick);

    this.subElements.imageListContainer.removeEventListener('click', this.#handleRemoveImageClick);
  }

  #appendImageElement(link, name) {
    const imageElement = generateElement(ProductForm.fillSortableListItemTemplate(link, name));
    this.subElements.imageListContainer.firstElementChild.append(imageElement);
  }

  // 
  // upload images

  #addUploadImageEventListeners() {
    const uploadImageElement = this.element.querySelector('#uploadImage');
    uploadImageElement.addEventListener('change', this.#hadnleUploadImageChange);

    const selectImageFileElement = this.element.querySelector('#selectImage');
    selectImageFileElement.addEventListener('click', this.#handleSelectImageFileClick);
  }

  #removeUploadImageEventListeners() {
    const uploadImageElement = this.element.querySelector('#uploadImage');
    uploadImageElement.removeEventListener('change', this.#hadnleUploadImageChange);

    const selectImageFileElement = this.element.querySelector('#selectImage');
    selectImageFileElement.removeEventListener('click', this.#handleSelectImageFileClick);
  }

  #handleSelectImageFileClick = (e) => {
    const uploadImageElement = e.target.getRootNode().querySelector('#uploadImage');

    if (!uploadImageElement) {
      return;
    }

    uploadImageElement.click();
  }

  #hadnleUploadImageChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];
      const result =// { success: true, data: { link: reader.result } }; //
        await this.apiService.sendImage(base64Image);

      if (result?.success) {
        this.#appendImageElement(result.data.link, selectedFile.name);
      }
    };

    reader.onerror = () => {
      console.log(reader.error);
    };
  }

  #handleRemoveImageClick = (e) => {
    const imageItem = e.target.closest('.products-edit__imagelist-item');

    if (!imageItem || !this.subElements.imageListContainer.contains(imageItem)) {
      return;
    }

    imageItem.remove();
  }

  //
  // form submit

  #handleSubmitClick = async (e) => {
    await this.save();
  }

  //
  // static

  static fillTemplate() {
    return `<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">

          </ul>
        </div>
        <input type="file" id="uploadImage" accept="image/*" style="display:none"></input>
        <button id='selectImage' type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id='subcategory' class="form-control" name="subcategory">
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`;
  }

  static fillSortableListItemTemplate(url, title) {
    return `<li class="products-edit__imagelist-item sortable-list__item" name="images" style="">
              <input type="hidden" name="url" value="${url}">
              <input type="hidden" name="source" value="${title}">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="${url}">
                <span>${title}</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button>
            </li>`;
  }
}
