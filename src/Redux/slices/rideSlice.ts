import { createSlice } from "@reduxjs/toolkit";

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
  rideId: undefined,
  inPayment: false,
  stripePayment: false,
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRideActive: (state, action) => {
      state.isRideActive = action.payload;
    },
    setRideInfoInSlice: (state, action) => {
      state.rideInfo = action.payload;
    },
    setPickupCoordsInSlice: (state, action) => {
      state.pickupCoords = action.payload;
    },
    setDropOffCoordsInSlice: (state, action) => {
      state.dropOffCoords = action.payload;
    },
    setRouteCoordsInSlice: (state, action) => {
      state.routeCoords = action.payload;
    },

    setDriverRouteInSlice: (state, action) => {
      state.driverRoute = action.payload;
    },

    setRemainingRouteInSlice: (state, action) => {
      state.remainingRoute = action.payload;
    },
    setRemainingDropOffRouteInSlice: (state, action) => {
      state.remainingDropOffRoute = action.payload;
    },

    setDriverLiveLocationInSlice: (state, action) => {
      state.driverLiveLocation = action.payload;
    },
    setDriverArrivedInSlice: (state, action) => {
      state.driverArrived = action.payload;
    },
    setIsToDropOffInSlice: (state, action) => {
      state.isToDropOff = action.payload;
    },
    setRideIdInSlice: (state, action) => {
      state.rideId = action.payload;
    },
    setInPaymentInSlice: (state, action) => {
      state.inPayment = action.payload;
    },
    setStripePaymentInSlice: (state, action) => {
      state.stripePayment = action.payload;
    },
    resetRide: () => {
      return initialState;
    },
  },
});

export const {
  setRideActive,
  setRideInfoInSlice,
  setPickupCoordsInSlice,
  setDropOffCoordsInSlice,
  setRouteCoordsInSlice,
  setDriverRouteInSlice,
  setRemainingRouteInSlice,
  setRemainingDropOffRouteInSlice,
  setDriverLiveLocationInSlice,
  setDriverArrivedInSlice,
  setIsToDropOffInSlice,
  resetRide,
  setInPaymentInSlice,
  setRideIdInSlice,
  setStripePaymentInSlice
} = rideSlice.actions;

export default rideSlice.reducer;

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RideInfo  } from '@/utils/socket';
// import { DriverRoute } from '@/interfaces/ride.interface';
// import { IMessage } from '@/interfaces/chat.interface';
// export interface RideState {
//   isRideActive: boolean;
//   rideInfo: RideInfo | null;
//   pickupCoords: [number, number] | null;
//   dropOffCoords: [number, number] | null;
//   routeCoords: [number, number][] | [];
//   driverRoute: DriverRoute | undefined;
//   remainingRoute: [number, number][] | [];
//   remainingDropOffRoute: [number, number][] | [];
//   driverLiveLocation: [number, number] | undefined;
//   driverArrived: boolean;
//   isToDropOff: boolean;
//   rideId: string | undefined;
//   inPayment: boolean;
//   isRateModalOpen: boolean;
//   messages: IMessage[];
//   chatOn: boolean;
// }

// const initialState: RideState = {
//   isRideActive: false,
//   rideInfo: null,
//   pickupCoords: null,
//   dropOffCoords: null,
//   routeCoords: [],
//   driverRoute: undefined,
//   remainingRoute: [],
//   remainingDropOffRoute: [],
//   driverLiveLocation: undefined,
//   driverArrived: false,
//   isToDropOff: false,
//   rideId: undefined,
//   inPayment: false,
//   isRateModalOpen: false,
//   messages: [],
//   chatOn: false,
// };

// const rideSlice = createSlice({
//   name: 'ride',
//   initialState,
//   reducers: {
//     setRideActive: (state, action: PayloadAction<boolean>) => {
//       state.isRideActive = action.payload;
//     },
//     setRideInfo: (state, action: PayloadAction<RideInfo | null>) => {
//       state.rideInfo = action.payload;
//     },
//     setPickupCoords: (state, action: PayloadAction<[number, number] | null>) => {
//       state.pickupCoords = action.payload;
//     },
//     setDropOffCoords: (state, action: PayloadAction<[number, number] | null>) => {
//       state.dropOffCoords = action.payload;
//     },
//     setRouteCoords: (state, action: PayloadAction<[number, number][] | []>) => {
//       state.routeCoords = action.payload;
//     },
//     setDriverRoute: (state, action: PayloadAction<DriverRoute | undefined>) => {
//       state.driverRoute = action.payload;
//     },
//     setRemainingRoute: (state, action: PayloadAction<[number, number][] | []>) => {
//       state.remainingRoute = action.payload;
//     },
//     setRemainingDropOffRoute: (state, action: PayloadAction<[number, number][] | []>) => {
//       state.remainingDropOffRoute = action.payload;
//     },
//     setDriverLiveLocation: (state, action: PayloadAction<[number, number] | undefined>) => {
//       state.driverLiveLocation = action.payload;
//     },
//     setDriverArrived: (state, action: PayloadAction<boolean>) => {
//       state.driverArrived = action.payload;
//     },
//     setIsToDropOff: (state, action: PayloadAction<boolean>) => {
//       state.isToDropOff = action.payload;
//     },
//     setRideId: (state, action: PayloadAction<string | undefined>) => {
//       state.rideId = action.payload;
//     },
//     setInPayment: (state, action: PayloadAction<boolean>) => {
//       state.inPayment = action.payload;
//     },
//     setIsRateModalOpen: (state, action: PayloadAction<boolean>) => {
//       state.isRateModalOpen = action.payload;
//     },
//     addMessage: (state, action: PayloadAction<IMessage>) => {
//       state.messages.push(action.payload);
//     },
//     setChatOn: (state, action: PayloadAction<boolean>) => {
//       state.chatOn = action.payload;
//     },
//     resetRide: () => initialState,
//   },
// });

// export const {
//   setRideActive,
//   setRideInfo,
//   setPickupCoords,
//   setDropOffCoords,
//   setRouteCoords,
//   setDriverRoute,
//   setRemainingRoute,
//   setRemainingDropOffRoute,
//   setDriverLiveLocation,
//   setDriverArrived,
//   setIsToDropOff,
//   setRideId,
//   setInPayment,
//   setIsRateModalOpen,
//   addMessage,
//   setChatOn,
//   resetRide
// } = rideSlice.actions;

// export default rideSlice.reducer;
