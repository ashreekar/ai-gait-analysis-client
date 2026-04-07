import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  session: [],
  isRunning: false,
  sleep: false,
};

const gaitSlice = createSlice({
  name: "gait",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      if (state.isRunning) state.session.push(action.payload);
    },
    startSession: (state) => {
      state.isRunning = true;
      state.session = [];
    },
    stopSession: (state) => {
      state.isRunning = false;
    },
    toggleSleep: (state) => {
      state.sleep = !state.sleep;
    },
  },
});

export const { setData, startSession, stopSession, toggleSleep } = gaitSlice.actions;
export default gaitSlice.reducer;