module.exports = function ( express, app, io ) {
  	alarms = {};
  	alarms.express = express;
  	alarms.app = app;
  	alarms.io = io;
  	alarms.name = "alarms";
  	alarms.connections = [];
  
  	app.use('/apps/alarms', express.static(__dirname + '/public'));

  	return alarms;
}