const Tapable = require('tapable')
class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options||{}; 
  }

  request(options={}) {
    // TODO
    let options2 = Object.assign(options,this.applyPluginsWaterfall('options',this.options))
    return this.applyPluginsBailResult('endpoint',options2).then(res=>{
        if(this.applyPluginsBailResult('judge',res)){
          return Promise.reject(res);
        }else{
          return Promise.resolve(res);
        }
    })
    
    
  }
}

module.exports = DB