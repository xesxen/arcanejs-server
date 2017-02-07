class FileDropdown extends Dropdown{
    constructor(event, file, fileBrowser){
        super(event.clientX,event.clientY);
        console.log(fileBrowser);
        this.fileBrowser = fileBrowser;
        this.addItem("New directory", () => {new NewDirModal(fileBrowser)});
        this.addItem("New file", () => {new NewFileModal(fileBrowser)});
        if(file){
            this.addItem("Delete", () => {new DeleteModal(fileBrowser, file)});
        }
        this.show();
    }
}