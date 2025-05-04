import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: localStorage.getItem('accessToken') || undefined,
    refreshToken: localStorage.getItem('refreshToken') || undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;