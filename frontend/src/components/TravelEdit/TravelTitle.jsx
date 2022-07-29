import { useSelector } from "react-redux"
import "globalStyle.css"

function TravelTitle() {
  const title = useSelector(state => state.courseList.title)
  const date = useSelector(state => state.courseList.startDate)
  return (
    <>
      <h1 className="title-size text-center">{title}</h1>
      <p className="content-size text-center">{date}</p>
    </>
  )
}

export default TravelTitle