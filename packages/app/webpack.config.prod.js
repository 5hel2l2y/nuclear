const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const UI_DIR = path.resolve(__dirname, '..', 'ui');

const config = {
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    namedModules: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        include: [
          APP_DIR,
          UI_DIR
        ],
        exclude: /node_modules\/electron\-timber\/preload\.js/
      },
      {
        test: /.node$/,
        use: 'node-loader'
      },
      {
        test: /.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader'
        ]
      }, {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      },  {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        include: RESOURCES_DIR
      }, {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'url-loader',
        include: UI_DIR
      }, {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.prod.html',
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true
      },
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  target: 'electron-renderer'
};

module.exports = config;
