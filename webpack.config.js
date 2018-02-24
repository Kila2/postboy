const path = require('path');
module.exports = {
  entry: {
    'server.js': path.join(__dirname, 'backend/bin', 'www'),
  },
  output: {
    filename: `[name]${fileSuffix}.js`,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  }
};