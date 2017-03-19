class Ticker{
    constructor(){
        this.container = new Div("ticker_container");
        this.topTicker = new Div("ticker_top");
        this.topTicker.targetX = 0;
        this.container.addChild(this.topTicker);
        
        this.bottomTicker = new Div("ticker_bottom");
        this.bottomTicker.targetX = 0;
        this.container.addChild(this.bottomTicker);
        
        this.addItem("< berm> Sinds dat ik in 2600nl zit, ben ik nogal verpauperd");
        this.addItem("|");
        this.addItem("< sj0rz> 0day is het ruwe grondmateriaal voor kibbeling/");
        this.addItem("|");
        this.addItem("<@flunk> als dat mijn zusje was... zou ik dr zelf doen <@flunk> nohomo");
        this.addItem("|");
        this.addItem("<%flunk> weet je wat pas pijnlijk is?! <+Nissima> uitscheuren");
        this.addItem("|");
        
        this.addStock("1:EINDBAZEN", true , 9001);
        this.addStock("2:DRAGONSECTOR", false , 3451);
        this.addStock("3:WICS", false , 2366);
        this.addStock("4:STRATUMAUHUUR", true , 2146);
        this.addStock("5:DIEGAST", true , 1346);
        this.addStock("6:LAFFEKOREANEN", true , 1114);
        this.addStock("7:JEMOEDER", false , 100);
        this.addStock("8:SLINGSMOEDER", false , 100);
        this.addStock("9:BLASTY", false , 0);


        window.requestAnimationFrame(() => {this.update()});
        this.container.show();
    }
    
    addItem(title){
        let item = new TickerItem(title);
        this.topTicker.addChild(item);
    }
    
    addStock(title, isUp, score){
        let item = new StockItem(title, isUp, score);
        this.bottomTicker.addChild(item);           
    }
    
    update(){
        this.topTicker.targetX = this.topTicker.targetX - 1.5;
        this.bottomTicker.targetX = this.bottomTicker.targetX - 1;
        
        this.updateTicker(this.topTicker);
        this.updateTicker(this.bottomTicker);

        window.requestAnimationFrame(() => {this.update()});
    }
    
    updateTicker(ticker){
        ticker.x = ticker.targetX;
        let firstChild = ticker.children[0];
        
        if((ticker.x * -1) >= firstChild.width){
            ticker.targetX += firstChild.width;
            ticker.x = ticker.targetX;
            ticker.removeChild(firstChild);
            ticker.addChild(firstChild);
        }        
    }
}

class TickerItem extends Div{
    constructor(title){
        super("ticker_item");
        this.setText(title);
        return this;
    }
}

class StockItem extends Div{
    constructor(title, isUp, score){
        super("ticker_item");
        this.addChild(new Element("Span").setText(title));
        
        if(isUp){
            this.addChild(new Element("Span", "glyphicon glyphicon-triangle-top green stockTriangle"));
        } else {
            this.addChild(new Element("Span", "glyphicon glyphicon-triangle-bottom red stockTriangle"));
        }

        this.addChild(new Element("Span").setText(score));
        return this;
    }
}

window.onload = () => {
    new Ticker();
}
