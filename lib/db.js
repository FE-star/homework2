const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {}
  }

  request(options) {

    let _options = Object.assign({}, this.options, options)

    // this.applyPlugins('options', _options)
    // let result = this.applyPluginsBailResult('endpoint', _options)
    // return Promise.resolve(result)
    //   .then((res) => {
    //     if (this.hasPlugins('judge')) {
    //       return this.applyPluginsBailResult('judge', res) ? Promise.reject(res) : Promise.resolve(res)
    //     } else {
    //       return Promise.resolve(res)
    //     }
    //   })

    return new Promise((resolve, reject) => {
      _options = this.applyPluginsWaterfall('options', _options)
      this.applyPluginsBailResult('endpoint', _options)
        .then(res => {
          if (this.applyPluginsBailResult('judge', res)) {
            reject(res)
          } else {
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = DB