class Ftorrent{
  	constructor(){
      	//app.loader.loadStyles(["apps/irc/irc.css"], () => {
  		//	app.loader.loadScripts(["apps/irc/window.js","apps/irc/channelwindow.js"], () => {  });      
        //});
      	this.init();
    }
  
  	init(){
        let view = new View( );
      	let item = new NavBarItem( new Glyphicon("cloud-download"), app.navBarApp.navBar, view );
      	let frameSet = new FrameSet( true, view, view);
      	item.handleClick();
    }
}

new Ftorrent();