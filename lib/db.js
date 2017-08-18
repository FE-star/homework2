const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options = {}) {
    // TODO
    super()
    this.options = options
  }

  request(options = {}) {
    // TODO
    Object.assign(this.options, options);
    this.applyPlugins('options', this.options);

    return this.applyPluginsBailResult('endpoint', this.options)
      .then((res) => {
        if (!!this.applyPluginsBailResult('judge', res)) {
          return Promise.reject(res)
        } else {
          return Promise.resolve(res)
        }
      })
      .catch((err) => {
        return Promise.reject(err)
      });
  }
}

module.exports = DB