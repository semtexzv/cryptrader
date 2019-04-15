import {customElement, html, LitElement, property, PropertyValues, TemplateResult} from "lit-element";

import * as api from '../util/api';
import {CustomElement} from '../util/notify'

@customElement("assignment-item")
class AssignmentItem extends CustomElement {

}


@customElement("assignment-list")
class AssignmentList extends CustomElement {
    periods = ["1m", "5m", "15m"];
    pairs: any[] = null;
    assignments: any[] = null;
    strategies: api.Strategy[] = null;
    traders: any[] = null;

    newData: api.Assignment = new api.Assignment();


    protected firstUpdated(_changedProperties: PropertyValues): void {
        api.getAll('pairs')
            .then(p => {
                this.pairs = p;
                this.requestUpdate()
            });

        this.load()
    }

    loaded() {
        return this.pairs != null && this.strategies != null && this.assignments != null && this.traders != null;
    }

    async load() {
        this.assignments = await api.getAll('assignments');
        this.strategies = await api.getAll('strategies');
        this.traders = <any[]>await api.getAll('traders');

        console.log(this.traders);
        this.requestUpdate()
    }

    private async delete(a: any) {
        a.period = null;
        a.strategy_id = null;
        a.trader_id = null;
        await api.postOne('assignments', a);
        await this.load()
    }

    protected trader_name(id): any {
        let t = this.traders.find(t => t.id == id);
        return t ? t.name : '';
    }

    protected async createNew() {
        await api.postOne('assignments', this.newData);
        await this.load()
    }

    protected form(): TemplateResult {

        let selectExchange = html`
        `;
        let pairListener = (e) => {
            let p = e.target.options[e.target.selectedIndex];
            this.newData.exchange = p.dataset.exchange;
            this.newData.pair = p.dataset.pair;
            this.requestUpdate('newData');
        };

        let selectPair = html`
        <select class="form-control" @change="${pairListener}" required>
           <option value="" disabled selected>Select pair</option>
${this.pairs.map(p => html`
<option data-exchange="${p.exchange}" data-pair="${p.pair}">${p.exchange}/${p.pair}</option>`)}
        </select>
        `;


        let periodListener = (e) => {
            this.newData.period = e.target.options[e.target.selectedIndex].value
            this.requestUpdate('newData');
        };
        let selectPeriod = html`
<select class="form-control" @change="${periodListener}">
${this.periods.map(p => html`<option>${p}</option>`)}
</select>
        `;

        let stratListener = (e) => {
            this.newData.strategy_id = parseInt(e.target.options[e.target.selectedIndex].dataset.id);
            this.requestUpdate('newData');
        };

        let selectStrat = html`
        <select class="form-control" @change="${stratListener}">
           <option value="" disabled selected>Select Strategy</option>
        ${this.strategies.map(s => html`<option data-id="${s.id}" >${s.name}</option>`)}
        </select>
        `;

        let traderListener = (e) => {
            this.newData.trader_id = parseInt(e.target.options[e.target.selectedIndex].dataset.id);
            this.requestUpdate('newData');
        };

        let selectTrader = html`
        <select class="form-control" @change="${traderListener}">
           <option value="" disabled selected>Select trader</option>
           <option value="" >None</option>
        ${this.traders
            .filter(t => this.assignments.find(a => a.trader_id == t.id) == null)
            .map(s => html`<option data-id="${s.id}">${s.name}</option>`)}
        </select>
        `;
        return html`
        <td colspan="2">${selectPair}</td>
        <td>${selectPeriod}</td>
        <td>${selectStrat}</td>
        <td>${selectTrader}</td>
        <td><button class="btn btn-primary" @click="${this.createNew}" ?disabled="${this.newData.pair == null || this.newData.strategy_id == null}">Create new</button></td>
        
        `
    }

    protected header(): TemplateResult {
        return html`
          <thead class="thead-default">
        <tr>
        <th>Exchange</th>
        <th>Pair</th>
        <th>Period</th>
        <th>Strategy</th>
        <th>Trader</th>
        <th>Actions</th>
        </tr>
    </thead>
        `
    }

    protected row(a): TemplateResult {
        return html`
<tr>
        <td>${a.exchange}</td>
        <td>${a.pair}</td>
        <td>${a.period}</td>
        <td>${this.strategies.find(s => s.id == a.strategy_id).name}</td>
        <td>${this.trader_name(a.trader_id)}</td>
        <td><button class="btn btn-danger" @click="${e => this.delete(a)}">Delete</button></td>
</tr>
        
        `
    }

    loading(): TemplateResult {
        return html`<div>Not yet loaded</div>`
    }

    protected ok(): TemplateResult {
        return html`
<div class="card">
<div class="card-header">
    <h3>Strategy assignments</h3>
</div>
<div class="card-body">
    <table id="assignments" class="table">
    ${this.header()}  
    <tbody>
    ${this.form()}
    ${this.assignments.map(a => this.row(a))}
    </tbody>
</table>
</div>
</div>


        `
    }

    protected render(): TemplateResult {
        return html`
            ${this.loaded() ? this.ok() : this.loading()}
        `
    }

}