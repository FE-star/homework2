const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options = {}) {
    super(options)
    this.options = options
  }

  request(params = {}) {
    // 先执行options插件，使用applyPluginsWaterfall是因为endpoint要使用其返回值
    if (this.hasPlugins("options")) {
      this.applyPluginsWaterfall("options", params)
    }

    let _params = Object.assign(params, this.options)

    return new Promise((resolve, reject) => {
      return this.applyPluginsBailResult("endpoint", _params)
        .then(res => {
          if (this.hasPlugins("judge")) {
            if (this.applyPluginsBailResult("judge", res)) {
              resolve(res)
            } else {
              reject(res)
            }
          } else {
            resolve(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = DB