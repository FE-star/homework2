const Tapable = require('tapable');

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }


  request(options) {
    // 混入options
    options = Object.assign({}, this.options, options);
    this.applyPlugins('options', options)
    // blahblahblah业务逻辑
    return this.applyPluginsBailResult('endpoint', options).then(res => {
      return !this.applyPluginsBailResult('judge', res)
        ? res
        : Promise.reject(res);
      });
  }
}

module.exports = DB