import { eventEmitter, errorEmitter, CAST_TYPES } from "./emitter.js"
import { checkAuthorized, join, revokeAllAuthorities } from "./stateManager.js"
import { updateStaytime, swapSchedule, createSchedule, deleteSchedule } from "./stateManager.js"
import { grantAuthority, revokeAuthority } from "./stateManager.js"

// ERROR
const ERRORS = {
  UNKNOWN_CAST_TYPE_ERROR: {
    statusCode: -1,
    msg: "unknown cast type error"
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 0,
    msg: "internal server error"
  },
  FETCH_ERROR: {
    statusCode: 1,
    msg: "fetch error"
  },
  BLOCKED_ERROR: {
    statusCode: 2,
    msg: "blocked error"
  },
  TERMINATED_ERROR: {
    statusCode: 3,
    msg: "terminated error"
  },
  JOIN_ERROR: {
    statusCode: 4,
    msg: "join error"
  },
  INPUT_ERROR: (err) => ({
    statusCode: 5,
    msg: err.message
  })
}

// EVENT
const EVENTS = {
  JOIN_EVENT: {
    eventName: "join",
    callback: (socket, namespace, room, roomTable, eventName, { id }) => {
      try {
        join(room, roomTable, id)
        socket.data.id = id
        eventEmitter({ socket, namespace, room }, 
          CAST_TYPES.BROADCAST_SERVER, eventName, { id })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
        socket.disconnect()
      }
    }
  },
  LEAVE_EVENT: {
    eventName: "leave",
    callback: (socket, namespace, room, roomTable, eventName, _) => {
      const id = socket.data.id
      try {
        leave(room, roomTable, id)
        revokeAllAuthorities(room, roomTable, { id })
        eventEmitter({ socket, namespace, room }, 
          CAST_TYPES.BROADCAST_SERVER, eventName, { id })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
      }
    }
  },
  CHECK_FETCHED_EVENT: {
    eventName: "check fetched",
    callback: (socket, namespace, room, roomTable, eventName, _) => {
      eventEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, eventName, 
        { fetched: roomTable[room].fetched })
    }
  },
  FETCH_TRAVEL_EVENT: {
    eventName: "fetch travel",
    callback: (socket, namespace, room, roomTable, eventName, _) => {
      eventEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, eventName, {
          travelInfo: roomTable[room].travelInfo,
          schedules: roomTable[room].schedules
        })
    }
  },
  GRANT_AUTHORITY_EVENT: {
    eventName: "grant authority",
    callback: (socket, namespace, room, roomTable, eventName, 
        { id, authorityName, day }) => {
      try {
        grantAuthority(room, roomTable, { id, authorityName, day })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, eventName, {
            granted: 1
          })
      }
      catch (err) {
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, eventName, {
            granted: 0
          })
      }
    }
  },
  REVOKE_AUTHORITY_EVENT: {
    eventName: "revoke authority",
    callback: (socket, namespace, room, roomTable, eventName, 
        { id, authorityName, day }) => {
      try {
        revokeAuthority(room, roomTable, { id, authorityName, day })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, eventName, {
            revoked: 1
          })
      }
      catch (err) {
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, eventName, {
            revoked: 0
          })
      }
    }
  },
  UPDATE_STAYTIME_EVENT: {
    eventName: "update staytime",
    callback: (socket, namespace, room, roomTable, eventName, 
        { day, turn, stayTime }) => {
      try {
        updateStaytime(room, roomTable, { day, turn, stayTime })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER, eventName, 
          { day, turn, stayTime })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
      }
    }
  },
  SWAP_SCHEDULE_EVENT: {
    eventName: "swap schedule",
    callback: (socket, namespace, room, roomTable, eventName, 
        { day, turn1, turn2 }) => {
      try {
        checkAuthorized(room, roomTable, { 
          id: socket.data.id,
          authorityName: "schedules",
          day
         })
        swapSchedule(room, roomTable, { day, turn1, turn2 })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER, eventName,
          { day, turn1, turn2 })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
      }
    }
  },
  CREATE_SCHEDULE_EVENT: {
    eventName: "create schedule",
    callback: (socket, namespace, room, roomTable, eventName,
        { day, placeUid, placeName, lat, lng }) => {
      try {
        checkAuthorized(room, roomTable, {
          id: socket.data.id,
          authorityName: "schedules",
          day
        })
        createSchedule(room, roomTable, { day, placeUid, placeName, lat, lng })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER, eventName,
          { day, placeUid, placeName, lat, lng })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
      }
    }
  },
  DELETE_SCHEDULE_EVENT: {
    eventName: "delete schedule",
    callback: (socket, namespace, room, roomTable, eventName,
        { day, turn }) => {
      try {
        checkAuthorized(room, roomTable, {
          id: socket.data.id,
          authorityName: "schedules",
          day
        })
        deleteSchedule(room, roomTable, { day, turn })
        eventEmitter({ socket, namespace, room },
          CAST_TYPES.BROADCAST_SERVER, eventName,
          { day, turn })
      }
      catch (err) {
        errorEmitter({ socket, namespace, room },
          CAST_TYPES.UNICAST, ERRORS.INPUT_ERROR(err))
      }
    }
  }
}


export { ERRORS, EVENTS }