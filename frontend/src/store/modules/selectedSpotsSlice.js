import { createSlice } from "@reduxjs/toolkit";


const initialState = []

const selectedSpotsSlice = createSlice({
  name: "selectedSpotSlices",
  initialState,
  reducers: {
    addSpot(state, { payload }) {
      state.push({
        ...payload,
        stayTime: 60
      })
    },
    deleteSpot(state, { payload }) {
      return state.filter(spot => spot.placeUid !==  payload)
    },
    resetSpot(state, action) {
      return []
    }
  }
})

const { actions, reducer } = selectedSpotsSlice
export const { addSpot, deleteSpot, resetSpot } = actions
export default reducer