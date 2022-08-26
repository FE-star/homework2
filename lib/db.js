const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO 
    super()
    this.options = options
  }

  // request(options) {
  //   // TODO
  //   // return this.applyPluginsWaterfall('endpoint') // 1
  //   // return this.applyPluginsWaterfall0('endpoint') // 1
  //   // return this.applyPluginsBailResult('endpoint') // 1
  //   // if (this.options) {
  //   //   this.options = this.applyPluginsWaterfall0('options',this.options) //
  //   // }
  //   return this.applyPluginsBailResult('endpoint',options) // 1 2
  // }

  // request(options) {
  //   if (!this.options) {
  //     this.options = {}
  //   }
  //   Object.assign(this.options, options);
  //   this.options = this.applyPluginsWaterfall0('options',this.options) //
  //   return this.applyPluginsBailResult('endpoint', this.options) // 1 2 3
  // }
  
  request(params = {}) {
    if (!this.options) {
      this.options = {}
    }
    let newParams = Object.assign(params, this.options)
    this.applyPluginsWaterfall0('options',newParams)
    newParams = Object.assign(newParams, this.options)
    return new Promise((resolve,reject) => {
      this.applyPluginsBailResult('endpoint', newParams).then(res => {
        // 超时
        // return this.applyPluginsWaterfall('judge',res) ? reject(res) : resolve(res)
        return this.applyPluginsBailResult('judge',res) ? reject(res) : resolve(res)
      }, res => {
        return reject()
      })
    })
  }
}

module.exports = DB