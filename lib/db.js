const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options = {}) {
    // TODO
      super();
      this.options = options;
      this.hooks = {};
  }

  request(params = {}) {
    // TODO
      // apply options
      const options = this.applyPluginsWaterfall('options', this.options);
      // apply endpoint
      return this.applyPluginsBailResult('endpoint', Object.assign(params, options))
          .then(res => {
              if(this.applyPluginsBailResult('judge', res)){
                  return Promise.reject(res);
              }
              return Promise.resolve(res);
          })
          .catch(error => Promise.reject(error));
  }
}

module.exports = DB