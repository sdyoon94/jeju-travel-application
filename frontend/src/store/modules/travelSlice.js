import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
// import travel from "dummies/DummyTravel.json"

// TODO: createAsyncThunk
const HOST = "http://i7a609.p.ssafy.io:8081/api/v1/"
const SCHEDULE_PATH = "schedule"
const TRAVEL_PATH = "travel/showTripInfo"

const buildScheduleConfig = (travelId, day) => ({
	method: "get",
	url: `${HOST + SCHEDULE_PATH}?tripId=${travelId}&day=${day}`
})

const buildTravelConfig = (travelId) => ({
	method: "get",
	url: `${HOST + TRAVEL_PATH}/${travelId}`
})

export const fetchTravel = createAsyncThunk(
	"travel",
	async ({ travelId }, thunkAPI) => {
		const dispatch = thunkAPI.dispatch

		try {
			const response = await axios(buildTravelConfig(travelId))
			console.log(response)

			if (response.status === 200) {
				const info = response.data.tripInfo
				console.log(info)

				dispatch(setTravelInfo({ payload: info }))
				
				const { periodInDays } = info
				dispatch(initSchedule({ payload: periodInDays }))

				for (let day = 0; day < periodInDays; day++) {
					const response = await axios(buildScheduleConfig(travelId, day))
					console.log(response)

					if (response.status === 200) {
						const schedule = response.data["일자별 Schedule List"]
						console.log(schedule)

						dispatch(setSchedule({ day, schedule }))
					}
				}
			}
		}
		catch (err) {
			console.log(err)
			return
		}
	}
)

/* 
info: {
	tripId: 여행 아이디,
	tripName: 여행 이름, 
	startDate: 시작 일자 (YYYY-MM-DD),
	periodInDays: 여행 일 수,
	budget: 여행 예산,
	vehicle: 주 교통 수단 (car, walk),
	style: 여행 스타일 (bit-masking),
	member: 	멤버 정보 배열
	  - kakaoId,
		- nickname,
		- imagePath,
}
 */

const initialState = {
	info: {
		tripId: 0,
		tripName: "",
		startDate: "",
		periodInDays: 0,
		budget: 0,
		vehicle: "",
		style: 0,
		member: []
	},
	schedules: [],
	error: null
}

const travelSlice = createSlice({
	name: "travel",
	initialState,
	reducers: {
		editStartTime(state, { payload }) {
			state.courses[payload.courseIndex].startTime = payload.newStartTime
		},
		editStayTime(state, { payload }) {
			state.courses[payload.courseIndex].route[payload.scheduleIndex].duration = payload.newStartTime
		},
		setTravel(state, { payload }) {
			state[payload[0]] = payload[1]
		},
		setTravelInfo(state, { payload: info }) {
			state = {
				...state,
				info
			}
		},
		initSchedule(state, { payload: periodInDays }) {
			state = {
				...state,
				schedules: new Array(periodInDays)
			}
		},
		setSchedule(state, { payload: { day, schedule } }) {
			const schedules = state.schedules
			schedules[day] = {
				day: day + 1,
				schedule
			}

			state = {
				...state,
				schedules
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTravel.fulfilled, (state, action) => {
				console.log(action.payload)
			})
			.addCase(fetchTravel.rejected, (state, action) => {
				console.log(action.payload)
				state.error = action.payload
			})
	}
})

const { actions, reducer } = travelSlice

export const { editStartTime, editStayTime, setTravel, setTravelInfo, initSchedule, setSchedule } = actions
export default reducer