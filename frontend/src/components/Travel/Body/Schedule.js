import { ReactComponent as Car } from "assets/car-side.svg"

import "./Schedule.css"

function Schedule({ place, startTime, timeReq, isFirst, isLast }) {
    return (
        <div className="schedule">
            <div className="schedule-time">
                {startTime}
            </div>
            <div className="schedule-info">
                <p>{place.name}</p>
                <p>{place.duration}</p>
            </div>
            {isLast && 
                <div className="schedule-addi link">
                    추가하기
                </div>
            }
            {!isLast && 
                <div className="schedule-addi">
                    <Car width={12} height={12} /> {timeReq}
                </div>
            }
        </div>
    )
}

export default Schedule