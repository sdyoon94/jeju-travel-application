import { useState } from "react"
import { useDispatch } from "react-redux"
import { editStartTime } from "store/modules/courseListSlice"
import TimePicker from "rc-time-picker"
import moment from "moment";
import "globalStyle.css"
import "routes/TravelEdit.css"
import "rc-time-picker/assets/index.css";


function StartTimeInputEdit({ idx, time, ...rest }) {
  const dispatch = useDispatch()
  const format = 'HH:mm'
  const [startTime, setStartTime] = useState(moment(time, format))

  
  const handleValue = (value) => {
    setStartTime(value)
    const newStartTime = value.format(format)
    dispatch(editStartTime({idx, newStartTime}))
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

export default StartTimeInputEdit