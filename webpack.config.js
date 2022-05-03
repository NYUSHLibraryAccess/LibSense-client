const path = require('path');
const { merge } = require('webpack-merge');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const env = require('./utils/env');

const isDevelopment = env.NODE_ENV !== 'production';
const isAnalyzer = env.ANALYZER === 'true';

let config = {
  entry: {
    app: path.resolve(__dirname, 'src/pages/app.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': '#8621dc',
                  'link-color': '#8621dc'
                }
              }
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:6].[ext]',
              esModule: false,
              limit: 0,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new AntdDayjsWebpackPlugin(),
    new LodashWebpackPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'public'),
    //       to: path.resolve(__dirname, 'build'),
    //     },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/default.ejs'),
      minify: !isDevelopment,
      chunks: ['app'],
    }),
    new DefinePlugin({
      '__IS_DEV__': JSON.stringify(isDevelopment),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

if (isDevelopment) {
  config = merge(config, {
    mode: 'development',
    stats: false,
    devtool: 'inline-cheap-module-source-map',
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin({
        overlay: true,
      }),
    ],
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
  });
} else {
  config = merge(config, {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/i,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'webpack-strip-block',
              options: {
                start: 'debug:start',
                end: 'debug:end',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new WebpackBarPlugin(),
      ...(isAnalyzer ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerHost: env.HOST,
          analyzerPort: env.PORT,
          logLevel: 'silent',
        }),
      ] : []),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
    performance: {
      maxEntrypointSize: 4096000,
      maxAssetSize: 1024000,
    },
  });
}

module.exports = config;
