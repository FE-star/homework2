const Tapable = require('tapable')

class DB extends Tapable {
    constructor(options) {
        super();
        this.options = options;
        // let superPlugin = this.plugin;
        // this.plugin = (name,cb) => {
        //     superPlugin(name,cb);
        // }
    }

    request(opts) {
        if(this.hasPlugins('endpoint')){
            let _arguments = arguments;
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("arguments:",opts);
            // 需要返回 Promise
            return new Promise((resolve,reject) => {
              opts = this.applyPluginsWaterfall('options', Object.assign({},this.options,opts));


                // if(!opts){

                //     resolve(this.applyPluginsWaterfall('endpoint',opts).then((data) =>{
                //         console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                //         console.log(data);
                //         return data;
                //         // resolve(data);
                //     }));
                // }else{
                    this.applyPluginsBailResult('endpoint',opts).then((data) =>{
                      const result = this.applyPluginsBailResult('judge',data,opts);
                      if(!result){
                        return resolve(data);
                      }else{
                        return reject(data);
                      }
                    }).catch(err=>{reject(err)});
                // }
                // .then(function(data){
                //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                //     console.log(data);
                    // resolve({"12":12})
                // })
            })
        }
    }
}

module.exports = DB
