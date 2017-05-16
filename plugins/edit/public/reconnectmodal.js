class ReconnectModal extends Modal{
    constructor(editApp, ids){
        super("Reconnect terminals", true);
        this.body.setText("You currently have terminals open on the server. Do you want to reconnect?");
        this.edit = editApp;
        this.ids = ids;
        this.ok = new Button("Yes please!");
        this.ok.onClick = () => {this.submit()};
        this.footer.addChild(this.ok);
    }
    
    submit(){
        this.ids.forEach((id) => {
            this.edit.openTerminal(id);
            this.hide();
        });
    }
}
