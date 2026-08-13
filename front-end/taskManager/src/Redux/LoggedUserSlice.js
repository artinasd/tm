import {createSlice} from "@reduxjs/toolkit";

const STORAGE_KEY = 'taskManagerLoggedUser';

function saveData(userObject) {
    if (userObject) localStorage.setItem(STORAGE_KEY, JSON.stringify(userObject));
    else localStorage.removeItem(STORAGE_KEY);
}

function getLoggedUser() {
    try {
        const readFile = localStorage.getItem(STORAGE_KEY);
        return readFile ? JSON.parse(readFile) : undefined;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return undefined;
    }
}

const initialState = {
    accessToken: null,
    refreshToken: null,
    userInfo: {
        email: null, accountID: null, phoneNumber: null, accountName: null,
        bio: null, picture: null, dateOfBirth: null, accountCode: null
    }
};

const LoggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState,
    reducers: {
        setLoggedUser: (_, action) => {
            saveData(action.payload);
            return action.payload;
        },
        clearLoggedUser: () => {
            saveData(null);
            return initialState;
        }
    }
});

export default LoggedUserSlice.reducer;
export const loggedUserActions = LoggedUserSlice.actions;
export {getLoggedUser};
