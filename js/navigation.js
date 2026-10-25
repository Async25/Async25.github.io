// Hash navigation for regular pages and project detail pages.
class Navigation {
    constructor() {
        this.currentPage = 'home';
        window.navigation = this;
        this.setupNavigation();
        this.setupHashNavigation();
    }

    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                this.navigateToPage(link.dataset.page);
            });
        });
    }

    setupHashNavigation() {
        const route = window.location.hash.slice(1);
        if (route) this.route(route);
        window.addEventListener('hashchange', () => this.route(window.location.hash.slice(1) || 'home'));
    }

    route(route) {
        const projectMatch = /^project-(\d+)$/.exec(route);
        if (projectMatch && window.projectsManager) {
            window.projectsManager.showDetail(Number(projectMatch[1]), false);
            return;
        }
        this.navigateToPage(route || 'home', null, false);
    }

    navigateToPage(page, hash = page, updateHash = true) {
        const targetPage = page === 'project-detail' ? 'project-detail' : page;
        const nextPageEl = document.getElementById(`page-${targetPage}`);
        if (!nextPageEl) return;
        const currentPageEl = document.getElementById(`page-${this.currentPage}`);
        if (currentPageEl && currentPageEl !== nextPageEl) currentPageEl.classList.remove('active');
        nextPageEl.classList.add('active');
        this.currentPage = targetPage;
        document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === targetPage));
        const nav = document.querySelector('.main-nav');
        if (nav) nav.style.display = targetPage === 'home' ? 'none' : 'flex';
        if (updateHash && hash && window.location.hash.slice(1) !== hash) window.location.hash = hash;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => { new Navigation(); });
