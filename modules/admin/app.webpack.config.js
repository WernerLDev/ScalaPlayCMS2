// app.webpack.config.js
var webpack = require('webpack')
var path = require('path');

module.exports = {
  entry: {
    app: path.join(__dirname, '/target/web/typescript/main/typescripts/app.js')
  },

  output: {
    filename: 'app.bundle.js',
    path: path.join(__dirname, '/app/assets/javascripts'),
    libraryTarget: 'var',
    library: 'App'
  },

  devtool: 'eval-source-map',
  module:  {
      loaders: [
          {
              test:   /\.js$/,
              loader: 'source-map-loader',
              exclude: path.join(__dirname, '/node_modules/'),
              include: path.join(__dirname, '/target/web/typescript/main/typescripts')
          }
      ]
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(path.join(__dirname, '/target/webpack/dist/react-manifest.json'))
    }),
  ]
}