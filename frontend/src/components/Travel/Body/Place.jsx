import { ReactComponent as Car } from "assets/car-side.svg"
import { ReactComponent as Bus } from "assets/bus-alt.svg"

import StartTime from "./StartTime"
import Exclamation from "./Exclamation"
import "./Place.css"
import "globalStyle.css"
import TimeReq from "./TimeReq"


function Place({ travel, placeIdx, scheduleIdx, startTime, timeReq, timeReqs, setTimeReqs, directionError, isFirst, isLast, hold, vehicle }) {

	return (
		<>
			{isFirst &&
				<StartTime 
					style={{padding: "0vh 2vw"}} 
					travel={travel}
					placeIdx={0}
					scheduleIdx={scheduleIdx}
				/>
			}
			{!isFirst && !hold &&
				<span className="span-padding subcontent-size">{startTime}</span>
			}

			<div className="place-info place-box">
				<span className="overflow-x-dots">{travel.schedules[scheduleIdx][placeIdx].placeName}</span>
				{ !isFirst && !isLast &&
					<StartTime
						travel={travel}
						placeIdx={placeIdx}
						scheduleIdx={scheduleIdx}
					/>
				}
			</div>

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