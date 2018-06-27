const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options);
    this.options = options;
  }

  request(options /* test内传入了options自定义参数 */) {
    // 因为 test 中使用了 then => 肯定结果返回了一个 Promise
    // 其次分析代码发现通过 this.plugin 分别注册了endpoint、options、judge 插件
    // 因为是自定义的请求库，通过 test.js 分析其应具有的功能
    // 1. 可以设置options => options 有什么作用？
    // 2. 可以设置endpoint插件，使得该请求用指定的方式处理 => 指定请求处理方式？
    // 3. 可以根据不同的options，使用不同的 endpoint => options 不同，请求处理方式不同
    // 4. 可以设置options插件来处理options，会传入 options，和类本身 options 有什么关系？ ====> 本身options是默认配置，传入是个性化配置
    // 5. 可以设置多个options插件，并且后者覆盖前者
    // 6. 可以通过judge插件判断返回是否正确
    // 7. 可以reject数据
    // => option是入参，endpoint根据不同options返回不同出参，judge判断请求成功与否，否则reject
    return new Promise((resolve, reject) => {
      // 先处理入参，可以设置options插件来处理options，而且后者覆盖前者，最终返回一个option => this.applyPluginsWaterfall：串行调用、后续处理函数接收前一个处理函数的返回值
      // applyPluginsWaterfall初始值为默认options，以及request接收options,Object.assign({}, this.options, options || {})
      const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options || {})); // 最终options

      // 再处理过程，可以从 test 看出首先endpoint获取options参数返回的是一个promise，而且一旦reject就需要停止endpoint执行，=> 转向reject。串行即可，且回调没有参数依赖，且能得到返回的结果（Promise）
      this.applyPluginsBailResult('endpoint', opts).then((res)=>{ // 可以根据不同的options，使用不同的endpoint => 即将options传给插件回调使用
        // 根据res判断是否返回正确结果，根据test可以看出judge插件根据res.retcode值是否为0来判断请求是否成功，因此就将res传入即可，而且judge插件一旦触发(返回true)，则就意味着请求结果不正确.
        // 如果其中一个处理函数返回值!== undefined（这里为true），直接返回这个返回值，后续的处理函数将不被执行，且得到返回的结果（函数无返回结果默认undefined 或 true） => applyPluginsBailResult触发，且得到return结果
        if(this.applyPluginsBailResult('judge', res)){
          reject(res);
        }
        resolve(res);  // 执行resolve即执行了指定的方式
      }, (error)=>{
        reject(error);
      });

    });
  }
}

module.exports = DB;