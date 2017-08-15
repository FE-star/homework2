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
		super(options);
		this.options = {};
		if (options) {
			this.options = options;
		}
		// if (options) {
		// 	merge(this.options, options);
		// }

	}
	defaultEnd (xhr) {
		if (xhr instanceof XMLHttpRequest) {
			console.log(JSON.parse(xhr.responseText).msg);
		} else {
			return null;
		}
	}
	request(options){
		if (options) {
			merge(this.options, options);
		}
		console.log('new pRequest promise');

		var pRequest = new Promise((resolve, reject) => {
			this.applyPluginsWaterfall('options', this.options);
			console.log('options:', this.options);
			const config = merge({}, this.options);
			config.url = config.url || '';
			config.method = config.method.toUpperCase || 'GET';
			config.async = config.async || true;
			config.data = config.data || null;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = ()=>{
				if(xhr.status === 4) {
					resolve(JSON.parse(xhr.responseText).msg);
				}
			};
			xhr.onerror = ()=>{
				reject(new Error('xhr error'));
				xhr = null;
			};
			xhr.open(config.method, config.url, confing.async);
			xhr.send(config.data);
		});
		pRequest = pRequest
		.then(()=>{ return this.applyPluginsBailResult('endpoint', this.options)})
		.catch(()=>{return this.applyPluginsBailResult('endpoint', this.options)});
		return pRequest;
	}

}

module.exports = DB