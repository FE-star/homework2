const Tapable = require('tapable')

class DB extends Tapable {
    constructor(options) {
        // TODO
        super(options)
        this.options = options
    }

    request(options) {
        // TODO

        console.log(options, 111);
        return new Promise((resolve, reject) => {
            if (this.hasPlugins('options') && options) {
                this.options = Object.assign(options, this.applyPluginsWaterfall('options', this.options))
            } else {
                this.options = options || {}
            }
            console.log(options, 22);

            this.applyPluginsBailResult('endpoint', this.options).then(res => {
                console.log(res, 3333)
                if (this.hasPlugins('judge') && this.applyPluginsBailResult('judge', res)) {
                    reject(res)
                }
                resolve(res)

            }).catch(res => {
                reject(res)
            })
        })
    }
}

module.exports = DB