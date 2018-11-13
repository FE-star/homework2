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
    const options = this.applyPluginsWaterfall('options', this.options) || {};
    return new Promise((resolve, reject) => {
      const _option = option ? Object.assign(option, options) : options;
      this.applyPluginsBailResult('endpoint', _option)
        .then((res) => {
          // resolve(res);
          const judge = this.applyPluginsBailResult('judge', res);
          if (!judge) {
            resolve(res)
          } else {
            reject(res)
          }
        });
    });
  }
}

module.exports = DB