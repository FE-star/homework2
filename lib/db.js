const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}){
    super();
    this.options = options
  }

  request(options={}){
    options = this.applyPluginsWaterfall('options', options)
    this.options = Object.assign(this.options, options)
    return this.applyPluginsWaterfall('endpoint', this.options)
  }
}

module.exports = DB
