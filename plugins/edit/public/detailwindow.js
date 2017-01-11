class InspectorWindow extends Window{
  	constructor(){
      	super("Inspector");
      	return this;
    }
  
  	setItem(item){
       	let stack = new PanelStack();
      	let panel = new Panel();
      	stack.addHandle( new PanelHandle("Info",panel , stack ));
      
      
      	this.addKeyValuePair("Name", item.data.name, panel);
      	this.addKeyValuePair("Severity", item.data.severity, panel);

              	//timestamp:"123123123",
              	//customer:"Testklant",     
      
      	let details = item.data.details;
      	for (var key in details) {
          	this.addToStack(details, key, stack);
		}
      
      	this.panel.clear();
      	this.panel.addChild(stack);   		 
    }
  
  
  	addToStack(details, key, stack){
      	let panel = new Panel( new H3("jemoeder") );
      	
      	for (var k in details[key]) {
  			console.log(k, details[key][k]);
          	this.addKeyValuePair(k, details[key][k], panel);
		}
      
    	stack.addHandle( new PanelHandle(key, panel, stack) );	 
    }
  
  	addKeyValuePair(key, val, panel){
    	panel.addChild(new Div("inspectorItem").setText(key + ": " + val));
    }
}