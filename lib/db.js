const Tapable = require('tapable')

// 自己作业
class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {}
  }

  request(options) {

    let _options = Object.assign({}, this.options, options)

    // this.applyPlugins('options', _options)
    // let result = this.applyPluginsBailResult('endpoint', _options)
    // return Promise.resolve(result)
    //   .then((res) => {
    //     if (this.hasPlugins('judge')) {
    //       return this.applyPluginsBailResult('judge', res) ? Promise.reject(res) : Promise.resolve(res)
    //     } else {
    //       return Promise.resolve(res)
    //     }
    //   })

    return new Promise((resolve, reject) => {
      _options = this.applyPluginsWaterfall('options', _options)
      this.applyPluginsBailResult('endpoint', _options)
        .then(res => {
          if (this.applyPluginsBailResult('judge', res)) {
            reject(res)
          } else {
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

// 老师讲解
class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options
  }

  request(options) {
    return new Promise((resolve, reject) => {
      // 使用 applyPluginsWaterfall 在现实场景中返回了可能是处理过后的 options
      const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
      this.applyPluginsBailResult('endpoint', opts)
        .then(res => {
          // 中途要切断 使用applyPluginsBailResult
          const hasError = this.applyPluginsBailResult('judge', res, opts)
          if (hasError === true) {
            res = this.applyPluginsWaterfall('error', res, opts)
            reject(res)
          } else {
            res = this.applyPluginsWaterfall('success', res, opts)
            resolve(res)
          }
        }, res => {
          res = this.applyPluginsWaterfall('error', res, opts)
          reject(res)
        }).catch(err => {
          // TODO
        })
    })
  }
}

module.exports = DB