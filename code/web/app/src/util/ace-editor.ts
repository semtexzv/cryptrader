import {LitElement, html, TemplateResult, customElement, property, PropertyValues} from "lit-element";
import { CustomElement } from "./notify";

import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-dreamweaver';


@customElement("ace-editor")
class AceEditor extends CustomElement {

    @property({type: String}) content = "";

    private editor: any;

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.initEditor()
    }

    protected updated(changedProperties: PropertyValues): void {
        if (changedProperties.has('content')) {
            this.editor.session.setValue(this.content);
        }
    }

    protected initEditor() {
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/');

        var shadow = this;
        ace.require("ace/ext/lanugage_tools");

        var dom = ace.require("ace/lib/dom");
        dom.buildDom(["div", {id: "host"},
            ["div", {id: "editor"}],
            ["style", `
                #host {
                    border: solid 1px gray;                 
                }
                #editor {
                    height: 500px;
                }
            `]
        ], shadow);

        this.editor = ace.edit(shadow.querySelector("#editor"), {
            theme: "ace/theme/dreamweaver",
            mode: "ace/mode/lua",
            value: this.content,
            autoScrollEditorIntoView: true,

            enableBasicAutocompletion: true,
            enableSnippets: true
        });

        this.editor.renderer.attachToShadowRoot();
        this.editor.session.on('change', () => {
            this.notifyPropChanged('content',this.editor.session.getValue());
        });


    }

}