class Cache {
    constructor(express, app, io, rootDir){
        let md5 = require('md5');
        this.fs = require('fs');
        this.express = express;
        this.app = app;
        this.io = io;
        this.rootDir = rootDir;
        
        console.log("Initialising cache...");
        this.items = {};
        
        app.post('/api/cache/getpackhash', (req, res)=>{
            let files = req.body.manifest;
            let hash = md5(files.toString());
        	
        	if(this.items[hash] === undefined){
        	    let pack = this.readFiles(files);
             	let item = {
            	    js : pack.js,
            	    css: pack.css,
            	    timeStamp : new Date().getTime()
            	}
            	
            	this.items[hash] = item;
            	res.send({hash:hash, timeStamp: item.timeStamp});   	    
        	} else {
        	    res.send({hash:hash, timeStamp: this.items[hash].timeStamp});
        	}
        });
        
        app.get('/api/cache/pack/:hash', (req, res) => {
            let splitParams = req.params.hash.split(".");
            let hash = splitParams[0];
            let type = splitParams[1];
            if(this.items[hash] !== undefined){
                if(type === "css"){
                    res.contentType("blaat.css");
                    res.send(this.items[hash][type]);
                } else if(type === "js"){
                    res.send(this.items[hash][type]);
                } 
                else {
                    res.statusCode = 404;
                    res.send("Not found");                    
                }
            } else {
                res.statusCode = 404;
                res.send("Not found");  
            }
        });
    }
    
    readFiles(files){
        let result = {js:"", css:""};
        let i = 0;
        while( i < files.length ){
            let file = files[i];
            i++;
            
            let subDir = "/public/";
            
            if(file.startsWith("/apps/")){
                subDir = "/plugins/";
                
                let pluginName = file.split("/")[2];
                
                file = file.replace("/apps/"+pluginName, pluginName+"/public");
            }
            
            let fullPath = this.rootDir + subDir + file; //TODO: Fix directory traversal
            if(file.endsWith(".js")){
                result.js += this.fs.readFileSync(fullPath);
                
            } else if(file.endsWith(".css")){
                console.log(fullPath);
                let css = this.fs.readFileSync(fullPath);
                this.fs.readFileSync(fullPath);
                result.css += css;
            }
        }
        
        return result;
    }
}

module.exports = function ( express, app, io, rootDir) {
    return new Cache(express, app, io, rootDir);
}