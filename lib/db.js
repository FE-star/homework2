const Tapable = require('tapable');
// const Promise = require('bluebird');
function merge(des, src) {
	if(!src) {
		return des;
	}
	Object.keys(src).forEach(
		(key) => des[key] = src[key]
	)
	return src;

}

class DB extends Tapable {
	constructor(options){
		super();
		this.options = {};
		if (options) {
			this.options = options;
		}
		// if (options) {
		// 	merge(this.options, options);
		// }

	}
	request(options){
		if (options) {
			merge(this.options, options);
		}
		this.applyPluginsWaterfall('options', this.options);
		return new Promise((resolve, reject)=>{
			this.applyPluginsBailResult('endpoint', this.options).then(
				(res) => {
					if (this.hasPlugins('judge')) {
						var result = this.applyPluginsBailResult('judge', res);
						result? reject(res): resolve(res);
					} else {
						resolve(res);
					}
					
				}
			).catch(
				(res)=>{
					reject(res);
				}
			)
		})

	}

}

module.exports = DB