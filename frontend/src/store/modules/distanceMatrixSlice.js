import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Loader } from '@googlemaps/js-api-loader'

const API_KEY = "AIzaSyA_Kp9lPUVHWZ5i3blrGYJRk8yG70ZovsM"
const TRAVEL_MODE = {
    "car": "DRIVING"
}
const loader = new Loader({
    apiKey: API_KEY,
    version: "weekly"
})

// TODO: createAsyncThunk + RTK Query API
const fetchDistanceMatrix = createAsyncThunk(
    "google/maps/api/distancematrix",
    async ({ index, vehicle, route }) => {
        console.log(index);
        console.log(vehicle);
        console.log(route);

        const google = await loader.load()

        var service = new google.maps.DistanceMatrixService()

        var origins = []
        var destinations = []

        route.forEach(place => {
            var coord = new google.maps.LatLng(place.lat, place.lng)
            origins.push(coord)
            destinations.push(coord)
        })

        var response = await service.getDistanceMatrix({
            origins,
                destinations,
                travelMode: TRAVEL_MODE[vehicle],
                unitSystem: 0,
                avoidHighways: false,
                avoidTolls: false
        })

        return response
    }
)

const initialState = {
    distanceMatrices: [],
    loading: "idle"
}

const distanceMatrixSlice = createSlice({
    name: "distanceMatrix",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDistanceMatrix.fulfilled, (state, action) => {
            state.distanceMatrices.push(action.payload)
            console.log(state.distanceMatrices);
        })
    }
})

const { actions, reducer } = distanceMatrixSlice

export { fetchDistanceMatrix }
// export const {  } = actions
export default reducer