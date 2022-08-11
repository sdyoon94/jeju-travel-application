import { useState, useEffect } from "react"
import { convert, revert } from "components/DateTime/time"
import { editStartTime, editStayTime } from "store/modules/travelSlice"

import TimePicker from "rc-time-picker"
import moment from "moment"
import { useDispatch } from "react-redux"
import "rc-time-picker/assets/index.css"


function StartTime({ travel, placeIdx, scheduleIdx, ...rest }) {
  const dispatch = useDispatch()

  const [startTime, setStartTime] = useState(moment(convert(travel.schedules[scheduleIdx][placeIdx].stayTime), "HH:mm"))
  
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

  useEffect(() => {
      setStartTime(moment(convert(travel.schedules[scheduleIdx][placeIdx].stayTime), "HH:mm"))
  }, [ travel.schedules[scheduleIdx][placeIdx].stayTime ])
  

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