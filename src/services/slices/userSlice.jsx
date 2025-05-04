import { createSlice } from "@reduxjs/toolkit";

export const selectedUserSlice = createSlice({
  name: 'selectedStudent',
  initialState: {
    value: localStorage.getItem('selectedStudent') ? JSON.parse(localStorage.getItem('selectedStudent')) : null,
  },
  reducers: {
    setSelectedUser(state, action) {
      state.value = action.payload;
      localStorage.setItem('selectedStudent', JSON.stringify(action.payload))
    },
    clearSelectedUser(state) {
      state.value = null;
      localStorage.removeItem('selectedStudent');
    }
  },
});

export const { setSelectedUser } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;
