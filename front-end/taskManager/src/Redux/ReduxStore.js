import { configureStore } from '@reduxjs/toolkit';
import { getLoggedUser } from './LoggedUserSlice.js';
import LoggedUserSlice from './LoggedUserSlice.js';
import { getState } from './IsLoggedSlice.js';
import IsLoggedSlice from './IsLoggedSlice.js';
import { getStoredRole } from './ActiveRoleSlice.js';
import ActiveRoleSlice from './ActiveRoleSlice.js';

const preloadedState = {
    loggedState: getState(),
    loggedUser: getLoggedUser(),
    activeRole: getStoredRole(),
};

const reduxStore = configureStore({
    reducer: {
        loggedUser: LoggedUserSlice,
        loggedState: IsLoggedSlice,
        activeRole: ActiveRoleSlice,
    },
    preloadedState,
});

export default reduxStore;
