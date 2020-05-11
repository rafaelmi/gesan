const fs = require('fs');
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    port: '8080',
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '/api': '' }
      },
      '/socket.io': {
        target: 'http://localhost:3000'
      },
    },
  },
};
