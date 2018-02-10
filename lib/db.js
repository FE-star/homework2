const Tapable = require('tapable')

class DB extends Tapable {
  constructor(args) {
    // TODO
    super(args);

    this.options = args || {};
  }

  request(options) {
    let opt = Object.assign(this.options, options);

    return new Promise((resolve, reject) => {

        // hasPlugins(name)
        // 如果插件注册了这个名字，则返回true。
        if (this.hasPlugins('options')) {
          opt = this.applyPluginsBailResult('options', opt)
          resolve()
        }
        if (this.hasPlugins('endpoint')) {
          // applyPluginsBailResult()
          // 可以触发事件endpoint
          // 调用注册在事件上的处理函数, 传入参数
          // 如果其中一个处理函数返回值!== undefined，直接返回这个返回值，后续的处理函数将不被执行
          // this.applyPluginsBailResult('endpoint', opt).then(data => resolve(data))
          this.applyPluginsBailResult('endpoint', opt)
            .then(res => {
              if (this.hasPlugins('endpoint') && this.applyPluginsBailResult('judge', res)) {
                reject(res);
              } else {
                resolve(res)
              }
            })
            .catch(err => {
              reject(err)
            })
        }


    })

  }
}

module.exports = DB