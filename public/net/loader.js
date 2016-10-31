class Loader{
	constructor(){
    	return this;
    }
    
  	loadJs(filename){
    	var fileref = document.createElement('script');
    	fileref.setAttribute("type","text/javascript");
    	fileref.setAttribute("src", filename);
    	document.body.appendChild( fileref );      
    }
  
  	loadScripts(scripts, cb){
        let script = scripts.shift();
        let el = document.createElement( 'script' );
        el.onload = () => {
            if ( scripts.length ) {
                this.loadScripts(scripts, cb);
            } else {
              	cb();
            }
        };
      
      	el.src = script;
        document.body.appendChild( el );
    }
  
  	loadStyles(styles, cb){
        let style = styles.shift();
        let el = document.createElement( 'link' );
      	el.setAttribute("rel", "stylesheet")
        el.setAttribute("type", "text/css")
      
        el.onload = () => {
            if ( styles.length ) {
                this.loadScripts(styles, cb);
            } else {
              	cb();
            }
        };
      
      	el.setAttribute("href", style)
        document.body.appendChild( el );
    }  
  
}