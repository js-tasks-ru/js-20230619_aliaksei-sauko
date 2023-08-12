import Component from "./component.js";
import { generateElement } from "./helpers/element-helper.js";

export default class Sidebar extends Component {
    homepageOptions;
    defaultActiveItem;
    items = [];
    activeId;

    constructor({ homepageOptions = { id: '', link: '', title: '' }, items = [], activeId = '' }) {
        super();

        this.items = items;
        this.homepageOptions = homepageOptions;
        this.activeId = activeId;
        this.defaultActiveItem = this.items.find(item => item.id === this.homepageOptions.id);

        this.render();
    }

    render() {
        const element = generateElement(this.#getMainTemplate(this.homepageOptions.link, this.homepageOptions.title));

        this.element = element;

        this.#renderNav(this.items);

        this.#addHandlers();

        const activeItem = this.items.find(item => item.id === this.activeId);
        const activeItemId = activeItem ? this.activeId : this.defaultActiveItem.id;

        this.setActive(activeItemId);
    }

    destroy() {
        this.#removeHandlers();

        super.destroy();
    }

    setActive(id) {
        this.items.forEach(item => {
            item.isActive = item.id === id;
            if (!item.isActive) {
                return;
            }

            const navClickEvent = new CustomEvent('nav-click', { bubbles: true, detail: { itemId: item.id } });
            this.element.dispatchEvent(navClickEvent);

            const title = item.title;
            const url = item.id === this.homepageOptions.id ? this.homepageOptions.link : `${this.homepageOptions.link}/${item.id}`;
            window.history.pushState(null, title, url);
            document.title = title;
        });

        this.#updateNav(this.items);
    }


    //
    // private

    #renderNav(items = []) {
        const navElement = this.element.querySelector('.sidebar__nav');

        items.forEach(({ link, id, title, isActive }) => {
            const itemElement = generateElement(this.#getItemTemplate({ link, id, title, isActive }));
            navElement.append(itemElement);
        });
    }

    #updateNav(items = []) {
        const itemElements = this.subElements.navigation.querySelectorAll('li');
        itemElements.forEach(element => {
            const pageId = element.querySelector('[data-page]')?.dataset.page;
            const itemData = items.find(item => item.id === pageId);

            element.classList.remove('active');
            if (itemData.isActive) {
                element.classList.add('active');
            }
        });
    }


    #addHandlers() {
        const togglerElement = this.element.querySelector('button.sidebar__toggler');
        console.log(togglerElement);

        togglerElement.addEventListener('click', this.#handlerTogglerClick);

        const sidebarNavElement = this.element.querySelector('.sidebar__nav');
        sidebarNavElement.addEventListener('click', this.#handlerPageLinkClick, { bubbles: true });

        const homepageLinkElement = this.element.querySelector('.sidebar__title a');
        homepageLinkElement.addEventListener('click', this.#handlerTitleClick, { bubbles: true });
    }

    #removeHandlers() {
        const togglerElement = this.element.querySelector('button.sidebar__toggler');
        togglerElement.removeEventListener('click', this.#handlerTogglerClick);

        const sidebarNavElement = this.element.querySelector('.sidebar__nav');
        sidebarNavElement.removeEventListener('click', this.#handlerPageLinkClick);

        const titleLinkElement = this.element.querySelector('.sidebar__title a');
        titleLinkElement.removeEventListener('click', this.#handlerTitleClick);
    }

    #handlerTogglerClick = (e) => {
        if (document.body.classList.contains('is-collapsed-sidebar')) {
            document.body.classList.remove('is-collapsed-sidebar');
        } else {
            document.body.classList.add('is-collapsed-sidebar');
        }
    }

    #handlerTitleClick = (e) => {
        const titleElement = e.target.closest('.sidebar__title a');
        if (!titleElement) {
            return;
        }

        e.preventDefault();

        this.setActive(this.homepageOptions.id);
    }

    #handlerPageLinkClick = (e) => {
        const pageLinkElement = e.target.closest('[data-page]');
        if (!pageLinkElement) {
            return;
        }

        e.preventDefault();

        this.setActive(pageLinkElement.dataset.page);
    }


    //
    // templates

    #getItemTemplate({ link, id, title, isActive = false }) {
        return `<li ${isActive ? 'class="active"' : ''}>
                    <a href="${link}" data-page="${id}">
                        <i class="icon-${id}"></i> <span>${title}</span>
                    </a>
                </li>`;
    }

    #getMainTemplate(homeLink, homeTitle) {
        return `<aside class="sidebar" >
                <h2 class="sidebar__title">
                    <a href="${homeLink}">${homeTitle}</a>
                </h2>
                <ul class="sidebar__nav" data-element='navigation'>
                    
                </ul>
                <ul class="sidebar__nav sidebar__nav_bottom">
                    <li>
                        <button type="button" class="sidebar__toggler">
                            <i class="icon-toggle-sidebar"></i> <span>Toggle sidebar</span>
                        </button>
                    </li>
                </ul></aside>`;
    }
}