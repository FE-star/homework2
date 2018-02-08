const Tapable = require('tapable')

class DB extends Tapable {
  constructor (options) {
    super(options)
    this.options = options || {}
  }

  request (options) {
    let opt = Object.assign(this.options, options);

    return new Promise((resolve, reject) => {
      //
      if (this.hasPlugins('options')) {
        opt = this.applyPluginsBailResult('options', opt)
        resolve()
      }

      if (this.hasPlugins('endpoint')) {
        // !== undefined 就把值返回 即在 plugin 里面返回的 promise , 同名函数一直执行直到值不为 undefined
        this.applyPluginsBailResult('endpoint', opt)
          .then(res => {
            if (this.hasPlugins('endpoint') && this.applyPluginsBailResult('judge', res)) {
              reject(res);
            } else {
              resolve(res)
            }
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }
}

module.exports = DB
