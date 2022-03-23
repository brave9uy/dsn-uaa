module.exports = {
  configureWebpack: {
    devtool: 'inline-cheap-module-source-map'
  },
  devServer: {
    port: 8089,
    proxy: { // 配置跨域
      [process.env.VUE_APP_BASE_API]: {
        // target: 'http://127.0.0.1:8081/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
        target: 'http://127.0.0.1:3000/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
           */
          [`^${process.env.VUE_APP_BASE_API}`]: ''
        }
      }
    },
    hot: true,
    open: true,
    host: '0.0.0.0'
  }
}
