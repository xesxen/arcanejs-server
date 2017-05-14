module.exports = function ( express, app, io ) {
  	edit = {};
  	edit.express = express;
  	edit.app = app;
  	edit.io = io;
  	edit.name = "edit";
  	edit.terminals = [];
    
    let os = require('os');
    let pty = require('node-pty');
      
  
  	app.use('/apps/edit', express.static(__dirname + '/public'));
  	
  	edit.handleNewSocket = ( socket ) => {
        socket.on('terminal attach', (id) => {
            let term = edit.terminals[id];
            
            if(socket.session.username == term.username){
                term.on('data', (data) => {
                    socket.emit("terminal data",{id:term.id, data:data});
                });            
            }
        });
      
      	socket.on('terminal key', (data) => {
      	    let term = edit.terminals[data.id];
          	term.write(data.key);
        });
        
        socket.on('terminal resize', (data) => {
      	    let term = edit.terminals[data.id];
      	    if(term !== undefined){
      	        term.resize(data.cols, data.rows);
      	    }
          	
        });
        
        socket.on('terminal close', (data) => {
      	    console.log("Killing terminal with id " + data.id);
      	    
      	    let term = edit.terminals[data.id];
      	    edit.terminals[data.id] = {id:-1};
          	term.kill();
        });
    }
    
    app.get('/api/edit/newterminal', (req, res) => {    
        app.checkSession(req, res, true, (session) => {
            let term = pty.spawn('bash', [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env
            });
            
            term.id = edit.terminals.length;
            term.username = session.username;
            edit.terminals.push(term);
            
            console.log("Forking new pty with id " + term.id + " for " + term.username )
            res.send({id:term.id});
        });        
    });
    
    app.get('/api/edit/openterminals', (req, res) => {    
        app.checkSession(req, res, true, (session) => {
            let found = [];
            edit.terminals.forEach((terminal) => {
                if(terminal.username == session.username){
                    found.push(terminal.id);
                } 
            });

            res.send({found:found});
        });        
    });
    
  	return edit;
}