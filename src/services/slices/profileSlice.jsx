import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : null,
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
            localStorage.setItem('userProfile', JSON.stringify(action.payload)); // Save the profile to localStorage
        },
        clearProfile: (state) => {
            state.profile = null;
            localStorage.removeItem('userProfile'); // Clear the profile from localStorage
        },
    },
});

export const { setProfile, clearProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;