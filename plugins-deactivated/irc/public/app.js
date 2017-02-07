class Irc extends BaseApp{
  	constructor(){
  	    super("fire");
  	    
  	    include([
          	"/apps/irc/irc.css",
          	"/apps/irc/window.js",
            "/apps/irc/channelwindow.js"
        ], null, true);
  	    
      	this.nick = "";
      	this.channels = {};
    }
  
  	init(){
      	let frameSet = new FrameSet( true, this.view, this.view);
      	let frame = new Frame( frameSet );
      	frameSet.addFrame( frame, 1 );

		this.statusWindow = new IrcWindow("status");
      
      	this.tabGroup = new TabGroup( this.view, this.statusWindow.tab );
      	frame.setContent ( this.tabGroup );
      	
        app.socketManager.emit("irc connect","irc.smurfnet.ch");
        app.socketManager.socket.on("irc data", (data) => this.handleData(data));   	
      	app.socketManager.socket.on("irc buffer", (data) => this.handleBuffer(data));   	
    }
  
  
  	handleBuffer(buffer){
    	var i = 0;
      	while ( i < buffer.length ){
        	this.handleData(buffer[i]);
          	i++; 
        }
    }
  	
    handleData(message){
      	let timestamp = message.timestamp;
      	let messages = message.data.split("\r\n");
      	messages.forEach((entry) => {
            if(entry != ""){
              	let parsed = this.parseLine(entry, timestamp);
            	switch(parsed.command){
                    case "001":
                    	this.handleWelcome(parsed);
                    	break;
                  	case "332":
                    	this.channels[parsed.args[1]].addUpdate("Topic: "+ parsed.trailing);
                    	break;
                  	case "353":
                    	this.channels[parsed.args[2]].addUsers(parsed.trailing);
                    	break;
                  	case "366":
                    	this.channels[parsed.args[1]].showUsers();
                    	break;                       
                  	case "JOIN":
                    	this.handleJoin(parsed);
                    	break;
                  	case "PRIVMSG":
                    	this.handlePrivmsg(parsed);
                    	break;
                  	case "QUIT":
                    	Object.keys(this.channels).forEach((key) => {
                            this.channels[key].handleQuit(parsed);;
                        });
                    	break;
                   	case "PART":
                        this.channels[parsed.args[0]].handlePart(parsed);;
                    	break; 
                   	case "NICK":
                    	Object.keys(this.channels).forEach((key) => {
                            this.channels[key].handleNickChange(parsed);;
                        });
                    	break;
                   	case "KICK":
                    	break;                
                    case "PING":
                    	break;
                    case "PONG":
                    	break;
                 	case "MODE":
                    	if(parsed.args.length > 2){
                          	this.channels[parsed.args[0]].handleModeChange(parsed);
                        } else {
                        	//handle own mode change 
                        }
                    	break;
                	default:
                		this.statusWindow.addText(this.statusWindow.getTimeString(timestamp) + " " + entry + "\r\n" );
            	}
            }
		});
   	}
 
  	parseLine(line, timestamp){
      	let prefix = '';
      	let trailing  = '';	
      	let args = [];
      
        if(line[0] == ':'){
          	prefix = line.substr(1, line.indexOf(" ")-1);
          	line = line.substr(line.indexOf(" ")+1, line.length);
        }
      
      	if(line.indexOf(" :") != -1){
          	args = line.substr(0, line.indexOf(" :")).split(" ");
          	trailing = line.substr(line.indexOf(" :")+2, line.length);
        } else {
          	args = line.split(" ");
        }
      
      	let command = args.shift();
      
      	return {command:command, args:args, trailing:trailing, prefix:prefix, timestamp:timestamp};
    }
  
  	parseUser(prefix){
    	let result = {};
      	result.nick = prefix.substr(0, prefix.indexOf("!"));
      	result.user = prefix.substr(prefix.indexOf("!") + 1, prefix.indexOf("@"));
      	result.host = prefix.substr(prefix.indexOf("@") + 1, prefix.length);      
      	return	result;
    }
  
  	handleWelcome(parsed){
      	this.nick = parsed.args[0];
    }
  
  	handleJoin(parsed){
      	let userInfo = this.parseUser(parsed.prefix);
        let channelName = "";
        if(parsed.args[0] != null){
          channelName = parsed.args[0];
        } else {
          channelName = parsed.trailing;
        }

      	if(userInfo.nick == this.nick){
          	let channie = this.channels[channelName];
          	if(!channie){
            	channie = new ChannelWindow(channelName, this);
                this.tabGroup.addTab(channie.tab);
                this.channels[channelName] = channie;              
            }

          	channie.addUpdate(parsed.prefix + " joined " + channelName);
        } else {
        	this.channels[channelName].addUser(parsed);  
        }
    }
  
  	handlePrivmsg(parsed){
      	let target = parsed.args[0];
      	if(target == this.nick){
        	//Do private convo stuff 
        } else {
        	if(this.channels[target] != null){
              	let user = this.parseUser(parsed.prefix);
              	if(user.nick == ""){
                	user.nick = this.nick; 
                }
              
              	this.channels[target].handleMessage(parsed, user);
            } else {
            	console.log("Got a message but I'm not in channel "+ target); 
            }
        }
    }
}

new Irc();