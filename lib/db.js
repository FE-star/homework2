const {AsyncSeriesWaterfallHook, SyncWaterfallHook, SyncHook} = require('tapable')

class DB {
  constructor(options) {
    // TODO
    this.options = options || {};
    this.hooks = {
      endpointHooks: new AsyncSeriesWaterfallHook(['options']),
      optionHooks: new SyncWaterfallHook(['options']),
      judgeHooks: new SyncWaterfallHook(['resValue']) 
    }
    
    this.plugin = function(pluginName, fn) {
      if(pluginName === 'endpoint') {
        this.hooks.endpointHooks.tapPromise(pluginName, fn)
      } else if(pluginName === 'options') {
        this.hooks.optionHooks.tap(pluginName, fn)
      } else if(pluginName === 'judge') {
        this.hooks.judgeHooks.tap(pluginName, fn)
      }
    }
  }

  request(options) {
    this.addOptions(options)
    return this.hooks.endpointHooks.promise(this.options).then(res=>{
      const isJudge = this.judge(res);
      if(!isJudge) {
        return res
      } 
      return Promise.reject(res);
    })
  }

  addOptions(options) {
    const totalOptions = this.options
    if(options) {
      for(let key in options) {
        totalOptions[key] = options[key]
      }
    }
    this.options = this.hooks.optionHooks.call(totalOptions)
  }

  judge(res) {
    let isJudged = this.hooks.judgeHooks.call(res);
    if(isJudged !== true) {
      isJudged = false
    }
    return isJudged;
  }
  
}
module.exports = DB;