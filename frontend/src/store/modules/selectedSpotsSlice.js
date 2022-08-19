import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  list: []
}

const selectedSpotsSlice = createSlice({
  name: "selectedSpots",
  initialState,
  reducers: {
    addSpot(state, { payload }) {
      state.list.push({
        ...payload
      })
    },
    deleteSpot(state, { payload }) {
      state.list = state.list.filter(spot => spot.placeUid !== payload)
    },
    resetSpot(state, action) {
      state.list = []
    }
  }
})

const { actions, reducer } = selectedSpotsSlice
export const { addSpot, deleteSpot, resetSpot } = actions
export default reducer