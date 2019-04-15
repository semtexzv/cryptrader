import {LitElement, html, property, customElement, TemplateResult} from 'lit-element';
import { CustomElement } from "../util/notify";


@customElement("auth-form")
export class Login extends CustomElement {
    @property() email = "";
    @property() password = "";

    @property({type: String}) mode = "login";

    protected render(): TemplateResult | void {
        return html`
<div class="login-form">
    <form method="POST" action="/users/${this.mode}/">
        <h2 class="text-center">${this.mode == 'login' ? 'Log in' : 'Sign up'}</h2>
        <input class="form-control"
            type="text" name="email"
            value="${this.email}" 
            @changed="${e => this.email = e.currentTarget.value}">
        <input class="form-control" 
            type="password" 
            name="password" 
            value="${this.password}" 
            @changed="${e => this.password = e.currentTarget.value}">
        <input class="form-control btn btn-primary" type="submit" value="${this.mode == 'login' ? 'Log in' : 'sign up'}">
    </form>
</div>

`
    }
}

@customElement("auth-block")
class AuthBlock extends LitElement {
    protected render(): TemplateResult | void {
        return html`<auth-form .mode="${'login'}"></auth-form> <auth-form .mode="${'signup'}"></auth-form>`;
    }
}