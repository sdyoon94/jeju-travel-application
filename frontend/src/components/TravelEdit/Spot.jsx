import { useState } from "react"
import { useDispatch } from "react-redux"
import { editStayTime } from "store/modules/courseListSlice"
import "globalStyle.css"
import "routes/TravelEdit.css"


function Spot({dayIdx, courseIdx, item}) {
  const dispatch = useDispatch()
  const [totalMinutes, setTotalMinutes] = useState(item.duration)
  const [minutes, setMiuntes] = useState(totalMinutes % 60)
  const [hours, setHours] = useState((totalMinutes - minutes) / 60)
  // 시간 안바뀜
  console.log(item.name, totalMinutes, hours, minutes)

  const handleHourChange = function(e) {
    setHours(e.target.value)
    const stayMinutes = e.target.value * 60 + minutes
    setTotalMinutes(stayMinutes)
    dispatch(editStayTime({dayIdx, courseIdx, stayMinutes}))
  }
  const handleMinuteChange = function(e) {
    setMiuntes(e.target.value)
    const stayMinutes = hours * 60 + Number(e.target.value)
    setTotalMinutes(stayMinutes)
    dispatch(editStayTime({dayIdx, courseIdx, stayMinutes}))
  }


  return (
  <div className="spot-box">
    <h1 className="content-size inline-block">{item.name}</h1>
    <span className="content-size spot-item">
      <input className="duration-input" onChange={handleHourChange} value={hours} />H
      <input className="duration-input" onChange={handleMinuteChange} value={minutes} />M
    </span>
  </div>
  )
}

export default Spot