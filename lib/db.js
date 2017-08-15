const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options)
    this.options = options
    console.log("hello1")
}

  request() {
    // TODO
    console.log("hello2")

   // return this.applyPluginsAsync("endpoint")

    return new Promise((resolve,reject)=>{
    	
    	this.applyPluginsAsync("endpoint").then((res)=>{
    		console.log(res)
    		resolve(res)})
    		//resolve({ retcode: 0, res: { msg: 'hello world' } })
    	
    })
    
   
  }
}

module.exports = DB