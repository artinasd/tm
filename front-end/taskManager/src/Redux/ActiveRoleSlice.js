import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'taskManagerActiveRole';

function getStoredRole() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? JSON.parse(value) : null;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function saveRole(role) {
    if (role) localStorage.setItem(STORAGE_KEY, JSON.stringify(role));
    else localStorage.removeItem(STORAGE_KEY);
}

const ActiveRoleSlice = createSlice({
    name: 'activeRole',
    initialState: getStoredRole(),
    reducers: {
        setActiveRole: (_, action) => {
            saveRole(action.payload);
            return action.payload;
        },
        clearActiveRole: () => {
            saveRole(null);
            return null;
        },
    },
});

export default ActiveRoleSlice.reducer;
export const activeRoleActions = ActiveRoleSlice.actions;
export { getStoredRole };
