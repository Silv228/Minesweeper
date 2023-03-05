import { combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import reducer from "./Reducer";


let reducers = combineReducers({
    Reducer : reducer
})

let store = legacy_createStore(reducers)

export default store