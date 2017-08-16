const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    super()
    this.options = options
  }
  request (options) {
    if (this.hasPlugins('options')) {
      if (options) {
        this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
      } else {
        this.options = this.applyPluginsWaterfall('options', this.options)
      }
    }
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then((res) => {
        resolve(res)
      })
    })
  }
}

module.exports = DB