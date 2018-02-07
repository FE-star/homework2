const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // 在class中，使用this之前，必须先调用super()
    super(options)
    this.options = options || {}
  }

  request(options) {

    options = options || {}

    // 先入先出,事件：options
    let opts = this.applyPluginsWaterfall('options',options)
    Object.assign(this.options,opts)

    // 先入先出,事件:endpoint
    let result = this.applyPluginsBailResult('endpoint',this.options)

    // 判断result是否Promise
    if(!result || typeof result.then !== 'function'){
        return Promise.reject(result)
    }

    // 使用Promise
    return new Promise((resolve, reject) => {
        result.then(res => {
            // 判断插件结果是否正确:judge
            if(!this.applyPluginsBailResult('judge',res)){
                resolve(res)
            }else{
                reject(res)
            }
        },res => {
            reject(res)
        })
    })


  }
}

module.exports = DB
