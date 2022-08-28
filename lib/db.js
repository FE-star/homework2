const {
  AsyncParallelBailHook,
  SyncHook,
  SyncWaterfallHook,
} = require("tapable");

class DB {
  constructor(options = {}) {
    this.options = options;
    this.hooks = {
      endpointHook: new AsyncParallelBailHook(["options"]),
      optionHook: new SyncHook(["options"]),
      judgeHook: new SyncWaterfallHook(["res"]),
    };
  }

  plugin(name, cb) {
    if (name === "endpoint") {
      this.hooks.endpointHook.tapPromise(
        name,
        async (options) => await cb(options)
      );
    } else if (name === "options") {
      this.hooks.optionHook.tap(name, cb);
    } else if (name === "judge") {
      this.hooks.judgeHook.tap(name, cb);
    }
  }

  async request(options = {}) {
    this.options = Object.assign({}, this.options, options);

    this.hooks.optionHook.call(this.options);
    const result = await this.hooks.endpointHook.promise(this.options);

    if (this.hooks.judgeHook.call(result) === true || result === undefined) {
      return Promise.reject(result);
    }

    return result;
  }
}

module.exports = DB;
