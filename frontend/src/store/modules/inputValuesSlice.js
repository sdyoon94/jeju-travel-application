import { formatMuiErrorMessage } from "@mui/utils";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import api from "api";
import axios from "axios";
import { addDays, format } from "date-fns";

// TODO: createAsyncThunk + RTK Query API

const initialState = {
  maxMemberCnt: "",
  startDate: "",
  endDate: "",
  periodInDays: "",
  style: [1, 1, 1, 1, 1, 1, 1],
  budget: "",
  startTime: "",
  endTime: "",
  period: "3",
  range: [
    // {
    //   startDate: new Date(),
    //   endDate: addDays(new Date(), 7),
    //   key: "selection",
    // },
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ],
};

export const createTravel = createAsyncThunk(
  "inputValues/createTravel",
  async (fake, thunkAPI) => {
    const state = thunkAPI.getState();

    // console.log(state.inputValues)
    try {
      const response = await axios({
        method: "post",
        url: api.inputs.createTravelUrl(),
        data: {
          maxMemberCnt: Number(state.inputValues.maxMemberCnt),
          periodInDays: Number(state.inputValues.periodInDays) + 1,
          startDate:
            state.inputValues.maxMemberCnt === "1"
              ? format(state.inputValues.startDate, "yyyy-MM-dd")
              : "",
          style: state.inputValues.style.join(""),
          budget: state.inputValues.budget,
          startTime: state.inputValues.startTime,
          endTime: state.inputValues.endTime,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

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
      // console.log(current(state))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTravel.fulfilled, (state, { payload }) => {
        // state.travelUid = payload.travelUid
        // console.log(payload)
      })
      .addCase(createTravel.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

const { actions, reducer } = inputValuesSlice;

export const { setInputValues } = actions;
export default reducer;
