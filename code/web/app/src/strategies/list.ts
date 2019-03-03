import {LitElement, html, property, customElement, TemplateResult, PropertyValues} from 'lit-element';

import * as api from '../util/api';
import CustomElement from "../util/notify";
import {repeat} from "lit-html/lib/repeat";

@customElement("strategy-list")
export class Detail extends CustomElement {


    @property({type: Array}) strategies = null;

    @property({type: String}) newName = null;

    async load() {
        this.strategies = await api.getAll('strategies')
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.load();
    }

    handleText(e) {
        this.newName = e.target.value;
    }

    submitNew(e) {
        api.postOne("strategies",{
            name : this.newName,
            body: ""
        }).then(e => {
            window.location.href = `/strategies/${e.id}`
        });
    }


    item(o): TemplateResult {
        return html`
        <tr>
        <td>${o.name}</td>
        <td>${o.created}</td>
        <td><a href="/app/strategies/${o.id}">Detail</a></td>
        </tr>
`
    }

    form(): TemplateResult {
        return html`
        <div style="display: inline-block;">
        <input name="name" type="text" .value="${this.newName}" @input="${(e) => this.handleText(e)}">
        <button @click="${this.submitNew}">Create new</button>
        </div>
        `
    }

    ok(): TemplateResult {
        return html`
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        ${this.strategies.map(this.item)}
        </tbody>
    </table>
       ${this.form()}
        
`
    }

    loading(): TemplateResult {
        return html`<div>Not yet loaded</div>`
    }

    protected render(): TemplateResult {
        return html`${this.strategies != null ? this.ok() : this.loading()}`

    }
}