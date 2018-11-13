const Tapable = require("tapable");


class DB extends Tapable {
  constructor(options = {}) {
    super()
    this.options = options;
  }

  request(options) {
    
    let _options = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))

    return this.applyPluginsBailResult('endpoint', _options).then(pipe => {
      
      let judge = this.applyPluginsBailResult('judge', pipe)

      if(judge == true){
        return Promise.reject(pipe)
      }else{
        return pipe
      }

    })

	}
}

module.exports = DB