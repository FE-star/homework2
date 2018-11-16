const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options || {};
  }

  request(options2) {
    // TODO
    // 设置options插件
    Object.assign(this.options, options2);
    let options3 = this.applyPluginsWaterfall('options', this.options);
    // console.log(options3);
    Object.assign(this.options, options3);
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options)
        .then((res) => {

          let unequalZero = this.applyPluginsBailResult('judge', res)
          if (!unequalZero) {
            resolve(res)
          }
          else {
            reject(res)
          }
        }, () => {
          reject()
        })
    })
  }
}

module.exports = DB