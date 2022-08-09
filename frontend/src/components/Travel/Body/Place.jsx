import { useNavigate } from "react-router"
import { ReactComponent as Car } from "assets/car-side.svg"
import { ReactComponent as Bus } from "assets/bus-alt.svg"
import { ReactComponent as AddSpot } from 'assets/add.svg'

import StartTime from "./StartTime"
import Exclamation from "./Exclamation"
import { convert } from "components/DateTime/time"
import "./Place.css"
import "globalStyle.css"
import { useSelector } from "react-redux"
import TimeReq from "./TimeReq"
// import { useState } from "react"

function Place({ place, placeIdx, scheduleIdx, startTime, timeReq, timeReqs, setTimeReqs, directionError, isFirst, isLast, hold, vehicle }) {
	const navigate = useNavigate()
	const handleAddSpot = () => {
		navigate("/search")
	}

	return (
		<>
			{isFirst && !hold && 
				<StartTime 
					style={{padding: "0vh 2vw"}} 
					placeIdx={0}
					scheduleIdx={scheduleIdx}
					time={startTime} 
				/>
			}
			{!isFirst && !hold &&
				<span className="span-padding subcontent-size">{startTime}</span>
			}

			<div className="place-info place-box">
				<span className="overflow-x-dots">{place.placeName}</span>
				<StartTime 
					placeIdx={placeIdx}
					scheduleIdx={scheduleIdx}
					time={convert(place.stayTime)}
				/>
				{/* <p>{place.duration}</p> */}
			</div>

			{isLast && !hold &&
				<AddSpot onClick={handleAddSpot} className="add-spot" />
			}
			{!isLast && !hold &&
				<div className="text-center transportation">
					{	directionError ?
						<Exclamation msg="현재 교통정보 제공이 원활하지 않습니다." /> :
						vehicle === "car" ?
							<Car className="vehicle" />:
							<Bus className="vehicle" />
					}
					{ directionError ?
						<TimeReq 
							placeIdx={placeIdx}
							timeReq={timeReq}
							timeReqs={timeReqs}
							setTimeReqs={setTimeReqs}
						/> :
						<span className="subcontent-size">{ timeReq }</span>
					}
				</div>
			}
		</>
	)
}

export default Place