import ScheduleItem from "components/Schedule/ScheduleItem"
import { useState } from "react"
import { useSelector } from "react-redux"
import "./ScheduleFix.css"


function ScheduleFix() {
  const travels = useSelector(state => state.travel.schedules)
  const initial = travels.reduce((acc, value, idx) => {

    acc[idx] = [travels[idx][value.length - 1]]
    return acc
  }, {})


  const [fixedSpots, setFixedSpots] = useState(initial)

  const handleFixedSpots = (selected, travelIdx, payload, setFixedSpots) => {
    if (selected) {
      setFixedSpots({
        ...fixedSpots,
        [travelIdx]: [...fixedSpots[travelIdx], payload]
      })
      
    } else {
      let newArr = fixedSpots[travelIdx].filter(item => {
        return item.scheduleId !== payload
      })
      setFixedSpots({
        ...fixedSpots,
        [travelIdx]: newArr
      })
      
    }
  }
  
  console.log(fixedSpots)

  return (
    <>  
      <p className="subtitle-size text-center" style={{marginTop: "11vh"}}><span className="color-1">고정</span>하고 싶은 여행지를 선택해주세요</p>
      <p className="gray text-center" style={{ margin: "0"}}>숙소는 자동으로 고정이 돼요.</p>
      <hr />
      {
        travels.map((travel, travelIdx) => (
          <div key={travelIdx}>
            <p className="content-size text-center">DAY{travelIdx + 1}</p>
            {
            travel.map((schedule, scheduleIdx) => (
              (scheduleIdx === 0) || (travelIdx === travels.length - 1 && scheduleIdx === travel.length - 1)
              ? null
              : <ScheduleItem 
                  key={schedule.scheduleId} 
                  handleFixedSpots={handleFixedSpots} 
                  setFixedSpots={setFixedSpots}
                  schedule={schedule}
                  travelIdx={travelIdx}
                  isLast={scheduleIdx === travel.length - 1}
                />
            )) 
            }
          </div>
        )
        )
      }
    </>
  )
}

export default ScheduleFix