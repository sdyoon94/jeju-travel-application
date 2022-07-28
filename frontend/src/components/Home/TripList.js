import TripSummary from './TripSummary'
// import { useSelector } from 'react-redux'
import 'globalStyle.css' 
import 'routes/Home.css'


function Trips() {
  // const trips = useSelector((state => console.log(state.courseList)))
  const trips = 3


  return (
    <div className="trip-list-box">
      {trips ?
        <h1 className="title-size text-center">내 여행 목록</h1>
        : null
      }
      {trips.length ? 
        trips.map((trip, idx) => 
        <TripSummary
        key={idx}
        title={trip.title}
        date={trip.date}
        person={trip.person}
        />) :
        <h3 className="subtitle-size">아직 참여중인 여행이 없습니다</h3>
        }
    </div>
  )
}

export default Trips