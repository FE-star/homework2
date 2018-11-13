const Tapable = require('tapable');

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options;
  }


  request(options) {
    // 混入options
    options = Object.assign({}, this.options, options);
    if (this._plugins.options) {
      for (var i = 0, len = this._plugins.options.length; i < len; i++) {
        options = this._plugins.options[i](options);
      }
    }
    // blahblahblah业务逻辑
    if (this._plugins.endpoint) {
      for (var i = 0, len = this._plugins.endpoint.length; i < len; i++) {
        let resPromise = this._plugins.endpoint[i](options);
        if (resPromise) {
          console.log(options)
          return resPromise.then(_res => {
            if (this._plugins.judge) {
              let shouldReject = this._plugins.judge.reduce((result, next) => {
                return result || !!next(_res)
              }, false)
              if (shouldReject) {
                return Promise.reject(_res);
              }
            }
            return _res;
          });
        }
      }
    }
  }
}

module.exports = DB