import { createTravelLogger } from "./logger.js"
import { checkMember, enter } from "./stateManager.js"

const logger = createTravelLogger("emitter")

// CAST TYPE
const CAST_TYPES = {
  UNICAST: 0,
  BROADCAST_SERVER: 1,
  BROADCAST_CLIENT: 2,
  BROADCAST_GLOBAL: 3
}

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
  }
}

// EVENT
const EVENTS = {
  JOIN_EVENT: {
    eventName: "join",
    timeout: 20,
    frequency: 50,
    callback: (socket, namespace, room, roomTable, eventName, { id }) => {
      if (checkMember(room, roomTable, id)) {
        enter(room, roomTable)
        eventEmitter({ socket, namespace, room }, 
          CAST_TYPES.BROADCAST_SERVER, eventName, { id })
        return
      }
      errorEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, ERRORS.JOIN_ERROR)
      socket.disconnect()
    }
  },
  CHECK_EVENT: {
    eventName: "check",
    timeout: 20,
    frequency: 50,
    callback: (socket, namespace, room, roomTable, eventName, _) => {
      eventEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, eventName, 
        { fetched: roomTable[room].fetched })
    }
  },
  FETCH_EVENT: {
    eventName: "fetch",
    timeout: 50,
    frequency: 20,
    callback: (socket, namespace, room, roomTable, eventName, _) => {
      eventEmitter({ socket, namespace, room },
        CAST_TYPES.UNICAST, eventName, {
          travelInfo: roomTable[room].travelInfo,
          schedules: roomTable[room].schedules
        })
    }
  }
}

// ===== Log builder start =====
const eventLogBuilder = (castType, event, ...args) => {
  return `${ castType } (${ event } - [${ args.map(arg => Object.keys(arg).join(",")).join("], [") }])`
}

const errorLogBuilder = (castType, error) => {
  return `${ castType } (error${ error.statusCode } - ${ error.msg })`
}
// ===== Log builder end =====


// ===== Event emitter start =====
const eventEmitter = ({ socket, namespace, room }, 
    castType, eventName, ...args) => {
  switch(castType) {
    case CAST_TYPES.UNICAST:
      socket.emit(eventName, ...args)
      logger.info(eventLogBuilder("UNICAST", eventName, ...args))
      break
    case CAST_TYPES.BROADCAST_SERVER:
      namespace.to(room).emit(eventName, ...args)
      logger.info(eventLogBuilder("BROADCAST_SERVER", eventName, ...args))
      break
    case CAST_TYPES.BROADCAST_CLIENT:
      socket.to(room).emit(eventName, ...args)
      logger.info(eventLogBuilder("BROADCAST_CLIENT", eventName, ...args))
      break
    case CAST_TYPES.BROADCAST_GLOBAL:
      namespace.emit(eventName, ...args)
      logger.info(eventLogBuilder("BROADCAST_GLOBAL", eventName, ...args))
      break
    default:
      logger.error(errorLogBuilder("UNKNOWN_CAST_TYPE", ERRORS.UNKNOWN_CAST_TYPE_ERROR))
      break
  }
}
// ===== Event emitter end =====


// ===== Error emitter start =====
const errorEmitter = ({ socket, namespace, room },
  castType, error) => {
switch(castType) {
  case CAST_TYPES.UNICAST:
    socket.emit("error", error)
    logger.error(errorLogBuilder("UNICAST", error))
    break
  case CAST_TYPES.BROADCAST_SERVER:
    namespace.to(room).emit("error", error)
    logger.error(errorLogBuilder("BROADCAST_SERVER", error))
    break
  case CAST_TYPES.BROADCAST_CLIENT:
    socket.to(room).emit("error", error)
    logger.error(errorLogBuilder("BROADCAST_CLIENT", error))
    break
  case CAST_TYPES.BROADCAST_GLOBAL:
    namespace.emit("error", error)
    logger.error(errorLogBuilder("BROADCAST_GLOBAL", error))
    break
  default:
    logger.error(errorLogBuilder("UNKNOWN_CAST_TYPE", ERRORS.UNKNOWN_CAST_TYPE_ERROR))
    break
}
}
// ===== Error emitter end =====


export { CAST_TYPES, ERRORS, EVENTS }
export { eventEmitter, errorEmitter }