module.exports = function ( express, app, io ) {
  	ftorrent = {};
  	ftorrent.express = express;
  	ftorrent.app = app;
  	ftorrent.io = io;
  	ftorrent.name = "ftorrent";
  	ftorrent.connections = [];
  
  	app.use('/apps/ftorrent', express.static(__dirname + '/public'));

  	return ftorrent;
}