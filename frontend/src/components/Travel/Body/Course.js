import Schedule from "components/Travel/Body/Schedule"
import { addTime, secToTime } from "components/DateTime/time"

import "./Course.css"
import { useEffect, useState } from "react"
import { fetchDirection } from "store/modules/distanceSlice"
import { useDispatch } from "react-redux"

function Course({ day, course }) {
    const className = "course day-" + day

    const [ startTimes, setStartTimes ] = useState([ course.startTime ])
    const [ timeReqs, setTimeReqs ] = useState([])

    const dispatch = useDispatch()

    // course가 변경되었을 때 로직
    useEffect(() => {
        const fetchData = async ({ index, route }) => {
            let startTime = course.startTime
            let startTimes_ = [ startTime ]
            let timeReqs_ = []

            const response = await dispatch(fetchDirection({ index: day-1, route: route }))

            const len = route.length
            for (let i = 1; i < len; i++) {
                const duration = route[i-1].duration
                const timeReq = secToTime(response.payload.directions[i-1].duration)

                startTime = addTime(startTime, duration, timeReq)
                startTimes_.push(startTime)
                timeReqs_.push(timeReq)
            }
            setStartTimes(startTimes_)
            setTimeReqs(timeReqs_)
        }
        fetchData({index: day-1, ...course})
    }, [course, day, dispatch])

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
                        isLast={i === timeReqs.length}
                    />
                )
            }
        </div>
    )
}

export default Course