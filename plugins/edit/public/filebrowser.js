class FileBrowser extends Window{
  	constructor(editApp){
      	super("Files");
      
      	this.editApp = editApp;
      	this.currentDir = [];
      	this.updateFiles();
      	
      	this.panel.element.oncontextmenu = (event) => {
            if (event.which == 3) {
                event.stopPropagation();
                const fileDropdown = new FileDropdown(event, null, this);
                return false;
            }
        }
      	
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
        let file = {}
        file.dir = this.pwd();
        file.name = name;
        
        const openEditor = this.editApp.getOpen(file);
        
        if(openEditor){
            openEditor.tab.activate();
        } else {
            app.reqManager.get("api/file/"+file.name+"?cd="+file.dir, (request) => {
                 if(request.status == 200){
                   	file.data = request.responseText;
                    this.editApp.open(file);
                } else {
                    //handleError(request);
                }       
            });            
        }
    }
}