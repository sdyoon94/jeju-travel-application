import { createSlice } from "@reduxjs/toolkit";

// TODO: createAsyncThunk + RTK Query API

const initialState = {
  maxMemberCnt: "",
  startDate: "",
  endDate: "",
  periodInDays: '',
  style: "abcd",
  budget: "",
  startTime: "",
  endTime: "",
};
const inputValuesSlice = createSlice({
  name: "inputValues",
  initialState,
  reducers: {
    setInputValues: (state, action) => {
      // console.log(action)
      // console.log(action.payload)
      // console.log(state)
      // const newState = action.payload
      // state = {...state, ...newState}

      const payload = action.payload;
      state[payload[0]] = payload[1];
      // console.log(action.payload[0]);
      // console.log(action.payload[1]);
      // console.log(typeof action.payload[1]);
      // console.log(state.budget);

      // console.log(action.payload)
      // console.log(state)
      // console.log(state.maxMemberCnt)
      // console.log(state.inputValuesSlice)
    },
  },
});

const { actions, reducer } = inputValuesSlice;

export const { setInputValues } = actions;
export default reducer;
