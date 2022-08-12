import Header from "components/Header/Header"
import ScheduleItem from "components/Schedule/ScheduleItem"
import { useState } from "react"
import { useSelector } from "react-redux"
import "./ScheduleFix.css"


function ScheduleFix() {
  const travels = useSelector(state => state.travel.schedules)
  const initial = travels.reduce((acc, value, idx) => {
    let left = `day${idx}`
    acc[left] = []
    return acc
  }, {})

  const [fixedSpots, setFixedSpots] = useState(initial)
  
  const handleFixedSpots = (selected, travelIdx, payload) => {
    let day = `day${travelIdx}`
    if (selected) {
      setFixedSpots({
        ...fixedSpots,
        [day]: [...fixedSpots[day], payload]
      })
    } else {
      let newArr = fixedSpots[day].filter(item => {
        return item.scheduleId !== payload
      })
      setFixedSpots({
        ...fixedSpots,
        [day]: newArr
      })
      
    }
  }


  return (
    <>  
      <Header />
      <p className="subtitle-size text-center"><span className="color-1">고정</span>하고 싶은 여행지를 선택해주세요</p>
      <hr />
      {
        travels.map((travel, travelIdx) => (
          <div key={travelIdx}>
            <p className="content-size text-center">DAY{travelIdx + 1}</p>
            {
            travel.map((schedule, scheduleIdx) => (
              (travelIdx === 0 && scheduleIdx === 0) || (travelIdx === travels.length - 1 && scheduleIdx === travel.length - 1)
              ? null
              : <ScheduleItem 
                  key={schedule.scheduleId} 
                  handleFixedSpots={handleFixedSpots} 
                  schedule={schedule}
                  travelIdx={travelIdx}  
                />
            )) 
            }
          <hr />
          </div>
        )
        )
      }
    </>
  )
}

export default ScheduleFix