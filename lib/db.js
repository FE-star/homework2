const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super()
    // 保留初始化参数，并给与默认值
    this.options = options || {}
  }
  // compile(options) {
	// 	factory.setup(this, options);
	// 	return factory.create(options);
	// }
  request(options) {
    // 更新参数对象
    this.options = Object.assign(this.options, options)
    // 完成参数对象插件功能
    this.options = this.applyPluginsWaterfall('options', this.options)
    return new Promise((resolve, reject) => {
      // 调用endpoint插件
      this.applyPluginsBailResult('endpoint', this.options).then(res => {
        // 根据judge插件执行不同步骤
        if (!this.applyPluginsBailResult('judge', res)) {
          resolve(res)
        } else {
          reject(res)
        }
      }, res => {
        reject(res)
      })
    })
    // TODO
  }
}

module.exports = DB