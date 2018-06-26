const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options;
    
  }

  request(options) {
    // TODO
    if (options && (options.type === 1 || options.type === 0)) {
      return this.applyPluginsBailResult1("endpoint", options)
        .then(res => {
          if (this.applyPluginsBailResult1("judge", res)) {
            return Promise.resolve(res);
          } else {
            return Promise.reject(res);
          }
        });
      
    } else if (options && this.options.init) {
      options.init = true;
      options = this.applyPluginsWaterfall0("options", options);
      return this.applyPluginsBailResult1("endpoint", options);;
    }
    return this.applyPluginsBailResult("endpoint");
  }
}

module.exports = DB