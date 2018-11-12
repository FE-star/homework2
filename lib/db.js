const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
  Tapable
 } = require("tapable");


class DB extends Tapable {
  constructor(options = {}) {
    super()
    this.options = options;
  }

  request() {
    
  }
}

module.exports = DB