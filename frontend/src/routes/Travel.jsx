import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import Header from "components/Header/Header"
import TravelTitle from "components/Travel/TravelTitle"
import TravelBody from "components/Travel/TravelBody"

import ConfigDrawer from "components/Travel/Drawer/ConfigDrawer"
import { initDirection } from "store/modules/directionSlice"
import { setTravel, setTravelInfo, initSchedule, setSchedule } from "store/modules/travelSlice"
import axios from "axios"
import api from "api"

import "routes/Inputs/CreateLoading.css"

function Travel({ params }) {
	// travelId를 통해 여행 정보 가져오기
	const { travelId } = params
	const dispatch = useDispatch()

	const [ error, setError ] = useState(null)
	const [ isLoaded, setIsLoaded ] = useState(false)
	const [ scheduleIdx, setScheduleIdx ] = useState(0)

	// get travel
	const travel = useSelector((state) => state.travel)
	const auth = useSelector((state) => state.auth)

	useEffect(() => {
		const buildTravelInfoConfig = (travelId) => ({
			method: "get",
			url: api.travel.createTravelInfoUrl(travelId)
			})

		const buildTravelScheduleConfig = (travelId, day) => ({
			method: "get",
			url: api.travel.createTravelScheduleUrl(travelId, day)
		})

		const fetchData = async (travelId) => {
			const response = await axios(buildTravelInfoConfig(travelId))

			if (response.status === 200) {
				const info = response.data.tripInfo

				const { periodInDays } = info
				dispatch(setTravelInfo(info))
				dispatch(initSchedule({ payload: periodInDays }))

				dispatch(initDirection(periodInDays))

				for (let day = 0; day < periodInDays; day++) {
					const response = await axios(buildTravelScheduleConfig(travelId, day))

					if (response.status === 200) {
						const schedule = response.data["일자별 Schedule List"]

						schedule.forEach(place => {
							if (!place.stayTime) {
								place.stayTime = 60
							}
						})

						dispatch(setSchedule({ scheduleIdx: day, schedule }))
					}
				}
			}
		}
        
		const updateState = async (travelId) => {
			try {
				const _ = await fetchData(travelId)
				setIsLoaded(true)
			}
			catch (err) {
				setError(err)
			}
		}

		updateState(travelId)
	// eslint-disable-next-line
	}, [])

	return (
		<>
			<div className="travel-container">
				{ error 
					? <div>에러 발생</div>
					: isLoaded
					?	<>
							<Header>
								<ConfigDrawer
									travel={travel}
									setTravel={(v)=>{dispatch(setTravel(v))}}
								/>
							</Header>
							<TravelTitle
								travel={travel}
								auth={auth}
							/>
							<TravelBody
								travel={travel}
								setSchedule={(v)=>{dispatch(setSchedule(v))}}
								scheduleIdx={scheduleIdx}
								setScheduleIdx={setScheduleIdx}
							/>
						</>
						:	<div className="loading">
								<div className="loading-mention text-center title-size title-weight">
									여행을 불러오는 중입니다!
								</div>
							</div>
				}
			</div>
		</>
	)
}

export default Travel