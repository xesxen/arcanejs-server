module.exports = function ( express, app, io ) {
  	irc = {};
  	irc.express = express;
  	irc.app = app;
  	irc.io = io;
  	irc.name = "irc";
  	irc.connections = [];
  
  	app.use('/apps/irc', express.static(__dirname + '/public'));

  	irc.handleNewSocket = function( socket ){
        socket.on('irc connect', function(server){
          	var connection = null;
          	var i = 0;
          	while ( i < irc.connections.length ){
              	if(irc.connections[i].getWebSocket().session.username == socket.session.username){
                	irc.connections[i].setWebSocket(socket);
                  	irc.connections[i].sendBuffer();
                  	connection = irc.connections[i];
                   	i = irc.connections.length;
                }
           		i++;  
            }
          	
          	if(connection == null){
            	connection = require("./connection.js");
          		connection.connect(server, socket, "KL4PL0NG", "KL4PL0NG", "KL4PL0NG", []);
              	irc.connections.push(connection);
            }
        });
      
      	socket.on('irc raw', function(data){
          	console.log(data);
          	var connection = null;
          	var i = 0; //TODO: DIT SLAAT ECHT NERGENS OP!!!!!
          	while ( i < irc.connections.length ){
              	if(irc.connections[i].getWebSocket().session.username == socket.session.username){
                  	connection = irc.connections[i];
                  	connection.raw(data);
                   	i = irc.connections.length;
                }
           		i++;  
            }        	
        });
    }

  	return irc;
}