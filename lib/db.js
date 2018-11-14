const Tapable = require('tapable')

class DB extends Tapable {
    constructor( options ) {
        super();
        this.options = options || {};
    }

    request( options ) {

        Object.assign( this.options, options);

        const option = this.applyPluginsWaterfall('options', this.options);

        return this.applyPluginsBailResult('endpoint', option ).then((res) => {

            if (this.applyPluginsBailResult('judge', res)) {
                return Promise.reject(res);
            } else {
                return Promise.resolve(res);
            }

        });

    }
}

module.exports = DB