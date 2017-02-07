"use strict";
var storage = require('node-persist');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
var readlineSync = require('readline-sync');
var fs = require('fs');
var express = require('express');
var speakeasy = require("speakeasy");
var qrcode = require('qrcode-terminal');

var app = express();

var bodyParser = require('body-parser');
var path = require('path');
var plugins = [];

app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());

storage.initSync();

//User stuff
var users = storage.getItem('users');
var sessions = storage.getItem('sessions');
var port = storage.getItem('port');
var rootDir = storage.getItem('rootDir');
var test = storage.getItem('jemoeder');

function loadPlugins(){
    var files = fs.readdirSync(__dirname +"/plugins" );
    for (var i in files){
        var file = {name:files[i]};
        var name = __dirname + '/plugins/' + files[i];

        if( fs.statSync(name).isDirectory() ){
          	var plugin = require(  "./plugins/" + files[i] + "/index.js")( express, app, io );;
          	console.log(plugin.name);
          	plugins.push( plugin );
        }
    }  
}

if(port == undefined){
	 firstRun();	
}

if(sessions == undefined){
	sessions = {}; 
}

loadPlugins();

function firstRun(){
	console.log("ArcaneJS-Server is run for the first time. Some variables need to be set before ArcaneJS can start.");
	addUserDialog();
  	
   	port = readlineSync.question('HTTP Port to use : ');
    storage.setItem('port',port);
	rootDir = readlineSync.question('Root directory : ');
    storage.setItem('rootDir',rootDir);
}

function addUserDialog(){
  	console.log("Addding a new user.");
	var user = readlineSync.question('Username : ');
  	var pass1 = "a";
  	var pass2 = "b";
  	var i = 0;
  	while(pass1 != pass2){
      	if(i > 0){
         	console.log("Passwords did not match :("); 
        }
      	
      	pass1 = readlineSync.question('Password : ', {
    		hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
 		});
      	pass2 = readlineSync.question('Confirm password : ', {
    		hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
 		});
      	i++;
    }
  	
  	var secret = speakeasy.generateSecret();
  	console.log("2FA QR :");
  	qrcode.generate(secret.otpauth_url);
  	addUser( user, pass1, secret.base32 );  
}

function addUser(name, pass, secret){
	var user = {}; 
  	user.name = name;
	user.hash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
	user.secret = secret;
  	if(users == undefined){
     	 users = [];
    }
  	users.push(user);
  	storage.setItem('users',users);
  	console.log("User " + name + " added.");
	return user;
}

function checkPass(user, pass){
	return bcrypt.compareSync(pass, user.hash);  
}

function getUser(name){
  	var found = null;
  	var i = 0;
  
  	while (i < users.length){
      	if(name == users[i].name){
          	return users[i]; 
        }
      	i++; 
    }
  	return found;
}

var server = app.listen(port);
console.log("Started on port "+ port);
var io = require('socket.io')(server);

//Session stuff
function newSession(user){
	var session = {};
  	session.uuid = uuid.v4();
  	session.csrfToken = uuid.v4();
  	session.username = user.name;
  	session.loggedIn = true;
  	sessions[session.uuid] = session;
  	console.log(session);
  	storage.setItem('sessions',sessions);
  	return session;
}

var checkSession = function(req,  res, checkCsrf, callback){
  	if(sessions[req.cookies.sessionId] != null){
      	if(sessions[req.cookies.sessionId].loggedIn){
        	if(checkCsrf){
              	if(req.get("X-Csrf-Token") == sessions[req.cookies.sessionId].csrfToken){
                  	callback(sessions[req.cookies.sessionId]);
                } else {
                  	res.statusCode = 401;
                	res.send("Incorrect CSRF Token");
                }
            } else { 
              	callback(sessions[req.cookies.sessionId]);
            }
          	
        } else {
          	res.statusCode = 401;
    		res.send("Session logged out");
        } 
    } else {
      	res.statusCode = 401;
    	res.send("Session unknown");
    }	 
}

//API routes
app.get('/api/apps', function (req, res) {
    checkSession(req, res, true, function(session){
      	var names = [];
      	var i = 0;
      	while(i < plugins.length){
          	names.push(plugins[i].name);
        	i++ 
        }
      	res.send(names);
    });
});

app.get('/api/dir', function (req, res) {
    checkSession(req, res, true, function(session){
      	console.log("Getdir " + rootDir + req.query.cd);
      	//TODO: Fix directory traversal
      	res.send(getFiles(rootDir + req.query.cd));
    });
});

app.get('/api/file/:name', function (req, res) {
    checkSession(req,res, true,function(session){
    	console.log("Getfile " + rootDir + req.query.cd + req.params.name);
      	//TODO: Fix directory traversal
      	res.sendFile(rootDir + req.query.cd + req.params.name)
    });
});

app.post('/api/save/:name', function(req, res){    
	checkSession(req, res, true, function(session){
      	console.log("Saving " + rootDir + req.query.cd + req.params.name);
      	//TODO: Fix directory traversal
        fs.writeFile(rootDir + req.query.cd + req.params.name, req.body.data, function (err,data) {
            if (err) {
              	res.statusCode = 400;
                res.send("Error saving");
            } else {
              	io.sockets.emit('refresh', 'now');
                res.send(true);
            }
        });
	});
});

app.post('/api/newFile/:name', function(req, res){    
	checkSession(req, res, true, function(session){
      	console.log("Creating New File " + rootDir + req.query.cd + req.params.name);
        fs.lstat(rootDir + req.query.cd + req.params.name, function(err, stats) {
    		if (err) { //TODO: Fix directory traversal
                fs.writeFile(rootDir + req.query.cd + req.params.name, req.body.data, function (err,data) {
                    if (err) {
                      	res.statusCode = 418;
                        res.send("Error creating file");
                    } else {
                        res.send(true);
                    }
                });
    		} else {
              	 res.statusCode = 409;
             	 res.send("File exists!");
            }
		});

	});
});

app.post('/api/newDir', function(req, res){    
	checkSession(req, res, true, function(session){
      	console.log("Creating New Directory " + rootDir + req.query.cd);
        fs.lstat(rootDir + req.query.cd, function(err, stats) {
    		if (err) {
                 fs.mkdirSync(rootDir + req.query.cd); //TODO: Fix directory traversal
              	 res.send(true);
    		} else {
              	 res.statusCode = 409;
             	 res.send("Directory exists!");
            }
		});
	});
});

app.post('/api/delete', function(req, res){    
	checkSession(req, res, true, function(session){
      	console.log("Deleting " + rootDir + req.query.cd);
        fs.lstat(rootDir + req.query.cd, function(err, stats) {
    		if (!err) {
              	 if(stats.isDirectory()){
                 	 deleteFolderRecursive(rootDir + req.query.cd);
                   	 res.send(true);
                 } else {
                     fs.unlinkSync(rootDir + req.query.cd); //TODO: Fix directory traversal
                     res.send(true);
                 }
    		} else {
              	 res.statusCode = 404;
             	 res.send("File doesn't exist!");
            }
		});
	});
});

app.post('/api/reauth', function(req, res){    
	checkSession(req, res, false, function(session){
		res.send({csrfToken:session.csrfToken});
	});
});

app.post('/api/login', function(req, res){
  	var username = req.body.data.user;
  	var password = req.body.data.pass;
  	var token = req.body.data.token;
  	var user = getUser(username);
  	var loginOK = false;
  	
 	if(user != null){
        if(checkPass(user, password)){
          	var session = newSession(user);
          	res.cookie("sessionId", session.uuid, { httpOnly: true });
          	//if(speakeasy.totp.verify({ secret: user.secret, encoding: 'base32', token: token })){
              	console.log("Login " + user.name + " OK");
            	res.send({csrfToken:session.csrfToken});
              	loginOK = true;
          	//}
        }
    }
  	
  	if(loginOK == false){
        console.log("Login " + username + " UNKNOWN!");
        res.statusCode = 401;
        res.send("Login failed");
    }
});

var getFiles = function(dir, files_){
    files_ = [];
    var files = fs.readdirSync(dir); //TODO: Fix directory traversal
    for (var i in files){
        var file = {name:files[i]};
        var name = dir + '/' + files[i];

        file.isDir = fs.statSync(name).isDirectory();
      
        files_.push(file);
    }
    return files_;
}

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath); //TODO: Fix directory traversal
            }
        });
        fs.rmdirSync(path);
    }
};

// Websocket stuffs
io.use(function(socket, next){
  	//Check if the user is authenticated
  	var sessionId = socket.request.headers.cookie.split("sessionId=")[1];
  	var csrfToken = socket.handshake.query.csrftoken;
  	var session = sessions[sessionId];
  
  	if( session != null){
    	if( session.csrfToken == csrfToken ){
          	socket.session = session;
        	return next();
        }
    }
   	
  	next(new Error('Authentication error'));
});

io.on('connection', function(socket) {
    console.log(socket.session.username + " connected");
  	
  	var i = 0;
  	while (i < plugins.length){
      	if( plugins[i].handleNewSocket ){
        	plugins[i].handleNewSocket( socket );
        }
      	i++; 
    }
  
    socket.on('disconnect', function() {
      	console.log(socket.session.username +'disconnect');
	});
});