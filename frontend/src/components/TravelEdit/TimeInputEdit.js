import { useState } from 'react'
import TimePicker from 'rc-time-picker'
import moment from "moment";
import "globalStyle.css"
import "routes/TravelEdit.css"
import "rc-time-picker/assets/index.css";


function TimeInputEdit({ idx, time, handleTimeInput, ...rest }) {
  const format = 'HH:mm';
  const [startTime, setStartTime] = useState(moment(time, "HH:mm"))

  
  const handleValue = (value) => {
    setStartTime(value)
    handleTimeInput(idx, value.format(format))
  }

  return (
    <>
      <TimePicker
        className="start-time"
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

export default TimeInputEdit