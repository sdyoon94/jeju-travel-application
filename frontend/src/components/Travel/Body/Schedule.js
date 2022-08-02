import { ReactComponent as Car } from "assets/car-side.svg"
import StartTime from "./StartTime"
import "./Schedule.css"
// import { useState } from "react"

function Schedule({ place, startTime, timeReq, isFirst, isLast, hold }) {
	// const [isHover, setIsHover] = useState(false)

	return (
		<>
			{/* {
				isFirst && isHover
				? <StartTime time={startTime} setIsHover={setIsHover} />
				: <span 
					onMouseOver={() => setIsHover(true)}
					className="subcontent-size"
					>{startTime}</span>
			} */}
			{ 
				isFirst 
				? <StartTime time={startTime}/> 
				: <span className="subcontent-size">{startTime}</span>
			}
			<div className="schedule-info schedule-box">
				<p>{place.name}</p>
				<StartTime time={place.duration} />
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