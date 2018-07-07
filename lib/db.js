const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options || {};
    // this.plugins = {};
  }

  request(args) {
    // applyPluginsWaterfall: 插件一个接一个的执行,并且每个插件接收上一个插件的返回值(瀑布)
    // applyPluginsBailResult: 保护模式终止插件执行: 一旦某个插件返回 非 undefined，会退出运行流程并返回 这个插件的返回值。这看起来像 EventEmitter 的 once()，但他们是完全不同的 - applyPluginsBailResult()
    // console.log(args);
    // this.options = { ...args }
    let options = this.applyPluginsWaterfall('options', Object.assign({}, this.options, args));
    const _this = this;
    const hasPlugin = this.hasPlugins('judge');
    return this.applyPluginsBailResult('endpoint', options).then(res => {
      const isOk = _this.applyPluginsBailResult('judge', res);
      // console.log('13: ' + res.retcode);
      return new Promise((resolve, reject) => {
        // console.log(_this.applyPluginsBailResult('judge', options));
        // 成功回调
        // resolve(res)
        // console.log('isok1: ' + hasPlugin)
        // console.log('isok2: ' + isOk)
        // isOk: undefined 表示成功回调, isOk: true 表示需要进入失败回调
        if (hasPlugin && isOk) {
          // 失败回调
          reject(res);
        } else {
          // 成功回调
          resolve(res);
        }
      })
    });
  }

  // plugin(name, hander) {
  //   // super(name, hander);
  //   (this.plugins[name] = this.plugins[name] || []).push(hander);
  // }
}

module.exports = DB