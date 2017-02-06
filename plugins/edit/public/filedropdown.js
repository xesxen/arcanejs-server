class FileDropdown extends Dropdown{
    constructor(event, file, fileBrowser){
        super(event.clientX,event.clientY);

        this.fileBrowser = fileBrowser;
        this.addItem("New directory");
        this.addItem("New file");
        if(file){
            console.log(file);
            this.addItem("Delete");
            this.addItem("Rename");
        }
        this.show();
    }
}