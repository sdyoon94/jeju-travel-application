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
    deletedScheduleList: [],
    authorities: {
      tripName: null,
      startDate: null,
      budget: null,
      vehicle: null,
      style: null,
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

const addOnlineMembers = (room, roomTable) => {
  return ++roomTable[room].onlineMembers
}

const subOnlineMembers = (room, roomTable) => {
  return --roomTable[room].onlineMembers
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

const initAuthorities = (room, roomTable, travelInfo) => {
  const { periodInDays } = travelInfo

  const authorities = roomTable[room].authorities

  authorities.tripName = {id: null, authorized: false}
  authorities.startDate = {id: null, authorized: false}
  authorities.budget = {id: null, authorized: false}
  authorities.vehicle = {id: null, authorized: false}
  authorities.style = {id: null, authorized: false}

  for (let i = 0; i < periodInDays; i++) {
    authorities.schedules.push({id: null, authorized: false})
  }
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
const checkDay = (room, roomTable, day) => {
  const flag = roomTable[room] && roomTable[room].fetched &&
    day >= 0 && day < roomTable[room].travelInfo.periodInDays

  return flag
}

// GET_ID_INDEX
const getIdIndex = (room, roomTable, id) => {
  const member = roomTable[room].travelInfo.member

  for (let i = 0; i < member.length; i++) {
    const { kakaoId } = member[i]
    if (kakaoId == id) {
      return i
    }
  }
  return -1
}

// JOIN
const join = (room, roomTable, id) => {
  const idIndex = getIdIndex(room, roomTable, id)

  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (roomTable[room].travelInfo.member[idIndex].online) {
    throw INPUT_ERRORS.DUPLICATE_JOIN_ERROR
  }

  roomTable[room].travelInfo.member[idIndex].online = 1
  addOnlineMembers(room, roomTable)

  logger.debug(logMsgBuilder("join", roomTable[room].travelInfo.member))
}

// LEAVE
const leave = (room, roomTable, id) => {
  const idIndex = getIdIndex(room, roomTable, id)

  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  if (!roomTable[room].travelInfo.member[idIndex].online) {
    throw INPUT_ERRORS.DUPLICATE_LEAVE_ERROR
  }

  roomTable[room].travelInfo.member[idIndex].online = 0
  subOnlineMembers(room, roomTable)

  logger.debug(logMsgBuilder("leave", roomTable[room].travelInfo.member))
}

// GRANT
const grant = (authority, id) => {
  authority.id = id
  authority.authorized = true
}

// GRANT_AUTHORITY - 권한 부여
const grantAuthority = (room, roomTable, { id, authorityName, day }) => {
  const idIndex = getIdIndex(room, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authorities = roomTable[room].authorities

  switch (authorityName) {
    case "schedules":
      if (authorities.schedules[day].authorized) {
        throw INPUT_ERRORS.CANNOT_GRANT_AUTHORITY_ERROR
      }
      
      grant(authorities.schedules[day], id)
      break
    case "tripName": case "startDate": case "budget": case "vehicle": case "style": case "member":
      if (authorities[authorityName].authorized) { // 이미 권한이 부여된 대상일 경우
        throw INPUT_ERRORS.CANNOT_GRANT_AUTHORITY_ERROR
      }
    
      grant(authorities[authorityName], id)
      break
    default:
      throw INPUT_ERRORS.WRONG_AUTHORITY_NAME_ERROR
  }

  logger.debug(logMsgBuilder("grant authority", authorities[authorityName]))
}

// REVOKE
const revoke = (authority) => {
  authority.id = null
  authority.authorized = false
}

// CHECK
const check = (authority, id) => {
  return authority.authorized && authority.id == id
}

// REVOKE_AUTHORITY - 권한 회수
const revokeAuthority = (room, roomTable, { id, authorityName, day }) => {
  const idIndex = getIdIndex(room, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authorities = roomTable[room].authorities

  switch (authorityName) {
    case "schedules":
      if (!check(authorities.schedules[day], id)) {
        throw INPUT_ERRORS.CANNOT_REVOKE_AUTHORITY_ERROR
      }

      revoke(authorities.schedules[day])
      break
    case "tripName": case "startDate": case "budget": case "vehicle": case "style":
      if (!check(authorities[authorityName], id)) {
        throw INPUT_ERRORS.CANNOT_REVOKE_AUTHORITY_ERROR
      }
    
      revoke(authorities[authorityName])
      break
    default:
      throw INPUT_ERRORS.WRONG_AUTHORITY_NAME_ERROR
  }

  logger.debug(logMsgBuilder("revoke authority", authorities[authorityName]))
}

// REVOKE_ALL_AUTHORITIES
const revokeAllAuthorities = (room, roomTable, { id }) => {
  const idIndex = getIdIndex(room, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  const authorities = roomTable[room].authorities

  authorities.schedules.forEach(authority => {
    check(authority, id) && revoke(authority)
  })

  check(authorities.tripName, id) && revoke(authorities.tripName)
  check(authorities.startDate, id) && revoke(authorities.startDate)
  check(authorities.budget, id) && revoke(authorities.budget)
  check(authorities.vehicle, id) && revoke(authorities.vehicle)
  check(authorities.style, id) && revoke(authorities.style)
}

// CHECK_AUTHORIZED
const checkAuthorized = (room, roomTable, { id, authorityName, day }) => {
  const idIndex = getIdIndex(room, roomTable, id)
  if (idIndex < 0) {
    throw INPUT_ERRORS.UNAUTHORIZED_MEMBER_ERROR
  }

  let authorized = false
  const authorities = roomTable[room].authorities

  switch (authorityName) {
    case "schedules":
      authorized = check(authorities.schedules[day], id)
      break
    case "tripName": case "startDate": case "budget": case "vehicle": case "style": case "member":
      authorized = check(authorities[authorityName], id)
      break
    default:
      throw INPUT_ERRORS.WRONG_AUTHORITY_NAME_ERROR
  }

  logger.debug(logMsgBuilder("check authority", `${authorityName} ${id} ${authorized}`))
  if (!authorized) {
    throw INPUT_ERRORS.UNAUTHORIZED_ACCESS_ERROR
  }
}

// UPDATE_STAYTIME
const MAX_STAYTIME = 24 * 60 // 24시간

const updateStaytime = (room, roomTable, { day, turn, stayTime }) => {
  if (stayTime < 0 || stayTime > MAX_STAYTIME) {
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
  schedule.stayTime = stayTime
  if (schedule.status === DATA_STATUSES.ORIGINAL) {
    schedule.status = DATA_STATUSES.UPDATED
  }

  logger.debug(logMsgBuilder("update staytime", roomTable[room].schedules[day][turn]))
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

  logger.debug(logMsgBuilder("update staytime", roomTable[room].schedules[day]))
}

// CREATE_SCHEDULE
const createSchedule = (room, roomTable,
    { day, placeUid, placeName, lat, lng }) => {
  if (!checkDay(room, roomTable, day)) {
    throw INPUT_ERRORS.RANGE_ERROR_DAY
  }

  const scheduleList = roomTable[room].schedules[day]
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

  logger.debug(logMsgBuilder("create schedule", roomTable[room].schedules[day]))
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

  logger.debug(logMsgBuilder("delete schedule", roomTable[room].schedules[day]))
  logger.debug(logMsgBuilder("delete schedule", roomTable[room].deletedScheduleList))
}
// ===== state management functions end =====


// ===== Concurrency management start =====
const process = (event, arg,
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

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout * Math.random()))

const asyncProcess = async (event, arg, 
    { socket, namespace, room, roomTable }, cnt = 0) => {
  if (isTerminated(room, roomTable)) {
    errorEmitter({ socket, namespace, room },
      CAST_TYPES.UNICAST, ERRORS.TERMINATED_ERROR)
    return
  }
  if (cnt === 10) {
    return
  }
  let { eventName, callback } = event

  if (!isBlocked(room, roomTable)) {
    dispatch(room, roomTable)
    callback(socket, namespace, room, roomTable, eventName, arg)
    release(room, roomTable)
    return
  }

  await wait(50)
  asyncProcess(event, arg, { socket, namespace, room, roomTable }, ++cnt)
}
// ===== Concurrency management end =====

export { isInitialized, initalize, create }
export { isTerminated, isBlocked, terminate, remove, dispatch, release }
export { addTravelInfo, initSchedules, initAuthorities, addSchedule }
export { join, leave }
export { grantAuthority, revokeAuthority, revokeAllAuthorities, checkAuthorized }
export { updateStaytime, swapSchedule, createSchedule, deleteSchedule }
export { process, asyncProcess }