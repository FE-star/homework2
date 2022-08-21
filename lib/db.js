const {
  SyncWaterfallHook,
  AsyncSeriesWaterfallHook
} = require('tapable');



class DB {
  constructor(options) {
    this.options = options || {};
    this.hooks = {
      endpoint: new AsyncSeriesWaterfallHook(['options']),
      options: new SyncWaterfallHook(['options']),
      judge: new SyncWaterfallHook(['res'])
    }
  }

  useExtendOptions(options) {
    const pluginOptions = this.hooks.options.call(this.options);
    Object.keys(pluginOptions).forEach(item => {
      if (pluginOptions.hasOwnProperty(item)) {
        options[item] = pluginOptions[item];
      }
    });
    return options;
  }

  request(options) {
    const extendsOptions = this.useExtendOptions(options);
    return this.hooks.endpoint.promise(extendsOptions)
      .then(
        res => {
          if (!this.hooks.judge.call(res)) {
            return Promise.reject(res);
          }
          return res;
        }
      )
      .catch(err => {
        return Promise.reject(err);
      });
  }
}

module.exports = DB;