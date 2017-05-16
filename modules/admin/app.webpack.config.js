// app.webpack.config.js
var webpack = require('webpack')
var path = require('path');

console.log(__dirname);
console.log(path.join(__dirname, '/target/webpack/dist/react-manifest.json'));

module.exports = {
  entry: {
    app: path.join(__dirname, '/target/web/typescript/main/typescripts/app.js')
  },

  output: {
    filename: 'app.bundle.js',
    path: path.join(__dirname, '/app/assets/javascripts'),
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(path.join(__dirname, '/target/webpack/dist/react-manifest.json'))
    }),
  ]
}