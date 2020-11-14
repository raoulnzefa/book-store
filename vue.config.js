const GoogleFontsPlugin = require("google-fonts-webpack-plugin");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    plugins: [
        new GoogleFontsPlugin({
            fonts: [
              { family: "Source Sans Pro" },
              { family: "Roboto", variants: [ "100", "300", "400", "500", "700", "900" ] }
          ]
        })
    ]
 },
 publicPath: process.env.NODE_ENV === 'production'
    ? '/bookstore/'
    : '/'
//  devServer:{
//    port:8081,
//    proxy: 'http://localhost/larashop-api/public/api/v1/',
//  }
}