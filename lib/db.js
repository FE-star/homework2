const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options;
  }

  request(param){
  	return this.applyPluginsBailResult('endpoint',param)
    // TODO
  }
}

module.exports = DB