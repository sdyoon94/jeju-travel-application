import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "api"
import axios from "axios"


const initialState = {
  token: sessionStorage.getItem("token") || "",
  nickname: sessionStorage.getItem("nickname") || "",
  profileImg: sessionStorage.getItem("image_path") || "",
  id: sessionStorage.getItem("id") || "",
  error: null,
}

export const editNickname = createAsyncThunk(
  "auth/editNickname",
  async (newNickname, thunkAPI) => {
    try {
      const response = await axios({
        method: "patch",
        url: api.accounts.editNicknameUrl(),
        data: {nickname: newNickname}
      })
      return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue('no')
    }
  }
)

export const editProfileImg = createAsyncThunk(
  "auth/editProfileImg",
  async (formdata, thunkAPI) => {
    console.log('사진')
    const state = thunkAPI.getState()
    try {
      const response = await axios({
        method:"post",
        url: api.accounts.editProfileImgUrl(state.auth.id),
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formdata
      })
      console.log('프사 변경', response)
      return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (thunkAPI) => {
    try {
      const response = await axios({
        method: "post",
        url: api.accounts.logoutUrl()
      })
      return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const signout = createAsyncThunk(
  "auth/signout",
  async (thunkAPI) => {
    try {
      const response = await axios({
        method: "delete",
        url: api.accounts.signoutUrl()
      })
      console.log(response)
      return response.data
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)


const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }) {
      state.nickname = payload.nickname
      state.profileImg = payload.image_path
      state.id = payload.id
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(editProfileImg.fulfilled, (state, { payload }) => {
      console.log('비동기 결과', {payload})
    })
    .addCase(editProfileImg.rejected, (state, { payload }) => {
      state.error = payload
    })
    .addCase(editNickname.fulfilled, (state, { payload }) => {
      state.nickname = payload.nickname
      sessionStorage.setItem("nickname", payload.nickname)
    })
    .addCase(editNickname.rejected, (state, {payload}) => {
      console.log('실패', payload)
    })
    .addCase(logout.fulfilled, (state, { payload }) => {
      sessionStorage.clear()
    })
    .addCase(signout.fulfilled, (state, { payload }) => {
      sessionStorage.clear()
    })
  }
})

const { actions, reducer } = loginSlice
export const { login } = actions
export default reducer