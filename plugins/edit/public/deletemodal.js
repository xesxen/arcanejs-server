class DeleteModal extends Modal{
    constructor(fileBrowser, file){
        super("New dir", true);
        this.file = file;
        this.fileBrowser = fileBrowser;
        console.log(file);
        this.body.setText("You are about to delete "+ this.fileBrowser.pwd() + file.name +" THERE IS NO UNDO, are you sure?");
        
        this.ok = new Button("Submit");
        this.ok.onClick = () => {this.submit()};
        this.footer.addChild(this.ok);
    }
    
    submit(){
        app.reqManager.post("/api/delete?cd=" + this.fileBrowser.pwd() + this.file.name ,"", (res) => {
            if(res.status == 200){
                this.hide();
                this.fileBrowser.updateFiles();
            } else {
                console.log(res);   
            }
        });
    }
}
