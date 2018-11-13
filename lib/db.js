const Tapable = require('tapable')

class DB extends Tapable {
    constructor(options) {
        super();
        this.options = options || {};
    }
    // param一定要设置默认值
    request(param = {}) {
        // 设置options插件 可以定制options的值
        this.applyPlugins('options', this.options);
        // 串行调用事件
        // 这里还是不太清楚applyPlugins和applyPluginsBailResult的使用时机
        return new Promise((resolve, reject) => {
            // 定制请求方式 可以合并传入参数和定制的options值
            // 这一步没有写出来 参考了同学答案
            this.applyPluginsBailResult('endpoint',
                Object.assign(param, this.options || {})
            ).then(res => {
                if (!this.applyPluginsBailResult('judge', res)) {
                    resolve(res);
                } else {
                    reject(res)
                }
            }, err => {
                 reject(err);
            })
        })
    }
}


module.exports = DB