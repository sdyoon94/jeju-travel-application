import { createServer } from "http"
import { Server } from "socket.io"
import { travelBuilder } from "./travel/builder.js"

const PORT = 5000
const TRAVEL_NAMESPACE = "/travel"

// 허용할 도메인 주소
const origin = ["http://localhost:3000", "http://i7a609.p.ssafy.io/", "https://i7a609.p.ssafy.io/"]

// socket.io Server 생성
const httpServer = createServer()
const io = new Server(httpServer, {
  // path: "/",
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

travelBuilder(io, TRAVEL_NAMESPACE)

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})