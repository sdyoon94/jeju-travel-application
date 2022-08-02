import { createSlice } from "@reduxjs/toolkit"
import travel from "dummies/DummyTravel.json"

// TODO: createAsyncThunk + RTK Query API

const initialState = travel
console.log(travel.courses)


const travelSlice = createSlice({
	name: "travel",
	initialState,
	reducers: {
		editStartTime(state, { payload }) {
			state.courses[payload.courseIndex].startTime = payload.newStartTime
		},
		editStayTime(state, { payload }) {
			state.courses[payload.courseIndex].route[payload.scheduleIndex].duration = payload.newStartTime
		}
	}
})

const { actions, reducer } = travelSlice

export const { editStartTime, editStayTime } = actions
export default reducer