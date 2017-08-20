const Tapable = require('tapable')

class DB extends Tapable {

    constructor(options) {
        // TODO
        super(options)
        this.options = options
    }

    request(options) {
        // return new Promise((resolve, reject) => {
        //     if (this.hasPlugins('options') && options) {
        //         this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
        //     } else {
        //         this.options = options || {}
        //     }
        //
        //     this.applyPluginsBailResult('endpoint', this.options).then(res => {
        //         if (this.hasPlugins('judge') && this.applyPluginsBailResult('judge', res)) {
        //             reject(res)
        //         }
        //         resolve(res)
        //
        //     }).catch(res => {
        //         reject(res)
        //     })
        //         // const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
        //         // this.applyPluginsBailResult('endpoint')
        // })

        // 老师的方法
        return new Promise((resolve, reject) => {
                const opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
                this.applyPluginsBailResult('endpoint', opts)
                .then(res => {
                const hasError = this.applyPluginsBailResult('judge', res, opts)
                if(hasError === true) {
                    res = this.applyPluginsWaterfall('error', res, opts)
                    reject(res);
                } else {
                    res = this.applyPluginsWaterfall('suceess', res, opts)
                    resolve(res)
                }
            }, res => {
                res = this.applyPluginsWaterfall('error', res, opts)
                reject(res)
            })
        })
    }
}


module.exports = DB
