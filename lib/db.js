const Tapable = require('tapable')
const log = console.log.bind(console)

class DB extends Tapable {
	constructor(options) {
		super(options)
		this.options = options || {}
	}

	request(opt) {
		opt && Object.assign(this.options, opt)
		this.applyPlugins('options', this.options)
		var p = this.applyPluginsBailResult('endpoint', this.options)
		return p.then((res)=>{
			if(!!this.applyPluginsBailResult('judge', res)){
				return Promise.reject(res)
			}
			else{
				return Promise.resolve(res)
			}
		})
	}
}

module.exports = DB
