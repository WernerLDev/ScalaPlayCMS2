// vendor-bundles.webpack.config.js
var webpack = require('webpack')
var path = require('path');

module.exports = {
  entry: {
    'react' : ['react', 'react-dom', 'react-split-pane', 'semantic-ui-react', 'moment', 'immutable', 'babel-polyfill']
  },

  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'app/assets/javascripts/'),

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: path.join(__dirname, 'target/webpack/dist/[name]-manifest.json'),
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib'
    }),
  ],
}