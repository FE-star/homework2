const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options={}) {
    // TODO
    super();
    this.options = options;
  }

  request(options) {
    // TODO
    //Object.assign(),第二个参数的对象拷贝到第一个参数对象中，返回第一个参数对象，如有相同属性，第二个参数值覆盖第一个。
    //满足用例中多个option，后面覆盖前面的
     //applyPluginsWaterfall(name: string, init: any, args: any...)
     //触发事件 name，串行的调用注册在事件 name 上的处理函数（先入先出），最先执行的处理函数传入 init 和 args，后续的处理函数传入前一个处理函数的返回值和 args，函数最终返回最后一个处理函数的返回结果
   //applyPluginsBailResult(name: string, args: any...)
   //触发事件 name，串行的调用注册在事件 name 上的处理函数（先入先出），传入参数 args，如果其中一个处理函数返回值 !== undefined，直接返回这个返回值，后续的处理函数将不被执行
     var optionsArr = Object.assign(this.options,options);
    this.applyPluginsWaterfall('options',optionsArr);
    return new Promise((resolve,reject)=>{
         this.applyPluginsBailResult('endpoint',optionsArr).then(res=>{
          if(this.applyPluginsBailResult('judge',res)){
              reject(res);
          }else {
            resolve(res);
          }
         },res=>{
           reject();
         })
    })
  }
}

module.exports = DB