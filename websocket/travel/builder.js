import jwtDecode from "jwt-decode"

import { initalize, dispatch, create, pushSocket } from "./stateManager.js"
import { createTravelLogger } from "./logger.js"
import { EVENTS } from "./eventHandler.js"
import { fetchTravel, fetchTravelInfo } from "./api/fetchTravel.js"

const logger = createTravelLogger("namespace")

const travelBuilder = (io, nsp) => {
  // namespace 등록
  const namespace = io.of(nsp)

  // state 생성
  const roomTable = create()

  // event handler 등록
  namespace.on("connection", async (socket) => {
    let { query, auth } = socket.handshake
    let { travelId } = query

    

    let { token } = auth
    let { id } = jwtDecode(token)
    
    // client socket 최초 접근 시퀀스
    travelId += ""
    socket.join(travelId)
    socket.data.travelId = travelId
    socket.data.id = id
    socket.data.token = `Bearer ${token}`

    logger.info(`client connected[${socket.id}] - travelId(${travelId}), id(${id})`)

    // travelId로의 첫 접근일 경우, roomTable[travelId] 초기화
    if (!roomTable[travelId]) {
      initalize(travelId, roomTable)
      logger.info(`travelId(${travelId}) 초기화`)
    }

    try {
      // travel info 받아오기 (socket의 토큰을 활용)
      const travelInfo = await fetchTravelInfo(travelId, socket.data.token)
      
      // 여행에 참여 중인 멤버인지 확인
      let verified = false
      
      const { member } = travelInfo
      member.forEach(memberInfo => {
        const { kakaoId } = memberInfo
        if (kakaoId == id) {
          verified = true
        }
      })
      
      // 여행에 참여 중인 멤버인 경우, travelInfo의 member 업데이트
      if (verified) {
        roomTable[travelId].travelInfo.member = member
        logger.info(`travelId (${travelId})에 속한 멤버 - id (${id})`)
      }
      // 아닌 경우 throw Error()
      else {
        logger.error(`travelId (${travelId})에 속하지 않은 멤버 - id (${id})`)
        throw new Error()
      }
    }
    catch (err) {
      // 에러 발생 시, socket disconnect
      socket.emit("error")
      socket.disconnect()
      return
    }

    // roomTable에 여행 정보가 없는 경우
    if (!roomTable[travelId].fetched) {
      dispatch(travelId, roomTable)
      try {
        await fetchTravel(travelId, roomTable, socket.data.token)
        namespace.to(travelId).emit("get travel", {
          status: 1,
          travel: {
            travelInfo: roomTable[travelId].travelInfo,
            schedules: roomTable[travelId].schedules
          }
        })
      }
      catch (err) {
        logger.error(`travelId (${travelId}) fetch 에러`)
        socket.emit("error")
        socket.disconnect()
        return
      }
    }
    else {
      socket.emit("get travel", {
        status: 1,
        travel: {
          travelInfo: roomTable[travelId].travelInfo,
          schedules: roomTable[travelId].schedules
        }
      })
    }

    // 정상적으로 여행에 참가가 가능한 경우, roomTable에 socket push
    pushSocket(socket, travelId, roomTable)

    socket.on("disconnect", async (reason) => {
      // 서버에서 직접 disconnect를 시킨 경우
      if (reason === "server namespace disconnect") {
        return
      }
      // 업데이트 코드 작성해서 올리기
    })

    // fetch travel 이벤트 핸들러
    socket.on(EVENTS.FETCH_TRAVEL_EVENT.eventName, () => {
      const travelId = socket.data.travelId
      const arg = null
      EVENTS.FETCH_TRAVEL_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.FETCH_TRAVEL_EVENT.eventName, arg)
    })

    // grant travelinfo authority 이벤트 핸들러
    socket.on(EVENTS.GRANT_TRAVELINFO_AUTHORITY_EVENT.eventName, () => {
      const travelId = socket.data.travelId
      const id = socket.data.id
      const arg = { id }
      EVENTS.GRANT_TRAVELINFO_AUTHORITY_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.GRANT_TRAVELINFO_AUTHORITY_EVENT.eventName, arg)
    })

    // grant schedules authority 이벤트 핸들러
    socket.on(EVENTS.GRANT_SCHEDULES_AUTHORITY_EVENT.eventName, ({ day }) => {
      const travelId = socket.data.travelId
      const id = socket.data.id
      const arg = { id, day }
      EVENTS.GRANT_SCHEDULES_AUTHORITY_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.GRANT_SCHEDULES_AUTHORITY_EVENT.eventName, arg)
    })

    // revoke travelinfo authority 이벤트 핸들러
    socket.on(EVENTS.REVOKE_TRAVELINFO_AUTHORITY_EVENT.eventName, () => {
      const travelId = socket.data.travelId
      const id = socket.data.id
      const arg = { id }
      EVENTS.REVOKE_TRAVELINFO_AUTHORITY_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.REVOKE_TRAVELINFO_AUTHORITY_EVENT.eventName, arg)
    })

    // revoke schedules authority 이벤트 핸들러
    socket.on(EVENTS.REVOKE_SCHEDULES_AUTHORITY_EVENT.eventName, ({ day }) => {
      const travelId = socket.data.travelId
      const id = socket.data.id
      const arg = { id, day }
      EVENTS.REVOKE_SCHEDULES_AUTHORITY_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.REVOKE_SCHEDULES_AUTHORITY_EVENT.eventName, arg)
    })

    // update staytime 이벤트 핸들러
    socket.on(EVENTS.UPDATE_STAYTIME_EVENT.eventName, (day, turn, stayTime) => {
      const travelId = socket.data.travelId
      const arg = { day, turn, stayTime }
      EVENTS.UPDATE_STAYTIME_EVENT.call(socket, namespace, travelId, roomTable, 
        EVENTS.UPDATE_STAYTIME_EVENT.eventName, arg)
    })

    // swap schedule 이벤트 핸들러
    socket.on(EVENTS.SWAP_SCHEDULE_EVENT.eventName, (day, turn1, turn2) => {
      const travelId = socket.data.travelId
      const arg = { day, turn1, turn2 }
      EVENTS.SWAP_SCHEDULE_EVENT.call(socket, namespace, travelId, roomTable, 
        EVENTS.SWAP_SCHEDULE_EVENT.eventName, arg)
    })

    // create schedule 이벤트 핸들러
    socket.on(EVENTS.CREATE_SCHEDULE_EVENT.eventName, (day, placeUid, placeName, lat, lng) => {
      const travelId = socket.data.travelId
      const arg = { day, placeUid, placeName, lat, lng }
      EVENTS.CREATE_SCHEDULE_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.CREATE_SCHEDULE_EVENT.eventName, arg)
    })

    // delete schedule 이벤트 핸들러
    socket.on(EVENTS.DELETE_SCHEDULE_EVENT.eventName, (day, turn) => {
      const travelId = socket.data.travelId
      const arg = { day, turn }
      EVENTS.DELETE_SCHEDULE_EVENT.call(socket, namespace, travelId, roomTable,
        EVENTS.DELETE_SCHEDULE_EVENT.eventName, arg)
    })
  })
}

export { travelBuilder }