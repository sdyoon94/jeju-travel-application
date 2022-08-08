import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import travel from "dummies/DummyTravel.json"

// TODO: createAsyncThunk
const HOST = "http://i7a609.p.ssafy.io:8081/api/v1/"
const SCHEDULE_PATH = "schedule"

const buildTripSchedulePath = (tripId, day) => `${HOST + SCHEDULE_PATH}?tripId=${tripId}&day=${day}`

const buildTripScheduleConfig = (tripId) => ({
	method: "get",
	url: buildTripSchedulePath(tripId)
})

export const fetchTravel = createAsyncThunk(
	"trip/schedule/tripId",
	async ({ tripId }, thunkAPI) => {
		try {
			const response = await axios(buildTripScheduleConfig(tripId))

			console.log(response.data)

			return response.data
		}
		catch (err) {
			if (err.response) {
				return thunkAPI.rejectWithValue(`fetchTravel response error - ${err.response.status}`)
			}
			else if (err.request) {
				return thunkAPI.rejectWithValue(`fetchTravel request error`)
			}
			else {
				return thunkAPI.rejectWithValue(`${err.message}`)
			}
		}
	}
)

const initialState = {
	...travel,
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

export const { editStartTime, editStayTime, setTravel } = actions
export default reducer