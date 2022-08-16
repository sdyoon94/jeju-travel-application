import axios from "axios"
import { addSchedule, addTravelInfo, initAuthorities, initSchedules, release, terminate } from "../stateManager.js"
import { ERRORS } from "../eventHandler.js"
import { APIS } from "../apiHandler.js"
import { logApiInfo, logApiError } from "./apiLogger.js"

// ===== Fetch API requests start =====
const fetchTravelInfo = async (room, roomTable) => {
  try {
    const travelId = room
    const response = await axios({
      method: "get",
      url: `${APIS.HOST_SERVER}/trip/showTripInfo/${travelId}`,
      validateStatus: status => status === 200
    })

    const travelInfo = response.data.tripInfo
    addTravelInfo(room, roomTable, travelInfo)
    initSchedules(room, roomTable, travelInfo)
    initAuthorities(room, roomTable, travelInfo)

    logApiInfo("fetchTravelInfo", {key: "travelId", value: travelId})

    return true
  }
  catch(err) {
    logApiError("fetchTravelInfo", err, {key: "travelId", value: travelId})

    return false
  }
}

const fetchSchedule = async (index, room, roomTable) => {
  try {
    const travelId = room
    const response = await axios({
      method: "get",
      url: `${APIS.HOST_SERVER}/schedule?day=${index}&tripId=${travelId}`,
      validateStatus: status => status === 200
    })

    const schedule = response.data["일자별 Schedule List"]
    addSchedule(room, roomTable, schedule, index)

    logApiInfo("fetchSchedule",
      {key: "travelId", value: travelId}, 
      {key: "index", value: index},
      {key: "scheduleId(s)", value: `${schedule.map(v => v.scheduleId).join(", ")}`}
    )

    return true
  }
  catch (err) {
    logApiError("fetchSchedule", err, [
      {key: "travelId", value: travelId},
      {key: "index", value: index}
    ])

    return false
  }
}

const fetchAllSchedule = (room, roomTable) => {

  const { periodInDays } = roomTable[room].travelInfo

  const promises = []

  for (let i = 0; i < periodInDays; i++) {
    promises.push(fetchSchedule(i, room, roomTable))

  }

  return Promise.all(promises)
}

const fetchTravel = async (room, roomTable) => {
  let fetched = await fetchTravelInfo(room, roomTable)

  if (fetched) {
    const results = await fetchAllSchedule(room, roomTable)

    for (let i = 0; i < results.length; i++) {
      fetched &= results[i]
      if (!fetched) {
        break
      }
    }
  }

  if (roomTable[room].fetched = fetched) {
    release(room, roomTable)
  }
  else {
    roomTable[room].error = ERRORS.FETCH_ERROR
    terminate(room, roomTable)
  }

  return
}
// ===== Fetch API requests end =====

export { fetchTravel }