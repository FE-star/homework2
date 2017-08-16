const Tapable = require('tapable');

class DB extends Tapable {
    constructor(options){
        super();
        this.options=options||{};
    }

    request(args){
        if(args){
            Object.assign(this.options, args);
            this.options=this.applyPluginsWaterfall("options",this.options);
        }
        return new Promise((resolve,reject)=>{
            this.applyPluginsBailResult("endpoint",this.options).then((res)=>{
                if(this.applyPluginsBailResult("judge",res)){
                    reject(res);
                }else{
                    resolve(res);
                }
            },(res)=>{
                reject(res);
            });

        });
    }
}

module.exports = DB