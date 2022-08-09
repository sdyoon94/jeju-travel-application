import { useState } from "react"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"


function TimeReq({ placeIdx, timeReq, timeReqs, setTimeReqs, ...rest }) {
  const [startTime, setStartTime] = useState(moment(timeReq, "HH:mm"))
  
  const handleValue = (value) => {
    const newTime = value.format("HH:mm")
    
    const timeReqs_ = timeReqs.slice(0)
    timeReqs_.splice(placeIdx - 1, 1, newTime)

    setTimeReqs(timeReqs_)

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

export default TimeReq