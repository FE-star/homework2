const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    // TODO
    super(options);
    this.options = options || {};
  }

  request (options = {}) {
    // TODO
    let opt = this.applyPluginsWaterfall("options", Object.assign(options, this.options));

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', opt).then((res) => {
        if (this.applyPluginsBailResult('judge', res)) {
          reject(res);
        }
        resolve(res);
      }, (error) => {
        reject(error);
      })
    });
  }
}

module.exports = DB