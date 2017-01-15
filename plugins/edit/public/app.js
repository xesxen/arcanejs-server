class Alarms extends BaseApp{
  	constructor(){
		super("edit");
		include([
          	"/apps/edit/alarms.css",
          	"/apps/edit/window.js",
            "/apps/edit/alarmitem.js",
          	"/apps/edit/editorwindow.js",
          	"/apps/edit/filebrowser.js",
          	"/apps/edit/fileitem.js"
        ], null, true);
    }
  
  	init(){
      	super.init();
      	this.activeItem = null;

		this.alarmWindow = new EditorWindow("editor");
      
      	this.inspector = new FileBrowser(this);

      	let frameSet = new FrameSet( false, this.view,  this.view);	
      
        let bottomFrame = new Frame( frameSet, 0.1 );
      	bottomFrame.setContent ( new TabGroup( this.view, this.inspector.tab ) );
      	frameSet.addFrame( bottomFrame, 0.3 );
      
        let mainFrame = new Frame( frameSet );
      	this.mainFrame = mainFrame;
      	mainFrame.setContent ( new TabGroup( this.view, this.alarmWindow.tab ) );
      	frameSet.addFrame( mainFrame, 0.8 );
    }
	
  	open(file){
    	let editWindow = new EditorWindow("blaat", file);
      	this.mainFrame.content.addTab(editWindow.tab);
    }
}

new Alarms();