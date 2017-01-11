class EditorWindow extends Window{
  	constructor(title){
      	super(title);
        console.log(this.panel);
        this.editor = ace.edit(this.panel.element);
        this.editor.setTheme("ace/theme/merbivore_soft");
        this.editor.getSession().setMode("ace/mode/javascript");
    }
}