const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]',
              outputPath: 'assets/images/',
              publicPath: 'assets/images/'
            }
          }
        ]
      }
    ]
  }
};
