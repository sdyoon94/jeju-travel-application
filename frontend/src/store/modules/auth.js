import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  token: localStorage.getItem("token") || "",
  email: "",
  nickname: ""
}


const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log('s', state)
      console.log('a', action)
    },
    signup(state, action) {},
  },
})


export const { login, signup } = loginSlice.actions
export default loginSlice.reducer