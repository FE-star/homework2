const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options = {}) {
    // TODO
    super(options)
    this.options = options;
  }

  request(options = {}) {
    // TODO
    const opts = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
    return this.applyPluginsBailResult('endpoint', opts).then(result => { 
      if (!this.applyPluginsBailResult('judge', result)) { 
        return Promise.resolve(result)
      } else {
        return Promise.reject(result)
      }
    })
  }
}

module.exports = DB