const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options || {};
    // console.log(this.plugin)
  }

  request(params={}) {
    // TODO
    let options = this.applyPluginsWaterfall('options', this.options);
    
    params =  Object.assign(params, options);

    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', params).then(res => {
        if(this.applyPluginsBailResult('judge', res)) {
          reject(res);
        }
        resolve(res);

      }).catch( err => {
        reject(err);
      })
    })
  }
}

module.exports = DB