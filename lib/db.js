const Tapable = require('tapable');

class DB extends Tapable {
	constructor(options){
		super(options);
        this.options = options;
	}
	request(options){
        // 设置options插件
        if(this.hasPlugins('options')){
            if(options){
                this.options = Object.assign(options,this.applyPluginsWaterfall('options',this.options))
            }else{
                this.options = this.applyPluginsWaterfall('options',this.options)
            }
        }else{
            this.options = options
        }

        return new Promise((resolve,reject)=>{
            this.applyPluginsBailResult('endpoint', this.options)
                .then((res)=>{
                    if(this.hasPlugins('judge')){
                        if(this.applyPluginsBailResult('judge',res)){
                            reject(res)
                        }else{
                            resolve(res)   
                        }
                    }else{
                        resolve(res)
                    }
                }).catch((res)=>{
                    reject(res)
                })
        })
		// var R = new Promise((resolve, reject) => {
        //     const options = Object.assign(options,this.options);
        //     var oAjax = new XMLHttpRequest();
        //     oAjax.open("GET", this.options.url, true);
        //     oAjax.send();
        //     oAjax.onreadystatechange = function () {
        //         if (oAjax.readyState === 4) {
        //             if (oAjax.status === 200) {
        //                 resolve(JSON.parse(oAjax.responseText).msg);
        //             } else {
        //                     reject(new Error('xhr error'));
        //             }
        //         }
        //     };
		// });
		// R = R
		// .then(()=>{ return this.applyPluginsBailResult('endpoint', this.options)})
		// .catch(()=>{return this.applyPluginsBailResult('endpoint', this.options)});
        // return R;
        
    
	}

}

module.exports = DB
