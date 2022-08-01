import { ReactComponent as Car } from "assets/car-side.svg"

import "./Schedule.css"

function Schedule({ place, startTime, timeReq, isLast, hold }) {

	return (
		<>
			<span className="subcontent-size">{startTime}</span>
			<div className="schedule-info schedule-box">
				<p>{place.name}</p>
				<p>{place.duration}</p>
			</div>
			{isLast && 
				<div className="subcontent-size link text-center">
					추가하기
				</div>
			}
			{!isLast && !hold &&
				<div className="subcontent-size text-center transportation">
					<Car width={12} height={12} /> {timeReq}
				</div>
			}
		</>
	)
}

export default Schedule