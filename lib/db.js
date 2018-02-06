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
    return this.applyPluginsBailResult("endpoint",this.options).then(res=>{
    	if (this._plugins["judge"]) {
    		if (this.applyPluginsBailResult('judge',res)) {
    			return new Promise((resolve,reject) => {reject(res)})
    		}else{
    			return new Promise((resolve) => {
		            setTimeout(() => {
		              resolve(res)
		            }, 0)
		          })
    		}
    	}else{
    		return new Promise((resolve) => {
            setTimeout(() => {
              resolve(res)
            }, 0)
          })
    	}
    })
  }
}

module.exports = DB