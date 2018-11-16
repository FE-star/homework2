const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}) {
    // TODO
    super();
    this.options = options;
  }

  request(options) {
    // TODO
    var optionsArr = Object.assign(this.options,options);
    this.applyPluginsWaterfall('options',optionsArr);
    return new Promise((resolve,reject)=>{
         this.applyPluginsBailResult('endpoint',optionsArr).then(res=>{
          if(this.applyPluginsBailResult('judge',res)){
              reject(res);
          }else {
            resolve(res);
          }
         },res=>{
           reject();
         })
    })
  }
}

module.exports = DB