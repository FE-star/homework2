const {
  AsyncSeriesWaterfallHook
} = require("tapable");


class DB {
  constructor(options) {
    this.options = options;
    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(['resp']),
    };
  }

  request(args) {
    return new Promise((resolve) => {
      this.hooks.endpoint.tap('endpoint', (res) => {
        resolve(res);
      });
      this.hooks.endpoint.callAsync(args, () => {
        console.log('end');
      });
    })
  }
}

module.exports = DB