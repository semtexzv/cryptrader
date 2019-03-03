import {customElement, html, LitElement, property, TemplateResult} from "lit-element";
import * as api from '../util/api'
import CustomElement from "../util/notify";



let style = html` <style> :host { display: table-row; }  .td, ::content .td { display: table-cell; width: 50px;} </style>`;

@customElement("trader-item")
class TraderItem extends CustomElement {
    // @ts-ignore
    @property({type: api.Trader}) trader: api.Trader = {};

    protected render(): TemplateResult | void {
        return html`
        ${style}
            <td>${this.trader.name}</td>
            <td>${this.trader.exchange}</td>
            <td>${this.trader.api_key}</td>
        <td>Hidden</td>
`;
    }
}


@customElement("trader-new")
class NewItem extends CustomElement {
    // @ts-ignore
    @property({type: api.Trader}) trader: api.Trader = {};
    @property({}) exchanges: string[] = [];

    protected add(e) {

    }

    protected valid(): boolean {
        return this.trader.api_secret != null && this.trader.api_key != null && this.trader.exchange != null;
    }



    protected render(): TemplateResult | void {
        let but = html`<button @click="${this.add}" ?disabled="${!this.valid()}">Create new</button>`;

        let exchListener = (e) => {
            this.trader.exchange = e.target.options[e.target.selectedIndex].value
            this.requestUpdate()
        };

        let nameListener = (e) => {
            this.trader.name = e.target.value;
            this.requestUpdate()
        };

        let keyListener = (e) => {
            this.trader.api_key = e.target.value;
            this.requestUpdate()
        };

        let secretListener = (e) => {
            this.trader.api_secret = e.target.value;
            this.requestUpdate()
        }



        return html`
${style}
<td><input @input="${nameListener}">${this.trader.name}</input></td>
<td>
    <select @change="${exchListener}" >
           <option value="" disabled selected>Select Exchange</option>
            ${this.exchanges.map(e => html`<option>${e}</option>`)}
    </select>
</td>
<td><input @input="${keyListener}">${this.trader.api_key}</input></td>
<td><input @input="${keyListener}">${this.trader.api_secret}</input></td>
${but}
`;
    }
}

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
        super.connectedCallback()
        this.load();
    }

    head(): TemplateResult {
        return html`
        <thead class="thead-dark">
        <tr>
            <th>Name</th>
            <th>Exchange</th>
            <th>Key</th>
            <th>Secret</th>
        </tr>
        </thead>
        `
    }

    created(e) {
        console.log(e);
    }

    new(): TemplateResult {
        return html`<trader-new .trader="${{}}" .exchanges="${this.exchanges}" @created="${(e) => console.log(e)}"></trader-new>`
    }

    body(): TemplateResult {
        return html`<tbody>
${this.new()}
${this.traders.map(t => html`<trader-item .trader="${t}"></trader-item>`)}
</tbody>
`
    }

    protected render(): TemplateResult | void {
        return html`
<table id="traders" class="table">
${this.head()}
${this.body()}
</table>
`;
    }
}