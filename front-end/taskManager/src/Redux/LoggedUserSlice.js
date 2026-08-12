import {createSlice} from "@reduxjs/toolkit";

function saveData(userObject) {
    localStorage.setItem('taskManagerLoggedUser', JSON.stringify(userObject));
}

function getLoggedUser() {
    const readFile = localStorage.getItem('taskManagerLoggedUser');
    if (readFile) {
        return JSON.parse(readFile);
    }
}

const LoggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState: {accessToken: null, refreshToken: null,
        userInfo: {
            email: null,
            accountID: null,
            phoneNumber: null,
            accountName: null,
            bio: null,
            picture: null,
            dateOfBirth: null,
            accountCode: null
        }},
    reducers: {
        setLoggedUser: (_, action) => {
            saveData(action.payload);
            return action.payload
        }
    }
})

export default LoggedUserSlice.reducer;
export const loggedUserActions = LoggedUserSlice.actions
export {getLoggedUser}