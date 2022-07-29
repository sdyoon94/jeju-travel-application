import { createSlice } from "@reduxjs/toolkit";


const initialState = {
}


const travelListSlice = createSlice({
  name: 'travelList',
  initialState,
  reducers: {
    createPost(state, action) {},
  },
})

const { actions, reducer } = travelListSlice
// Extract and export each action creator by name
export const { createPost } = actions
export default reducer