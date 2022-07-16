import { configureStore, combineReducers } from "@reduxjs/toolkit"
import auth from './modules/auth'


const rootReducer = combineReducers({
    auth
})


export default configureStore({
    reducer: rootReducer,
})
