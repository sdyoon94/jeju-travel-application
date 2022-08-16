import { createServer } from "http"
import { Server } from "socket.io"
import { travelBuilder } from "./travel/builder.js"

const PORT = 5000
const TRAVEL_NAMESPACE = "/travel"

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
    origin: ["https://www.piesocket.com", "http://amritb.github.io"]
  }
})

travelBuilder(io, TRAVEL_NAMESPACE)

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})