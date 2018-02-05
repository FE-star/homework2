const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {}
  }

  request(options) {
    let params = this.hasPlugins("options") 
                 ? this.applyPluginsWaterfall("options", Object.assign({}, options, this.options))
                 : Object.assign({}, options, this.options)

    return this.applyPluginsBailResult('endpoint', params).then(
      response => !this.hasPlugins("judge") || !this.applyPluginsBailResult("judge", response)
                  ? Promise.resolve(response)
                  : Promise.reject(response)
    );

    

  }
}

module.exports = DB