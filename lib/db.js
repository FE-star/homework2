const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super();
    this.options = options || {};
  }

  request(args) {
    // TODO
    merge(this.options, args);

    return new Promise((resolve, reject) => {
      if (this.hasPlugins('options')) {
        this.applyPluginsAsyncWaterfall('options', this.options, reject);
        resolve()
      }
      if (this.hasPlugins('endpoint')) {
        this.applyPluginsBailResult('endpoint', this.options).then(res => {
          if(this.hasPlugins('judge') && this.applyPluginsBailResult('judge', res)) {
            reject(res);
          } else {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        })
      }
    })

  }

}

// 对象合并
function merge(target) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.forEach(function(arg){
    for (var prop in arg) {
      if (arg.hasOwnProperty(prop)) { // 判断不是原型链上的属性
        target[prop] = arg[prop];
      }
    }
  })
}

module.exports = DB