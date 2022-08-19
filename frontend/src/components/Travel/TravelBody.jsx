import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";

import Schedule from "./Body/Schedule";
import Day from "./Body/Day";
import MapDrawer from "./Drawer/MapDrawer";

import "./TravelBody.css";
import { useSelector } from "react-redux";

function buildOnClickHandler({ periodInDays, setScheduleIdx, setOnClickNext, setOnClickPrev }) {
	const onClickNext = []
	const onClickPrev = []

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
		setOnClickNext(onClickNext)

		onClickPrev.push(() => {
			blur();
			prev();
		});
		setOnClickPrev(onClickPrev)
	}
}

function TravelBody({ setSchedule }) {
	const travel = useSelector((state) => state.travel);
	const [scheduleIdx, setScheduleIdx] = useState(0);
	const [dates, setDates] = useState([]);
	const [onClickNext, setOnClickNext] = useState([])
	const [onClickPrev, setOnClickPrev] = useState([])

	useEffect(() => {
		const dates_ = [];

		for (let day = 0; day < travel.info.periodInDays; day++) {
			dates_.push(
				travel.info.startDate
					? format(addDays(new Date(travel.info.startDate), day), "yyyy-MM-dd")
					: ""
			);
		}

		setDates(dates_);
		buildOnClickHandler({
			periodInDays: travel.info.periodInDays,
			setScheduleIdx,
			setOnClickNext,
			setOnClickPrev
		});
	}, [travel.info.periodInDays, travel.info.startDate]);

	return (
		<div className="course-container">
			{dates.map((date, i) => {
				return (
					<Day
						key={i}
						day={i + 1}
						date={date}
						next={onClickNext[i]}
						prev={onClickPrev[i]}
					/>
				);
			})}
			<div className="map-drawer-container">
				<MapDrawer travel={travel} scheduleIdx={scheduleIdx} />
			</div>
			{travel.schedules.map((_, i) => {
				return (
					<Schedule
						key={i}
						day={i + 1}
						travel={travel}
						scheduleIdx={i}
						setSchedule={setSchedule}
						vehicle={travel.info.vehicle}
					/>
				);
			})}
		</div>
	);
}

export default TravelBody;
