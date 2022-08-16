import axios from "axios"
import { ERRORS } from "../eventHandler.js"
import { APIS } from "../apiHandler.js"
import { logApiInfo, logApiError } from "./apiLogger.js"

const updateTravelInfo = async (room, roomTable) => {
  try {
    const travelId = room
    const travelInfo = roomTable[room].travelInfo
    const response = await axios({
      method: "put",
      url: `${APIS.HOST_SERVER}/trip/update/${travelId}`,
      validateStatus: status => status === 200,
      data: {

      }
    })

    return true
  }
  catch (err) {
    logApiError("updateTravelInfo", err, 
      { key: "travelId", value: travelId })

    return false
  }
}

const updateSchedule = async (day, turn, room, roomTable) => {
  try {
    const travelId = room
    const schedule = roomTable[room].schedules[day][turn]
    const { scheduleId, placeUid, placeName, stayTime, lat, lng } = schedule

    await axios({
      method: "put",
      url: `${APIS.HOST_SERVER}/schedule/${schedule.scheduleId}`,
      validateStatus: status => status === 200,
      data: { 
        scheduleId, 
        placeUid, 
        placeName, 
        stayTime, 
        lat, 
        lng 
      }
    })

    logApiInfo("updateSchedule", 
      { key: "travelId", value: travelId},
      { key: "scheduleId", value: scheduleId })
    
    return true
  }
  catch (err) {
    logApiError("updateSchedule", err, 
      { key: "travelId", value: travelId },
      { key: "scheduleId", value: schedule.scheduleId })

    return false
  }
}

const createSchedule = async (day, turn, room, roomTable) => {
  try {
    const travelId = room
    const schedule = roomTable[room].schedules[day][turn]
    const { placeUid, placeName, stayTime, lat, lng } = schedule

    await axios({
      method: "post",
      url: `${APIS.HOST_SERVER}/schedule/${travelId}`,
      validateStatus: status => status === 200,
      data: {
        placeUid,
        placeName,
        stayTime,
        lat,
        lng,
        turn
      }
    })

    logApiInfo("createSchedule", 
      { key: "travelId", value: travelId },
      { key: "placeUid", value: placeUid},
      { key: "placeName", value: placeName })

    return true
  } 
  catch (err) {
    logApiError("createSchedule", err, 
      { key: "travelId", value: travelId },
      { key: "placeUid", value: placeUid },
      { key: "placeName", value: placeName })
    
    return false
  }
}

const deleteSchedule = async (index, room, roomTable) => {
  try {
    const travelId = room
    const schedule = roomTable[room].deletedScheduleList[index]
    const { scheduleId } = schedule

    await axios({
      method: "delete",
      url: `${APIS.HOST_SERVER}/schedule/${scheduleId}`,
      validateStatus: status => status === 200
    })

    logApiInfo("deleteSchedule",
      { key: "travelId", value: travelId },
      { key: "scheduleId", value: scheduleId })
    
    return true
  }
  catch (err) {
    logApiError("deleteSchedule", err,
      { key: "travelId", value: travelId },
      { key: "scheduleId", value: scheduleId })
    
    return false
  }
}

const updateAllSchedule = (room, roomTable) => {

  const promises = []

  const schedules = roomTable[room].schedules

  schedules.forEach(scheduleList => {
    scheduleList.forEach(schedule => {
      if (schedule.status === DATA_)
    })
  })

}

const updateTravel = async (room, roomTable) => {
  let updated = await updateTravelInfo(room, roomTable)

}