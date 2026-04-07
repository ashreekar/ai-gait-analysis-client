import { configureStore } from "@reduxjs/toolkit";
import gaitReducer from "./gaitSlice";

export const store = configureStore({
  reducer: { gait: gaitReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;