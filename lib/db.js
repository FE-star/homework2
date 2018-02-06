const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super()
    this.options = options || {};
  }
  
  request(options = {}) {
    // 合并配置
    Object.assign(this.options, options);

    const optionsPlugs = this._plugins.options || [];
    // 拿到options插件并合并options
    for(let optionsPlug of optionsPlugs) {
      optionsPlug(this.options);
    }
    
    let resProm;
    const endpoints = this._plugins.endpoint || [];
    // 传递options给所有endpoints，拿到endpoint
    for(let endpoint of endpoints) {
      let prom = endpoint(this.options);
      if(!!prom) {
        resProm = prom;
        break;
      }
    }

    const judges = this._plugins.judge || [];
    // 根据judges验证传递的结果
    if(!!resProm) {
      return resProm.then(res=>{
        for(let judge of judges) {
          if(
            !!res &&
            (!!res.retcode || res.retcode ===0 ) &&
            judge(res)
          ){
            return Promise.reject(res);
          }
        }
        return res;
      });
    }
  }
}

module.exports = DB