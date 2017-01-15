class EditorWindow extends Window{
  	constructor(title, value){
      	super(title);
        console.log(this.panel);
        this.editor = ace.edit(this.panel.element);
        this.editor.setTheme("ace/theme/merbivore_soft");
        this.editor.getSession().setMode("ace/mode/javascript");
      	if(value != null){
      		this.editor.setValue(value, -1);
          	//this.editor.clearSelection();
        }
    }
}