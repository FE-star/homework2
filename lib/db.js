const { AsyncSeriesWaterfallHook } = require('tapable');

class DB {
  constructor(options) {
    // TODO
    this.options =
      Object.prototype.toString.call(options) === '[object Object]'
        ? options
        : {};
    this.hooks = {
      pluginHook: new AsyncSeriesWaterfallHook(['name']),
    };
  }
  
  plugin(name, cb) {
    const { pluginHook } = this.hooks;
    pluginHook.tapPromise(name, (options) => {
      return new Promise(async (resolve, reject) => {
        const isJudge = name === 'judge';
        const cbBack = cb(options);
        if (cbBack instanceof Promise) cbBack.catch((err) => reject(err));
        let res = await cbBack;
        let isErr = false;
        if (res === true && isJudge) isErr = true;
        if (res === true || isJudge) res = options;
        if (isErr) reject(res);
        else resolve(res);
      });
    });
  }

  request(options) {
    // TODO
    return new Promise((resolve, reject) => {
      const { pluginHook } = this.hooks;
      const optionsAssigned = Object.assign({}, this.options, options);
      pluginHook
        .promise(optionsAssigned)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}

module.exports = DB