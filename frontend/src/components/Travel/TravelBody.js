import { ReactComponent as AngleLeft } from "assets/angle-left.svg"
import { ReactComponent as AngleRight } from "assets/angle-right.svg"
import "./TravelBody.css"

const { default: React } = require("react")
const { default: Carousel } = require("react-material-ui-carousel");

function TravelBody({ travel }) {
    const { courses, startDate, periodInDays } = travel;

    const dates = getDates(startDate, periodInDays)

    return (
        <Carousel
            autoPlay={ false }
            animation={ "slide" }
            NextIcon={ <AngleRight width={20} height={20} /> }
            PrevIcon={ <AngleLeft width={20} height={20} /> }
            fullHeightHover={false}
            navButtonsProps={{
                style: {
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    borderRadius: 0
                }
            }} 
            navButtonsWrapperProps={{
                style: {
                    bottom: 'unset',
                    top: '-30'
                }
            }}
        >
            {
                courses.map((course, i) => {
                    // time taken from i'th to (i+1)'th place, 
                    // asynchronous logic needed
                    const timeRequired = Array(course.route.length - 1)
                    for (let i = 0; i < timeRequired.length; i++){
                        timeRequired[i] = "01:00"
                    }

                    return <Day 
                        key={i}
                        course={course}
                        timeRequired={timeRequired}
                        date={dates[i]}
                        day={i+1}
                    />
                })
            }
        </Carousel>
    )
}

function Day({ course, timeRequired, date, day }) {
    let startTime = course.startTime
    const startTimes = [startTime]
    for (let i = 0; i < timeRequired.length; i++) {
        // 다음 번 시간을 계산해서 배열에 push
        startTime = addTime(startTime, course.route[i].duration, timeRequired[i])
        startTimes.push(startTime)
    }
    return (
        <div className="course-container">
            <div className="course-title">DAY{day}({date})</div>
            <div className="course-route">
                {
                    course.route.map((place, i) => 
                        <Schedule
                            key={i}
                            isFirst={i === 0}
                            startTime={startTimes[i]}
                            place={place}
                        />
                    )
                }
            </div>
        </div>
        
    )
}

function Schedule({ isFirst, startTime, place }) {
    return (
        <div>
            {isFirst ? "true" : "false"}, {startTime}, {place.name}
        </div>
    )
}

// 시간은 5분 단위로 계산한다. 
function addTime(time1, time2, time3) {
    const [ hour1, min1 ] = time1.split(":");
    const [ hour2, min2 ] = time2.split(":");
    const [ hour3, min3 ] = time3.split(":");

    let hour = Number(hour1) + Number(hour2) + Number(hour3);
    let min = Number(min1) + Number(min2) + Number(min3);
    min = Math.round(min / 5) * 5;

    if (min >= 60) {
        hour += Math.floor(min / 60);
        min %= 60;
    }
    if (hour >= 24) {
        hour -= 24;
    }

    return buildTime(hour, min)
}

function buildTime(hour, min) {
    let time = "";
    if (hour < 10) {
        time += "0" + hour + ":"
    }
    else {
        time += hour + ":"
    }

    if (min < 10) {
        time += "0" + min
    }
    else {
        time += min
    }

    return time
}

//         month = [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12]
const dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const SEPARATOR = "."

// date format == "yy.mm.dd"
function getDates(date, periodInDays) {
    const ymd = date.split(SEPARATOR)
    if (ymd.length !== 3)
        return []

    let year = Number(ymd[0])
    let month = Number(ymd[1])
    let day = Number(ymd[2])

    let dates = []

    dates.push(buildDate(year, month, day))

    for (let d = 1; d < periodInDays; d++) {
        day++
        if (day > dayOfMonth[month-1]) {
            day = 1
            month++
            if (month > 12) {
                month = 1
                year++
            }
        }
        dates.push(buildDate(year, month, day))
    }

    return dates
}

function buildDate(year, month, day) {
    let date = ""
    if (year < 10) {
        date = "0" + year + SEPARATOR
    }
    else {
        date = year + SEPARATOR
    }

    if (month < 10) {
        date += "0" + month + SEPARATOR
    }
    else {
        date += month + SEPARATOR
    }

    if (day < 10) {
        date += "0" + day
    }
    else {
        date += day
    }

    return date
}

export default TravelBody