const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options
  }

  request(options) {
    // TODO
    if (this.hasPlugins("options")) {
      options = Object.assign(this.options, options)
   	  //options.init = this.options.init
   	  this.applyPluginsWaterfall("options",options,(res)=>{options=res})
    }
    return new Promise((resolve,reject)=>{    	
    	this.applyPluginsBailResult("endpoint",options).then((res)=>{
        if (this.hasPlugins("judge")) {
          if (this.applyPluginsBailResult("judge",res)) {
              reject(res)
            } else {
              resolve(res)
            }
          } else {
    		    resolve(res)
          }
      },()=>{reject()})    	
    })   
  }
}

module.exports = DB