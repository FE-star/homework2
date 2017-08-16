const Tapable = require('tapable');

class DB extends Tapable {
    constructor(options){
        super();
        this.options=options||{};
    }

    request(args){
        if(args){
            this.options=Object.assign(this.options, args);
            this.options=this.applyPluginsWaterfall("options",this.options);

            var endpoint=this.applyPluginsBailResult("endpoint",this.options);
            return endpoint.then((res)=>{
                if(this.applyPluginsBailResult("judge",res)){
                    return new Promise((resolve,reject) => {
                        reject(res);
                    });
                }else{
                    return endpoint;
                }
            },(res)=>{
                return endpoint;
            });
        }

        return this.applyPluginsWaterfall("endpoint",this.options);
    }
}

module.exports = DB