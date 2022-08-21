const {
	AsyncSeriesWaterfallHook,
  SyncWaterfallHook
} = require("tapable")
class DB {
  constructor(options) {
    this.options = options || {}

    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(['options']),
      optionHook: new SyncWaterfallHook(['options']),
      judge: new SyncWaterfallHook(['res'])
    }

    this.plugin = function(name, f) {
      if (name === 'endpoint') {
        // 执行一次，就在“链”中加一个处理函数f, 直到下面调用.promise方法才真正开始执行这个“链”
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
      Object.assign(this.options, options)
      this.hooks.optionHook.call(this.options)
    }

    return this.hooks.endpoint.promise(this.options).then((res) => {
      if (this.invalid(res)) {
        return Promise.reject(res);
      }
      return res
    }, err => {
      return Promise.reject(err)
    })
  }

  invalid(res) {
    // 根据用例，.judge.call在retcode不为0时返回true, 即返回true时表示请求失败。
    const callFailed = this.hooks.judge.call(res)
    // console.log(111, callFailed) jude hook 没有tap注册回调链时，call会返回入参本身，此时意味着应该继续往后执行
    if (callFailed === res) {
      return false
    }
    return callFailed
  }
}

module.exports = DB