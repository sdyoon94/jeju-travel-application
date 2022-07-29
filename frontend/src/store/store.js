import { configureStore, combineReducers } from "@reduxjs/toolkit"
import travelList from './modules/travelListSlice'
import auth from './modules/auth'


const rootReducer = combineReducers({
    travelList, auth
})


export default configureStore({
    reducer: rootReducer,
})
