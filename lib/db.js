const Tapable = require('tapable')

class DB extends Tapable {
  constructor(props) {
    // TODO
    super(props);
    this.options = props || {};
  }

  request(options) {
    // TODO
    const opts = this.applyPluginsWaterfall('options', {});
    Object.assign(this.options, options, opts);
    
    return this.applyPluginsBailResult('endpoint', this.options)
      .then((res) => {
        if(!this.applyPluginsBailResult('judge', res)) {
          return Promise.resolve(res);
        } else{
          return Promise.reject(res);
        }
      })
  }
}

module.exports = DB