import {customElement, html, LitElement, property, TemplateResult} from "lit-element";
import * as api from '../util/api'
import { CustomElement } from "../util/notify";
import {Trader} from "../util/api";


let style = html` <style> :host { display: table-row; }  .td, ::content .td { display: table-cell; width: 50px;} </style>`;

@customElement("trader-list")
class TraderList extends CustomElement {
    @property() traders = [];
    @property() exchanges = [];

    async load() {
        this.traders = await api.getAll('traders');
        let pairs = await api.getAll('pairs');
        this.exchanges = [...new Set(pairs.map(p => p.exchange))];
    }


    connectedCallback(): void {
        super.connectedCallback();
        this.load();
    }

    thead(): TemplateResult {
        return html`
        <thead >
        <tr>
            <th>Name</th>
            <th>Exchange</th>
            <th>Key</th>
            <th>Secret</th>
            <th>Actions</th>
        </tr>
        </thead>
        `
    }

    item(t) {
        return html`
        ${style}
        <tr>
        <td>${t.name}</td>
        <td>${t.exchange}</td>
        <td>${t.api_key}</td>
        <td>Hidden</td>
        <td><button class="btn btn-danger">Delete</button></td>
        </tr>
        `
    }

    newTrader = new Trader();

    itemNew(): TemplateResult {

        let valid = (): Boolean => {
            return this.newTrader.api_secret != null && this.newTrader.api_key != null && this.newTrader.exchange != null;
        };

        let clicked = async (e) => {
            await api.postOne('traders', this.newTrader);
            this.newTrader = new Trader();
            await this.load();

            console.log(e)
        };

        let but = html`<button class="btn btn-primary" @click="${clicked}"  ?disabled="${!valid()}">Create new</button>`;

        let exchListener = (e) => {
            this.newTrader.exchange = e.target.options[e.target.selectedIndex].value
            this.requestUpdate()
        };

        let nameListener = (e) => {
            this.newTrader.name = e.target.value;
            this.requestUpdate()
        };

        let keyListener = (e) => {
            this.newTrader.api_key = e.target.value;
            this.requestUpdate()
        };

        let secretListener = (e) => {
            this.newTrader.api_secret = e.target.value;
            this.requestUpdate()
        };


        return html`
${style}
<td><input class="form-control" @input="${nameListener}" .value="${this.newTrader.name}"/></td>
<td>
    <select class="form-control" @change="${exchListener}" >
           <option value="" disabled selected>Select Exchange</option>
            ${this.exchanges.map(e => html`<option>${e}</option>`)}
    </select>
</td>
<td><input class="form-control" @input="${keyListener}" .value="${this.newTrader.api_key}"/></td>
<td><input class="form-control" @input="${secretListener}" .value="${this.newTrader.api_secret}"/>
</td>
${but}
`
    }


    tbody() {
        return html`
<tbody>
${this.itemNew()}
${this.traders.map(this.item)}
</tbody>
`
    }

    created(e) {
        console.log(e);
    }


    protected render(): TemplateResult | void {
        return html`
<div class="card">
<div class="card-header card-header-primary">
    <h3>Trader accounts</h3>
</div>
<div class="card-body">
    <table id="traders" class="table">
    ${this.thead()}
    ${this.tbody()}
</table>
</div>
</div>
`;
    }
}