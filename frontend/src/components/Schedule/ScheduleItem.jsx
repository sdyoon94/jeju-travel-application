import { useState } from "react"



function ScheduleItem({ handleFixedSpots, schedule, travelIdx, isLast, setFixedSpots }) {

  const [boxStyle, setBoxStyle] = useState({
    backgroundColor: "white"
  })

  const [selected, setSelected] = useState(false)
  // console.log(schedule)
  const handleScheduleFix = (e) => {
    setSelected(!selected)
    if (!selected) {
      setBoxStyle({
        backgroundColor: "#BBDEFB",
        border: "2px solid #1E88E5"
      })
      handleFixedSpots(!selected, travelIdx, {
        scheduleId: schedule.scheduleId,
        placeUid: schedule.placeUid,
        placeName: schedule.placeName,
        stayTime: schedule.stayTime,
        lat: schedule.lat,
        lng: schedule.lng
      }, setFixedSpots)
    } else {
      setBoxStyle({
        backgroundColor: "white"
      })
      handleFixedSpots(!selected, travelIdx, schedule.scheduleId)
    }
  } 



  if(isLast) {

    return (
    <div style={{backgroundColor: "#8C8C8C"}} className="schedule-fix">
      <p>{schedule.placeName}</p>
    </div>
    )
  } else {
    return (
    <div onClick={handleScheduleFix} style={boxStyle} className="schedule-fix">
      <p>{schedule.placeName}</p>
    </div>
    )

  }

}

export default ScheduleItem