import Sidebar from "../../common/sidebar-component.js";
import { generateElement } from "../../common/helpers/element-helper.js";
import { pick } from "../../common/helpers/object-helper.js";


const ROOT_SITE_PATH = "/10-routes-browser-history-api/1-dashboard-page";

export default class Application {
    #components = {};
    #pages = [];

    constructor({ pages = [] }) {
        this.#pages = pages;
    }

    render() {
        const mainElement = generateElement(this.#getMainTemplate());
        document.body.append(mainElement);

        this.#renderSidebar();
    }

    destroy() {
        const sidebarNode = document.querySelector("#sidebar");
        sidebarNode.removeEventListener("nav-click", this.#renderContent);

        this.#destroyComponents();
    }

    //
    // private

    #destroyComponents() {
        for (const component in this.#components) {
            if (this.#components.hasOwnProperty(component)) {
                const element = this.#components[component];

                element.destroy();
            }
        }
    }

    #renderSidebar() {
        const pagesOptions = this.#pages.map(page => pick(page, 'id', 'title', 'link'));
        const homepageId = 'dashboard';

        this.#components.sidebar = new Sidebar({
            homepage: { id: homepageId, link: ROOT_SITE_PATH, title: "shop admin" },
            items: pagesOptions,
            activeId: this.#getPageItem(window.location.pathname)?.id || '',
        });

        const sidebarNode = document.querySelector("#sidebar");
        sidebarNode.append(this.#components.sidebar.element);

        sidebarNode.addEventListener("nav-click", this.#renderContent, { bubbles: true });
        sidebarNode.dispatchEvent(new CustomEvent('nav-click', { bubbles: true, detail: { itemId: homepageId } }));
    }

    #renderContent = (e) => {
        const render = this.#getElementRender(e.detail.itemId);
        const element = render();

        const contentNode = document.querySelector("#content");
        contentNode.innerHTML = '';
        contentNode.append(element);
    };

    #getElementRender(id) {
        const page = this.#pages.find(page => page.id === id);

        if (page?.hasOwnProperty('renderElement')) {
            return page.renderElement;
        }

        return () => {
            return generateElement('<div />');
        };
    }

    #getPageItem(pathname) {
        let path = pathname.replace(ROOT_SITE_PATH, "");

        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        return this.#pages.find(page => path.startsWith(page.id));
    }

    //
    // templates

    #getMainTemplate() {
        return `<main class="main">
                    <div class="progress-bar">
                      <div class="progress-bar__line"></div>
                    </div>
                    <div id="sidebar"></div>
                    <section class="content" id="content"></section>
                </main>`;
    }
}
