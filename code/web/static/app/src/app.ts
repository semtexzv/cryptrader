import './util/api'
import './util/ace-editor'
import './util/notify.ts'

import './login.ts'
import './signup.ts'

import './strategies/detail'
import './strategies/list'


/*
const outlet = document.getElementById('outlet');
const router: Router = new Router(outlet);

@customElement("app-home")
class AppHome extends LitElement {

    protected render(): TemplateResult | void {
        return html`Root`;
    }
}

router.setRoutes([
    {path: "/", component: "app-home"},
    {path: '/strategies', component: 'strategy-list' },
    {path: '/strategies/:id', component: 'strategy-detail'},
    {path: '/assignments', component: 'assignment-list'},
    {path: '/traders', component: 'trader-list'},
    {path: '(.*)', component: 'x-not-found-view'},
]);

*/