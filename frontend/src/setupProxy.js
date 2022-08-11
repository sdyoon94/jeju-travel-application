const {createProxyMiddleware}=require('http-proxy-middleware');

module.exports=function(app){
  createProxyMiddleware('/api',{
    target: 'http://i7a609.p.ssafy.io:8081',
    changeOrigin: true
  })
}