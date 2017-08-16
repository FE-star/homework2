const Tapable = require('tapable')

class DB extends Tapable {

    constructor(options){
         super()
         this.options = options || {};
    }

    request(option){
       
       option = option || {};
       
       var plugins = this._plugins;
        
       //获取到 keys
       var keysArr = Object.keys(plugins);

       //找到当前构造函数的签名
       var fnName = this.constructor.name;

       var result = this.options; 
       
       //把 options 和 option 合并
       //把 target 上的属性 拷贝到 source
       function copyProperties(source, target){
            for(var i  in target){
                 source[i] = target[i];
            }
       }

       copyProperties(this.options, option);
       var result = this.options;

       
               

       keysArr.forEach((elem) => {
            if(fnName === "BB"){
               result = super.applyPluginsWaterfall(elem, result);
            }else if(fnName == "CC"){
              
              if(elem === 'judge'){
                  return;
              } 
              result =  super.applyPluginsBailResult(elem, result);

              console.info(result);       
            }else{
               result = super.applyPluginsBailResult(elem, result);
            }

             
            console.log("=="+result); 
       }) 


       /*keysArr.forEach((elem) => {
            console.log("elem==="+);
            result = super.applyPluginsWaterfall(elem, result);
            console.log(result);
       })  */ 
        

       console.log("result=="+result); 
       return result; 

       /*function copyProperties(from, to) {
    			for(var key in from)
    				to[key] = from[key];
    			return to;
	     }

       var fnName = this.constructor.name;

       if(fnName === 'YY'){
          
          var result = super.applyPluginsWaterfall(this._plugins[]);

       } 
       console.log(this.constructor.name === 'YY');

       copyProperties(this.options,option);
       
       super.applyPluginsAsyncWaterfall("options",this.options,function(err,result){

            console.log(123123);
       })*/

       /*var option = super.applyPluginsWaterfall("options",this.options,option);
       console.log(option);
       return super.applyPluginsBailResult('endpoint',option);  */
    }   
}

module.exports = DB