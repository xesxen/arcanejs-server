class AlarmItem extends Div{
  	constructor(data, alarmApp){
      	super("alarmItem");
      	this.alarmApp = alarmApp;
      	this.data = data;
      
      	//<span class="label label-default">New</span>
      	this.label = new Span("label").setText(this.data.severity);
      	if(this.data.severity >= 8){
          	this.label.addCssClass("label-info");
        } else if(this.data.severity >= 5){
          	this.label.addCssClass("label-danger");
        } else if(this.data.severity >= 1){
          	this.label.addCssClass("label-warning");
        } else {
          	this.label.addCssClass("label-primary");
        }
      	
      	this.addEventListener("click", () => {
          	this.addCssClass("alarmItemActive");
          	this.alarmApp.setActiveItem(this);
        });
      
      	this.addChild(this.label);
      	this.addChild(new Div("alarmItemText").setText(this.data.name));
		//this.setText("jemoeder");
      	return this;
    }
  
  
  	deactivate(){
    	this.removeCssClass("alarmItemActive");
    }
}