const Tapable = require('tapable')


// {'endpoint': [fn, fn]}
class DB extends Tapable {
    constructor(options) {
        // TODO
        super();
        this.options = options || {};
    }

    request (params = {}) {
        // TODO
        const options = this.applyPluginsWaterfall('options', this.options);
        
        return this.applyPluginsBailResult('endpoint', Object.assign(params, options))
        .then(res => {
            if(this.applyPluginsBailResult('judge', res)){
                return Promise.reject(res);
            }
            return Promise.resolve(res);
        })
        .catch(err => {
            return Promise.reject(err);
        })
    }
}

module.exports = DB