import Schedule from "components/Travel/Body/Schedule"
import { addTime } from "components/DateTime/time"

import "./Course.css"

function Course({ day, course }) {
    const className = "course day-" + day

    let startTime = course.startTime
    const startTimes = [startTime]
    const timeReqs = []
    const len = course.route.length

    for (let i = 1; i < len; i++) {
        const duration = course.route[i-1].duration
        const timeReq  = "01:00" // TODO: 경로 탐색 async 로직 추가

        startTime = addTime(startTime, duration, timeReq)
        startTimes.push(startTime)
        timeReqs.push(timeReq)
    }

    return (
        <div 
            className={className}
            style={{
                display: day === 1 ? "grid": "none"
            }}
        >
            {
                course.route.map((place, i) =>
                    <Schedule
                        key={i}
                        place={place}
                        startTime={startTimes[i]}
                        timeReq={timeReqs[i]}
                        isFirst={i === 0}
                        isLast={i === len-1}
                    />
                )
            }
        </div>
    )
}

export default Course