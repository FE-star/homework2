const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options
    // TODO
  }


  request(options) {
    var self =  this
    options = self.applyPluginsWaterfall('options', options)
    // merge
    for(var key in self.options){
      options[key] = self.options[key]
    }
    var p = new Promise(function(resolve, reject) {
      self.applyPluginsBailResult('endpoint', options)
      .then(function(data){
        if(self.applyPluginsBailResult('judge', data))
          reject(data)
        else
          resolve(data)
      }, function(reason){
        reject(reason)
      })
      .catch(function(reason){
        console.log(reason);
      })
    })
    return p
  }
}

module.exports = DB
