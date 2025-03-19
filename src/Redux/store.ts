import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "./slices/authSlice"; 
import { combineReducers } from "redux";
import driverAuthReducer from './slices/driverAuthSlice'

const rootReducer = combineReducers({
  auth: persistReducer(
    { key: "auth", storage, whitelist: ["user", "token"] },
    authReducer
  ),
  driverAuth:persistReducer(
    {key:'driverAuth',storage, whitelist : ['driver','token']},
    driverAuthReducer
  )
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
