import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  socket: ""
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket(state, { payload }) {
      state.socket = payload
    }
  }
}) 

const { actions, reducer } = socketSlice
export const { initSocket } = actions
export default reducer