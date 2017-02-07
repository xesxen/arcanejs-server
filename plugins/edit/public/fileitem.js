class FileItem extends Div{
  	constructor(file, fileBrowser){
      	super("fileItem unselectable");
      	this.fileBrowser = fileBrowser;	
      
      	if(file !== null){
         	this.file = file;
            if(file.isDir){
                this.setText("/" + file.name);
              	this.onClick= () => {
                	this.fileBrowser.cd(file.name);
                }
            } else {
                this.setText(file.name);
                this.onClick= () => {
                	this.fileBrowser.open(file.name);
                }
            }
        } else {
          	this.setText("/..");
          	this.onClick= () => {
            	this.fileBrowser.cd("..");
            }
        }
        
        this.element.oncontextmenu = (event) => {
            if (event.which == 3) {
                event.stopPropagation();
                const fileDropdown = new FileDropdown(event, this.file, this.fileBrowser);
                return false;
            }
        }
    }
}