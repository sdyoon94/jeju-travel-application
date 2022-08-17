import axios from "axios"
import { APIS } from "../apiHandler.js"
import { DATA_STATUSES } from "../stateManager.js"

const INVALID_ARGUMENT_ERROR = new Error("invalid argument error")

const checkArgs = (...args) => {
  args.forEach(arg => {
    if (!arg) {
      throw INVALID_ARGUMENT_ERROR
    }
  })
}

const updateTravelInfo = async (travelId, roomTable, token) => {
  const travelInfo = roomTable[travelId].travelInfo
  const { budget, startDate, style, tripName, vehicle } = travelInfo

  checkArgs(budget, startDate, style, tripName, vehicle)

  try {
    await axios({
      method: "put",
      url: `${APIS.HOST_SERVER}/trip/update/${travelId}`,
      validateStatus: status => status === 200,
      headers: {
        Authorization: token
      },
      data: {
        startDate,
        style,
        tripName,
        vehicle
      }
    })
  }
  catch (err) {
    throw err
  }
}

const updateSchedule = async (day, turn, travelId, roomTable, token) => {
  const schedule = roomTable[travelId].schedules[day][turn]
  const { scheduleId, placeUid, placeName, stayTime, lat, lng } = schedule

  checkArgs(scheduleId, placeUid, placeName, stayTime, lat, lng)

  try {
    await axios({
      method: "put",
      url: `${APIS.HOST_SERVER}/schedule/${scheduleId}`,
      validateStatus: status => status === 200,
      headers: {
        Authorization: token
      },
      data: { 
        placeUid, 
        placeName, 
        stayTime, 
        lat, 
        lng,
        turn
      }
    })
  }
  catch (err) {
    throw err
  }
}

const createSchedule = async (day, turn, travelId, roomTable, token) => {
  const schedule = roomTable[travelId].schedules[day][turn]
  const { placeUid, placeName, stayTime, lat, lng } = schedule

  checkArgs(placeUid, placeName, stayTime, lat, lng)

  try {
    await axios({
      method: "post",
      url: `${APIS.HOST_SERVER}/schedule/${travelId}`,
      validateStatus: status => status === 200,
      headers: {
        Authorization: token
      },
      data: {
        day,
        placeUid,
        placeName,
        stayTime,
        lat,
        lng,
        turn
      }
    })
  }
  catch (err) {
    throw err
  }
}

const deleteSchedule = async (index, travelId, roomTable, token) => {
  const schedule = roomTable[travelId].deletedScheduleList[index]
  const { scheduleId } = schedule

  checkArgs(scheduleId)

  try {
    await axios({
      method: "delete",
      url: `${APIS.HOST_SERVER}/schedule/${scheduleId}`,
      validateStatus: status => status === 200,
      headers: {
        Authorization: token
      }
    })
  }
  catch (err) {
    throw err
  }
}

const updateAllSchedule = async (travelId, roomTable, token) => {
  const promises = []

  const schedules = roomTable[travelId].schedules

  schedules.forEach((scheduleList, day) => {
    scheduleList.forEach((schedule, turn) => {
      switch (schedule.status) {
        case DATA_STATUSES.UPDATED:
          promises.push(updateSchedule(day, turn, travelId, roomTable, token))
          break
        case DATA_STATUSES.CREATED:
          promises.push(createSchedule(day, turn, travelId, roomTable, token))
          break
        default:
          break
      }
    })
  })

  const deletedScheduleList = roomTable[travelId].deletedScheduleList

  deletedScheduleList.forEach((schedule, index) => {
    switch (schedule.status) {
      case DATA_STATUSES.DELETED:
        promises.push(deleteSchedule(index, travelId, roomTable, token))
        break
      default:
        break
    }
  })

  return Promise.all(promises)
}

export { updateTravelInfo, updateAllSchedule }