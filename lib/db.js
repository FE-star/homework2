const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    // TODO
    super(options);
    this.options = options; //TEST 1
  }

  request(options) {
    // TODO
    return new Promise((resolve, reject) =>{
    	let obj = this.applyPluginsWaterfall('options',this.options); //test 4 test 5
    		if(obj == undefined){ //test 2
    			obj = options
    		}else{              //test 4 test 5
    			for(let name in options){ 
    			if(obj[name] == undefined){
				obj[name] = options[name];
			   }
    		}	
  		}
    	let temp = this.applyPluginsBailResult('endpoint',obj);//test 2,test3
    	console.log(temp)
    	temp.then((res)=>{
    		//resolve(res);//test 1,2,3,4,5
    		let judgeresult = this.applyPluginsBailResult('judge',res); //test 6
    		if(judgeresult){
    			reject(res)
    		}else{
    			resolve(res);
    		}
          },(res)=>{ //test 7
          	reject(res);
          })
    	
    })
  }
}

module.exports = DB