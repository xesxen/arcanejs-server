class EditorWindow extends Window{
  	constructor(file, editApp){
      	super(file.name);
      
        const modes = {
            js:"javascript",
            html:"html",
            css:"css",
            xml:"xml",
            json:"json",
            php:"php",
            py:"python",
            c:"c_cpp",
            cpp:"c_cpp",
            md:"markdown"
        };
      
      
      	this.file = file;
      	this.isClean = true;
      	this.editApp = editApp;
        this.editor = ace.edit(this.panel.element);
        this.editor.setTheme("ace/theme/merbivore_soft");
        
        const splitName = file.name.split(".");
        const extention = splitName[splitName.length -1].toLowerCase();

        if(modes[extention]){
            this.editor.getSession().setMode("ace/mode/" + modes[extention]);
        }
      
      	if(file.data !== null){
      		this.editor.setValue(file.data, -1);
        }

      	this.panel.handleActivate = () => {this.editor.focus()};
      	this.editor.on("focus", () => {this.focus()});
      	this.editor.on("input", () => {this.change()});
      	
      	this.tab.onClose = () => {this.close()};
      	this.tab.onResize = () => {this.resize()};
    }
  
  	focus(){
      	this.editApp.setFocus(this);
      	this.tab.focus();
    }
  
  	unFocus(){
    	this.tab.unFocus();
    }
    
    close(){
        this.editApp.close(this);
    }
    
    resize(){
        this.editor.resize();
    }
    
    change(){
        if(this.isClean && this.editor.session.getUndoManager().$undoStack.length > 1){
            this.isClean = false;
            this.tab.setTitle("* " + this.file.name);
        }
    }
    
    markClean(){
        this.isClean = true;
        this.tab.setTitle(this.file.name);
    }
  
  	getValue(){
    	return this.editor.getValue(); 
    }
}