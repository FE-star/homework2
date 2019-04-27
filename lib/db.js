const {Tapable ,
  SyncHook ,
  SyncBailHook ,
  SyncWaterfallHook ,
  SyncLoopHook ,
  AsyncParallelHook ,
  AsyncParallelBailHook ,
  AsyncSeriesHook ,
  AsyncSeriesBailHook ,
  AsyncSeriesWaterfallHook ,
  HookMap ,
  MultiHook }=require('tapable')
const assert=require('assert')
class DB {
  constructor (options) {
    this.options=options||{}
    this.hooks={
      endpoint:new AsyncParallelBailHook(['options']),
      options:new SyncWaterfallHook(['options']),
      judge:new SyncBailHook(['res'])
    }
  }
  request (options) {
    options = this.hooks.options.call(Object.assign(this.options,options))
    return new Promise((resolve,reject)=>{
      this.hooks.endpoint.promise(options).then(
        (res)=>{
          if(!this.hooks.judge.call(res)) resolve(res)
          else reject(res)
        },
        reject
      )
    })
    
  }
}

module.exports=DB