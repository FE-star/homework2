const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options || {}
  }

  request(params) {
    this.plugin('options', (options) => {
      for (let i in options) {
        this.options[i] = options[i]
      }
      return this.options
    })
    this.applyPluginsWaterfall('options', params)
    return new Promise((resolve, reject) => {
      return this
        .applyPluginsBailResult('endpoint', this.options)
        .then(
          res => {
           let isReject = this.applyPluginsWaterfall('judge', res)
           if (!!isReject && isReject != res) {
            reject(res)
           }
           resolve(res)
          },
          reject
        )
    })
  }
}

module.exports = DB
