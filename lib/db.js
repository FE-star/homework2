const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')

class DB {
  constructor(options) {
    // TODO
    this.options = options ? options : {}

    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(['options']),
      options: new SyncWaterfallHook(['options']),
      judge: new SyncWaterfallHook(['res'])
    }
  }

  modifyOptions(options) {
    this.hooks.options.call(options)

    Object.keys(options).forEach(key => {
      if (options.hasOwnProperty(key)) {
        this.options[key] = options[key]
      }
    })
  }

  request(options) {
    if (options) {
      this.modifyOptions(options)
    }

    // TODO
    return this.hooks.endpoint
      .promise(this.options)
      .then(res => {
        const judge = this.hooks.judge.call(res)

        if (!judge) {
          throw res
        }

        return res
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}

module.exports = DB
