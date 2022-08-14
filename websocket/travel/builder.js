import { isInitialized, initalize, dispatch, create } from "./stateManager.js"
import { apiHandler, APIS } from "./apiHandler.js"
import { createTravelLogger } from "./logger.js"
import { EVENTS } from "./emitter.js"
import { process } from "./stateManager.js"

const logger = createTravelLogger("namespace")

const travelBuilder = (io, nsp) => {
  // namespace 등록
  const namespace = io.of(nsp)

  // state 생성
  const roomTable = create()

  // event handler 등록
  namespace.on("connection", (socket) => {
    logger.info(`client connected - [${socket.id}]`)
    let { query, auth } = socket.handshake
    let { travelId } = query

    // client socket 최초 접근 시퀀스
    const room = travelId + ""
    socket.data.room = room
    socket.join(room)
    if (!isInitialized(room, roomTable)) {
      initalize(room, roomTable)
      dispatch(room, roomTable)
      apiHandler(socket, namespace, room, roomTable, APIS.FETCH_TRAVEL)
    }

    socket.on(EVENTS.JOIN_EVENT.eventName, (id) => {
      const room = socket.data.room
      const arg = { id }
      process(EVENTS.JOIN_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    socket.on(EVENTS.CHECK_EVENT.eventName, () => {
      const room = socket.data.room
      const arg = null
      process(EVENTS.CHECK_EVENT, arg, 
        { socket, namespace, room, roomTable })
    })

    socket.on(EVENTS.FETCH_EVENT.eventName, () => {
      const room = socket.data.room
      const arg = null
      process(EVENTS.FETCH_EVENT, arg,
        { socket, namespace, room, roomTable })
    })
  })
}

export { travelBuilder }