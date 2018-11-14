const { SyncWaterfallHook, AsyncSeriesBailHook, SyncBailHook } = require('tapable');

class DB {
  constructor(options) {
    // TODO
    this.options = options || {};
    this.hooks = {
      'options': new SyncWaterfallHook(['options']),
      'endpoint': new AsyncSeriesBailHook(['options']),
      'judge': new SyncBailHook(['judgeResult'])
    };
  }


  request(option = {}) {
    // 混入options
    option = Object.assign({}, this.options, option);
    const { options, endpoint, judge } = this.hooks
    this.hooks.options.call(option);
    return new Promise((resolve, reject) => {
      // blahblahblah业务逻辑, 请求一个url

      // 这里约定endpoint插件一定会返回一个promise
      this.hooks.endpoint.promise(option).then(res => {
        if (this.hooks.judge.call(res)) {
          reject(res);
        };
        resolve(res)
      }
      ).catch(err => {
        // 处理endpoint的error，抛回给上一层
        reject(err)
      });
    })
  }
  
}

module.exports = DB