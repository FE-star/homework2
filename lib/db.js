const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    // TODO
    super(options);
    this.options = options;
  }
  // https://www.cnblogs.com/QH-Jimmy/p/8036962.html
  request(option) {
    // TODO
    // 设置options插件
    let options = this.applyPluginsWaterfall('options', this.options) || {};
    return new Promise((resolve, reject) => {
      let _option = option ? Object.assign(option, options) : options;
      this.applyPluginsBailResult('endpoint', _option)
        .then((res) => {
          resolve(res);
        });
    });
  }
}

module.exports = DB