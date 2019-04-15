import * as api from '../util/api'
import {CustomElement} from "../util/notify";
import {html, TemplateResult} from "lit-html";
import {customElement} from "lit-element";


@customElement("auth-nav-item")
export class AuthNavItem extends CustomElement {

    protected render(): TemplateResult | void {
        return html`<a class="nav-link" href="#" @click="${(e) => {
            console.log("Logging out")
        }}">Logout</a>`;
    }
}