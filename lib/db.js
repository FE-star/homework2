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
    if(this._plugins.length <= 0) return;
    //返回一个总的Promise代理，Judge插件根据总代理里的逻辑判断指定最后的回调函数
    return new Promise((resolve,reject)=>{ 
      //如果有options插件则进行options参数的扩展
      if(this.hasPlugins("options")){
        _plugins["options"].forEach(()=>{Object.assign(options, this.applyPluginsWaterfall("options",options))})
      }
      //如果有安装了judge插件，则需根据endpoint插件绑定的异步事件计算结果进行判断，指定下一步操作
      this.applyPluginsBailResult("endpoint",options).then((data)=>{
         if (this.hasPlugins("judge") && this.applyPluginsWaterfall("judge",data)) {
            //如果judge通过，则返回reject方法
            reject(data)
           } else {
            resolve(data)
           }
      }).catch((data) => {reject(data)})    
    })
  }
}

module.exports = DB
