import { createSlice } from "@reduxjs/toolkit"
import { io } from "socket.io-client";

const initialState = {
  socket: ""
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket(state, { payload: travelId }) {
      const data = {
        auth: { token: sessionStorage.getItem("accessToken")},
        query: { travelId },
      };
      const socket = io("http://localhost:5000/travel", data);
      state.socket = socket
    }
  }
}) 

const { actions, reducer } = socketSlice
export const { initSocket } = actions
export default reducer