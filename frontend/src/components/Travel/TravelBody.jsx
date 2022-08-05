import { getAllDates } from "components/DateTime/date";
import { useSelector } from "react-redux";

import Course from "./Body/Course";
import Day from "./Body/Day";
import MapDrawer from "./Drawer/MapDrawer";

import "./TravelBody.css";

const { default: React, useEffect, useState } = require("react");

var onClickNext = [];
var onClickPrev = [];

function buildOnClickHandler({ periodInDays, setCourseIdx }) {
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
      setCourseIdx(nextDay - 1);
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
      setCourseIdx(prevDay - 1);
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

function TravelBody({ courseIdx, setCourseIdx }) {
  const travel = useSelector((state) => state.travel);

  const [startDate] = useState(travel.startDate);
  const [periodInDays] = useState(travel.periodInDays);
  const [courses] = useState(travel.courses);
  // const [ startTime ] = useState(travel.startTime)
  const [vehicle] = useState(travel.vehicle);

  const [dates, setDates] = useState(getAllDates(startDate, periodInDays));

  useEffect(() => {
    setDates(getAllDates(startDate, periodInDays));
  }, [startDate]);

  buildOnClickHandler({ periodInDays, setCourseIdx });

  return (
    <div className="course-container">
      {courses.map((course, i) => {
        const day = i + 1;
        const date = dates[i];

        return (
          <Day
            key={i}
            day={day}
            date={date}
            next={onClickNext[i]}
            prev={onClickPrev[i]}
          />
        );
      })}
      <div className="map-drawer-container">
        <MapDrawer courseIdx={courseIdx} />
      </div>
      {courses.map((course, i) => {
        const day = i + 1;

        return (
          <Course 
            key={i}
            day={day}
            course={course} 
            courseIndex={i} 
            vehicle={vehicle} 
          />
        );
      })}
    </div>
  );
}

export default TravelBody;
