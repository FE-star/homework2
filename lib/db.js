const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options
  }

  request(options) {
    if(this.hasPlugins('options') && options){
      this.options = Object.assign(options,this.applyPluginsWaterfall('options',this.options))
    }else if(options){
      this.options = options || {}
    }
    //console.log('========',this,this.hasPlugins('endpoint'),'=========')
    return new Promise((resolve,reject)=>{
      this.applyPluginsBailResult('endpoint', this.options).then(res => {
        if (this.hasPlugins('judge') && this.applyPluginsBailResult('judge', res)) {
          reject(res)
        }
        resolve(res)
      }).catch(res => {
        reject(res)
      })
    })
  }
}

module.exports = DB