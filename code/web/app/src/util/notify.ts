/**
 * Returns the event name for the given property.
 */
import {LitElement, PropertyValues} from "lit-element";
import {PropertyDeclaration} from "lit-element/src/lib/updating-element";

export interface NotifyPropertyDeclaration extends PropertyDeclaration {
    readonly notify: Boolean

}

export function eventNameForProperty(name) {
    return `${name.toLowerCase()}-changed`;
}

class CustomElement extends LitElement {


    protected createRenderRoot(): Element {
        return this;
    }

    protected notifyPropChanged(name: String, value: any = null) {
        this.dispatchEvent(new CustomEvent(eventNameForProperty(name), {
            detail: {
                value: value != null ? value : this[name]
            },
            bubbles: true,
            composed: false
        }))
    }

}

export default CustomElement;