const Tapable = require('tapable');

class DB extends Tapable {
	constructor(options){
		super(options);
		this.options = options;

	}
	request(options){
        //合并options参数
        if(options){
            this.options = Object.assign(this.options,options);
            this.applyPlugins('options', this.options);
        }
		var R = new Promise((resolve, reject) => {
            const options = Object.assign(options,this.options);
            var oAjax = new XMLHttpRequest();
            oAjax.open("GET", this.options.url, true);
            oAjax.send();
            oAjax.onreadystatechange = function () {
                if (oAjax.readyState === 4) {
                    if (oAjax.status === 200) {
                        resolve(JSON.parse(oAjax.responseText).msg);
                    } else {
                            reject(new Error('xhr error'));
                    }
                }
            };
		});
		R = R
		.then(()=>{ return this.applyPluginsBailResult('endpoint', this.options)})
		.catch(()=>{return this.applyPluginsBailResult('endpoint', this.options)});
		return R;
	}

}

module.exports = DB
