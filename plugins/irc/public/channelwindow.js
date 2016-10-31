class ChannelWindow extends IrcWindow{
	constructor(title, irc){
    	super(title);
      	this.target = title;
      	this.connection = irc;
      
      	this.users = {};
      	return this;
    }
  
  	handleKeyDown(e){
     	if (e.keyCode == 13) {
          	let value = this.input.value;
          	if(value.charAt(0) == "/"){
              	app.socketManager.emit("irc raw", value.substr(1, value.length));
            } else {
                let message = "PRIVMSG " + this.target + " :" + value;
                this.addText(this.getTimeString() + " " + "<" + this.connection.nick + "> " + value + "\r\n");
                app.socketManager.emit("irc raw", message);             
            }
          	this.input.value = "";
        }
    }
  
  	handleMessage(parsed, user){
        this.addText(this.getTimeString(parsed.timestamp) + " " + "<"+ this.users[user.nick].prefix+ user.nick + "> " + parsed.trailing + "\r\n");      
    }
  
  
  	handleNickChange(parsed){
    	let user = this.connection.parseUser(parsed.prefix);
      	if(this.users[user.nick]){
        	this.users[parsed.args[0]] = this.users[user.nick];
          	this.users[user.nick] = null;
        	this.addUpdate(parsed.prefix + " changed nick to: " + parsed.args[0]); 	
        }
    }
  
  	handleModeChange(parsed){
      	let nick = parsed.args[2];
      	let mode = parsed.args[1];
      	let user = this.users[nick];
    	this.addUpdate(parsed.prefix + " sets mode " + mode + " " + nick);
           	      
      	if(mode.charAt(0) == "+"){
        	 switch(mode.charAt(1)){
            	case "o":
					user.o=true;
                    user.prefix = "@";	  
                	break;
            	case "h":
					user.h=true;
                 	if(!user.o){
						user.prefix = "%";
                    }
                	break;
                case "v":
 					user.v=true;
                 	if (!user.o && !user.h){
                    	user.prefix = "+";
                    }                	
                	break;
            }          
        } else {

        	 switch(mode.charAt(1)){
            	case "o":
					user.o=false;
                 	if(user.h){
                    	user.prefix = "%";	  
                    } else if (user.v){
                    	user.prefix = "+";	
                    } else {
                    	user.prefix = " ";
                    }
                	break;
            	case "h":
					user.h=false;
                 	if(!user.o){
                        if (user.v){
                            user.prefix = "+";	
                        } else {
                            user.prefix = " ";
                        }
                    }
                	break;
                case "v":
 					user.v=false;
                 	if (!user.o && !user.h){
                    	user.prefix = " ";
                    }                	
                	break;
            }
        }
    }
  	
  	addUpdate(update, timestamp){
    	this.addText(this.getTimeString(timestamp) + " -!- " + update + "\r\n");
    }
  
  	addUser(parsed){
    	let user = this.connection.parseUser(parsed.prefix);
      	this.users[user.nick] = {nick:user.nick, prefix:" "};
      	this.addUpdate(parsed.prefix + " joined " + this.target);
    }
  
  	addUsers(users){
    	let rawUsers = users.split(" ");
      	let user;
    	let i = 0;
      	while(i < rawUsers.length){
        	switch(rawUsers[i].charAt(0)){
            	case "@":
                	user = rawUsers[i].substr(1, rawUsers[i].length);
                	this.users[user] = {nick:rawUsers[i].slice(1), prefix:"@", o:true, v:false, h:false };  	
                	break;
            	case "%":
                	user = rawUsers[i].substr(1, rawUsers[i].length);
                	this.users[user] = {nick:rawUsers[i].slice(1), prefix:"%", o:false, v:false, h:true };  	
                	break;
                case "+":
                	user = rawUsers[i].substr(1, rawUsers[i].length);
                	this.users[user] = {nick:rawUsers[i].slice(1), prefix:"+", o:false, v:true, h:false };  	
                	break;    
                default:
                	user = rawUsers[i];
                	this.users[user] = {nick:rawUsers[i], prefix:" ", o:false, v:false, h:false };  	
                	break;
            }
        	i++; 
        }
    }
  
  	handleQuit(parsed){
      	let user = this.connection.parseUser(parsed.prefix);
      	this.users[user] = null;
      	this.addUpdate(parsed.prefix + " has quit: " + parsed.trailing);
    }
  
  	handlePart(parsed){
      	console.log(parsed)
      	let user = this.connection.parseUser(parsed.prefix);
      	this.users[user] = null;
      	this.addUpdate(parsed.prefix + " has left " + this.target);
    }  
  
  	showUsers(){
    	let usersString = "Users: ";
      
      	Object.keys(this.users).forEach((entry) => {
          	if(this.users[entry] != null){
              	usersString += this.users[entry].prefix + entry + " ";
            }
        	
        });
      
      	this.addUpdate( usersString );
    }
}