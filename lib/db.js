const Tapable = require('tapable')

class DB extends Tapable {

    constructor(options) {
        super()
        this.options = options  
    }

    request(options) {

        return new Promise((resolve,reject)=>{ 
            
            let option = this.hasPlugins("options") ? this.applyPluginsWaterfall("options", options || {}):options||{} 
            options = Object.assign( {}, this.options || {}, options || {})
            
            return this.applyPluginsBailResult("endpoint",options).then((res)=>{

                let some = this.applyPluginsBailResult("judge",res,options) 
                
                if(some === true){
                   reject(res)
                }else{
                   resolve(res)
                }

            }).catch((error)=>{
            	 reject(error)
            })

        })
    }
}

module.exports = DB