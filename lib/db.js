const {
	AsyncSeriesWaterfallHook,
  SyncWaterfallHook
} = require("tapable")
class DB {
  constructor(options) {
    this.options = options || {}

    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(['options']),
      optionHook: new SyncWaterfallHook(['options','existingOptions']),
      judge: new SyncWaterfallHook(['res'])
    }

    this.plugin = function(name, f) {
      if (name === 'endpoint') {
        this.hooks.endpoint.tapPromise(name, f)
      } else if (name === 'options') {
        this.hooks.optionHook.tap(name, f)
      } else if (name === 'judge') {
        this.hooks.judge.tap(name, f)
      } else {
        throw new Error(`unknown hooks: ${name}`)
      }
    }
  }

  request(options) {
    if (options) {
      this.addOptions(options)
    }

    return this.hooks.endpoint.promise(this.options).then((res) => {
      if (this.validate(res)) {
        return Promise.reject(res);
      }
      return res
    }, err => {
      return Promise.reject(err)
    });
  }

  addOptions(options) {
    let defined = this.hooks.optionHook.call(options, this.options)

    if (defined === options) {
      Object.keys(options).forEach(key => {
        this.options[key] = options[key]
      });
    }
  }

  validate(res) {
    const validated = this.hooks.judge.call(res)
    if (validated === res) {
      return false
    }
    return validated
  }
}

module.exports = DB