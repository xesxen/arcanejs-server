class TerminalWindow extends Window{
  	constructor(editApp){
      	super("Terminal");
        this.panel.addCssClass("terminalBackground");
        
        this.editApp = editApp;
        this.term = new Terminal();
        this.term.open(this.panel.element, true);
        this.term.resize(80, 30);
        this.term.focus();
        this.id = null;
        app.reqManager.get("/api/edit/newterminal", (res) => {
            if(res.status === 200){
                this.id = JSON.parse(res.response).id;
                app.socketManager.emit("terminal attach", this.id);
                this.resize();
                
            }
        });

        this.term.on('key', (e) =>{
            app.socketManager.emit("terminal key",{id:this.id, key:e});
        });
        
        app.socketManager.socket.on("terminal data", (data) => {
            if(data.id == this.id){
                this.term.write(data.data);
                this.term.focus();
            }
        });
        
        this.tab.resize = () => {
            this.resize();
        }
        
        this.tab.close = () => {
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
    }
  
  	unFocus(){
    	this.tab.unFocus();
    }
    
    close(){
        this.editApp.close(this);
    }
}