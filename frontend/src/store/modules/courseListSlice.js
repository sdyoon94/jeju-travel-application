import { createSlice } from "@reduxjs/toolkit"
import dummy from "dummies/DummyTravel.json"


const initialState = dummy

const courseListSlice = createSlice({
  name: 'courseList',
  initialState,
  reducers: {
    editCourses(state, { payload }) {
      state.courses[payload.idx].route = payload.newSpots
    },
    // editStartTime(state, { payload }) {
    //   state.courses[payload.idx].startTime = payload.newStartTime
    // },
    editStayTime(state, { payload }) {
      state.courses[payload.dayIdx].route[payload.courseIdx].duration = payload.stayMinutes
    }
  },
})

const { actions, reducer } = courseListSlice
export const { editCourses, editStartTime, editStayTime } = actions
export default reducer