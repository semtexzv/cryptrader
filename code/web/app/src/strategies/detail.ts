import {LitElement, html, property, customElement, TemplateResult, PropertyValues} from 'lit-element';

import * as api from '../util/api';
import CustomElement from "../util/notify";


@customElement("strategy-detail")
export class Detail extends CustomElement {

    @property({type: Number}) id = null;
    @property({type: Object}) strat = null;


    async loadStrat() {
        this.strat = await api.getOne('strategies', this.id);
        console.log("Loaded strategy details: " + this.strat.name)
    }

    async saveStrat() {
        this.strat = await api.postOne('strategies', this.strat);
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('id-changed', (e) => {
            this.loadStrat();
        });

        this.notifyPropChanged('id')
    }


    editor(): TemplateResult {
        return html`
<ace-editor 
content="${this.strat.body}" 
@content-changed="${(e) => this.strat.body = e.detail.value}"></ace-editor>
<button @click="${(e) => this.saveStrat()}">Save</button>
`
    }

    loading(): TemplateResult {
        return html`<div>Not yet loaded</div>`
    }

    protected render(): TemplateResult {
        return html`${this.strat != null ? this.editor() : this.loading()}`

    }
}