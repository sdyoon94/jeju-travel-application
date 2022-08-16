import { isInitialized, initalize, dispatch, create, asyncProcess } from "./stateManager.js"
import { apiHandler, APIS } from "./apiHandler.js"
import { createTravelLogger } from "./logger.js"
import { EVENTS } from "./eventHandler.js"
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

    // join 이벤트 핸들러
    socket.on(EVENTS.JOIN_EVENT.eventName, (id) => {
      const room = socket.data.room
      const arg = { id }
      process(EVENTS.JOIN_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    socket.on("disconnect", async (reason) => {
      // 서버에서 직접 disconnect를 시킨 경우
      if (reason === "server namespace disconnect") {
        return
      }
      const arg = null
      await asyncProcess(EVENTS.LEAVE_EVENT, arg, 
        { socket, namespace, room, roomTable })
      if (roomTable[room].onlineMembers === 0) {

      }
    })

    // check fetched 이벤트 핸들러
    socket.on(EVENTS.CHECK_FETCHED_EVENT.eventName, () => {
      const room = socket.data.room
      const arg = null
      process(EVENTS.CHECK_FETCHED_EVENT, arg, 
        { socket, namespace, room, roomTable })
    })

    // fetch travel 이벤트 핸들러
    socket.on(EVENTS.FETCH_TRAVEL_EVENT.eventName, () => {
      const room = socket.data.room
      const arg = null
      process(EVENTS.FETCH_TRAVEL_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    // grant authority 이벤트 핸들러
    socket.on(EVENTS.GRANT_AUTHORITY_EVENT.eventName, (authorityName, day) => {
      const room = socket.data.room
      const id = socket.data.id
      const arg = { id, authorityName, day }
      process(EVENTS.GRANT_AUTHORITY_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    // revoke authority 이벤트 핸들러
    socket.on(EVENTS.REVOKE_AUTHORITY_EVENT.eventName, (authorityName, day) => {
      const room = socket.data.room
      const id = socket.data.id
      const arg = { id, authorityName, day }
      process(EVENTS.REVOKE_AUTHORITY_EVENT, arg, 
        { socket, namespace, room, roomTable })
    })

    // update staytime 이벤트 핸들러
    socket.on(EVENTS.UPDATE_STAYTIME_EVENT.eventName, (day, turn, stayTime) => {
      const room = socket.data.room
      const arg = { day, turn, stayTime }
      process(EVENTS.UPDATE_STAYTIME_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    // swap schedule 이벤트 핸들러
    socket.on(EVENTS.SWAP_SCHEDULE_EVENT.eventName, (day, turn1, turn2) => {
      const room = socket.data.room
      const arg = { day, turn1, turn2 }
      process(EVENTS.SWAP_SCHEDULE_EVENT, arg, 
        { socket, namespace, room, roomTable })
    })

    // create schedule 이벤트 핸들러
    socket.on(EVENTS.CREATE_SCHEDULE_EVENT.eventName, (day, placeUid, placeName, lat, lng) => {
      const room = socket.data.room
      const arg = { day, placeUid, placeName, lat, lng }
      process(EVENTS.CREATE_SCHEDULE_EVENT, arg,
        { socket, namespace, room, roomTable })
    })

    // delete schedule 이벤트 핸들러
    socket.on(EVENTS.DELETE_SCHEDULE_EVENT.eventName, (day, turn) => {
      const room = socket.data.room
      const arg = { day, turn }
      process(EVENTS.DELETE_SCHEDULE_EVENT, arg,
        { socket, namespace, room, roomTable })
    })
  })
}

export { travelBuilder }