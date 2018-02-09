const Tapable = require('tapable')

class DB extends Tapable {
  constructor( options ) {
    // TODO
    // 
    super( options );

    this.options = options;
  }

  request( options ) {
    // TODO
    
    let isEndPoint = this.hasPlugins( "endpoint" );
    let isOption = this.hasPlugins( "options" );
    let params = Object.assign( {} , this.options , options );

    if ( isOption ) {
    	params = this.applyPluginsWaterfall( "options" , params );
    }

    return new Promise( ( resolve , reject ) => {

	    	this.applyPluginsBailResult("endpoint" , params)
	    		.then( (res) => {
	    			let hadJudge = this.hasPlugins( "judge" );

	    			if ( hadJudge ) {
	    				let isPass = this.applyPluginsBailResult( "judge" , res );

	    				if ( isPass ) {
	    					reject(res);
	    				}
	    			} 

	    			resolve( res );  	
	    		} )
	    		.catch ( error  => {

	    			reject( error );

	    		});
    	})
  }
}

module.exports = DB