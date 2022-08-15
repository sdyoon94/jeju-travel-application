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

// ===== roomTable state manager start =====
const isInitialized = (room, roomTable) => roomTable[room] ? true : false

const initalize = (room, roomTable) => {
  roomTable[room] = {
    status: ROOM_STATUSES.READY,
    error: null,
    fetched: 0,
    onlineMembers: 0,
    travelInfo: null,
    schedules: null,
    deletedScheduleList: []
  }
}

const create = () => {
  const roomTable = {}
  return roomTable
}
// ===== roomTable state manager end =====


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
  roomTable[room].onlineMembers++
}

const leave = (room, roomTable) => {
  roomTable[room].onlineMembers--
}
// ===== room state management end =====


// ===== init data start =====
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
// ===== init data end =====


// ===== state management functions start =====

// INPUT_ERRORS
const INPUT_ERRORS = {
  UNAUTHORIZED_ERROR: new Error("unauthorized error"),
  RANGE_ERROR_DAY: new Error("range error (day)"),
  RANGE_ERROR_TURN: new Error("range error (turn)"),
  RANGE_ERROR_STAYTIME: new Error("range error (staytime)")
}

// CHECK_DAY
const checkDay = (room, roomTable, day) => {
  const flag = roomTable[room] && roomTable[room].fetched &&
    day >= 0 && day < roomTable[room].travelInfo.periodInDays

  return flag
}

// JOIN
const join = (room, roomTable, id) => {
  const members = roomTable[room].travelInfo.member

  for (let i = 0; i < members.length; i++) {
    const { kakaoId, online } = members[i]
    if (kakaoId == id && !online) {
      members[i] = {
        ...members[i],
        online: 1
      }
      roomTable[room].travelInfo.member = members
      enter(room, roomTable)

      console.log("join")
      console.log(roomTable[room].travelInfo.member)
      return
    }
  }

  throw INPUT_ERRORS.UNAUTHORIZED_ERROR
}

// UPDATE_STAYTIME
const MAX_STAYTIME = 24 * 60 // 24시간

const updateStaytime = (room, roomTable, { day, turn, staytime }) => {
  if (staytime < 0 || staytime > MAX_STAYTIME) {
    throw INPUT_ERRORS.RANGE_ERROR_STAYTIME
  }

  if (!checkDay(room, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[room].schedules[day]

  if (turn < 0 || turn >= scheduleList.length) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  const schedule = scheduleList[turn]
  schedule.staytime = staytime
  if (schedule.status === DATA_STATUSES.ORIGINAL) {
    schedule.status = DATA_STATUSES.UPDATED
  }

  console.log(`update staytime - ${day} ${turn} ${staytime}`)
  console.log(roomTable[room].schedules[day][turn])
}

// SWAP_SCHEDULE
const swap = (scheduleList, turn1, turn2) => {
  const temp = scheduleList[turn1]
  scheduleList[turn1] = scheduleList[turn2]
  scheduleList[turn2] = temp
}

const swapSchedule = (room, roomTable, { day, turn1, turn2 }) => {
  if (!checkDay(room, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[room].schedules[day]

  if (turn1 <= 0 || turn1 >= scheduleList.length - 1 ||
      turn2 <= 0 || turn2 >= scheduleList.length - 1) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  swap(scheduleList, turn1, turn2)

  if (scheduleList[turn1].status === DATA_STATUSES.ORIGINAL) {
    scheduleList[turn1].status = DATA_STATUSES.UPDATED
  }
  if (scheduleList[turn2].status === DATA_STATUSES.ORIGINAL) {
    scheduleList[turn2].status = DATA_STATUSES.UPDATED
  }

  console.log(`swap schedule - ${day} ${turn1} ${turn2}`)
  console.log(roomTable[room].schedules[day])
}

// CREATE_SCHEDULE
const createSchedule = (room, roomTable,
    { day, placeUid, placeName, lat, lng }) => {
  if (!checkDay(room, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[room].schedules[day]

  scheduleList.push({
    placeUid,
    placeName,
    lat,
    lng,
    status: DATA_STATUSES.CREATED
  })

  console.log(`create schedule - ${day} ${placeUid} ${placeName} ${lat} ${lng}`)
  console.log(roomTable[room].schedules[day])
}

// DELETE_SCHEDULE
const deleteSchedule = (room, roomTable, { day, turn }) => {
  if (!checkDay(room, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[room].schedules[day]

  if (turn <= 0 || turn >= scheduleList.length - 1) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  const deletedSchedule = scheduleList.splice(turn, 1)[0]

  if (deletedSchedule.status === DATA_STATUSES.CREATED) {
    return
  }

  deletedSchedule.status = DATA_STATUSES.DELETED
  roomTable[room].deletedScheduleList.push(deletedSchedule)

  console.log(`delete schedule - ${day} ${turn}`)
  console.log(roomTable[room].schedules[day])
  console.log(roomTable[room].deletedScheduleList)
}
// ===== state management functions end =====


// ===== Concurrency management start =====
const process = async (event, arg,
  { socket, namespace, room, roomTable }) => {
if (isTerminated(room, roomTable)) {
  errorEmitter({ socket, namespace, room },
    CAST_TYPES.UNICAST, ERRORS.TERMINATED_ERROR)
  return
}
let { eventName, callback } = event

if (!isBlocked(room, roomTable)) {
  dispatch(room, roomTable)
  callback(socket, namespace, room, roomTable, eventName, arg)
  release(room, roomTable)
  return
}
else {
  errorEmitter({ socket, namespace, room },
    CAST_TYPES.UNICAST, ERRORS.BLOCKED_ERROR)
  return
}
}
// ===== Concurrency management end =====

export { isInitialized, initalize, create }
export { isTerminated, isBlocked, terminate, remove, dispatch, release, enter, leave }
export { addTravelInfo, initSchedules, addSchedule }
export { join, updateStaytime, swapSchedule, createSchedule, deleteSchedule }
export { process }