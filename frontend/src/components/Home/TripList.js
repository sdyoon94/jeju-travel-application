import TripSummary from './TripSummary'
import NewUser from './NewUser'
import { useSelector } from 'react-redux'
import 'globalStyle.css' 
import 'routes/Home.css'


function Trips() {
  const trips = useSelector((state => state.tripList.trips))

  return (
    <div className="trip-list-box">
      {trips.length ? 
        trips.map((trip, idx) => 
        <TripSummary
        key={idx}
        title={trip.title}
        date={trip.date}
        person={trip.person}
        />) :
        <NewUser />
        }
    </div>
  )
}

export default Trips