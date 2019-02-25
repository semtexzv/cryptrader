
var editor = ace.edit('editor');
ace.require("ace/ext/lanugage_tools");
editor.session.setMode("ace/mode/lua");
editor.setTheme("ace/theme/dreamweaver");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true
});
var textarea = $('#editor-dest');
var submit = $('#editor-submit');
let changeFun =  function () {
    console.log("Change : " + editor.session.getValue());
    textarea.val( editor.session.getValue());

    let annotations = editor.session.getAnnotations();

    let enabled = true;

    $.each(annotations, function (k,v) {
        if(v.type === 'error') {
            enabled = false
        }
    });

    if(enabled) {
        submit.removeAttr('disabled');

    } else {
        submit.attr('disabled', true);
    }
};
editor.getSession().on("change",changeFun);
changeFun();