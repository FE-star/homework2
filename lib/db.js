const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options;
  }

  request(options = {}) {
    // TODO
    this.applyPlugins('options', this.options);
    return this.applyPluginsBailResult('endpoint', Object.assign(options,this.options || {}))
    .then(res => {
      return !this.applyPluginsBailResult('judge', res) ? Promise.resolve(res) : Promise.reject(res);
    },
    err => {
      return Promise.reject(err);
    }
  )

  }
}

module.exports = DB