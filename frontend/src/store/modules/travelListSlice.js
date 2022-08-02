import { createSlice } from "@reduxjs/toolkit";
import travelList from "dummies/travelList.json"

const initialState = travelList


const travelListSlice = createSlice({
  name: 'travelList',
  initialState,
  reducers: {
    createPost(state, action) {},
  },
})

const { actions, reducer } = travelListSlice
export const { createPost } = actions
export default reducer