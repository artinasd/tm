import {createSlice} from "@reduxjs/toolkit";

const STORAGE_KEY = 'isLoggedState';

function saveData(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Boolean(state)));
}

function getState() {
    try {
        const readFile = localStorage.getItem(STORAGE_KEY);
        return readFile ? JSON.parse(readFile) : false;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return false;
    }
}

const IsLoggedSlice = createSlice({
    name: 'isLogged',
    initialState: false,
    reducers: {
        setIsLogged: (_, action) => {
            saveData(action.payload);
            return Boolean(action.payload);
        },
        clearIsLogged: () => {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }
    }
});

export default IsLoggedSlice.reducer;
export const IsLoggedUserActions = IsLoggedSlice.actions;
export {getState};
