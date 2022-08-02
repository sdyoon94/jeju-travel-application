import { useState } from "react"
import { useDispatch } from "react-redux"
import { editStartTime, editStayTime } from "store/modules/travelSlice"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"


function StartTime({ courseIndex, time, scheduleIndex, ...rest }) {
  const dispatch = useDispatch()
  const format = 'HH:mm'
  const [startTime, setStartTime] = useState(moment(time, format))
  
  
  const handleValue = (value) => {
    setStartTime(value)
    const newStartTime = value.format(format)
    if (scheduleIndex >= 0) {
      dispatch(editStayTime({courseIndex, scheduleIndex, newStartTime}))
    } else {
      dispatch(editStartTime({courseIndex, newStartTime}))
    }
  }

  return (
    <>
      <TimePicker
        className="schedule-start-time"
        {...rest}
        showSecond={false}
        onChange={handleValue}
        hideDisabledOptions
        minuteStep={5}
        value={startTime}
        use24Hours
       />
    </>
  )
}

export default StartTime