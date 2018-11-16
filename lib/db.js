const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options);
    this.options = options;
  }

  request(options) {
    //注册
    let myApplyPluginsWaterfall = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options));
    return this.applyPluginsBailResult('endpoint', myApplyPluginsWaterfall).then(value => {
      let judge = this.applyPluginsBailResult('judge', value)
      if (judge === true) {
        //触发事件
        return Promise.reject(value);
      } else {
        return value;
      }
    });
  }
}

module.exports = DB;