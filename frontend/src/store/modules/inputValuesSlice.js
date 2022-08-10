import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";
import axios from "axios";
import { addDays, format } from "date-fns";


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
  // period: "3",
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
    // console.log(state);
    console.log(fake);
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
          // periodInDays: 2,
          // startTime: "17:05",
          // endTime: "17:04",
        },
      });
      // console.log("response");
      // console.log(response);
      return response.data;
    } catch (err) {
      // return thunkAPI.rejectWithValue();
    }
  }
);

// export const createTravel = createAsyncThunk(
//   "inputValues/createTravel",
//   async (thunkAPI) => {
//     const state = thunkAPI.getState();

//     try {
//       const response = await axios({
//         method: "post",
//         url: api.inputs.createTravelUrl(),
//         data: {
//           maxMemberCnt: Number(state.inputValues.maxMemberCnt),
//           periodInDays: Number(state.inputValues.periodInDays) + 1,
//           startDate:
//             state.inputValues.maxMemberCnt === "1"
//               ? format(state.inputValues.range[0].startDate, "yyyy-MM-dd")
//               : "",
//           style: state.inputValues.style.join(""),
//           budget: state.inputValues.budget,
//           startTime: state.inputValues.startTime,
//           endTime: state.inputValues.endTime,
//           // periodInDays: 2,
//           // startTime: "17:05",
//           // endTime: "17:04",
//         },
//       });
//       console.log(response.data);
//       return response.data;
//     } catch (err) {
//       console.log(err);
//       return thunkAPI.rejectWithValue();
//     }
//     console.log(state.inputValues);
//   }
// );

const inputValuesSlice = createSlice({
  name: "inputValues",
  initialState,
  reducers: {
    setInputValues: (state, action) => {
      const payload = action.payload;
      state[payload[0]] = payload[1];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTravel.fulfilled, (state, { payload }) => {
        console.log(payload);
        console.log(payload.tripId)
        console.log(state)
        state.travelUid = payload.tripId
        // console.log(state);
        // const travelId = payload.tripId;
        // const navigate = useNavigate();
        // navigate(`/travel/${travelId}`);
      })
      .addCase(createTravel.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

const { actions, reducer } = inputValuesSlice;

export const { setInputValues } = actions;
export default reducer;
