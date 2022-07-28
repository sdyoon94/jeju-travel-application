import "./TravelBody.css"

import { getAllDates } from "components/DateTime/date"
import Course from "./Body/Course";
import Day from "./Body/Day";

const { default: React } = require("react")

function TravelBody({ travel }) {
    const { courses, startDate, periodInDays } = travel;

    const dates = getAllDates(startDate, periodInDays)
    
    return (
        <div className="course-container">
            {
                courses.map((course, i) => {
                    const day = i+1
                    const date = dates[i]

                    const blur = () => {
                        Array.from(document.getElementsByClassName("day-" + day)).forEach(el => {
                            el.style.display = "none"
                        })
                    }

                    const next = () => {
                        blur()
                        let nextDay = day + 1
                        if (nextDay > periodInDays) {
                            nextDay = 1
                        }
                        Array.from(document.getElementsByClassName("day-" + nextDay)).forEach(el => {
                            el.style.display = "grid"
                        })
                    }

                    const prev = () => {
                        blur()
                        let prevDay = day - 1
                        if (prevDay <= 0) {
                            prevDay = periodInDays
                        }
                        Array.from(document.getElementsByClassName("day-" + prevDay)).forEach(el => {
                            el.style.display = "grid"
                        })
                    }

                    return (
                        <div key={i}>
                            <Day
                                day={day}
                                date={date}
                                next={next}
                                prev={prev}
                            />
                            <Course
                                day={day}
                                course={course}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default TravelBody