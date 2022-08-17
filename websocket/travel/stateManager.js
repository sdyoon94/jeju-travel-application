import { createTravelLogger } from "./logger.js"

const logger = createTravelLogger("state manager")

const logMsgBuilder = (method, arg) => {
  if (Array.isArray(arg)) {
    return `${method} - [${arg.map(v => JSON.stringify(v)).join(" | ")}]`
  }
  return `${method} - ${JSON.stringify(arg)}`
}

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

class RegExp_ extends RegExp {
  [Symbol.match](str) {
    const result = RegExp.prototype[Symbol.match].call(this, str)
    if (result) {
      return true
    }
    return false
  }
}

// DATE_REGEXP
const DATE_REGEXP = new RegExp_(/\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/g)
const STYLE_REGEXP = new RegExp_(/[0-1]{7}/g)

// ===== roomTable state manager start =====
const isInitialized = (travelId, roomTable) => roomTable[travelId] ? true : false

const initalize = (travelId, roomTable) => {
  roomTable[travelId] = {
    status: ROOM_STATUSES.READY,
    error: null,
    fetched: 0,
    connectedSockets: [],
    travelInfo: {},
    schedules: null,
    deletedScheduleList: [],
    authorities: {
      travelInfo: null,
      schedules: []
    }
  }
}

const create = () => {
  const roomTable = {}
  return roomTable
}
// ===== roomTable state manager end =====


// ===== room state management start =====
const isTerminated = (travelId, roomTable) => roomTable[travelId].status === ROOM_STATUSES.TERMINATED
const isBlocked = (travelId, roomTable) => roomTable[travelId].status === ROOM_STATUSES.BLOCKED

const terminate = (travelId, roomTable) => {
  roomTable[travelId].status = ROOM_STATUSES.TERMINATED
}

const remove = (travelId, roomTable) => {
  delete roomTable[travelId]
}

const dispatch = (travelId, roomTable) => {
  roomTable[travelId].status = ROOM_STATUSES.BLOCKED
}

const release = (travelId, roomTable) => {
  roomTable[travelId].status = ROOM_STATUSES.READY
}

const pushSocket = (socket, travelId, roomTable) => {
  return roomTable[travelId].connectedSockets.push(socket)
}

const popSocket = (socket, travelId, roomTable) => {
  const connectedSockets = roomTable[travelId].connectedSockets
  const len = roomTable[travelId].connectedSockets.length
  for (let i = 0; i < len; i++) {
    const connectedSocket = connectedSockets[i]
    if (socket.id === connectedSocket.id) {
      connectedSockets.splice(i, 1)
      break
    }
  }

  return roomTable[travelId].connectedSockets.length
}
// ===== room state management end =====


// ===== init data start =====
const addTravelInfo = (travelId, roomTable, travelInfo) => {
  roomTable[travelId].travelInfo = {
    ...travelInfo,
    status: DATA_STATUSES.ORIGINAL
  }
}

const initSchedules = (travelId, roomTable, travelInfo) => {
  roomTable[travelId].schedules = new Array(travelInfo.periodInDays)
}

const initAuthorities = (travelId, roomTable, travelInfo) => {
  const { periodInDays } = travelInfo

  const authorities = roomTable[travelId].authorities

  authorities.travelInfo = {id: null, authorized: false}

  for (let i = 0; i < periodInDays; i++) {
    authorities.schedules.push({id: null, authorized: false})
  }
}

const addSchedule = (travelId, roomTable, schedule, index) => {
  roomTable[travelId].schedules[index] = schedule.map(v => ({
    ...v,
    status: DATA_STATUSES.ORIGINAL
  }))
}
// ===== init data end =====


// ===== state management functions start =====
// INPUT_ERRORS
const INPUT_ERRORS = {
  UNAUTHORIZED_MEMBER_ERROR: new Error("unauthorized member error"),
  UNAUTHORIZED_ACCESS_ERROR: new Error("unauthorized access error"),
  DUPLICATE_JOIN_ERROR: new Error("duplicate join error"),
  DUPLICATE_LEAVE_ERROR: new Error("duplicate leave error"),
  CANNOT_GRANT_AUTHORITY_ERROR: new Error("cannot grant authority error"),
  CANNOT_REVOKE_AUTHORITY_ERROR: new Error("cannot revoke authority error"),
  WRONG_AUTHORITY_NAME_ERROR: new Error("wrong authority name error"),
  RANGE_ERROR_DAY: new Error("range error (day)"),
  RANGE_ERROR_TURN: new Error("range error (turn)"),
  RANGE_ERROR_STAYTIME: new Error("range error (staytime)")
}

// CHECK_DAY
const checkDay = (travelId, roomTable, day) => {
  const flag = roomTable[travelId] && roomTable[travelId].fetched &&
    day >= 0 && day < roomTable[travelId].travelInfo.periodInDays

  return flag
}

// GET_ID_INDEX
const getIdIndex = (travelId, roomTable, id) => {
  const member = roomTable[travelId].travelInfo.member

  for (let i = 0; i < member.length; i++) {
    const { kakaoId } = member[i]
    if (kakaoId == id) {
      return i
    }
  }
  return -1
}

// GRANT_AUTHORITY - 권한 부여
const grantAuthority = (authority, id) => {
  authority.id = id
  authority.authorized = true
}

// GRANT_TRAVELINFO_AUTHORITY
const grantTravelInfoAuthority = (travelId, roomTable, { id }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authority = roomTable[travelId].authorities.travelInfo

  if (authority.authorized) {
    throw INPUT_ERRORS.CANNOT_GRANT_AUTHORITY_ERROR
  }

  grantAuthority(authority, id)

  logger.info(logMsgBuilder("grant travelinfo authority", roomTable[travelId].authorities.travelInfo))
}

// GRANT_SCHEDULES_AUTHORITY
const grantSchedulesAuthority = (travelId, roomTable, { id, day }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const authority = roomTable[travelId].authorities.schedules[day]

  if (authority.authorized) {
    throw INPUT_ERRORS.CANNOT_GRANT_AUTHORITY_ERROR
  }

  grantAuthority(authority, id)

  logger.info(logMsgBuilder("grant schedules authority", roomTable[travelId].authorities.schedules))
}


// REVOKE
const revokeAuthority = (authority) => {
  authority.id = null
  authority.authorized = false
}

// CHECK
const checkAuthority = (authority, id) => {
  return authority && authority.authorized && authority.id == id
}

// REVOKE_TRAVELINFO_AUTHORITY - 권한 회수
const revokeTravelInfoAuthority = (travelId, roomTable, { id }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authority = roomTable[travelId].authorities.travelInfo

  if (!checkAuthority(authority, id)) {
    throw INPUT_ERRORS.CANNOT_REVOKE_AUTHORITY_ERROR
  }

  revokeAuthority(authority)
  logger.info(logMsgBuilder("revoke travelinfo authority", roomTable[travelId].authorities.travelInfo))
}

// REVOKE_SCHEDULES_AUTHORITY - 권한 회수
const revokeSchedulesAuthority = (travelId, roomTable, { id, day }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const authority = roomTable[travelId].authorities.schedules[day]

  if (!checkAuthority(authority, id)) {
    throw INPUT_ERRORS.CANNOT_REVOKE_AUTHORITY_ERROR
  }

  revokeAuthority(authority)
  logger.info(logMsgBuilder("revoke schedules authority", roomTable[travelId].authorities.schedules[day]))
}

// REVOKE_ALL_AUTHORITIES
const revokeAllAuthorities = (travelId, roomTable, { id }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authorities = roomTable[travelId].authorities

  authorities.schedules.forEach(authority => {
    checkAuthority(authority, id) && revokeAuthority(authority)
  })

  checkAuthority(authorities.travelInfo, id) && revokeAuthority(authorities.travelInfo)
}

// CHECK_TRAVELINFO_AUTHORITY
const checkTravelInfoAuthority = (travelId, roomTable, { id }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (!checkAuthority(roomTable[travelId].authorities.travelInfo, id)) {
    throw INPUT_ERRORS.UNAUTHORIZED_ACCESS_ERROR
  }

  return
}

// CHECK_SCHEDULES_AUTHORITY
const checkSchedulesAuthority = (travelId, roomTable, { id, day }) => {
  const idIndex = getIdIndex(travelId, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (!checkAuthority(roomTable[travelId].authorities.schedules[day], id)) {
    throw INPUT_ERRORS.UNAUTHORIZED_ACCESS_ERROR
  }

  return
}

// UPDATE_STAYTIME
const MAX_STAYTIME = 24 * 60 // 24시간

const updateStaytime = (travelId, roomTable, { day, turn, stayTime }) => {
  if (stayTime < 0 || stayTime > MAX_STAYTIME) {
    throw INPUT_ERRORS.RANGE_ERROR_STAYTIME
  }

  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[travelId].schedules[day]

  if (turn < 0 || turn >= scheduleList.length) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  const schedule = scheduleList[turn]
  schedule.stayTime = stayTime
  if (schedule.status === DATA_STATUSES.ORIGINAL) {
    schedule.status = DATA_STATUSES.UPDATED
  }

  logger.info(logMsgBuilder("update staytime", roomTable[travelId].schedules[day][turn]))
}

// SWAP_SCHEDULE
const swap = (scheduleList, turn1, turn2) => {
  const temp = scheduleList[turn1]
  scheduleList[turn1] = scheduleList[turn2]
  scheduleList[turn2] = temp
}

const swapSchedule = (travelId, roomTable, { day, turn1, turn2 }) => {
  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[travelId].schedules[day]

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

  logger.info(logMsgBuilder("update staytime", roomTable[travelId].schedules[day]))
}

// CREATE_SCHEDULE
const createSchedule = (travelId, roomTable,
    { day, placeUid, placeName, lat, lng }) => {
  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[travelId].schedules[day]
  if (scheduleList.length === 0) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  const len = scheduleList.push({
    placeUid,
    placeName,
    lat,
    lng,
    status: DATA_STATUSES.CREATED
  })

  swap(scheduleList, len-1, len-2)

  logger.info(logMsgBuilder("create schedule", roomTable[travelId].schedules[day]))
}

// DELETE_SCHEDULE
const deleteSchedule = (travelId, roomTable, { day, turn }) => {
  if (!checkDay(travelId, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[travelId].schedules[day]

  if (turn <= 0 || turn >= scheduleList.length - 1) {
    throw INPUT_ERRORS.RANGE_ERROR_TURN
  }

  const deletedSchedule = scheduleList.splice(turn, 1)[0]

  if (deletedSchedule.status === DATA_STATUSES.CREATED) {
    return
  }

  deletedSchedule.status = DATA_STATUSES.DELETED
  roomTable[travelId].deletedScheduleList.push(deletedSchedule)

  logger.info(logMsgBuilder("delete schedule", roomTable[travelId].schedules[day]))
  logger.info(logMsgBuilder("delete schedule", roomTable[travelId].deletedScheduleList))
}

// PUT_TRAVELINFO
const putTravelInfo = (travelId, roomTable, 
    { tripName, startDate, style, vehicle }) => {
  if (tripName) {
    roomTable[travelId].travelInfo.tripName = tripName
  }
  if (startDate && startDate.match(DATE_REGEXP)) {
    roomTable[travelId].travelInfo.startDate = startDate
  }
  // style 어떤 방식으로 보내오나 확인
  if (style && typeof style === "string" && style.match(STYLE_REGEXP)) {
    roomTable[travelId].travelInfo.style = Number(style)
  }
  if (style && typeof style === "number" && Number.isInteger(style) && style >= 0 && style < 128) {
    roomTable[travelId].travelInfo.style = style
  }
  if (vehicle && (vehicle === "car" || vehicle === "walk")) {
    roomTable[travelId].travelInfo.vehicle = vehicle
  }

  const { travelId, tripName, startDate, periodInDays, budget, vehicle, style, member } = roomTable[travelId].travelInfo

  return { tripId: travelId, tripName, startDate, periodInDays, budget, vehicle, style, member }
}


// ===== state management functions end =====

export { DATA_STATUSES }
export { isInitialized, initalize, create }
export { isTerminated, isBlocked, terminate, remove, dispatch, release }
export { addTravelInfo, initSchedules, initAuthorities, addSchedule }
export { pushSocket, popSocket }
export { grantTravelInfoAuthority, grantSchedulesAuthority }
export { revokeTravelInfoAuthority, revokeSchedulesAuthority, revokeAllAuthorities }
export { checkTravelInfoAuthority, checkSchedulesAuthority }
export { updateStaytime, swapSchedule, createSchedule, deleteSchedule }
export { putTravelInfo }