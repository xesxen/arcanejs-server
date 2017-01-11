module.exports = function ( express, app, io ) {
  	edit = {};
  	edit.express = express;
  	edit.app = app;
  	edit.io = io;
  	edit.name = "edit";
  	edit.connections = [];
  
  	app.use('/apps/edit', express.static(__dirname + '/public'));

  	return edit;
}