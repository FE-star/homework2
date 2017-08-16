const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options
  }

  request(options) {
    return new Promise( (resolve) => {
      resolve(this.applyPluginsBailResult('endpoint', options))
    })
  }
}

module.exports = DB