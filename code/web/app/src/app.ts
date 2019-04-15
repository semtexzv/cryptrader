import './util/api'
import './util/ace-editor'
import './util/notify.ts'

import './auth/auth-block.ts'
import './auth/auth-nav-item'

import './strategies/detail'
import './strategies/list'

import './assignments/list'
import './traders/list'


import {customElement, html, LitElement, property, TemplateResult} from "lit-element";
import {routerMixin} from 'lit-element-router';
import {CustomElement, navigate} from "./util/notify";


@customElement("app-home")
class AppHome extends CustomElement {

    protected render(): TemplateResult | void {
        return html`
<div class="row">
    <div class="col-md-6">
    <div class="card">
        <div class="card-header">
            <h3>Latest evaluations</h3>
        </div>
        <div class="card-body">
            asda
        </div>
    </div>
    </div>
     <div class="col-md-6">
    <div class="card">
        <div class="card-header">
            <h3>Latest trades</h3>
        </div>
        <div class="card-body">
            asda
        </div>
    </div>
    </div>

</div>
`;
    }
}

// @ts-ignore
@customElement("app-nav")
class AppNav extends CustomElement {


    protected render(): TemplateResult | void {

        var clickListener = (e) => {
            e.preventDefault();
            // @ts-ignore
            navigate(e.target.href);
        };

        var activeClass = (i) => {
            return ''
        };

        return html`
        <ul class="nav">
                <li class="nav-item ${activeClass(0)}">
                    <a class="nav-link" href="/app/" text="Home" @click="${clickListener}">
                    <i class="material-icons">dashboard</i>
                        Home
                    </a>
                </li>
                <li class="nav-item ${activeClass(1)}">
                    <a class="nav-link" href="/app/strategies" @click="${clickListener}">
                    <i class="material-icons">code</i>
                        Strategies
                    </a>
                </li>
                <li class="nav-item ${activeClass(2)}">
                    <a class="nav-link" href="/app/assignments" @click="${clickListener}" >
                    <i class="material-icons">assignment</i>
                        Assignments
                    </a>
                </li>
                <li class="nav-item ${activeClass(3)}">
                    <a class="nav-link" href="/app/traders" @click="${clickListener}" >
                    <i class="material-icons">account_balance</i>
                        Trader account
                    </a>
                </li>
                <!-- your sidebar here -->
            </ul>
`;
    }
}

// @ts-ignore
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
<div class="wrapper" id="wrapper">
    <div class="sidebar" data-color="purple" data-background-color="white">
        <div class="logo">
            <a href="#" class="simple-text logo-mini">
                Trader
            </a>

        </div>
        <div class="sidebar-wrapper">
            <app-nav/>
        </div>
    </div>
    <div class="main-panel">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
            <div class="container-fluid">

                <div class="navbar-wrapper">
                    <a class="navbar-brand" href="#pablo">${this.route}</a>
                    <!-- todo- auth button here -->
                </div>

                <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="navbar-toggler-icon icon-bar"></span>
                    <span class="navbar-toggler-icon icon-bar"></span>
                    <span class="navbar-toggler-icon icon-bar"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end">

                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <auth-nav-item/>
                            </li>
                        </ul>

                </div>
            </div>
        </nav>
        <!-- End Navbar -->
        <div class="content">
            <div class="container-fluid">
            ${this.elem}
            </div>
        </div>
        <footer class="footer">
            <div class="container-fluid">
                <nav class="float-left">
                    <ul>
                        <li>
                            <a href="https://www.creative-tim.com">
                                Theme by Creative Tim
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    </div>
</div>

        `
    }
}
