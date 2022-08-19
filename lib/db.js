const {
  SyncWaterfallHook,
  AsyncSeriesWaterfallHook
} = require("tapable");


class DB {
  constructor(options) {
    this.options = options;
    this.hooks = {
      options: new SyncWaterfallHook(['options']),
      endpoint: new AsyncSeriesWaterfallHook(['resp']),
    };
  }

  request(options) {
    return new Promise((resolve) => {
      this.hooks.options.tap('options end', (finalOptions) => {
        this.hooks.endpoint.callAsync(finalOptions, () => {
          console.log('end');
        });
      });

      this.hooks.endpoint.tap('endpoint', (res) => {
        resolve(res);
      });

      this.hooks.options.call(Object.assign({}, this.options || {}, options || {}), (o) => {
        console.log('0000', o)
      })
    })
  }
}

module.exports = DB