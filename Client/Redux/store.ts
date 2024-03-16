import { configureStore } from "@reduxjs/toolkit";
import tikanheittoReducer from './tikanheittoSlice'

export const store = configureStore({
    reducer : {
        kilpailut : tikanheittoReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;