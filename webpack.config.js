/* eslint-env node */
const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const WebpackBarPlugin = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const env = require('./utils/env');
const packageJson = require('./package.json');

const isDevelopment = env.NODE_ENV === 'development';
const isAnalyzer = env.ANALYZER === 'true';

const cssLoaderOptions = {
  modules: {
    auto: true,
    localIdentName: isDevelopment ? '[file]__[local]' : '[md5:hash:base64:12]',
    exportLocalsConvention: 'dashesOnly',
  },
};

const config = {
  devServer: {
    hot: true,
    client: {
      overlay: false,
    },
    static: path.resolve(__dirname, 'build'),
    host: env.HOST,
    port: env.PORT,
    open: true,
    proxy: {
      '/api': {
        target: 'http://10.208.6.254:8081',
        pathRewrite: { '^/api': '' },
      },
      // '/api': {
      //   target: 'https://libsense.shanghai.nyu.edu',
      //   secure: false,
      // },
    },
  },
  entry: path.resolve(__dirname, 'src/app.tsx'),
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
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 2 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { ...cssLoaderOptions, importLoaders: 2 },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#7c3aed',
                  'link-color': '#7c3aed',
                  'border-radius-base': '6px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|woff2?|ttf|eot)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
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
      template: path.resolve(__dirname, 'src/templates/default.html'),
      minify: !isDevelopment,
    }),
    new DefinePlugin({
      __NAME__: JSON.stringify('LibSense'),
      __VERSION__: JSON.stringify(packageJson.version),
      __IS_DEV__: JSON.stringify(isDevelopment),
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

const devConfig = merge(config, {
  mode: 'development',
  stats: false,
  devtool: 'inline-cheap-module-source-map',
  plugins: [new ReactRefreshPlugin(), new FriendlyErrorsWebpackPlugin()],
});

const prodConfig = merge(config, {
  mode: 'production',
  stats: 'errors-warnings',
  plugins: [
    new WebpackBarPlugin({
      profile: true, // Require patch to work properly.
    }),
    new MiniCssExtractPlugin(),
    isAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        logLevel: 'silent',
      }),
  ].filter(Boolean),
});

module.exports = isDevelopment ? devConfig : prodConfig;
