const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options || {}
  }

  request(options) {
    if(this.hasPlugins('options')) {
      options = options? Object.assign(options, this.applyPluginsWaterfall('options', this.options)) : this.applyPluginsBailResult('options', this.options)
    }

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', options)
        .then(res => {
          if(!this.hasPlugins('judge') || !this.applyPluginsBailResult('judge', res)) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = DB