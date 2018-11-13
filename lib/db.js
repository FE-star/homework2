const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    // TODO
    super(options)
    this.options = options
  }
  // https://www.cnblogs.com/QH-Jimmy/p/8036962.html
  request(option) {
    // TODO
    let _option = option || this.options
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', _option)
        .then((res) => {
          resolve(res)
        })
    })
  }
}

module.exports = DB