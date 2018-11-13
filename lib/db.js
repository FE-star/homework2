const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    // TODO
    super(options)
    this.options = options
  }

  request(obj) {
    // TODO
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options)
        .then((res) => {
          resolve(res)
        })
    })
  }
}

module.exports = DB