const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}) {
    // TODO
    super();
    this.options = options;
  }

  request(options) {
    // TODO
    var optionsArr = Object.assign(this.options,options);
    this.applyPluginsWaterfall('options',optionsArr);
  }
}

module.exports = DB