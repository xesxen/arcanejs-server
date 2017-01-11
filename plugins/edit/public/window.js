class Window extends Div{
  	constructor(title){
      	super();
       	this.panel = new Panel();
      	//this.panel.addChild(this);
      	this.tab = new PanelTab(title, this.panel);
      	return this;
    }
}