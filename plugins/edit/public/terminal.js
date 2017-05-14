class TerminalWindow extends Window{
  	constructor(editApp, id){
      	super("Terminal");
        this.panel.addCssClass("terminalBackground");
        
        this.editApp = editApp;
        this.term = new Terminal();
        this.term.open(this.panel.element, true);
        this.term.resize(80, 30);
        this.term.focus();
        
        if(id !== undefined){
            this.id = id;
            this.attach();
        } else {
            this.id = null;
            app.reqManager.get("/api/edit/newterminal", (res) => {
                if(res.status === 200){
                    this.id = JSON.parse(res.response).id;
                    this.attach();
                }
            });
        }
        
        this.term.setOption("disableStdin", true);

        this.term.on('key', (e) =>{
            app.socketManager.emit("terminal key",{id:this.id, key:e});
        });
        
        app.socketManager.socket.on("terminal data", (data) => {
            if(data.id == this.id){
                this.term.write(data.data);
            }
        });
        
        this.tab.resize = () => {
            this.resize();
        }
        
        this.tab.onClose = () => {
            this.close();
        }
        
        this.term.on('focus', () =>{
            this.focus(); 
        });
        
        this.term.on('blur', () =>{
            this.unFocus(); 
        });
        
        this.tab.panel.handleActivate = () => {
            this.focus();
        }
    }
    
    attach(){
        app.socketManager.emit("terminal attach", this.id);
        this.resize();
        this.term.focus();
    }
    
    resize(){
        let rows = Math.floor(this.panel.height / 20);
        let cols = Math.floor(this.panel.width / 8);
        
        this.term.resize(cols,rows);
        app.socketManager.emit("terminal resize",{id:this.id, rows:rows, cols:cols});        
    }
    
    focus(){
      	this.editApp.setFocus(this);
      	this.tab.focus();
      	this.term.focus();
      	this.resize();
    }
  
  	unFocus(){
    	this.tab.unFocus();
    }
    
    close(){
        app.socketManager.emit("terminal close",{id:this.id});
        this.editApp.close(this);
    }
}