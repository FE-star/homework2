const { AsyncSeriesHook } = require('tapable')

class DB {
  constructor(options) {
    this.options = options || {};
    this._tmpDataMap = {};

    // 请求时调用的声明周期
    this.requestHook = new AsyncSeriesHook(['options']);

    this.request = this.request.bind(this);
    this.plugin = this.plugin.bind(this);
    this.handleOptions = this.handleOptions.bind(this);
    this.handleEndPoint = this.handleEndPoint.bind(this);
  }

  // 发送请求 调用钩子
  request(options) {
    options && Object.assign(this.options, options);
    return new Promise((resolve, reject) => {
      this.requestHook.promise(this.options).then(() => {
        resolve(this._tmpDataMap['endpoint']);
        this._tmpDataMap['endpoint'] = null;
      }).catch(e => {
        reject(e);
      });
    })
  }

  // 注册插件
  plugin(name, func) {
    if (name === 'options') {
      this.handleOptions(func);
    } else if (name === 'endpoint') {
      this.handleEndPoint(func);
    } else if (name === 'judge') {
      this.handleJudge(func);
    }
  }

  // 拦截器
  handleOptions(func) {
    this.requestHook.intercept({
      call: (options) => {
        return func(options)
      }
    })
  }

  handleEndPoint(func) {
    this.requestHook.tapPromise('endpoint', (options) => {
      return new Promise((resolve, reject) => {
        const result = func(options);
        if (result) {
          result.then(res => {
            this._tmpDataMap['endpoint'] = res // 保存到当前实例中
            return resolve();
          }).catch((e) => {
            return reject(e);
          });
        } else {
          return resolve();
        }
      })
    });
  }

  handleJudge(func) {
    this.requestHook.tapPromise('judge', () => {
      return new Promise((resolve, reject) => {
        const data= this._tmpDataMap['endpoint']
        if (func(data)) {
          reject(data)
        } else {
          resolve(data)
        }
      })
    })
  }
}

module.exports = DB