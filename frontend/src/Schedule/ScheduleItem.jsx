import { useState } from "react"



function ScheduleItem({ handleFixedSpots, schedule, travelIdx }) {

  const [boxStyle, setBoxStyle] = useState({
    backgroundColor: "white"
  })

  const [selected, setSelected] = useState(false)
  
  const handleScheduleFix = (e) => {
    setSelected(!selected)
    if (!selected) {
      setBoxStyle({
        backgroundColor: "#BBDEFB",
        border: "2px solid #1E88E5"
      })
      handleFixedSpots(!selected, travelIdx, {
        scheduleId: schedule.scheduleId,
        stayTime: schedule.stayTime
      })
    } else {
      setBoxStyle({
        backgroundColor: "white"
      })
      handleFixedSpots(!selected, travelIdx, schedule.scheduleId)
    }
  } 

  return (
  <div onClick={handleScheduleFix} style={boxStyle} className="schedule-fix">
    <p>{schedule.placeName}</p>
  </div>
  )
}

export default ScheduleItem