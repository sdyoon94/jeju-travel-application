import { useState } from "react"
// import { useDispatch } from "react-redux"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"


function StartTime({ time, ...rest }) {
  // const dispatch = useDispatch()
  const format = 'HH:mm'
  const [startTime, setStartTime] = useState(moment(time, format))

  
  const handleValue = (value) => {
    setStartTime(value)
    const newStartTime = value.format(format)
    // timepicker 말고 span으로 태그 바꾸기 위함
    // setIsHover(false)
    console.log(newStartTime)
    // dispatch(editStartTime({idx, newStartTime}))
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