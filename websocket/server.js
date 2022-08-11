import { createServer } from "http"
import { Server } from "socket.io"

import { scheduleNamespaceConstructor } from "./schedule"

// 허용할 도메인 주소
const origin = ["http://localhost:3000/", "http://i7a609.p.ssafy.io/", "https://i7a609.p.ssafy.io/"]

// socket.io Server 생성
const httpServer = createServer()
const io = new Server(httpServer, {
  serveClient: false,
  allowRequest: (req, callback) => {
    const error = null
    const success = true
    callback(error, success)
  },
  cors: {
    origin
  }
})

// Namespace 객체의 nsp (namespace), constructor 선언
const namespaces = [
  {
    nsp: "/schedule",
    constructor: scheduleNamespaceConstructor
  }
]

// 각 Namespace 생성
namespaces.forEach(({ nsp, constructor }) => {
  constructor(io, nsp)
})

httpServer.listen(5000)