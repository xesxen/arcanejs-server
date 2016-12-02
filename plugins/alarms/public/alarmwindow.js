class AlarmWindow extends Window{
  	constructor(alarmApp){
      	super("Alarms");
      	this.alarmApp = alarmApp;
		this.getAlarms();
      	return this;
    }
  
  	getAlarms(){
    	let alarms = [
          	{
          		name:"Alarm 1",
              	severity:9,
              	timestamp:"123123123",
              	customer:"Testklant",
              	details:{
                	"Customer":{"Contact Persoon":"Die Gast", "Telefoon nummmer":"040-123456673"},
                  	"User":{"Username":"d_gast"}
                }
          	},{
          		name:"Alarm 2",
              	severity:3,
              	timestamp:"123123123",
              	customer:"Jemoeder",
              	details:{}
          	},{
          		name:"Alarm 3",
              	severity:6,
              	timestamp:"123123123",
              	customer:"Je Oma",
              	details:{}
          	},{
          		name:"Alarm 4",
              	severity:4,
              	timestamp:"123123123",
              	customer:"Blaat",
              	details:{}
          	},{
          		name:"Alarm 5",
              	severity:7,
              	timestamp:"123123123",
              	customer:"Batman",
              	details:{}
          	},{
          		name:"Alarm 6",
              	severity:5,
              	timestamp:"123123123",
              	customer:"Testklant",
              	details:{}
          	},{
          		name:"Alarm 7",
              	severity:1,
              	timestamp:"123123123",
              	customer:"Testklant",
              	details:{}
          	}
        ];
      
      	alarms.forEach(	(element) => {
        	this.panel.addChild( new AlarmItem(element, this.alarmApp) );
        });
                       
      	return alarms;
    }
}