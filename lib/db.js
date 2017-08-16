const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options
  }

  request(options) {

    if (this.hasPlugins('options')) {
      if (options) {
        // this.options => { init : true }
        // option => { url: 'my://hello' }
        // this.applyPluginsBailResult('options', this.options) => { init : true , flag : true }
        // Object.assign =>  { init : true , flag : true , url : 'my://hello' }
        // this.options = >  { init : true , flag : true , url : 'my://hello' }

        // applyPluginsWaterfall 作用: 
        this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
      } else {
        //  this.options = this.applyPluginsBailResult('options', this.options)
      }
    } else {
      // 可以根据不同的options，使用不同的endpoint
      this.options = options;
    }

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then(res => {
        if (this.hasPlugins('judge')) {
          if (this.applyPluginsBailResult('judge', res)) {
            reject(res)
          } else {
            resolve(res)
          }
        } else {
          resolve(res);
        }
      }).catch(res => {
        reject(res);
      })
    });
  }
}

module.exports = DB