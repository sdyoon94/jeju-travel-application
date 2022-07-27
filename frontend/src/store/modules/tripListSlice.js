import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [{'title': '여행제목1', 'date': '07/21~07/28', 'person': 3}, {'title': '여행제목 2', 'date': '07/23~07/30', 'person': 33}]
}


const tripListSlice = createSlice({
  name: 'tripList',
  initialState,
  reducers: {
    createPost(state, action) {},
  },
})

const { actions, reducer } = tripListSlice
// Extract and export each action creator by name
export const { createPost } = actions
export default reducer