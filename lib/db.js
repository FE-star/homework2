const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}) {
    super();
    this.options = options
  }

  request(options={}) {
    this.options = Object.assign(this.options, this.applyPluginsWaterfall('options',  options))
    if (!this.hasPlugins('judge')) {
      return this.applyPluginsBailResult('endpoint', this.options)
    }    
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then(result => {
         if (this.applyPluginsBailResult('judge', result)) {
           reject(result)
         } else {
           resolve(result)
         }
       })
       .catch(result => {
         reject(result)
       })
    })
  }
}

module.exports = DB