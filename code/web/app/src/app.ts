import './util/api'
import './util/ace-editor'
import './util/notify.ts'

import './auth/auth-block.ts'

import './strategies/detail'
import './strategies/list'

import './assignments/list'
import './traders/list'


import {customElement, html, LitElement, TemplateResult} from "lit-element";
import {routerMixin} from 'lit-element-router';
import CustomElement from "./util/notify";

/*
const outlet = document.getElementById('outlet');
const router: Router = new Router(outlet);

router.setRoutes([
    {path: "/app", component: "app-root"},
    {path: "/app/login", component: "auth-block"},
    {path: '/app/strategies/:strat_id', component: 'strategy-detail'},
    {path: '/app/strategies', component: 'strategy-list'},
    {path: '/app/assignments', component: 'assignment-list'},
    {path: '/app/traders', component: 'trader-list'},
]);
*/

@customElement("app-home")
class AppHome extends LitElement {

    protected render(): TemplateResult | void {
        return html`Root`;
    }
}


@customElement("app-root")
class AppRoot extends routerMixin(CustomElement) {

    route: string = '';
    params: any = null;
    elem: any = null;

    static routes = [
        {name: 'app-home', pattern: '/app'},
        {name: 'auth-block', pattern: '/app/login'},
        {name: 'strategy-list', pattern: '/app/strategies'},
        {name: 'strategy-detail', pattern: '/app/strategies/:strat_id'},
        {name: 'assignment-list', pattern: '/app/assignments'},
        {name: 'trader-list', pattern: '/app/traders'},
    ];


    onRoute(route, params, query, data) {
        console.log(route, params, query, data);
        this.route = route;
        this.params = params;
        this.elem = document.createElement(route);
        for (let k in params) {
            this.elem.setAttribute(k, params[k])
        }
    }

    render() {
        return html`
        ${this.elem}
        `
    }
}
