import { isTerminated, remove } from "./stateManager.js"
import { errorEmitter, CAST_TYPES } from "./emitter.js"
import { ERRORS } from "./eventHandler.js"
import { fetchTravel } from "./api/fetchTravel.js"

const APIS = {
  HOST_SERVER: "https://i7a609.p.ssafy.io/api/v1",
  FETCH_TRAVEL: {
    request: fetchTravel
  },
  UPDATE_TRAVEL: {

  }
}

// ===== API Handler start =====
const apiHandler = async (socket, namespace, room, roomTable, api) => {
  await api.request(room, roomTable)

  // API 호출 이후 roomTable[room].status === TERMINATED
  if (isTerminated(room, roomTable)) {
    errorEmitter({ socket, namespace, room }, CAST_TYPES.BROADCAST_SERVER, ERRORS.TERMINATED_ERROR)
    remove(room, roomTable)
  }
}
// ===== API Handler end =====


export { apiHandler, APIS }