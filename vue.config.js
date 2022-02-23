module.exports = {
  publicPath: getPublicPath(),
  outputDir:'build',
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'UNDP SIDS Data Platform'
    }
  }
}

function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'production':
        return '/sids/'
      break;
    case 'staging':
      return '/SIDSDataPlatform/'
      break;
    default:
      return '/'
  }
}
