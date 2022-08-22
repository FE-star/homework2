const { AsyncSeriesWaterfallHook, AsyncSeriesBailHook } = require("tapable");

class DB {
  // options;
  constructor(options) {
    // TODO
    // super();
    this.options = options;

    this.hook = new AsyncSeriesWaterfallHook(["res"]);
    /**
     * 保存每一步回调操作的正常结果
     */
    this.values = [];
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const finalOps = {};
      Object.assign(finalOps, options, this.options);

      this.hook.callAsync(finalOps, (err, res) => {
        // judge一般都会是最后一个回调
        const prevRes = this.values.slice(0, this.values.length - 1).pop();

        // err || err === undefined 验证reject空和非空
        // res === true 验证中断
        if (err || err === undefined || res === true) reject(prevRes);
        else {
          resolve(res);
        }
      });
    });
  }

  plugin(name, callback) {
    this.hook.tapPromise(name, async (...args) => {
      // 为了保存中间结果，返回new Promise
      // 为了把同步回调都转成异步使用await
      const res = await callback(...args);

      // console.log("callback", res);
      //回调中返回的undefined不保存
      if (res !== undefined) this.values.push(res);

      return new Promise((resolve, reject) => {
        resolve(res);
      });
    });
  }
}

module.exports = DB;
