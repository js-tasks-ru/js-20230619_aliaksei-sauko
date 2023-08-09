import Sidebar from "../../common/sidebar-component.js";
import { generateElement } from "../../common/helpers/element-helper.js";

import Page from "./index.js";

const ROOT_SITE_PATH = "/10-routes-browser-history-api/1-dashboard-page";

const items = [
    {
        id: "dashboard",
        title: "Dashboard",
        link: "/",
    },
    {
        id: "products",
        title: "Products",
        link: "/products",
    },
    {
        id: "categories",
        title: "Categories",
        link: "/categories",
    },
    {
        id: "sales",
        title: "Sales",
        link: "/sales",
    },
];

const pageRenders = [
    {
        id: "dashboard",
        renderElement: () => {
            const page = new Page();

            return page.element;
        },
    },
];

function getPageItem(pathname) {
    let path = pathname.replace(ROOT_SITE_PATH, "");

    if (path.startsWith("/")) {
        path = path.substring(1);
    }

    return items.find((item) => path.startsWith(item.id));
}

function getElementRender(id) {
    const render = pageRenders.find((render) => render.id === id);

    if (render) {
        return render.renderElement;
    }

    return () => {
        return generateElement('<div />');
    };
}

const renderContent = (e) => {
    const render = getElementRender(e.detail.itemId);
    const element = render();

    const contentNode = document.querySelector("#content");
    contentNode.innerHTML = '';
    contentNode.append(element);
};

function getMainTemplate() {
    return `<main class="main">
                <div class="progress-bar">
                  <div class="progress-bar__line"></div>
                </div>
                <div id="sidebar"></div>
                <section class="content" id="content"></section>
            </main>`;
}

function initialize() {
    const mainElement = generateElement(getMainTemplate());
    document.body.append(mainElement);

    const homepageId = 'dashboard';
    const sidebar = new Sidebar({
        homepage: { id: homepageId, link: ROOT_SITE_PATH, title: "shop admin" },
        items,
        activeId: getPageItem(window.location.pathname)?.id || '',
    });

    const sidebarNode = document.querySelector("#sidebar");
    sidebarNode.append(sidebar.element);

    sidebarNode.addEventListener("nav-click", renderContent, { bubbles: true });
    sidebarNode.dispatchEvent(new CustomEvent('nav-click', { bubbles: true, detail: { itemId: homepageId } }))
}

initialize();
