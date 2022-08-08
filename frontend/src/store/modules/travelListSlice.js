import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "api"
import axios from "axios"


const initialState = {
  userUid: "",
  travelList: []
}

export const getTravelInfo = createAsyncThunk(
  "travelList/getInfo",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState()
    try {
      const response = await axios({
        method: "get",
        url: api.travel.getTravelInfoUrl(),
        headers: state.auth.authHeader
      })
      return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue()
    }
  }
)

const travelListSlice = createSlice({
  name: 'travelList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getTravelInfo.fulfilled, (state, { payload }) => {
      state.userUid = payload.userUid
      state.travelList = payload.tripList
    })
  }
})

const { actions, reducer } = travelListSlice
export const { createPost } = actions
export default reducer