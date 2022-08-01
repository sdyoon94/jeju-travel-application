import { createSlice } from "@reduxjs/toolkit"

import travel from "dummies/DummyTravel.json"

// TODO: createAsyncThunk + RTK Query API

const initialState = travel

const travelSlice = createSlice({
    name: "travel",
    initialState,
    reducers: {
        getTravel(state, action) { }
    }
})

const { actions, reducer } = travelSlice

export const { getTravel } = actions
export default reducer