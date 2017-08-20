const Tapable = require('tapable')

class DB extends Tapable {
    constructor(options) {
        super()
        this.options = options || {}
    }

    request(options) {
        var opts = this.applyPluginsWaterfall('options', Object.assign({}, this.options, options))
        if (!this.hasPlugins('judge')) {
            return this.applyPluginsBailResult('endpoint', opts);
        }
        return new Promise((resolve, reject) => {
            this.applyPluginsBailResult('endpoint', opts)
                .then(result => {
                    const hasError = this.applyPluginsBailResult('judge', result);
                    if (hasError) {
                        reject(result)
                    } else {
                        resolve(result)
                    }
                })

        })

    }
}


module.exports = DB