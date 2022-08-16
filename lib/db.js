const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options=options||{};
  }

  request(option) {
    return new Promise((resolve,reject)=>{
      //合并option
      this.options=Object.assign(this.options,option)
      //处理option
      this.options=this.applyPluginsWaterfall('options',this.options)
      //调用endpoint插件
      this.applyPluginsBailResult('endpoint',this.options).then((res)=>{
          //判断返回是否正确
          if(!this.applyPluginsBailResult('judge', res)){
            resolve(res)
          }else{
            reject(res)
          }
      },(err)=>{
          reject(err)
      })
    })
  }
}

module.exports = DB