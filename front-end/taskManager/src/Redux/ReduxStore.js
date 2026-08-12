import {configureStore} from "@reduxjs/toolkit";
import {getLoggedUser} from "./LoggedUserSlice.js";
import LoggedUserSlice from "./LoggedUserSlice.js";
import {getState} from "./IsLoggedSlice.js";
import IsLoggedSlice from "./IsLoggedSlice.js";

const preloadedState = {
    loggedState: getState(),
    loggedUser: getLoggedUser()
}

const reduxStore = configureStore({
    reducer: {loggedUser: LoggedUserSlice, loggedState: IsLoggedSlice},
    preloadedState
})

export default reduxStore