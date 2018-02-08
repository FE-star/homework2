const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options); 
    this.options = options || {};
  }
  request(options) {
    // 不会做，抄的Elliott-Hu的修改的
    this.options = Object.assign(this.options, options)
    // 可以设置options插件来处理options
    // 可以设置多个options插件
    if(this.hasPlugins("options")){
      this.applyPluginsWaterfall("options", this.options)
    }
    // applyPluginsBailResult:事件流执行过程中，返回第一个不是undefined的值，后续函数不执行
    if(this.hasPlugins("endpoint")){
      return this.applyPluginsBailResult('endpoint', this.options).then(response => {
        // 这段不是很明白
        return !this.applyPluginsBailResult("judge", response)
               ? Promise.resolve(response)
               : Promise.reject(response)
      });
    }
  }
}

module.exports = DB