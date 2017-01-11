module.exports = function ( express, app, io ) {
  	threatMap = {};
  	threatMap.express = express;
  	threatMap.app = app;
  	threatMap.io = io;
  	threatMap.name = "threatMap";
  	threatMap.connections = [];
  
  	app.use('/apps/threatmap', express.static(__dirname + '/public'));

  	return threatMap;
}