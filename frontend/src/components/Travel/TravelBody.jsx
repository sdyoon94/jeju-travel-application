import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { format, addDays } from "date-fns"

import { getAllDates } from "components/DateTime/date"

import Schedule from "./Body/Schedule"
import Day from "./Body/Day"
import MapDrawer from "./Drawer/MapDrawer"

import "./TravelBody.css"

var onClickNext = [];
var onClickPrev = [];

function buildOnClickHandler({ periodInDays, setScheduleIdx }) {
  for (let day = 1; day <= periodInDays; day++) {
    const blur = () => {
      Array.from(document.getElementsByClassName("day-" + day)).forEach(
        (el) => {
          el.style.display = "none";
        }
      );
    };
    let nextDay = day + 1;
    if (nextDay > periodInDays) {
      nextDay = 1;
    }

    const next = () => {
      Array.from(document.getElementsByClassName("day-" + nextDay)).forEach(
        (el) => {
          el.style.display = "grid";
        }
      );
      setScheduleIdx(nextDay - 1);
    };

    let prevDay = day - 1;
    if (prevDay === 0) {
      prevDay = periodInDays;
    }

    const prev = () => {
      Array.from(document.getElementsByClassName("day-" + prevDay)).forEach(
        (el) => {
          el.style.display = "grid";
        }
      );
      setScheduleIdx(prevDay - 1);
    };

    onClickNext.push(() => {
      blur();
      next();
    });

    onClickPrev.push(() => {
      blur();
      prev();
    });
  }
}

function TravelBody({ travel, setSchedule, scheduleIdx, setScheduleIdx }) {

  const [ dates, setDates ] = useState([])

  useEffect(() => {
    const dates_ = []

    for (let day = 0; day < travel.info.periodInDays; day++) {
      dates_.push(format(
        addDays(
          travel.info.startDate ? 
          new Date(travel.info.startDate) :
          new Date(), 
          day),
        "yyyy-MM-dd"
      ))
    }

    setDates(dates_)
  }, [ travel.info.periodInDays, travel.info.startDate ])

  buildOnClickHandler({ 
    periodInDays: travel.info.periodInDays, 
    setScheduleIdx
  })

  return (
    <div className="course-container">
      { 
        dates.map((date, i) => {
          return <Day 
            key={i}
            day={i+1}
            date={date}
            next={onClickNext[i]}
            prev={onClickPrev[i]}
          />
        })
      }
      <div className="map-drawer-container">
        <MapDrawer travel={travel} scheduleIdx={scheduleIdx} />
      </div>
      {
        travel.schedules.map((schedule, i) => {
          return (
            <Schedule 
              key={i}
              day={i+1}
              travel={travel}
              schedule={schedule} 
              scheduleIdx={i}
              setSchedule={setSchedule}
              vehicle={travel.info.vehicle}
            />
          )
        })
      }
    </div>
  );
}

export default TravelBody;
