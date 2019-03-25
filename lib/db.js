const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}) {
    super(options)
    this.options = options
  }

  request(params={}) {
    const newOptions = this.applyPluginsWaterfall('options', this.options)
    return new Promise((resolve, reject) => {
      // params should be in front of newOptions
      this.applyPluginsBailResult('endpoint', Object.assign(params, newOptions))
      .then(data => {
        return this.applyPluginsBailResult('judge', data) ?
          reject(data): resolve(data);
      })
      .catch(error => reject(error));
    })
  }
}

module.exports = DB