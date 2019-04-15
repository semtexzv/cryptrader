import {LitElement, html, property, customElement, TemplateResult, PropertyValues} from 'lit-element';

import * as api from '../util/api';
import {CustomElement, navigate} from "../util/notify";
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
        api.postOne("strategies", {
            name: this.newName,
            body: ""
        }).then(e => {
            window.location.href = `/app/strategies/${e.id}`
        });
    }


    item(o): TemplateResult {
        var link = `/app/strategies/${o.id}`;
        return html`fs
        <tr>
        <td>${o.name}</td>
        <td>${o.created}</td>
        <td><a class="btn btn-primary"  href="${link}" @click="${(e) => navigate(link)}" >Detail</a></td>
        </tr>
`
    }


    form(): TemplateResult {
        return html`
<tr>
<td>
    <input id="strategyname" name="name" type="text" class="form-control" .value="${this.newName}" @input="${(e) => this.handleText(e)}">
     </td>
        <td></td>
        <td><button class="btn btn-primary " @click="${this.submitNew}">Create new</button></td>
        </tr>
        `
    }

    ok(): TemplateResult {
        return html`
<div class="card">
<div class="card-header">
    <h3>User strategies</h3>
</div>
<div class="card-body">
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        ${this.form()}
        ${this.strategies.map(this.item)}
        </tbody>
    </table>
</div>
</div>


<div class="card">
<div class="card-header">
    <h3>Evaluations</h3>
</div>
<div class="card-body">
    asda
</div>
</div>
        
`
    }

    loading(): TemplateResult {
        return html`<div>Not yet loaded</div>`
    }

    protected render(): TemplateResult {
        return html`${this.strategies != null ? this.ok() : this.loading()}`

    }
}