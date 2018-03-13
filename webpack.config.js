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
const frontendCodePath = './frontend';
const bootstrapPath = resolveModulePath('bootstrap');
const jsoneditorPath = resolveModulePath('jsoneditor');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './frontend/js/index.js',
    login: './frontend/js/login.js',
    vendor: './frontend/js/vendor.js',
  },
  output: {
    filename: `[name]${fileSuffix}.js`,
    path: path.resolve(__dirname, 'build'),
    publicPath: 'public/',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['env', 'stage-0'],
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

      { from: path.join(jsoneditorPath, '/dist/jsoneditor.css'), to: 'css/[name].[ext]' },
      { from: path.join(jsoneditorPath, '/dist/jsoneditor.map'), to: 'css/[name].[ext]' },
      { from: path.join(jsoneditorPath, '/dist/img/*'), to: 'css/img/[name].[ext]' },
    ]),
  ],
};
