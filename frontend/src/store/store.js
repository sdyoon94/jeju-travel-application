import { configureStore, combineReducers } from "@reduxjs/toolkit"
import travelList from './modules/travelListSlice'
import auth from './modules/auth'
import courseList from './modules/courseListSlice'



const rootReducer = combineReducers({
    travelList, auth, courseList
})


export default configureStore({
    reducer: rootReducer,
})
