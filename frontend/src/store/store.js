import { configureStore, combineReducers } from "@reduxjs/toolkit"
import tripList from './modules/tripListSlice'
import auth from './modules/auth'


const rootReducer = combineReducers({
    tripList, auth
})


export default configureStore({
    reducer: rootReducer,
})
