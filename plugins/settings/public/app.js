class Settings extends BaseApp{
  	constructor(){
		super("cog");
      	
      	include([
          	"/apps/settings/app.css",
        ], () =>{
        	this.init();
        });
    }
  
  	init(){
      	this.item.handleClick();
        this.row = new Div("Row");
        this.view.addCssClass("darkview");
      	this.view.addChild(this.row);
      	
        this.newWatcher("Events/min", 16, 3);
      	this.newWatcher("Critical devices", 23, 3);
        this.newWatcher("Prio1", 24, 3);
        this.newDonutChart("Detection types");
      	this.newLineChart("Events over time");
    }
  
  	newPostcard(title, colsm, colmd){
       	let postcard = new Div("postcard col-sm-" + colsm + " col-md-" + colmd);
      	postcard.addChild( new Div("postcardTitle").setText(title));
      	this.row.addChild(postcard);
      	return postcard;
    }
  
  	newDonutChart(title){
    	let postcard = this.newPostcard(title, 6, 3);
     	let chart = new Div();
      	chart.height=200;
      	postcard.addChild(chart);

        Morris.Donut({
            element: chart.element,
            data: [
              {value: 70, label: 'foo'},
              {value: 15, label: 'bar'},
              {value: 10, label: 'baz'},
              {value: 5, label: 'A really really long label'}
            ],
            backgroundColor: 'rgba(0,0,0,0)',
            labelColor: 'rgba(255,255,255,0.4)',
            colors: [
              '#fff',
              '#bbb',
              '#999',
              '#777',
              '#555'
            ],
            formatter: function (x) { return x + "%"}
          });
    }
  
  	newWatcher(title, value){
     	let postcard = this.newPostcard(title, 6, 3);
     	let chart = new Div('watchvalue').setText(value);
      	postcard.addChild(chart);   
      
            	postcard.addChild(new Div('watchdetail').setText("+3%"));
    }
  
  	newLineChart(title){
    	let postcard = this.newPostcard(title, 12, 12);
      	postcard.height = 380;
     	let chart = new Div();
      	postcard.addChild(chart);
        new Morris.Area({
          // ID of the element in which to draw the chart.
          element: chart.element,
          // Chart data records -- each entry in this array corresponds to a point on
          // the chart.
          data: [
            { year: '2008', value: 20 },
            { year: '2009', value: 10 },
            { year: '2010', value: 5 },
            { year: '2011', value: 5 },
            { year: '2012', value: 20 }
          ],
          goalStrokeWidth:10,
          lineColors: ['#aaa'],
          lineWidth:1,
          pointSize:2,
          fillOpacity:0.1,
          smooth:false,
          // The name of the data record attribute that contains x-values.
          xkey: 'year',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['value'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['Value']
        });
    }
  
}

new Settings();