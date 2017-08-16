var path = require('path');
var webpack = require('webpack');
module.exports={
    module:{
        loaders:[{
            test:/\.js$/,
            loader:'babel-loader',
            query:{
                presets:['babel-preset-stage-0']
            },
            exclude:[
               path.resolve( __dirname, './node_modules' )
            ]
        }]
    }
};