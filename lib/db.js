const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options;
  }

  request(options) {
    // TODO
    const opts = this.applyPluginsWaterfall0('options', Object.assign({}, this.options, options));
    return this.applyPluginsBailResult1('endpoint', opts).then(res => !this.applyPluginsBailResult1('judge', res) ? res : Promise.reject(res));
  }
}

module.exports = DB