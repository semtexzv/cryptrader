import './util/api'
import './util/ace-editor'
import './util/notify.ts'

import './auth/auth-block.ts'

import './strategies/detail'
import './strategies/list'

import './assignments/list'

import './traders/list'



import {customElement, html, LitElement, TemplateResult} from "lit-element";

import {Router} from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router: Router = new Router(outlet);

@customElement("app-home")
class AppHome extends LitElement {

    protected render(): TemplateResult | void {
        return html`Root`;
    }
}

router.setRoutes([
    {path: "/app", component: "app-root"},
    {path: "/app/login", component: "auth-block"},
    {path: '/app/strategies/:id', component: 'strategy-detail'},
    {path: '/app/strategies', component: 'strategy-list'},
    {path: '/app/assignments', component: 'assignment-list'},
    {path: '/app/traders', component: 'trader-list'},
    {path: '(.*)', component: 'x-not-found-view'},
]);


@customElement("app-root")
class AppRoot extends LitElement {


    protected render(): TemplateResult | void {
        return html`<div id="root"></div>`;
    }
}
