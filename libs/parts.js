const webpack = require('webpack');

exports.devServer = function(options){
  return {
    devServer: {
      // Enable history API fallback so HTML5 History Api based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization
      host: options.host, // Defaults to 'localhost'
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Emable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}

// Include in Webpack Config File if you want to use CSS
exports.setupCSS = function(paths){
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css', 'less'],
          include: paths
        }
      ]
    }
  }
}

// Include in Webpack Config File if you want to use LESS
exports.setupLESS = function(paths){
  return {
    module: {
      loaders: [
        {
          test: /\.less$/,
          loaders: ['style', 'css', 'less'],
          include: paths
        }
      ]
    }
  };
}

// Include in Webpack Config File if you want to use JSON
exports.setupJSON = function(){
  return {
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    }
  };
}
