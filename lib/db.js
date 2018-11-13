const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options||{};
  }

  request(parm) {
    // TODO
    this.options = Object.assign(this.options,parm);
    return new Promise((resolve, reject)=>{
      this.applyPluginsWaterfall('options',this.options);
      this.applyPluginsBailResult('endpoint',this.options).then((res) => {
        let judgeResult = this.applyPluginsBailResult('judge',res);
        if(judgeResult){
          reject(res);
        }else{
          resolve(res);
        }
      },()=>{
        reject()
      });
    })
  }
}

module.exports = DB