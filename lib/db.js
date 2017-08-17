const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }

  request(options) {
    // TODO
      options = Object.assign({},this.options,options)
      this.applyPlugins('options',options)
      // this.applyPlugins('judge')
      let result =  this.applyPluginsBailResult('endpoint',options);

      return Promise.resolve(result)
        .then((res) => {
          if (this.hasPlugins('judge')) {
            let flag = this.applyPluginsBailResult('judge', res);
            if (!flag) {
              return Promise.resolve(res)
            } else {
              return Promise.reject(res)
            }
          } else {
            return Promise.resolve(res)
          }
        })
  }
}

module.exports = DB