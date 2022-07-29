import { useSelector } from "react-redux"
import Header from "components/Header/Header"
import TravelTitle from "components/TravelEdit/TravelTitle"
import Spots from "components/TravelEdit/Spots"
import StartTimeInputEdit from "components/TravelEdit/StartTimeInputEdit"


function TravelEdit() {
  const coursePlan = useSelector(state => state.courseList.courses)
  console.log('처음계획', coursePlan)

  return (
    <>
      <Header />
        <TravelTitle />
        {coursePlan.map((course, idx) => (
          <div key={idx}>
            <hr />
            <p className="content-size text-center">DAY{idx + 1}({course.day})</p>
            <StartTimeInputEdit idx={idx} time={course.startTime} />
            <Spots idx={idx} routes={course.route} />
            <p className="content-size text-center">추가하기</p>
          </div>
        ))}
    </>
  )
}



export default TravelEdit
