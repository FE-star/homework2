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

  request() {
    return new Promise((resolve) => {
      this.hooks.endpoint.tap('endpoint', (res) => {
        resolve(res);
      });
      this.hooks.endpoint.callAsync('request', () => {
        console.log('end');
      });
    })
  }
}

module.exports = DB