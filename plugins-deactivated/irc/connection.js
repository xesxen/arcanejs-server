var net = require('net');
var tls = require('tls');
var fs = require('fs');
var irc = {};
irc.socket = null;
irc.socket = null;
irc.websocket = null;
irc.buffer = [];

irc.sendBuffer = function(){ 
	irc.websocket.emit("irc buffer", irc.buffer);
}

irc.connect = function(server, websocket, nick, user, version, channels, callback){
	console.log("Connecting to " + server);
	irc.websocket = websocket;
	irc.server = server;
	irc.nick = nick;
	irc.user = user;
	irc.version = version;
	irc.channels = channels;
	irc.callback = callback;
	irc.plugins = [];
	irc.channelsJoined = 0;

  	//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //TODO... WAT!?!?!?!
	irc.socket = tls.connect({port:6697, host:server,rejectUnauthorized:false});
	irc.socket.setEncoding('ascii');
	irc.socket.setNoDelay();
  
  	irc.socket.on('connect', function () {
        irc.raw('NICK '+ irc.nick);
        irc.raw('USER '+ irc.user +' 8 * :' + irc.version);
        setTimeout(function () {
            var i = 0;
            while(i<irc.channels.length){
                console.log("Joining " + irc.channels[i]);
                irc.join(irc.channels[i], function(){
                    irc.channelsJoined++;
                    if(irc.channelsJoined == irc.channels.length){
                        if(irc.callback != null){
                            irc.callback();
                        }
                    }
                });
                i++;
            }
        }, 2000);
	});
  
  	irc.socket.on('data', function (data) {
      	var message = {data:data, timestamp:Date.now()};
        irc.websocket.emit("irc data", message);
        irc.buffer.push(message);
        data = data.split('\n');
        for (var i = 0; i < data.length; i++) {
            if (data !== '') {
                //console.log('RECV - ' + data[i]);
                irc.handle(data[i].slice(0, -1));
            }
        }
    });
  
}

irc.setWebSocket = function(websocket){
	irc.websocket = websocket; 
}

irc.getWebSocket = function(){
	return irc.websocket;
}


irc.execute = function(){
	irc.raw(irc.command);
}

irc.handle = function (data) {
	var i, info;
	for (i = 0; i < irc.listeners.length; i++) {
		info = irc.listeners[i][0].exec(data);
		if (info) {
			irc.listeners[i][1](info, data);
			if (irc.listeners[i][2]) {
				irc.listeners.splice(i, 1);
			}
		}
	}
};

irc.listeners = [];

irc.on = function (data, callback) {
	irc.listeners.push([data, callback, false])
};

irc.on_once = function (data, callback) {
	irc.listeners.push([data, callback, true]);
};

irc.raw = function (data) {
    var message = {data:data, timestamp:Date.now()};
  	irc.buffer.push(message);
	irc.socket.write(data + '\r\n', 'ascii', function () {
		//console.log('SENT -', data);
	});
};

irc.on(/^PING :(.+)$/i, function (info) {
	irc.raw('PONG :' + info[1]);
});

irc.on(/^[^ ]+ 001 ([0-9a-zA-Z\[\]\\`_\^{|}\-]+) :/, function (info) {
	irc.nick = info[1];
});

irc.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function (info) {
	if (info[1] === irc.nick) {
		irc.nick = info[2];
	}
});

irc.join = function (chan, callback) {
	if (callback !== undefined) {
		irc.on_once(new RegExp('^:' + irc.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
	}
	irc.raw('JOIN ' + chan);
};

irc.part = function (chan, callback) {
	if (callback !== undefined) {
		irc.on_once(new RegExp('^:' + irc.nick + '![^@]+@[^ ]+ PART :' + chan), callback);
	}
	irc.raw('PART ' + chan);
};

module.exports = {
	connect:irc.connect,
  	sendBuffer:irc.sendBuffer,
  	setWebSocket:irc.setWebSocket,
  	getWebSocket:irc.getWebSocket,
	msg:irc.msg,
	loadPlugin:irc.loadPlugin,
	raw:irc.raw
}