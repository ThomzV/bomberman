export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = this.getCurrentRoute();
        this.renderRoute();
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }

    getCurrentRoute() {
        const hash = window.location.hash.replace('#/', '');
        return hash ? `/${hash}` : '/'; // Ensure format matches routes
    }

    handleHashChange() {
        this.currentRoute = this.getCurrentRoute();
        this.renderRoute();
    }

    renderRoute() {
        const route = this.routes[this.currentRoute];
        if (typeof route === 'function') { // Ensure route is a function
            route(); // Call the rendering function
        } else {
            console.error(`Route not found: ${this.currentRoute}`);
        }
    }
    
    navigate(routeName) {
        window.location.hash = routeName;
    }
}