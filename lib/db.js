const Tapable = require('tapable');

class DB extends Tapable {
  constructor(options) {
    super(options);
    this.options = options;
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options));//new一个options对象
      this.applyPluginsBailResult('endpoint', opts)
        .then((res) => {
          if(this.applyPluginsBailResult('judge', res, opts)){
            this.applyPluginsWaterfall('error', res, opts);
            reject(res);
          }else {
            this.applyPluginsWaterfall('success', res, opts);
            resolve(res);
          }
        },(res) => {
          this.applyPluginsWaterfall('error', res, opts);
          reject(res);
        })
        .catch((res) => {
          reject(res);
        })
    });
  }
}

module.exports = DB;