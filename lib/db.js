const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super();
    this.options = options || {};
  }

  /**
   * request方法
   * @param {*} options 属性
   */
  request(options) {
    //  如果调用构造函数的时候存在options方法
    if (this.hasPlugins('options')) {
      if (options) {
        console.info(this.options);
        console.info(JSON.stringify(this.applyPluginsWaterfall('options', this.options)));
        console.info(JSON.stringify(Object.assign(options, this.applyPluginsWaterfall('options', this.options))));
        //  合并构造函数生成时的options对象和设置的options方法的options对象
        this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options));
      } else {
        /**
         * applyPluginsBailResult执行方法，并且将第二个参数传入参数一的函数中
         */
        this.options = this.applyPluginsBailResult('options', this.options);
      }
    } else {
      this.options = options;
    }

    //  默认执行endpoint
    return new Promise((resolve, reject) => {
      this.applyPluginsBailResult('endpoint', this.options).then((res) => {
        if (this.hasPlugins('judge')) {
          /**
           * applyPluginsBailResult执行方法，并且将第二个参数传入参数一的函数中
           */
          if (this.applyPluginsBailResult('judge', res)) {
            // console.info(res);
            /**
             * res = {
             *    retcode:1,
             *    msg:'logout'
             * }
             * 这里执行了构造函数生成时的judge方法，并且将res对象作为回调交给了judge
             * 详情见test.js 179
             * 返回结果为true，所以reject了数据
             */
            // console.info(this.applyPluginsBailResult('judge', res));
            reject(res);
          } else {
            resolve(res);
          }
        } else {
          resolve(res);
        }
      }).catch((res) => {
        reject(res);
      })
    });
  }
}

module.exports = DB