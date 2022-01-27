module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/SIDSDataPlatform/'
    : '/',
  outputDir:'docs',
  transpileDependencies: [
    'vuetify'
  ]
}
console.log()
