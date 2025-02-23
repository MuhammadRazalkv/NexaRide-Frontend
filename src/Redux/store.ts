import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import authReducer from "./slices/authSlice"; // Import the auth reducer
import { combineReducers } from "redux";

// Combine reducers (if you have multiple slices)
const rootReducer = combineReducers({
  auth: persistReducer(
    { key: "auth", storage, whitelist: ["user", "token"] },
    authReducer
  ),
});

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

// Persistor instance
export const persistor = persistStore(store);

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
