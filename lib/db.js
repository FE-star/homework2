const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options
  }

  request(params) {

    var option = this.options || {}
    for(var k in option){
      params[k] = option[k]
    }
    this.applyPluginsWaterfall("options",params)
    if(this.hasPlugins("judge")){
      return new Promise((r,j)=>{
        this.applyPluginsBailResult("endpoint",params)
        .then(res=>{
          this.applyPluginsWaterfall("judge",res)? j(res) : r(res) 
        })
      })
    }
    return this.applyPluginsBailResult("endpoint",params)
  }
}

module.exports = DB
