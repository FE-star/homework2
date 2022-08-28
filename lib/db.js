const { AsyncSeriesWaterfallHook, SyncWaterfallHook } = require("tapable");

class DB {
  constructor(options) {
    this.options = options || {};

    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(["res"]),
      options: new SyncWaterfallHook(["options"]),
      judge: new SyncWaterfallHook(["res"]),
    };
  }

  plugin(name, callback) {
    if (name === "endpoint") {
      this.hooks.endpoint.tapPromise("EndpointPlugin", (options) => {
        const result = callback(options);
        if (result) {
          return result.catch((err) => {
            return Promise.reject(err);
          });
        } else {
          return Promise.resolve(options);
        }
      });
    }
    if (name === "options") {
      this.hooks.options.tap("OptionsPlugin", callback);
    }
    if (name === "judge") {
      this.hooks.judge.tap("JudgePlugin", callback);
    }
  }

  request(options) {
    const mergeOptions = Object.assign(this.options, options || {});
    this.hooks.options.call(mergeOptions);

    return this.hooks.endpoint
      .promise(this.options)
      .then((res) => {
        const judgeRes = this.hooks.judge.call(res);
        if (judgeRes === true) {
          return Promise.reject(res);
        }
        return res;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

module.exports = DB;
