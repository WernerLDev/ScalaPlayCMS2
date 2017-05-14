// app.webpack.config.js
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './target/web/typescript/main/typescripts/app.js'
  },

  output: {
    filename: 'app.bundle.js',
    path: 'app/assets/javascripts/',
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./target/webpack/dist/react-manifest.json')
    }),
  ]
}