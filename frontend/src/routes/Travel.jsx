import React, { useEffect, useState } from "react";
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
	deleteSchedule,
	swapSchedule,
	editStayTime,
	setIsLoaded,
	createSchedule
} from "store/modules/travelSlice";
import { initSocket } from "store/modules/socketSlice";
import "./Travel.css";
import "routes/Inputs/CreateLoading.css";

// const socket = io('http://localhost:5000/travel', data)

function Travel({ params }) {
	const token = useSelector((state) => state.auth.token);
	// travelId를 통해 여행 정보 가져오기
	const { travelId } = params;
	const dispatch = useDispatch();

	const [error, setError] = useState(null);

	// get travel
	const travel = useSelector((state) => state.travel);
	const auth = useSelector((state) => state.auth);
	const socket = useSelector((state) => state.socket.socket);
	const presentTravelId = useSelector((state) => state.socket.presentTravelId)
	const isLoaded = useSelector((state) => state.travel.isLoaded);

	useEffect(() => {
		if (socket) {
			socket.on("get travel", (data) => {
				dispatch(setTravelInfo(data.travel.travelInfo));
				dispatch(initSchedule(data.travel.schedules));
				dispatch(setIsLoaded(true));
				setError(false);
			});

			socket.on("error", (err) => {
				console.log(err, "err");
				if (err === 403) {
					setError(403);
				}
				socket.emit(
					"revoke all authority",
					(_) => {}
				);
			})

			socket.on("delete schedule", ({ day, turn }) => {
				dispatch(deleteSchedule({day,turn}))
				console.log("삭제성공", day, turn)
			})

			socket.on("swap schedule", ({day, turn1, turn2}) => {
				dispatch(swapSchedule({ day, turn1, turn2 }))
			})

			socket.on("update staytime", ({day, turn, stayTime}) => {
				dispatch(editStayTime({ 
					scheduleIdx: day, 
					placeIdx: turn, 
					stayTime
				}))
			})
			socket.on("put travel info ", (response) => {
				dispatch(setTravelInfo(response))
			})
			socket.on("create schedule", (response)=>{
				const day = response.day
				const spots = response.spots
				dispatch(createSchedule({ day, spots }))
			})
		}
	}, [ socket ])
		

	const connectSocket = () => {
		dispatch(initSocket(travelId));
	};
 
	useEffect(() => {
		if (!socket || presentTravelId !== travelId) {
			connectSocket();
		}
	}, [  ]);

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
