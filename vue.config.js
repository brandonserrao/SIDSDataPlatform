module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/SIDSDataPlatform/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
console.log(process.env.NODE_ENV)
