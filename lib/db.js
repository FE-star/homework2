const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options = {}) {
    // TODO
    super(options)
    this.options = options
  }

  request(options = {}) {
    // TODO
    this.options = this.applyPluginsWaterfall('options', 
      Object.assign(this.options, options)
    )
    
    return this.applyPluginsBailResult('endpoint', this.options)
      .then((response) => {
        return this.applyPluginsBailResult('judge', response)
          ? Promise.reject(response)
          : Promise.resolve(response)
      })
  }
}

module.exports = DB