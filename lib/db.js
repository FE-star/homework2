const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super()
    this.options = options||{};
  }	
  
  request(value={}) {
    // TODO
    let _plugins = this._plugins,options = this.options;
    Object.assign(options, value)
    if(_plugins.length <= 0) return;
    return new Promise((resolve,reject)=>{    	
    	if(this.hasPlugins("options")){
    		_plugins["options"].forEach(()=>{Object.assign(options, this.applyPluginsWaterfall("options",options))})
    	}

      	this.applyPluginsBailResult("endpoint",options).then((data)=>{
      		if (this.hasPlugins("judge")) {
	           if (this.applyPluginsWaterfall("judge",data)) {
	               reject(data)
	             } else {
	               resolve(data)
	             }
	           } else {
	     		   resolve(data)
	           }
       }).catch((data) => {reject(data)})    	
     })   
  }
}

module.exports = DB
