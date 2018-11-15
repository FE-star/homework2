const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }

  request(option) {
    // TODO
    var options = Object.assign({}, option, this.options)

    this.applyPluginsWaterfall('options', options);

    var resultPromise= new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', options).then(res => {
        if (this.applyPluginsBailResult('judge', res)) {
          reject(res)
        } else {
          resolve(res)
        }
      },res=>{
        reject()
      })
    })

    return resultPromise
  }
}

module.exports = DB