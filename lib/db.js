const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options || {}
  }

  request(params) {
    this.plugin('options', (options) => {
      for(let i in options){
        this.options[i] = options[i]
      }
      return this.options
    })
    this.applyPluginsWaterfall('options', params)
    return new Promise( (resolve, reject) => {
      //要resolve,所以多个插件方法只能执行一个
      // resolve(
      //   this
      //     .applyPluginsBailResult('endpoint', this.options)
      //     .then( res => {
      //       let isReject = his.applyPluginsWaterfall('judge', res.res)
      //       if(res){
      //         return reject(res)
      //       }
      //       return res
      //     })
      // )
      resolve(this.applyPluginsBailResult('endpoint', this.options))
    })
  }
}

module.exports = DB
