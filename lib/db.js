const Tapable = require('tapable')

class DB extends Tapable {
  constructor() {
    // TODO
    super();

    this.options = arguments[0];
    // this.options = this.applyPluginsBailResult.call(this, 'options', this.options);
  }

  request() {
    // TODO
    var argus = Array.prototype.slice.call(arguments, 0);

    // 来自初始化
    var thisOptions = Object.assign({}, this.options || {}); 

    // 来自merge
    argus.forEach((item) => {
      Object.assign(thisOptions, item);
    });

    // options plugin modify
    thisOptions = this.hasPlugins('options') && this.applyPluginsWaterfall.apply(this, ['options', thisOptions]) || thisOptions;

    argus = [thisOptions];
    argus.unshift('endpoint');

    var promise = this.applyPluginsBailResult.apply(this, argus);
    
    return promise.then((res) => {
      var result = this.applyPluginsBailResult('judge', res);
      if (result) {
        return Promise.reject(res);
      }
      return promise;
    });
  }
}

module.exports = DB