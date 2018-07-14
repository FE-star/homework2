const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }

  request(val) {
    // TODO
    return new Promise((resolve, reject) => {
      const opt = this.options ? this.applyPluginsWaterfall('options', Object.assign({}, this.options, val)) : val;
      this.applyPluginsBailResult('endpoint',  opt).then((res) => {
        const flag = this.applyPluginsBailResult('judge', res);
        if (!flag) {
          resolve(res);
        } else {
          reject(res);
        }
      }, (res) => {
        reject(res);
      })
    })
  }
}

module.exports = DB
