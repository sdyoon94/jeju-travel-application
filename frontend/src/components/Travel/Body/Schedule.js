import { ReactComponent as Car } from "assets/car-side.svg"
import StartTime from "./StartTime"
import "./Schedule.css"
// import { useState } from "react"

function Schedule({ scheduleIndex, courseIndex, place, startTime, timeReq, isFirst, isLast, hold }) {


	return (
		<>
			{isFirst && !hold && 
				<StartTime courseIndex={courseIndex} time={startTime}/> 
			}
			{!isFirst && !hold &&
				<p className="subcontent-size">{startTime}</p>
			}

			<div className="schedule-info schedule-box">
				<p>{place.name}</p>
				<StartTime courseIndex={courseIndex} time={place.duration} scheduleIndex={scheduleIndex}/>
				{/* <p>{place.duration}</p> */}
			</div>

			{isLast && !hold &&
				<div className="subcontent-size link text-center plus">
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