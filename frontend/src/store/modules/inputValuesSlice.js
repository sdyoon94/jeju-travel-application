import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "api";
import axios from "axios";
import { addDays, format } from "date-fns";
// import {authHeader} from auth

// TODO: createAsyncThunk + RTK Query API

const initialState = {
  maxMemberCnt: "1",
  startDate: "",
  endDate: "",
  periodInDays: "",
  style: [0, 0, 0, 0, 0, 0, 0],
  budget: "",
  startTime: "09:00",
  endTime: "10:00",
  range: [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ],
  travelUid : null,
};


export const createTravel = createAsyncThunk(
  "inputValues/createTravel",
  async (fake, thunkAPI) => {
    const state = thunkAPI.getState();
    try {
      const response = await axios({
        method: "post",
        url: api.inputs.createTravelUrl(),
        data: {
          maxMemberCnt: Number(state.inputValues.maxMemberCnt),
          periodInDays: Number(state.inputValues.periodInDays) + 1,
          startDate:
            state.inputValues.maxMemberCnt === "1"
              ? format(state.inputValues.range[0].startDate, "yyyy-MM-dd")
              : "",
          style: state.inputValues.style.join(""),
          budget: state.inputValues.budget,
          startTime: state.inputValues.startTime,
          endTime: state.inputValues.endTime,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        }
      });
      return response.data;
    } catch (err) {
      return isRejectedWithValue(err.message)
    }
  }
);


const inputValuesSlice = createSlice({
  name: "inputValues",
  initialState,
  reducers: {
    setInputValues: (state, action) => {
      const payload = action.payload;
      state[payload[0]] = payload[1];
    },
    resetInputValues: (state) => {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTravel.fulfilled, (state, { payload }) => {
        state.travelUid = payload.tripId
      })
      .addCase(createTravel.rejected, (state, { payload }) => {
        state.travelUid = "오류가 발생 했습니다 다시 시도해주세요"
      });
  },
});

const { actions, reducer } = inputValuesSlice;

export const { setInputValues, resetInputValues } = actions;
export default reducer;
