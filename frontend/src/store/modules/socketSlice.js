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
      const socket = io("wss://i7a609.p.ssafy.io/travel", data);
      state.socket = socket
    }
  }
}) 

const { actions, reducer } = socketSlice
export const { initSocket } = actions
export default reducer