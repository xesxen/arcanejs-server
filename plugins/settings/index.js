module.exports = function ( express, app, io ) {
  	settings = {};
  	settings.express = express;
  	settings.app = app;
  	settings.io = io;
  	settings.name = "settings";
  	settings.connections = [];
  
  	app.use('/apps/settings', express.static(__dirname + '/public'));

  	return settings;
}