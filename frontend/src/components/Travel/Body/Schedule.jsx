import { useNavigate } from "react-router"
import { ReactComponent as Car } from "assets/car-side.svg"
import { ReactComponent as Bus } from "assets/bus-alt.svg"
import { ReactComponent as AddSpot } from 'assets/add.svg'
import StartTime from "./StartTime"
import "./Schedule.css"
// import { useState } from "react"

function Schedule({ scheduleIndex, courseIndex, place, startTime, timeReq, isFirst, isLast, hold, vehicle }) {
	const navigate = useNavigate()
	const handleAddSpot = () => {
		navigate("/search")
	}


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
				<AddSpot onClick={handleAddSpot} className="add-spot" />
			}
			{!isLast && !hold &&
				<div className="subcontent-size text-center transportation">
					{	vehicle === "car" ?
						<Car className="vehicle" />:
						<Bus className="vehicle" />
					}
					 {timeReq} 
				</div>
			}
		</>
	)
}

export default Schedule