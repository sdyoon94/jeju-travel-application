import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { api } from "api"
import axios from "axios"


const initialState = {
  token: localStorage.getItem("token") || "",
  email: "",
  nickname: "진오",
  error: null,
}


export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (code, thunkAPI) => {
    try {
      const response = await axios.get(`http://i7a609.p.ssafy.io:8081/api/oauth/kakao/login?code=${code}`)
      return response.data
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
  )
  
  
  const loginSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchLogin.fulfilled, (state, { payload }) => {
        // payload에 token, email, nickname
        state.token = payload.token
        state.email = payload.email
        state.nickname = payload.nickname
        localStorage.setItem("token", payload.token)
      })
      .addCase(fetchLogin.rejected, (state, { payload }) => {
        state.error = payload
      })
  }
})


export default loginSlice.reducer