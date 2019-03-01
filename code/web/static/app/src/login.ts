import {LitElement, html, property, customElement, TemplateResult} from 'lit-element';


@customElement("login-form")
export class Login extends LitElement {
    @property() email = "";
    @property() password = "";

    onEmail(e) {
        this.email = e.currentTarget.value
    }

    onPw(e) {
        this.password = e.currentTarget.value
    }

    protected render(): TemplateResult | void {
        return html`
<div class="login-form">
    <form method="POST" action="/users/login/">
        <h2 class="text-center">Log in</h2>
        <input class="form-control" 
            type="text" name="email"
            value="${this.email}" 
            @changed="${e => this.onEmail(e)}">
        <input class="form-control" 
            type="password" 
            name="password" 
            value="${this.password}" 
            @changed="${e => this.onPw(e)}">
        <input class="form-control btn btn-primary" type="submit" value="Log in">
    </form>
</div>

`
    }
}