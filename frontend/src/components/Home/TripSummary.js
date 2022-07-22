import 'routes/Home.css'
import 'globalStyle.css'


function TripSummary({title, date, person}) {

  return (
    <div className="trip-summary-box">
      <h3 className="subtitle-size item">{title}</h3>
      <div className="item">
        <img className="person-icon" src="icons/personIcon.png" alt="personIcon"></img>
        <span className="content-size">{person}</span>
      </div>
      <span className="content-size item">{date}</span>
    </div>
  )
}

export default TripSummary