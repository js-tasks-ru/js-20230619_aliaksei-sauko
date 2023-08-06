import Component, { generateElement } from '../../common/component.js';

export default class SortableList extends Component {
    #draggableItemElement = null;
    #placeholderElement = null;

    #shiftX = null;
    #shiftY = null;

    constructor({ items } = {}) {
        super();

        this.items = items;

        this.render();
    }

    render() {
        const listElement = generateElement(this.#getTemplate());

        this.items.forEach(item => {
            item.classList.add('sortable-list__item');

            listElement.append(item);
        });

        this.element = listElement;

        this.#addHandlers();
    }

    destroy() {
        super.destroy();

        this.remove();
    }

    remove() {
        this.#removeHandlers();

        this.element?.remove();
    }

    //
    // private

    #renderPlaceholderElement(width, height) {
        this.#placeholderElement = generateElement(this.#getPlaceholderTemplate());
        this.#placeholderElement.style.display = 'none';

        this.#placeholderElement.style.height = height + 'px';
        this.#placeholderElement.style.width = width + 'px';
    }

    #addHandlers() {
        this.element.addEventListener('pointerdown', this.#handlerDeleteClick, { bubbles: true });
        this.element.addEventListener('pointerdown', this.#handlerListItemMouseDown, { bubbles: true });
        this.element.addEventListener('dragstart', this.#handlerDragStart, { bubbles: true });
    }

    #removeHandlers() {
        this.element?.removeEventListener('pointerdown', this.#handlerDeleteClick);
        this.element?.removeEventListener('pointerdown', this.#handlerListItemMouseDown);
        this.element?.removeEventListener('dragstart', this.#handlerDragStart);
    }

    #elementMoveAt = (clientX, clientY) => {
        this.#draggableItemElement.style.left = clientX - this.#shiftX + 'px';
        this.#draggableItemElement.style.top = clientY - this.#shiftY + 'px';
    }

    #handlerListItemMouseDown = (e) => {
        if (!e.target.dataset.hasOwnProperty('grabHandle')) {
            return;
        }

        const itemElement = this.#getCurrentListItemElement(e.target);
        if (!itemElement) {
            return;
        }

        this.#draggableItemElement = itemElement;

        const itemElementRect = this.#draggableItemElement.getBoundingClientRect();
        this.#shiftX = e.clientX - itemElementRect.x;
        this.#shiftY = e.clientY - itemElementRect.y;

        this.#renderPlaceholderElement(itemElementRect.width, itemElementRect.height);

        this.#draggableItemElement.style.width = itemElementRect.width + 'px';
        this.#draggableItemElement.style.height = itemElementRect.height + 'px';

        if (this.element.lastElementChild === itemElement) {
            this.#draggableItemElement.previousSibling.insertAdjacentElement('afterend', this.#placeholderElement);
        } else {
            this.#draggableItemElement.nextSibling.insertAdjacentElement('beforebegin', this.#placeholderElement);
        }

        this.#draggableItemElement.classList.add('sortable-list__item_dragging');

        this.#placeholderElement.style.display = ''; // show placeholder

        this.#elementMoveAt(e.clientX, e.clientY);

        document.addEventListener('pointermove', this.#handlerMouseMove);
        this.#draggableItemElement.addEventListener('pointerup', this.#handlerMouseUp);
    }

    #handlerMouseMove = (e) => {
        this.#elementMoveAt(e.clientX, e.clientY);

        this.#draggableItemElement.style.display = 'none';
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        this.#draggableItemElement.style.display = '';

        if (!elementBelow) {
            return;
        }

        const droppableBelow = elementBelow.closest('.sortable-list__item');
        if (!droppableBelow) {
            return;
        }

        const droppableBelowPosition = droppableBelow.getBoundingClientRect().top;
        const placeholderElementPosition = this.#placeholderElement.getBoundingClientRect().top;

        if (placeholderElementPosition > droppableBelowPosition) {
            droppableBelow.insertAdjacentElement('beforebegin', this.#placeholderElement);
        } else {
            droppableBelow.insertAdjacentElement('afterend', this.#placeholderElement);
        }
    }

    #handlerDragStart = (e) => {
        if (!e.target.dataset.hasOwnProperty('grabHandle')) {
            return;
        }

        e.preventDefault();
    }

    #handlerMouseUp = (e) => {
        document.removeEventListener('pointermove', this.#handlerMouseMove);
        e.target.removeEventListener('pointerup', this.#handlerMouseUp);

        this.#placeholderElement.insertAdjacentElement('afterend', this.#draggableItemElement);
        this.#placeholderElement.remove();
        this.#draggableItemElement.classList.remove('sortable-list__item_dragging');
        this.#draggableItemElement.style = '';

        this.#placeholderElement = null;
        this.#draggableItemElement = null;
    }


    #handlerDeleteClick = (e) => {
        if (!e.target.dataset.hasOwnProperty('deleteHandle')) {
            return;
        }

        const itemElement = this.#getCurrentListItemElement(e.target);
        if (!itemElement) {
            return;
        }

        itemElement.remove();
    }

    #getCurrentListItemElement(target) {
        const itemElements = this.element.querySelectorAll('li');

        for (let i = 0; i < itemElements.length; i++) {
            const element = itemElements[i];
            if (!element.contains(target)) {
                continue;
            }

            return element;
        }

        return null;
    }

    //
    // templates

    #getTemplate() {
        return `<ul class='sortable-list'></ul>`;
    }

    #getPlaceholderTemplate() {
        return `<div class='sortable-list__placeholder'></div>`;
    }
}
