const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options
  }

  request(options) {
    // TODO
    if (this.hasPlugins('options')) {
      if (options) {
        this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
      } else {
        this.options = this.applyPluginsBailResult('options', this.options)
      }
    } else {
      this.options = options
    }

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then((res) => {
        if (this.hasPlugins('judge')) {
          if (this.applyPluginsBailResult('judge', res)) {
            reject(res)
          } else {
            resolve(res)
          }
        } else {
          resolve(res)
        }
      }).catch((res) => {
        reject(res)
      })
    })
  }
}

module.exports = DB