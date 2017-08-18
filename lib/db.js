const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options || {};
  }

  request(options) {
    // TODO
    Object.assign(this.options, options || {});
    this.applyPluginsWaterfall('options',this.options);
    var _promise = this.applyPluginsBailResult('endpoint',this.options);
    return _promise.then((res)=>{
      if(this.hasPlugins('judge')){
        var judgeRes = this.applyPluginsBailResult('judge',res);
        if(judgeRes){
          return Promise.reject(res);
        }else{
          return Promise.resolve(res);
        }
      }
      return Promise.resolve(res);
    },(res)=>{
      return Promise.reject(res);
    });
  }
}

module.exports = DB