import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import { combineReducers } from "redux";
import driverAuthReducer from "./slices/driverAuthSlice";
import rideReducer from "./slices/rideSlice";
import driverRideSlice from './slices/driverRideSlice'
import adminAuthReducer from "@/redux/slices/adminAuthSlice";
const rootReducer = combineReducers({
  auth: persistReducer(
    { key: "auth", storage, whitelist: ["user", "token"] },
    authReducer
  ),
  driverAuth: persistReducer(
    { key: "driverAuth", storage, whitelist: ["driver", "token"] },
    driverAuthReducer
  ),
  adminAuth: persistReducer(
    { key: "adminAuth", storage, whitelist: ["token"] },
    adminAuthReducer
  ),
  ride: persistReducer(
    {
      key: "ride",
      storage,
      whitelist: [
        "isRideActive",
        "rideInfo",
        "pickupCoords",
        "dropOffCoords",
        "routeCoords",
        "driverRoute",
        "remainingRoute",
        "remainingDropOffRoute",
        "driverArrived",
        "rideId",
        "inPayment",
        'stripePayment',
        'rideCompleted'
      ],
    },
    rideReducer
  ),
  DRide: persistReducer(
    {
      key: "dRide",
      storage,
      whitelist: [
        "isRideStarted",
        "rideReqInfo",
        "pickupCoords",
        "dropOffCoords",
        "routeCoords",
        "driverRoute",
        "remainingRoute",
        "remainingDropOffRoute",
        "ridePhase",
        "rideId",
        "inPayment",
        "currentLoc",
        'OTPModal'
      ],
    },
    driverRideSlice
  ),
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
