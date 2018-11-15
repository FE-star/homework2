const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super();
    this.options = options || {};
  }

  request(options) {
    options && Object.assign(this.options, options);
		this.applyPlugins('options', this.options);
		const opt = this.applyPluginsWaterfall('options', this.options);
		return this.applyPluginsBailResult('endpoint', opt)
    .then(res => {
			if(this.applyPluginsBailResult('judge', res)){
				return Promise.reject(res)
			}
			else{
				return Promise.resolve(res)
			}
    }).catch(error => Promise.reject(error));
  }
}

module.exports = DB
