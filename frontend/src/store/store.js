import { configureStore, combineReducers } from "@reduxjs/toolkit"

import travelList from './modules/travelListSlice'
import auth from './modules/authSlice'
import courseList from './modules/courseListSlice'

import travel from './modules/travelSlice'
import distanceMatrix from './modules/distanceMatrixSlice'
import distance from './modules/distanceSlice'

import inputValues from './modules/inputValuesSlice'

const rootReducer = combineReducers({
    travel,
    distanceMatrix,
    distance,
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
