import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { AuthState } from "./slices/authSlice";
import { combineReducers } from "redux";
import driverAuthReducer, { DriverAuthState } from "./slices/driverAuthSlice";
import rideReducer, { UserRideState } from "./slices/rideSlice";
import driverRideSlice, { DriverRideState } from "./slices/driverRideSlice";
import adminAuthReducer, {
  AdminAuthState,
} from "@/redux/slices/adminAuthSlice";
import { PersistPartial } from "redux-persist/es/persistReducer";
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
        "stripePayment",
        "rideCompleted",
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
        "OTPModal",
        "dPickupIndex",
        "dDropOffIndex",
        "inPayment",
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
export interface RootState {
  auth: AuthState & PersistPartial;
  driverAuth: DriverAuthState & PersistPartial;
  adminAuth: AdminAuthState & PersistPartial;
  ride: UserRideState & PersistPartial;
  DRide: DriverRideState & PersistPartial;
}
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
