const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options
    console.log("hello1")
}

  request(options) {
    // TODO
    console.log("hello2")

   // return this.applyPluginsAsync("endpoint")
   if (this.hasPlugins("options")) {
   	this.applyPluginsWaterfall("options",options,(res)=>{options=res})
   	//console.log(options)
   }

    return new Promise((resolve,reject)=>{
    	
    	this.applyPluginsBailResult("endpoint",options).then((res)=>{
    		//console.log(res)
    		resolve(res)})
    		
    	
    })
    
   
  }
}

module.exports = DB