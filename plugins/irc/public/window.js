class IrcWindow extends Div{
  	constructor(title){
      	super();
		this.pre = new Element("pre","ircwindow");
      	this.input = new Input(null, null, "ircinput");
      	this.input.setAttribute("spellcheck",false);
      	this.input.addEventListener("keydown", (e) => this.handleKeyDown(e));
		this.pre.addEventListener("click", (e) => this.handleClick(e));
      	
       	this.panel = new Panel();
      	this.addCssClass("flexcollumn");
      	this.addChild(this.pre);
      	this.addChild(this.input);
      	this.panel.addChild(this);
      
      	this.panel.handleActivate = () => this.handleActivate();
      	
      	this.tab = new PanelTab(title, this.panel);
      	return this;
    }
  
  	addText(text){
    	this.pre.setText(this.pre.getText() + text);
		this.pre.element.scrollTop = this.pre.element.scrollHeight;
    }
  
  	handleKeyDown(e){
     	if (e.keyCode == 13) {
        	console.log(this.input.value);
          	app.socketManager.emit("irc raw",this.input.value);
        }
    }
  
  	handleClick(){
      	document.execCommand('copy');
    	this.input.element.focus();
   	}
  
  	getTimeString(timestamp){
      	let date = null;
      	if(timestamp){
            date  = new Date(timestamp);
        } else {
          	date = new Date(Date.now());
        }
      	return date.toTimeString().split(' ')[0].substr(0,5);          
    }
  
  	handleActivate(e){
      	if(this.input != null){
    		this.input.element.focus();
          	this.pre.element.scrollTop = this.pre.element.scrollHeight;
        }
    }
}