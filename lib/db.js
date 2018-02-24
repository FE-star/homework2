const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options);
    this.options = options || {};
  }

  request(options) {
    if (this.hasPlugins('options')) {
      var optionsPluginResult = this.applyPluginsWaterfall('options', this.options);
      this.options = options ? Object.assign(options, optionsPluginResult) : optionsPluginResult;
    } else {
      this.options = options;
    }
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options)
        .then((res) => {
          if (this.hasPlugins('judge')) {
            var judgeResult = this.applyPluginsBailResult('judge', res);
            judgeResult ? reject(res) : resolve(res);;
          } else {
            resolve(res);
          }
        })
        .catch((res) => {
          reject(res);
        })
    });
  }
}

module.exports = DB
