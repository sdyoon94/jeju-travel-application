import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tripList from './modules/tripListSlice'
import auth from './modules/auth'
import courseList from './modules/courseListSlice'



const rootReducer = combineReducers({
    tripList, auth, courseList
})


export default configureStore({
    reducer: rootReducer,
})
