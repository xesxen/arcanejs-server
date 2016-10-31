class SocketManager{
	constructor( app ){
      	this.app = app;
		this.socket = null;
    }

  	connect(){
      	if(!this.socket){
        	this.socket = io("/", {query:"csrftoken="+ this.app.sessionManager.csrfToken }); 
        }
    }
  
  	emit( target, data ){
    	this.socket.emit(target, data);
    }
}