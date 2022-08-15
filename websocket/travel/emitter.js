import { createTravelLogger } from "./logger.js"
import { ERRORS } from "./eventHandler.js"

const logger = createTravelLogger("emitter")

// CAST TYPE
const CAST_TYPES = {
  UNICAST: 0,
  BROADCAST_SERVER: 1,
  BROADCAST_CLIENT: 2,
  BROADCAST_GLOBAL: 3
}

// ===== Log builder start =====
const eventLogBuilder = (castType, event, ...args) => {
  return `${ castType } (${ event } - [${ args.map(arg => Object.keys(arg).join(",")).join("], [") }])`
}

const errorLogBuilder = (castType, error) => {
  return `${ castType } (${ error.statusCode } - ${ error.msg })`
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


export { CAST_TYPES }
export { eventEmitter, errorEmitter }