const Tapable = require('tapable')

class DB extends Tapable {
	constructor(options) { 
		super(options)
		this.options = options  
	}

	request(opt) {
		opt && Object.assign(this.options, opt)
		this.applyPlugins('options', this.options)  
		var p = this.applyPluginsBailResult1('endpoint', this.options)
		return p
	}
}

module.exports = DB