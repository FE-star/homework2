const Tapable = require('tapable')


class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
   this.options = options;
    
  }

  request(options) {
      // TODO
    return new Promise((resolve,reject) => {
    	const opts = this.applyPluginsWaterfall('options' , 
    		Object.assign({},this.options,options));

    	this.applyPluginsBailResult('endpoint',opts)
    		.then(res => {
    			const hasError = this.applyPluginsBailResult('judge',res,opts)  
  
    			if(hasError === true){
    				res = this.applyPluginsWaterfall('error',res,opts)
    				reject(res);
    			}else {
       				res = this.applyPluginsWaterfall('success',res,opts);
    				resolve(res);
    			}
    		},res =>{
    			res = this.applyPluginsWaterfall('error',res,opts)
    			reject(res);
    		});
    })

  }
}

module.exports = DB