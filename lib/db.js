const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super()
    this.options = options || {}
  }
  // compile(options) {
	// 	factory.setup(this, options);
	// 	return factory.create(options);
	// }
  request(options) {
    this.options = Object.assign(this.options, options)
    this.options = this.applyPluginsWaterfall('options', this.options)
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then(res => {
        if (!this.applyPluginsBailResult('judge', res)) {
          resolve(res)
        } else {
          reject(res)
        }
      }, res => {
        reject(res)
      })
    })
    // TODO
  }
}

module.exports = DB