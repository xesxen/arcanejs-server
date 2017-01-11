class ThreatMap extends BaseApp{
  	constructor(){
		super("globe");
      	this.manifest = [
			"http://d3js.org/d3.geo.projection.v0.min.js",
			"http://d3js.org/topojson.v1.min.js",
          	"/apps/threatmap/threatmap.css"
        ]
      	
        include(["http://d3js.org/d3.v3.min.js"], () => {
            include(this.manifest, () => {
                this.draw();
            });
        });
      	
      	this.map = new Div("threatMap");
      	this.view.addChild(this.map);
		this.overlay = new Div("threatOverlay").addChild(new H3("CYBER Attack map *pew* *pew* *pew*"));
      
    }
  	
  	draw(){
      	this.item.handleClick();
      	console.log(this.view.height);
      	console.log("blaat");

        var projection = d3.geo.miller()
            .scale(230)
            .translate([this.view.width / 2, this.view.height / 2])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection);

        var graticule = d3.geo.graticule();

        var svg = d3.select(this.map.element).append("svg")
            .attr("width", this.view.width)
            .attr("height", this.view.height);

        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        d3.json("/apps/threatmap/world.json", function(error, world) {
          if (error) throw error;

          svg.insert("path", ".graticule")
              .datum(topojson.feature(world, world.objects.land))
              .attr("class", "land")
              .attr("d", path);

          svg.insert("path", ".graticule")
              .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
              .attr("class", "boundary")
              .attr("d", path);
        });

        d3.select(self.frameElement).style("height", this.view.height + "px");
		
      	this.view.addChild(this.overlay);
    }
}

new ThreatMap();