const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    super(options)
    this.options=options
  }

  request (options) {
    function addProperties(from, to) {
      for(var key in from)
        if(to[key]===undefined)
          to[key] = from[key];
      return to;
    }
    this.options=addProperties(this.options,options)
    this.applyPluginsWaterfall0('options',this.options)
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult1("endpoint", this.options)
      .then(res => {
        !this.applyPluginsBailResult1("judge", res)
          ? resolve(res): reject(res);
      })
      .catch(reject);
    });
  }
}
module.exports = DB
