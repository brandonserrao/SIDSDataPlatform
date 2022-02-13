module.exports = {
  publicPath: getPublicPath(),
  outputDir:'build',
  transpileDependencies: [
    'vuetify'
  ]
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
