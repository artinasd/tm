import {createSlice} from "@reduxjs/toolkit";

function saveData(state) {
    localStorage.setItem('isLoggedState', JSON.stringify(state));
}

function getState() {
    const readFile = localStorage.getItem('isLoggedState');
    if (readFile) {
        return JSON.parse(readFile)
    }
}

const IsLoggedSlice = createSlice({
    name: 'isLogged',
    initialState: false,
    reducers: {
        setIsLogged: (_, action) => {
            saveData(action.payload)
            return action.payload;
        }
    }
})

export default IsLoggedSlice.reducer;
export const IsLoggedUserActions = IsLoggedSlice.actions;
export {getState}