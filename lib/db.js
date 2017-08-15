const Tapable = require('tapable')
const log = console.log.bind(console)

class DB extends Tapable {
	constructor(options) {
		super(options)
		this.options = options || {}
	}

	request(opt) {
		log(this, this.options)
		opt && Object.assign(this.options, opt)
		this.applyPlugins('options', this.options)
		// log(this, this._plugins['endpoint'].length)
		var p = this.applyPluginsBailResult('endpoint', this.options)

		return p.then( (res) => {
			log(111, res)
			return new Promise((resolve, reject)=>{
				var a = !!this.applyPluginsBailResult('judge', res)
				log(9, a)
				if (a) {
					reject(res)
				}
				else{
					resolve(res)
				}
			})
		})

		// p.then((res)=>{
		// 	log(111, res)
		// 	var a = !!this.applyPluginsBailResult('judge', res)
		// 	log(9, a)
		// 	if(a){
		// 		return Promise.reject(res)
		// 	}
		// 	else{
		// 		return Promise.resolve(res)
		// 	}
		// })

		// return p
	}
}

module.exports = DB
