import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';

const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export default store;