import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "api"
import axios from "axios"
import jwt_decode from "jwt-decode"


const initialState = {
  token: sessionStorage.getItem("accessToken") || "",
  nickname: sessionStorage.getItem("nickname") || "",
  profileImg: sessionStorage.getItem("image_path") || "",
  id: sessionStorage.getItem("id") || "",
  error: null,
}

export const editNickname = createAsyncThunk(
  "auth/editNickname",
  async (newNickname, {getState, rejectWithValue}) => {
    try {
      const response = await axios({
        method: "patch",
        url: api.accounts.editNicknameUrl(),
        data: {nickname: newNickname},
        headers: {
          Authorization: `Bearer ${getState().auth.token}`
        }
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response)
    }
  }
)

export const editProfileImg = createAsyncThunk(
  "auth/editProfileImg",
  async (formdata, {getState, rejectWithValue}) => {
    try {
      const response = await axios({
        method:"post",
        url: api.accounts.editProfileImgUrl(),
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${getState().auth.token}`
        },
        data: formdata
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (payload, {getState, rejectWithValue}) => {
    try {
      const response = await axios({
        method: "post",
        url: api.accounts.logoutUrl(),
        headers: {
          Authorization: `Bearer ${getState().auth.token}`
        }
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const signout = createAsyncThunk(
  "auth/signout",
  async (payload, {getState, rejectWithValue}) => {
    try {
      const response = await axios({
        method: "delete",
        url: api.accounts.signoutUrl(),
        headers: {
          Authorization: `Bearer ${getState().auth.token}`
        }
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }) {
      const accessToken = payload
      
      const decoded = jwt_decode(accessToken)

      state.token = accessToken
      sessionStorage.setItem("accessToken", accessToken)
      state.nickname = decoded.nickname
      sessionStorage.setItem("nickname", decoded.nickname)
      state.id = decoded.id
      sessionStorage.setItem("id", decoded.id)
      state.profileImg = decoded.image_path
      sessionStorage.setItem("image_path", decoded.image_path)
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    },
    setToken(state, { payload }) {
      state.token = payload.accessToken
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(editProfileImg.fulfilled, (state, { payload }) => {
      state.profileImg = payload.image_path
      sessionStorage.setItem("image_path", payload.image_path)
    })
    .addCase(editProfileImg.rejected, (state, { payload }) => {
      state.error = payload
    })
    .addCase(editNickname.fulfilled, (state, { payload }) => {
      state.nickname = payload.nickname
      sessionStorage.setItem("nickname", payload.nickname)
    })
    .addCase(editNickname.rejected, (state, {payload}) => {
      state.error = payload
    })
    .addCase(logout.fulfilled, (state, { payload }) => {
      sessionStorage.clear()
    })
    .addCase(logout.rejected, (state, {payload}) => {
      state.error = payload
    })
    .addCase(signout.fulfilled, (state, { payload }) => {
      sessionStorage.clear()
    })
  }
})

const { actions, reducer } = authSlice
export const { login, setToken } = actions
export default reducer