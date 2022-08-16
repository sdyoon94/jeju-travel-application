import { eventEmitter, errorEmitter, CAST_TYPES } from "./emitter.js"
import { checkSchedulesAuthority, checkTravelInfoAuthority } from "./stateManager.js"
import { grantSchedulesAuthority, grantTravelInfoAuthority } from "./stateManager.js"
import { revokeSchedulesAuthority, revokeTravelInfoAuthority } from "./stateManager.js"
import { revokeAllAuthorities } from "./stateManager.js"
import { updateStaytime, swapSchedule, createSchedule, deleteSchedule } from "./stateManager.js"

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
  FETCH_TRAVEL_EVENT: {
    eventName: "fetch travel",
    call: (socket, namespace, travelId, roomTable, eventName, _) => {
      eventEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, eventName, {
          travelInfo: roomTable[travelId].travelInfo,
          schedules: roomTable[travelId].schedules
        })
    }
  },
  GRANT_TRAVELINFO_AUTHORITY_EVENT: {
    eventName: "grant travelinfo authority",
    call: (socket, namespace, travelId, roomTable, eventName, { id }) => {
      try {
        grantTravelInfoAuthority(travelId, roomTable, { id })
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
  GRANT_SCHEDULES_AUTHORITY_EVENT: {
    eventName: "grant schedules authority",
    call: (socket, namespace, travelId, roomTable, eventName, 
      { id, day }) => {
        try {
          grantSchedulesAuthority(travelId, roomTable, { id, day })
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
  REVOKE_TRAVELINFO_AUTHORITY_EVENT: {
    eventName: "revoke travelinfo authority",
    call: (socket, namespace, travelId, roomTable, eventName, 
      { id }) => {
      try {
        revokeTravelInfoAuthority(travelId, roomTable, { id })
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
  REVOKE_SCHEDULES_AUTHORITY_EVENT: {
    eventName: "revoke schedules authority",
    call: (socket, namespace, travelId, roomTable, eventName, 
        { id, day }) => {
      try {
        revokeSchedulesAuthority(travelId, roomTable, { id, day })
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
    call: (socket, namespace, travelId, roomTable, eventName, 
        { day, turn, stayTime }) => {
      try {
        checkSchedulesAuthority(travelId, roomTable, { 
          id: socket.data.id, 
          day 
        })
        updateStaytime(travelId, roomTable, { day, turn, stayTime })
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
    call: (socket, namespace, travelId, roomTable, eventName, 
        { day, turn1, turn2 }) => {
      try {
        checkSchedulesAuthority(travelId, roomTable, { 
          id: socket.data.id, 
          day 
        })
        swapSchedule(travelId, roomTable, { day, turn1, turn2 })
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
    call: (socket, namespace, travelId, roomTable, eventName,
        { day, placeUid, placeName, lat, lng }) => {
      try {
        checkSchedulesAuthority(travelId, roomTable, { 
          id: socket.data.id, 
          day 
        })
        createSchedule(travelId, roomTable, { day, placeUid, placeName, lat, lng })
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
    call: (socket, namespace, travelId, roomTable, eventName,
        { day, turn }) => {
      try {
        checkSchedulesAuthority(travelId, roomTable, { 
          id: socket.data.id, 
          day 
        })
        deleteSchedule(travelId, roomTable, { day, turn })
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