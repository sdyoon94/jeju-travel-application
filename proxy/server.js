const express = require("express")
const { createProxyMiddleware } = require('http-proxy-middleware')

const ORIGIN = "http://localhost:3000"

const GOOGLE_MAPS_PATH = "/maps/api"
const GOOGLE_MAPS_DOMAIN = "https://maps.googleapis.com"

var app = express()

app.use(GOOGLE_MAPS_PATH, createProxyMiddleware({
  target: GOOGLE_MAPS_DOMAIN,
  changeOrigin: true,
  onProxyRes: (pReq, req, res) => {
    res.setHeader("Access-Control-Allow-Origin", ORIGIN)
  }
}))

app.listen(3001)