const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // this
    super(options)
    this.options = options
  }

  request(options) {
    let plugins = Object.keys(this._plugins)
    
    if (options) Object.assign(this.options, options)

    let cb

    plugins.forEach((plugin) => {
      cb = this.applyPluginsWaterfall(plugin, this.options)
      console.log(plugin, this.options, cb)      
    })
    return cb
  }
}

module.exports = DB