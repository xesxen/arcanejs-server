class Alarms extends BaseApp{
  	constructor(){
		super("bell");
      
      
		include([
          	"/apps/edit/alarms.css",
          	"/apps/edit/window.js",
            "/apps/edit/alarmitem.js",
          	"/apps/edit/editorwindow.js",
          	"/apps/edit/detailwindow.js"
        ], () =>{
        	  this.init();
        });
    }
  
  	init(){
      	this.activeItem = null;
		    this.item.handleClick();
		    this.alarmWindow = new EditorWindow("editor");
      	this.inspector = new InspectorWindow(this);

      	let frameSet = new FrameSet( false, this.view,  this.view);	
        let mainFrame = new Frame( frameSet );
      	mainFrame.setContent ( new TabGroup( this.view, this.alarmWindow.tab ) );
      	frameSet.addFrame( mainFrame, 0.5 );
      
      	let bottomFrame = new Frame( frameSet, 0.1 );
      	bottomFrame.setContent ( new TabGroup( this.view, this.inspector.tab ) );
      	frameSet.addFrame( bottomFrame, 0.3 );        
    }
  
  	setActiveItem(item){
    	if(this.activeItem != null){
        	this.activeItem.deactivate(); 
        }
     	this.activeItem = item;
      	this.inspector.setItem(item);
    }
}

new Alarms();