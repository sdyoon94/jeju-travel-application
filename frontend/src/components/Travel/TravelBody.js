import "./TravelBody.css"

import { getAllDates } from "components/DateTime/date"
import Course from "./Body/Course";
import Day from "./Body/Day";

const { default: React, useEffect } = require("react")

var onClickNext = []
var onClickPrev = []

function buildOnClickHandler( { periodInDays, setCourseIdx } ) {
    for (let day = 1; day <= periodInDays; day++) {
        const blur = () => {
            Array.from(document.getElementsByClassName("day-" + day)).forEach(el => {
                el.style.display = "none"
            })
        }
        let nextDay = day + 1
        if (nextDay > periodInDays) {
            nextDay = 1
        }

        const next = () => {
            Array.from(document.getElementsByClassName("day-" + nextDay)).forEach(el => {
                el.style.display = "grid"
            })
            setCourseIdx(nextDay - 1)
        }

        let prevDay = day - 1
        if (prevDay === 0) {
            prevDay = periodInDays
        }

        const prev = () => {
            Array.from(document.getElementsByClassName("day-" + prevDay)).forEach(el => {
                el.style.display = "grid"
            })
            setCourseIdx(prevDay - 1)
        }

        onClickNext.push(() => {
            blur()
            next()
        })

        onClickPrev.push(() => {
            blur()
            prev()
        })
    }
}


function TravelBody({ startDate, periodInDays, courses, setCourses, courseIdx, setCourseIdx, startTime, setStartTime }) {
    const dates = getAllDates(startDate, periodInDays)

    buildOnClickHandler({ periodInDays, setCourseIdx })
    
    return (
        <div className="course-container">
            {
                courses.map((course, i) => {
                    const day = i+1
                    const date = dates[i]

                    return (
                        <div key={i}>
                            <Day
                                day={day}
                                date={date}
                                next={onClickNext[i]}
                                prev={onClickPrev[i]}
                            />
                            <Course
                                day={day}
                                course={course}
                                courseIndex={i}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default TravelBody