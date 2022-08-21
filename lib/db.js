const { AsyncSeriesWaterfallHook, SyncWaterfallHook } = require("tapable");

class HooksAdapter {
  constructor() {
    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(["options"]),
      options: new SyncWaterfallHook(["options"]),
      judge: new SyncWaterfallHook(["res"]),
    };
  }

  register(hookName, cb) {
    switch (hookName) {
      case "endpoint":
        this.hooks.endpoint.tapPromise("requestPlugin", (options) => {
          const result = cb(options);
          if (result) {
            return result.catch((err) => {
              return Promise.reject(err);
            });
          } else {
            return Promise.resolve(options);
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
  }

  request(options) {
    return this.hooks.endpoint.promise(options).then(res => {
      const judgeRes = this.hooks.judge.call(res);

      if (judgeRes === true) {
        return Promise.reject(res);
      }

      return res;
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  syncOptions (options) {
    this.hooks.options.call(options);
  }
}

class DB {
  constructor(options) {
    this.options = options || {};
    this.hooksAdapter = new HooksAdapter();

    this.plugin = function (hookName, cb) {
      this.hooksAdapter.register(hookName, cb);
    };
  }

  request(options) {
    if (options) {
      this.modifyOptions(options);
    }

    return this.hooksAdapter
      .request(this.options)
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      })
  }

  modifyOptions(options = {}) {
    if (typeof options !== "object") {
      throw new Error("argument should be a Object");
    }
    Object.assign(this.options, options);
    this.hooksAdapter.syncOptions(this.options)
  }
}

module.exports = DB;
