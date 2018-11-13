const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super();
    this.options = options;
  }

  request(options = {}) {
    return new Promise((resolve, reject) => {
      const exOpts = this.applyPluginsWaterfall('options', options)
      this.applyPluginsBailResult('endpoint', Object.assign(exOpts, this.options))
        .then(res => {
          !this.applyPluginsBailResult('judge', res) ?
            resolve(res) :
            reject(res)
        })
        .catch(() => {
          reject()
        })
    })
  }
}

module.exports = DB