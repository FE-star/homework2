const { AsyncSeriesWaterfallHook, SyncWaterfallHook } = require("tapable");

class DB {
  constructor(options) {
    this.options = options || {};

    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(["options"]),
      options: new SyncWaterfallHook(["options"]),
      judge: new SyncWaterfallHook(["res"]),
    };

    this.plugin = function (hookName, cb) {
      switch (hookName) {
        case "endpoint":
          this.hooks.endpoint.tapPromise("requestPlugin", (options) => {
            const result = cb(options)
            if(result) {
              return result.catch(err => {
                return Promise.reject(err)
              })
            } else {
              return Promise.resolve(options)
            }
          });
          break;
        case "options":
          this.hooks.options.tap("setOptionsPlugin", cb);
          break;
        case "judge":
          this.hooks.judge.tap("parseResponsePlugin", cb);
          break;
      }
    };
  }

  request(options) {
    if (options) {
      this.modifyOptions(options);
    }

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

  modifyOptions(options = {}) {
    if (typeof options !== "object") {
      throw new Error("argument should be a Object");
    }
    Object.assign(this.options, options);
    this.hooks.options.call(this.options);
  }
}

module.exports = DB;
