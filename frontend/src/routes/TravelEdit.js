import { useState } from "react"
import Header from "components/Header"
import TravelTitle from "components/TravelEdit/TravelTitle"
import Spots from "components/TravelEdit/Spots"
import TimeInputEdit from "components/TravelEdit/TimeInputEdit"
import dummy from "dummies/DummyTravel.json"

function TravelEdit() {
  const TravelPlan = useState(dummy)[0]

  const [courses, setCourses] = useState(dummy.courses)
  const handleTravelCourses = function(index, data) {
    let newCourses = [...courses]
    newCourses[index].route = data
    setCourses(newCourses)
  }
    
  const handleTimeInput = function(index, data) {
    let newInput = [...courses]
    newInput[index].startTime = data
    setCourses(newInput)
  }

  return (
    <>
      <Header />
        <TravelTitle title={TravelPlan.title} date={TravelPlan.startDate} />
        {TravelPlan.courses.map((course, idx) => (
          <div key={idx}>
            <hr />
            <p className="content-size text-center">DAY{idx + 1}({course.day})</p>
            <TimeInputEdit idx={idx} time={course.startTime} handleTimeInput={handleTimeInput} />
            <Spots idx={idx} routes={course.route} handleTravelCourses={handleTravelCourses} />
            <p className="content-size text-center">추가하기</p>
          </div>
        ))}
    </>
  )
}



export default TravelEdit
