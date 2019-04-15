import {LitElement, html, property, customElement, TemplateResult, PropertyValues} from 'lit-element';

import * as api from '../util/api';
import { CustomElement } from "../util/notify";


@customElement("strategy-detail")
export class Detail extends CustomElement {

    @property({type: Number, attribute: true}) strat_id = null;
    @property({type: Object}) strat = null;
    @property({type: Array}) evaluations = [];


    async loadStrat() {
        this.strat = await api.getOne('strategies', this.strat_id);
        this.evaluations = await api.getAll(`strategies/${this.strat_id}/evaluations`);
        this.notifyPropChanged('evaluations');
        console.log("Loaded strategy details: " + this.strat.name)
    }

    async saveStrat() {
        this.strat = await api.postOne('strategies', this.strat);
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {

        this.addEventListener('id-changed', (e) => {
            this.loadStrat();
        });

        this.notifyPropChanged('id')
    }


    editor(): TemplateResult {
        var disabled = false;
        return html`
<div class="card">
<div class="card-header">
    <h3>Strategy detail : ${this.strat.name}</h3>
</div>
<div class="card-body">

<ace-editor 
content="${this.strat.body}" 
@content-changed="${(e) => this.strat.body = e.detail.value}"></ace-editor>
<button class="btn btn-primary float-right" @click="${(e) => this.saveStrat()}" ?disabled="${disabled}">Save</button>
${this.evaluations.map( e => html`aa `)}
</div>
</div>

`
    }

    protected render(): TemplateResult {
        return html`${this.strat != null ? this.editor() : this.loading()}`
    }
}