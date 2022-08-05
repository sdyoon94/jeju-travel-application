import { createSlice } from "@reduxjs/toolkit"
import travel from "dummies/DummyTravel.json"

// TODO: createAsyncThunk + RTK Query API

const initialState = travel


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
	}
})

const { actions, reducer } = travelSlice

export const { editStartTime, editStayTime, setTravel } = actions
export default reducer