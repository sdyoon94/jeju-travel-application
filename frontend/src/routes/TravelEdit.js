import { useState } from "react"
import Header from "components/Header"
import TravelTitle from "components/TravelEdit/TravelTitle"
import Spots from "components/TravelEdit/Spots"
import dummy from "dummies/DummyTravel.json"

function TravelEdit() {
    const [TravelPlan, setTravelPlan] = useState(dummy)
    const [courses, setCourses] = useState(dummy.courses)

    const handleTravelCourses = (index, data) => {
        let newCourses = [...courses]
        newCourses[index].route = data
        setCourses(newCourses)
    }

	return (
        <>
            <Header />
            <TravelTitle title={TravelPlan.title} date={TravelPlan.startDate} />
            {TravelPlan.courses.map((course, idx) => (
                <div key={idx}>
                    <hr />
                    <p className="content-size text-center">DAY{idx + 1}({course.day})</p>
                    <p className="content-size start-time">{course.startTime}</p>
                    <Spots idx={idx} routes={course.route} handleTravelCourses={handleTravelCourses} />
                    <p className="content-size text-center">추가하기</p>
                </div>
            ))}
        </>
	)
}



export default TravelEdit
