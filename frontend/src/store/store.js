import { configureStore, combineReducers } from "@reduxjs/toolkit"
import courseList from './modules/courseListSlice'

const rootReducer = combineReducers({
    courseList
})



export default configureStore({
    reducer: rootReducer,
})
