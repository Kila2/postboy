const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const fileSuffix = isDev ? '' : '-[chunkhash].min';
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolveModulePath(name) {
  const packageJson = '/package.json';
  return path.dirname(require.resolve(`${name}${packageJson}`));
}
const frontendCodePath = './frontend'
const bootstrapPath = resolveModulePath('bootstrap');

module.exports = {
  entry: {
    vendor: './frontend/js/vendor.js',
  },
  output: {
    filename: `[name]${fileSuffix}.js`,
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['env'],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([
      { from: path.join(frontendCodePath, 'css/*'), to: 'css/[name].[ext]' },
      { from: path.join(frontendCodePath, 'fonts/css/*'), to: 'fonts/css/[name].[ext]' },
      { from: path.join(frontendCodePath, 'fonts/js/*'), to: 'fonts/js/[name].[ext]' },

      { from: path.join(bootstrapPath, '/dist/css/bootstrap.min.css'), to: 'css/[name].[ext]' },
      { from: path.join(bootstrapPath, '/dist/css/bootstrap.min.css.map'), to: 'css/[name].[ext]' },
    ])
  ],
};