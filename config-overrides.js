const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
  };
  
  return config;
}; 