const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options
  }

  hasOptionsPlugin() {
    return this.options && this.options.init;
  }

  request(option) {
    if (this.hasOptionsPlugin()) { // 含有options插件
      this.applyPluginsWaterfall('options', this.options);
    }
    var retResult = this.applyPluginsBailResult('endpoint', Object.assign({}, option, this.options));
    if (this.hasPlugins('judge')) {
      return retResult.then((res) => {
        if (this.applyPluginsBailResult('judge', res)) {
          return Promise.reject(res);
        } else {
          return Promise.resolve(res);
        }
      })
    } else {
      return retResult;
    }
  }
}

module.exports = DB
