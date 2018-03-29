var webpack = require('webpack');   //minify 시키기위한작업

module.exports = {
    //devtool : 'eval-source-map',
    entry: './client/index.js',
    //entry: './client/index_redux.js',

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
        port: 3000,
        contentBase: __dirname + '/public/',
        inline : true
    },

    //minify 시키기위한작업
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
            'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
            warnings: false,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ],

    module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                  test: /\.css$/,
                  loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                }
            ]
    }
};
