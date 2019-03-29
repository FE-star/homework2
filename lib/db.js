const { AsyncSeriesWaterfallHook, SyncWaterfallHook } = require('tapable');

class DB {
    constructor(initOptions) {
        this.hooks = {
            endpoint: new AsyncSeriesWaterfallHook(['options']), // this hook define how to respond as an endpoint
            options: new SyncWaterfallHook(['options', 'existingOptions']), // this hook let user to define their logic to set options
            judge: new SyncWaterfallHook(['res']) // this hook let user to control what is valid request
        };
        this.existingOptions = initOptions || {};
    }

    request(options) {
    	// if provide options here, merge them
        if (options) {
            this.addOptions(options);
        }

        return this.hooks.endpoint.promise(this.existingOptions).then((res) => {
            if (this.validate(res)) {
                return Promise.reject(res);
            }
            return res;
        }, err => {
            return Promise.reject(err);
        });
    }

    addOptions(options) {
        let defined = this.hooks.options.call(options, this.existingOptions);

	    // if returned value === first parameter, then this plugin is not defined
	    if (defined === options) {
	        Object.keys(options).forEach(key => {
		        this.existingOptions[key] = options[key];
	        });
        }
    }

    validate(res) {
        const validated = this.hooks.judge.call(res);
        // in this case, judge hook is not defined outside
        if (validated === res) {
            return false;
        }
        return validated;
    }
}

module.exports = DB;