const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options || {}
  }

  request(params) {
    params && Object.assign(this.options, params)
    this.applyPlugins('options', this.options)
    const p = this.applyPluginsBailResult('endpoint', this.options)
    return p.then( res => {
      const isReject =  this.applyPluginsBailResult('judge', res)
      return (!!isReject) ? Promise.reject(res) : Promise.resolve(res)
    })
  }
}

module.exports = DB
