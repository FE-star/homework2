const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
	this.options = options||{}
  }

  request(options) {
  	if(this.hasPlugins('options')){
  		this.options = Object.assign(options,this.applyPluginsWaterfall('options',this.options))//可以设置不同的options
  	}else{
  		this.options = options || {}
  	}
    return new Promise((resolve,reject) => {
      this.applyPluginsBailResult('endpoint',this.options)//触发事件name，串行的调用注册在事件name上的处理函数（先入先出），传入参数args，如果其中一个处理函数返回值!== undefined，直接返回这个返回值，后续的处理函数将不被执行
        .then( res => {
          if(this.hasPlugins('judge') && this.applyPluginsWaterfall('judge',res)){
          	reject(res)
          }
		  resolve(res)
    	})
    	.catch( res => {
		  reject(res)
    	})
    });
  }
}

module.exports = DB