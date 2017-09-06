const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {};
  }

  request(options) {
    let newOpts = Object.assign({}, this.options);

    // 合并入参options
    if (!!options) {
      newOpts = Object.assign(newOpts, options)
    }

    // 合并插件options
    if (this.hasPlugins('options')) {
      newOpts = this.applyPluginsWaterfall('options', newOpts);
    }

    this.options = JSON.parse(JSON.stringify(newOpts))

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options)
        .then(res => {
          // 插件judge
          if (this.hasPlugins('judge')) {
            if (this.applyPluginsBailResult('judge', res)) {
              reject(res);
            }
            else {
              resolve(res);
            }
          }
          else {
            resolve(res);
          }
        })
        .catch(res => {
          reject(res)
        })
    })
  }
}

module.exports = DB