import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { api } from "api"
// import axios from "axios"


const initialState = {
  token: localStorage.getItem("token") || "",
  email: "",
  nickname: ""
}


// const fetchLogin = createAsyncThunk(
//   "users/fetchLogin",
//   async (code) => {
//     const response = await axios.get("http://i7a609.p.ssafy.io:8081/api/oauth/kakao/login?code=0h1O6iTuaw2ieiZhgr6-gh4dzI35KVdpzPlTkT1dC0LPxyga2Y5-ideRVQHN0yJ_HOVjkgopyNkAAAGCPdQD1A")
//     console.log(response)
//   }
// )


const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {

    },
    signup(state, action) {},
  },
})


export const { login, signup } = loginSlice.actions
export default loginSlice.reducer