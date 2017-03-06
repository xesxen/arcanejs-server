class NewFileModal extends Modal{
    constructor(fileBrowser){
        super("New file", true);
        this.fileBrowser = fileBrowser;
        
        this.input = new Input();
        this.input.addEventListener("keyup", (event) => {
            event.preventDefault();
            if (event.keyCode == 13) {
                this.submit();
            }
        });
        
        this.body.addChild(this.input);
        this.onShow = () => {
            this.input.element.focus();
        }
        
        this.ok = new Button("Submit");
        this.ok.onClick = this.submit;
        this.footer.addChild(this.ok);
    }
    
    submit(){
        app.reqManager.post("/api/newfile/"+this.input.value + "?cd=" + this.fileBrowser.pwd(),"", (res) => {
            if(res.status == 200){
                this.hide();
                this.fileBrowser.updateFiles();
            } else {
                console.log(res);   
            }
        });
    }
}
