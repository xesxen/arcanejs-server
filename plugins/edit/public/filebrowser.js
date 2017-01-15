class FileBrowser extends Window{
  	constructor(editApp){
      	super("Files");
      
      	this.editApp = editApp;
      	this.currentDir = [];
      
 		this.updateFiles();
        return this;
    }

  	updateFiles(){
      	this.panel.clear();
        app.reqManager.get("/api/dir/?cd="+this.pwd(), (req) => {
          	if(req.status == 200){
        		this.parseFiles(JSON.parse(req.responseText));
            } else {
            	console.log(req.responsetext); 
            }
        });
    }
  
  	parseFiles(files){
      	if(this.currentDir.length > 0){
        	this.panel.addChild(new FileItem(null, this));
        }
      
      
    	files.forEach((file, index) => {
          	if(file.isDir){
            	this.panel.addChild(new FileItem(file, this));
            }
        	
        });
      
    	files.forEach((file, index) => {
          	if(!file.isDir){
            	this.panel.addChild(new FileItem(file, this));
            }
        });      
    }
  
    cd(dir){
        if(dir == ".."){
            this.currentDir.pop();
        } else {
            this.currentDir.push(dir);
        }
        this.updateFiles();
    }
  
  	pwd(){
        let result = "/";
        let i = 0;
        while ( i < this.currentDir.length){
            result += this.currentDir[i] + "/";
            i++;
        }
        return result;
    }
  
    open(name){
        let curDir = this.pwd();
		app.reqManager.get("api/file/"+name+"?cd="+curDir, (request) => {
             if(request.status == 200){
                let file = request.responseText;
                this.editApp.open(file);
                console.log(file);
            } else {
                //handleError(request);
            }       
        });
		/*
        var existingTab = null;
        var i = 0;
        while(i < currentTabs.length){
            if(currentTabs[i].name  == name && currentTabs[i].dir == curDir){
                existingTab = currentTabs[i];
                i = currentTabs.length;
            }
            i++; 
        }*/



    };  
  	
}