const Tapable = require('tapable')

class DB extends Tapable {

    constructor(options) {
        super()
        this.options = options || {};
    }

    request(option) {

        option = option || {};

        var plugins = this._plugins;

        //获取到 keys
        var keysArr = Object.keys(plugins);

        var result = this.options;
        //把 options 和 option 合并
        //把 target 上的属性 拷贝到 source
        function copyProperties(source, target) {
            for (var i in target) {
                source[i] = target[i];
            }
        }

        copyProperties(this.options, option);

        var result = this.options;
        //judge 插件得单独处理
        if (this.hasPlugins("judge")) {
            result = this.applyPluginsBailResult("endpoint", result);
             
                 var that = this;
                 //直接返回 执行完 judge 后的 promise
                 return result.then(function(res){
                     result = that.applyPluginsBailResult("judge", res);
                     if(result === true){
                        return Promise.reject(res)
                     } else{
                        return Promise.resolve(res)
                     }
                 }) 
             
        } else {
            keysArr.forEach((elem) => {
                if (elem == 'options' && plugins[elem].length > 2) {
                    result = this.applyPluginsWaterfall(elem, result);
                } else {
                    result = this.applyPluginsBailResult(elem, result);
                }
            });
        }

        return result;
    }
}

module.exports = DB