const Tapable = require('tapable')

class DB extends Tapable {


  constructor(options) {
    super(options)
    this.options = options;
  }


  request(param){
  	//merge param
  	this.param = this.applyPluginsWaterfall('options',this.options)
  	if(param&&this.param){
  		param = Object.assign(param,this.param)
  	}


  	let ret = this.applyPluginsBailResult('endpoint',param)


  	return new Promise((resolve,reject)=>{
		ret.then((res)=>{
  			if(this.applyPluginsBailResult('judge',res)){
  				reject(res)
  			}
  			else{
  				resolve(res)
  			}
  		},(rej)=>{
  			reject(rej)
  		})
  	})
  }
}

module.exports = DB