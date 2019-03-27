const { AsyncParallelHook, SyncHook } = require('tapable');

class DB {
    constructor(initOptions) {
        this.hooks = {
            endpoint: new AsyncParallelHook(['options', 'result']), // this hook define how to respond as an endpoint
            options: new SyncHook(['options', 'existingOptions']), // this hook let user to define their logic to set options
            judge: new SyncHook(['res', 'result']) // this hook let user to control what is valid request
        };
        this.existingOptions = initOptions || {};
    }

    request(options) {
    	// if provide options here, merge them
        if (options) {
	        Object.keys(options).forEach(key => {
		        this.existingOptions[key] = options[key];
	        });
        }

        // must provide and obj to get result as of current version 1.1
        const result = {};
        return this.hooks.endpoint.promise(this.existingOptions, result).then(() => {
            if (this.validate(result.res)) {
                return Promise.reject(result.res);
            }
            return result.res;
        }, err => {
            return Promise.reject(err);
        });
    }

    addOptions(options) {
    	// there's no way to know if called successfully or not, always return undefined
        this.hooks.options.call(options, this.existingOptions);
    }

    validate(res) {
    	// even sync call won't return called values
        const result = {};
        this.hooks.judge.call(res, result);
        return result.data;
    }
}

module.exports = DB;