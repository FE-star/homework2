const Tapable = require('tapable')


class DB extends Tapable {

    constructor(options) {
        super()
        this.options = options
    }

    request(options) {

        return new Promise((resolve, reject) => {

            options = this.applyPluginsWaterfall("options", Object.assign({}, this.options, options))  
            
            this.applyPluginsBailResult("endpoint", options).then((res) => {
                
                //对于不存在的plugin 会直接返回 undefined
                let some = this.applyPluginsBailResult("judge", res, options)
                //根据 judge 来判断 走那个 流程 
                if (some === true) {
                    reject(res)
                } else {
                    resolve(res)
                }
            }).catch((error) => {
                reject(error)
            })

        })
    }
}

module.exports = DB