// src/store.ts
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reducer as viewReducer } from './viewSlice';
import { reducer as userReducer } from './userSlice';
import { reducer as poolReducer } from './poolSlice';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
});

const store = configureStore({
  reducer: {
    view: viewReducer,
    user: userReducer,
    pool: poolReducer
  },
  middleware: customizedMiddleware
});

export default store;