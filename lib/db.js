const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    // this.options = Object.assign(options)
    this.options = options;
  }

  request(params = {}) {
    // TODO
    // 设置options插件
    let options = this.applyPluginsWaterfall('options', this.options) || {};

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', Object.assign(params, options))
        .then((res) => {
          let judge = this.applyPluginsBailResult('judge', res);
          if(!judge) {
            resolve(res)
          }else {
            reject(res)
          }
        }, () => {
          reject()
        })
    })
  }
}

module.exports = DB