import { configureStore, combineReducers } from "@reduxjs/toolkit"

import travelList from './modules/travelListSlice'
import auth from './modules/authSlice'
import courseList from './modules/courseListSlice'

import travel from './modules/travelSlice'
import distanceMatrix from './modules/distanceMatrixSlice'
import direction from './modules/directionSlice'

import inputValues from './modules/inputValuesSlice'

const rootReducer = combineReducers({
    travel,
    distanceMatrix,
    direction,
    travelList, 
    auth, 
    courseList,
    inputValues,

})


export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
