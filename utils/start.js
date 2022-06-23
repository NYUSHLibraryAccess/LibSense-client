// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const env = require('./env');
const config = require('../webpack.config');

(async () => {
  for (let entryName in config.entry) {
    config.entry[entryName] = [
      `webpack-dev-server/client?hostname=${env.HOST}&port=${env.PORT}&hot=true`,
      "webpack/hot/dev-server",
    ].concat(config.entry[entryName]);
  }

  const compiler = webpack(config);

  const server = new WebpackDevServer({
    hot: false,
    liveReload: false,
    client: false,
    static: path.resolve(__dirname, "../build"),
    devMiddleware: {
      writeToDisk: true
    },
    host: env.HOST,
    port: env.PORT,
    proxy: {
      '/api': {
        target: "https://libsense.shanghai.nyu.edu",
        secure: false,
      },
    },
  }, compiler);

  await server.start();
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach(signal => process.on(signal, () => {
    compiler.close(() => {
    });
    process.exit();
  }));
})();
