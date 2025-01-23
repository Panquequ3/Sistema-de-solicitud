const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Otras configuraciones de Webpack...
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    store: 'pack',
    compression: 'gzip',
    cacheDirectory: path.resolve(__dirname, '.webpack_cache'),
    name: 'my-cache',
    version: '1.0',
    managedPaths: [path.resolve(__dirname, 'node_modules')],
    cacheLocation: path.resolve(__dirname, '.webpack_cache', 'cache.pack'),
    packOptions: {
      maxAge: 60 * 60 * 24 * 30, // 30 días
      maxSize: 50 * 1024 * 1024, // 50 MB
      minSize: 1024, // 1 KB
      minRatio: 0.8,
      serialize: (data) => {
        if (typeof data === 'string' && data.length > 100 * 1024) {
          return Buffer.from(data);
        }
        return data;
      },
      deserialize: (data) => {
        if (Buffer.isBuffer(data)) {
          return data.toString();
        }
        return data;
      },
    },
  },
  // Otras configuraciones de Webpack...
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};