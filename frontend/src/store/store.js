import { configureStore, combineReducers } from "@reduxjs/toolkit"

import travelList from './modules/travelListSlice'
import auth from './modules/authSlice'

import travel from './modules/travelSlice'
import distanceMatrix from './modules/distanceMatrixSlice'
import direction from './modules/directionSlice'

import selectedSpots from "./modules/selectedSpotsSlice"
import inputValues from './modules/inputValuesSlice'

import travelJoin from "./modules/travelJoinSlice"

const rootReducer = combineReducers({
    travel,
    distanceMatrix,
    direction,
    travelList, 
    auth, 
    selectedSpots,
    inputValues,
    travelJoin,
})


export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
