import React, { useEffect, useState, usePrams } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import TravelTitle from "components/Travel/TravelTitle";
import TravelBody from "components/Travel/TravelBody";
import Error403 from "components/Error/Error403";
import ConfigDrawer from "components/Travel/Drawer/ConfigDrawer";
import { initDirection } from "store/modules/directionSlice";
import {
	setTravel,
	setTravelInfo,
	initSchedule,
	setSchedule,
} from "store/modules/travelSlice";
import { initSocket } from "store/modules/socketSlice";
import axios from "axios";
import api from "api";
import "./Travel.css";
import "routes/Inputs/CreateLoading.css";

import { io } from "socket.io-client";

// const socket = io('http://localhost:5000/travel', data)

function Travel({ params }) {
	const token = useSelector((state) => state.auth.token);
	// travelId를 통해 여행 정보 가져오기
	const { travelId } = params;
	const dispatch = useDispatch();

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	// const [scheduleIdx, setScheduleIdx] = useState(0)

	// get travel
	const travel = useSelector((state) => state.travel);
	const auth = useSelector((state) => state.auth);

	// useEffect(() => {
	// 	const buildTravelInfoConfig = (travelId) => ({
	// 		method: "get",
	// 		url: api.travel.createTravelInfoUrl(travelId),
	// 		headers: {
	// 			Authorization: `Bearer ${token}`
	// 		}
	// 	})

	// 	const buildTravelScheduleConfig = (travelId, day) => ({
	// 		method: "get",
	// 		url: api.travel.createTravelScheduleUrl(travelId, day),
	// 		headers: {
	// 			Authorization: `Bearer ${token}`
	// 		}
	// 	})

	// 	const fetchData = async (travelId) => {
	// 		const response = await axios(buildTravelInfoConfig(travelId))

	// 		if (response.status === 200) {
	// 			setError(false)
	// 			const info = response.data.tripInfo

	// 			const { periodInDays } = info
	// 			// dispatch(setTravelInfo(info))
	// 			dispatch(initSchedule({ payload: periodInDays }))

	// 			dispatch(initDirection(periodInDays))

	// 			for (let day = 0; day < periodInDays; day++) {
	// 				const response = await axios(buildTravelScheduleConfig(travelId, day))

	// 				if (response.status === 200) {
	// 					const schedule = response.data["일자별 Schedule List"]

	// 					schedule.forEach(place => {
	// 						if (!place.stayTime) {
	// 							place.stayTime = 60
	// 						}
	// 					})

	// 					// dispatch(setSchedule({ scheduleIdx: day, schedule }))
	// 				}
	// 			}
	// 		}
	// 	}

	// 	const updateState = async (travelId) => {
	// 		try {
	// 			const _ = await fetchData(travelId)
	// 			setIsLoaded(true)
	// 		}
	// 		catch (err) {
	// 			setError(err.response.status)
	// 		}
	// 	}
	// 	updateState(travelId)
	// 	// eslint-disable-next-line
	// }, [])

	const socket = useSelector(state => state.socket.socket)

	useEffect(() => {
		if (socket) {
			socket.on("get travel", (data) => {
				dispatch(setTravelInfo(data.travel.travelInfo));
				dispatch(initSchedule(data.travel.schedules));
				setIsLoaded(true);
				setError(false)
			});

			socket.on("error", (err) => {
				console.log(err, "err")
				if (err === 403) {
					setError(403)
				}
			})
		}
	}, [ socket ])

	const connectSocket = () => {
		// const data = {
		// 	auth: { token },
		// 	query: { travelId },
		// };
		// const socket = io("http://localhost:5000/travel", data);
		dispatch(initSocket(travelId))

		// socket.on("get travel", (data) => {
		// 	dispatch(setTravelInfo(data.travel.travelInfo));
		// 	dispatch(setSchedule(data.travel.schedules));
		// 	setIsLoaded(true);
		// 	setError(false)
		// });

		// socket.on("error", (err) => {
		// 	console.log(err, "err")
		// 	if (err === 403) {
		// 		setError(403)
		// 	}
		// })
	};

	useEffect(() => {
		connectSocket();
		console.log("socket...please")
	}, []);

	return (
		<>
			<div className="travel-container">
				{error === 403 ? (
					<Error403 />
				) : isLoaded ? (
					<>
						<div className="travel-header">
							<div>
								<Link
									style={{
										textDecoration: "none",
										color: "black",
										display: "flex",
										alignItems: "center",
									}}
									to={"/"}
								>
									<span>놀멍쉬멍</span>
									<img
										className="gamgyul"
										alt="gamgyulImg"
										src="/icons/gamgyul.jpg"
									/>
								</Link>
							</div>
							<ConfigDrawer
								travel={travel}
								setTravel={(v) => {
									dispatch(setTravel(v));
								}}
							/>
						</div>
						<TravelTitle travel={travel} auth={auth} />
						<TravelBody
							// travel={travel}
							setSchedule={(v) => {
								dispatch(setSchedule(v));
							}}
							// scheduleIdx={scheduleIdx}
							// setScheduleIdx={setScheduleIdx}
						/>
					</>
				) : (
					<div className="loading">
						<div className="loading-mention text-center title-size title-weight">
							여행을 불러오는 중입니다!
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default Travel;
