import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tripList from './modules/tripListSlice'
import travel from './modules/travelSlice'
import distanceMatrix from './modules/distanceMatrixSlice'
import distance from './modules/distanceSlice'

const rootReducer = combineReducers({
    tripList,
    travel,
    distanceMatrix,
    distance
})



export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
