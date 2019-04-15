/**
 * Returns the event name for the given property.
 */
import {html, LitElement, PropertyValues, TemplateResult} from "lit-element";
import {PropertyDeclaration} from "lit-element/src/lib/updating-element";

export interface NotifyPropertyDeclaration extends PropertyDeclaration {
    readonly notify: Boolean

}

export function eventNameForProperty(name) {
    return `${name.toLowerCase()}-changed`;
}

export function navigate(href) {
    window.history.pushState({}, null, href + window.location.search);
    window.dispatchEvent(new CustomEvent('route'));

    // @ts-ignore
    //if (super.navigate) super.navigate();
}
export class CustomElement extends LitElement {


    protected createRenderRoot(): Element {
        return this;
    }


    loading(): TemplateResult {
        return html`<div>Not yet loaded</div>`
    }


    protected notifyPropChanged(name: String, value: any = null) {
        this.dispatchEvent(new CustomEvent(eventNameForProperty(name), {
            detail: {
                // @ts-ignore
                value: value != null ? value : this[name]
            },
            bubbles: true,
            composed: false
        }))
    }

}
