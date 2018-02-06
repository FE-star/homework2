const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options || {};
  }

  request(arg) {
    // TODO
    for(var key in arg){
    	if(arg.hasOwnProperty(key)){
    		this.options[key] = arg[key]
    	}
    }
    this.applyPlugins('options',this.options)

    return new Promise((resolve,reject)=>{
    	this.applyPluginsBailResult("endpoint",this.options).then(res=>{
    		if(this._plugins["judge"] && this.applyPluginsBailResult('judge',res)){
    			reject(res)
    		}else{
    			resolve(res)
    		}
    	}).catch(err=>{
    		reject(err)
    	})
    })
  }
}

module.exports = DB