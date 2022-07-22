import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tripList from './modules/tripListSlice'

const rootReducer = combineReducers({
    tripList
})



export default configureStore({
    reducer: rootReducer,
})
