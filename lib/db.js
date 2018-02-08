const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    // 支持设置options
    this.options = options || {}
  }

  request(opts) {
    opts = opts || {}

    let opt = this.applyPluginsWaterfall('options', opts)
    Object.assign(this.options, opt)

    // 设置endpoint插件
    let pluginResult = this.applyPluginsBailResult('endpoint', this.options)

    if (!pluginResult) {
      return Promise.reject('options is error')
    }

    return new Promise((resolve, reject) => {
      pluginResult.then(
        res => {
          if (!this.applyPluginsBailResult('judge', res)) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        res => {
          reject(res)
        }
      )
    })
  }
}

module.exports = DB
