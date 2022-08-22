const {
  SyncWaterfallHook,
  SyncBailHook,
  AsyncSeriesBailHook
} = require("tapable");


class DB {
  constructor(options) {
    this.options = options;
    this.hooks = {
      options: new SyncWaterfallHook(['options']),
      endpoint: new AsyncSeriesBailHook(['resp']),
      judge: new SyncBailHook(['failed']),
    };
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const finalOptions = this.hooks.options.call(
        Object.assign({}, this.options || {}, options || {})
      );

      this.hooks.endpoint.callAsync(finalOptions, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        const failed = this.hooks.judge.call(res);
        if (failed) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    })
  }
}

module.exports = DB