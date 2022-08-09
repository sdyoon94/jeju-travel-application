import { useState } from "react"
// import { useDispatch } from "react-redux"
// import { editStartTime, editStayTime } from "store/modules/travelSlice"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"
import { revert } from "components/DateTime/time"
import { useDispatch } from "react-redux"
import { editStartTime, editStayTime } from "store/modules/travelSlice"


function StartTime({ placeIdx, scheduleIdx, time, ...rest }) {
  const dispatch = useDispatch()

  const [startTime, setStartTime] = useState(moment(time, "HH:mm"))
  
  const handleValue = (value) => {
    const newTime = value.format("HH:mm")
    
    if (placeIdx === 0) {
      dispatch(editStartTime({ scheduleIdx, placeIdx, stayTime: revert(newTime) }))
    }
    else {
      dispatch(editStayTime({ scheduleIdx, placeIdx, stayTime: revert(newTime) }))
    }
    setStartTime(value)
  }

  return (
    <>
      <TimePicker
        className="place-start-time"
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