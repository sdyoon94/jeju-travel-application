import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	isInvited: 0,
  invitedTravelId: 0,
  inviterNickname: ""
}

const travelJoinSlice = createSlice({
  name: "travelJoin",
  initialState,
  reducers: {
    setInvited(state, { payload: { travelId, nickname } }) {
      state.isInvited++
      state.invitedTravelId = travelId
      state.inviterNickname = nickname
    },
    pollInvited(state, _) {
      state.isInvited--
      state.invitedTravelId = ""
      state.inviterNickname = ""
    }
  }
})

const { actions, reducer } = travelJoinSlice

export const { setInvited, pollInvited } = actions
export default reducer