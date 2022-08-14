import { eventEmitter, errorEmitter, CAST_TYPES, ERRORS } from "./emitter.js"

// ROOM_STATUSES
const ROOM_STATUSES = {
  READY: 1,
  BLOCKED: 2,
  TERMINATED: 3,
}

// DATA_STATUSES
const DATA_STATUSES = {
  ORIGINAL: 0,
  UPDATED: 1,
  DELETED: 2,
  CREATED: 3,
  REMOVED: 4
}

// ===== room state management start =====
const isTerminated = (room, roomTable) => roomTable[room].status === ROOM_STATUSES.TERMINATED
const isBlocked = (room, roomTable) => roomTable[room].status === ROOM_STATUSES.BLOCKED

const terminate = (room, roomTable) => {
  roomTable[room].status = ROOM_STATUSES.TERMINATED
}

const remove = (room, roomTable) => {
  delete roomTable[room]
}

const dispatch = (room, roomTable) => {
  roomTable[room].status = ROOM_STATUSES.BLOCKED
}

const release = (room, roomTable) => {
  roomTable[room].status = ROOM_STATUSES.READY
}

const enter = (room, roomTable) => {
  roomTable[room].socketCnt++
}

const leave = (room, roomTable) => {
  roomTable[room].socketCnt--
}
// ===== room state management end =====


// ===== data state management start =====
const addTravelInfo = (room, roomTable, travelInfo) => {
  roomTable[room].travelInfo = {
    ...travelInfo,
    status: DATA_STATUSES.ORIGINAL
  }
}

const initSchedules = (room, roomTable, travelInfo) => {
  roomTable[room].schedules = new Array(travelInfo.periodInDays)
}

const addSchedule = (room, roomTable, schedule, index) => {
  roomTable[room].schedules[index] = schedule.map(v => ({
    ...v,
    status: DATA_STATUSES.ORIGINAL
  }))
}

const checkMember = (room, roomTable, id) => {
  const members = roomTable[room].travelInfo.member

  for (let i = 0; i < members.length; i++) {
    const { kakaoId, online } = members[i]
    if (kakaoId == id && !online) {
      members[i] = {
        ...members[i],
        online: 1
      }
      roomTable[room].travelInfo.member = members
      return true
    }
  }

  return false
}

// ===== data state management end =====


// ===== roomTable state manager start =====
const isInitialized = (room, roomTable) => roomTable[room] ? true : false

const initalize = (room, roomTable) => {
  roomTable[room] = {
    status: ROOM_STATUSES.READY,
    error: null,
    fetched: 0,
    socketCnt: 0
  }
}

const create = () => {
  const roomTable = {}

  return roomTable
}
// ===== roomTable state manager end =====


// ===== Concurrency management start =====
const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

const process = async (event, arg,
    { socket, namespace, room, roomTable }, cnt = 0) => {
  if (isTerminated(room, roomTable)) {
    errorEmitter({ socket, namespace, room },
      CAST_TYPES.UNICAST, ERRORS.TERMINATED_ERROR)
    return
  }
  let { eventName, timeout, frequency, callback } = event

  if (cnt === frequency) {
    errorEmitter({ socket, namespace, room },
      CAST_TYPES.UNICAST, ERRORS.BLOCKED_ERROR)
    release(room, roomTable)
    return
  }

  if (!isBlocked(room, roomTable)) {
    dispatch(room, roomTable)
    callback(socket, namespace, room, roomTable, eventName, arg)
    release(room, roomTable)
    return
  }

  else {
    await wait(timeout)
    process(event, arg, 
      { socket, namespace, room, roomTable }, ++cnt)
  }
}
// ===== Concurrency management end =====


export { isTerminated, isBlocked, terminate, remove, dispatch, release, enter, leave }
export { addTravelInfo, initSchedules, addSchedule, checkMember }
export { isInitialized, initalize, create }
export { process }