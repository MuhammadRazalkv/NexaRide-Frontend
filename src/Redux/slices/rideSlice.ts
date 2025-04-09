import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isRideActive: false,
  rideInfo: null,
  pickupCoords: null,
  dropOffCoords: null,
  routeCoords: [],
  driverRoute: undefined,
  remainingRoute: [],
  remainingDropOffRoute: [],
  driverLiveLocation: undefined,
  driverArrived: false,
  isToDropOff: false,
  rideId:undefined,
  inPayment:false
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRideActive: (state, action) => {
      state.isRideActive = action.payload;
    },
    setRideInfo: (state, action) => {
      state.rideInfo = action.payload;
    },
    setPickupCoords: (state, action) => {
      state.pickupCoords = action.payload;
    },
    setDropOffCoords: (state, action) => {
      state.dropOffCoords = action.payload;
    },
    setRouteCoords: (state, action) => {
      state.routeCoords = action.payload;
    },
    setDriverRoute: (state, action) => {
      state.driverRoute = action.payload;
    },
    setRemainingRoute: (state, action) => {
      state.remainingRoute = action.payload;
    },
    setRemainingDropOffRoute: (state, action) => {
      state.remainingDropOffRoute = action.payload;
    },
    setDriverLiveLocation: (state, action) => {
      state.driverLiveLocation = action.payload;
    },
    setDriverArrived: (state, action) => {
      state.driverArrived = action.payload;
    },
    setIsToDropOff: (state, action) => {
      state.isToDropOff = action.payload;
    },
    setRideIdInSlice:(state,action)=>{
      state.rideId = action.payload
    },
    setInPayment:(state,action)=>{
      state.inPayment = action.payload
    },
    resetRide: () => {
      return initialState;
    }
  }
});

export const {
  setRideActive,
  setRideInfo,
  setPickupCoords,
  setDropOffCoords,
  setRouteCoords,
  setDriverRoute,
  setRemainingRoute,
  setRemainingDropOffRoute,
  setDriverLiveLocation,
  setDriverArrived,
  setIsToDropOff,
  resetRide,
  setInPayment,
  setRideIdInSlice
} = rideSlice.actions;

export default rideSlice.reducer;