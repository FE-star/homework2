const Tapable = require('tapable')

class DB extends Tapable {
    constructor(options) {
        // TODO
        super()
        this.options = options || {};
    }

    request(options = {}) {
        // TODO
        this.options = this.applyPluginsWaterfall('options', {...this.options, ...options})

        return new Promise((resolve, reject) => {
            this.applyPluginsBailResult('endpoint', this.options)
                .then(res => {
                    this.applyPluginsBailResult('judge', res) ? reject(res) : resolve(res)
                }).catch(err => {
                reject(err);
            });
        })
    }
}

module.exports = DB