class Window extends Div{
  	constructor(title){
      	super();
       	this.panel = new Panel();

      	this.tab = new PanelTab(title, this.panel);
      	return this;
    }
}