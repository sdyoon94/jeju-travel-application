import { createSlice } from "@reduxjs/toolkit";


const initialState = []

const selectedSpotsSlice = createSlice({
  name: "selectedSpotSlices",
  initialState,
  reducers: {
    addSpot(state, { payload }) {
      state.push(payload)
    },
    deleteSpot(state, { payload }) {
      return state.filter(spot => spot.uid !==  payload)
    }
  }
})

const { actions, reducer } = selectedSpotsSlice
export const { addSpot, deleteSpot } = actions
export default reducer