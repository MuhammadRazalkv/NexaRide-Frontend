import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "@/interfaces/chat.interface";
import { IDriverRoute, IRideReqInfo } from "@/interfaces/ride.interface";

interface DriverRideState {
  rideReqInfo?: IRideReqInfo;
  pickupCoords?: [number, number];
  dropOffCoords?: [number, number];
  routeCoords?: [number, number][];
  driverRoute?: IDriverRoute;
  dPickupIndex: number;
  dDropOffIndex: number;
  isRideStarted: boolean;
  ridePhase: "idle" | "toPickup" | "otpVerified" | "toDropOff";
  currentLoc?: [number, number];
  messages: IMessage[];
  rideId?: string;
  OTPModal: boolean;
  paymentModal: boolean;
  inPayment:boolean
}

const initialState: DriverRideState = {
  rideReqInfo: undefined,
  pickupCoords: undefined,
  dropOffCoords: undefined,
  routeCoords: [],
  driverRoute: undefined,
  dPickupIndex:0,
  dDropOffIndex:0,
  // remainingRoute: undefined,
  isRideStarted: false,
  ridePhase: "idle",
  currentLoc: undefined,
  messages: [],
  rideId: undefined,
  OTPModal: false,
  paymentModal: false,
  inPayment:false
};

const driverRideSlice = createSlice({
  name: "driverRide",
  initialState,
  reducers: {
    setDRideReqInfoInSlice: (
      state,
      action: PayloadAction<IRideReqInfo | undefined>
    ) => {
      state.rideReqInfo = action.payload;
    },
    setDRideIdInSlice: (state, action: PayloadAction<string | undefined>) => {
      state.rideId = action.payload;
    },
    setDPickupCoordsInSlice: (
      state,
      action: PayloadAction<[number, number] | undefined>
    ) => {
      state.pickupCoords = action.payload;
    },
    setDDropOffCoordsInSlice: (
      state,
      action: PayloadAction<[number, number] | undefined>
    ) => {
      state.dropOffCoords = action.payload;
    },
    setDRouteCoordsInSlice: (
      state,
      action: PayloadAction<[number, number][]>
    ) => {
      state.routeCoords = action.payload;
    },
    setDDriverRouteInSlice: (
      state,
      action: PayloadAction<IDriverRoute | undefined>
    ) => {
      state.driverRoute = action.payload;
    },
    setDPickupIndex: (state, action: PayloadAction<number>) => {
      state.dPickupIndex = action.payload;
    },
    setDDropOffIndex: (state, action: PayloadAction<number>) => {
      state.dDropOffIndex = action.payload;
    },
    setDIsRideStartedInSlice: (state, action: PayloadAction<boolean>) => {
      state.isRideStarted = action.payload;
    },
    setDRidePhaseInSlice: (
      state,
      action: PayloadAction<"idle" | "toPickup" | "otpVerified" | "toDropOff">
    ) => {
      state.ridePhase = action.payload;
    },
    setDCurrentLocInSlice: (
      state,
      action: PayloadAction<[number, number] | undefined>
    ) => {
      state.currentLoc = action.payload;
    },
    setDMessagesInSlice: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    addDMessageInSlice: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    openOTPModal: (state, action: PayloadAction<boolean>) => {
      state.OTPModal = action.payload;
    },
    openPaymentModal: (state, action: PayloadAction<boolean>) => {
      state.paymentModal = action.payload;
    },
    setInPayment: (state, action: PayloadAction<boolean>) => {
      state.inPayment = action.payload;
    },
    resetDriverRideInSlice: () => initialState,
  },
});

export const {
  setDRideReqInfoInSlice,
  setDPickupCoordsInSlice,
  setDDropOffCoordsInSlice,
  setDRouteCoordsInSlice,
  setDDriverRouteInSlice,
  setDDropOffIndex,
  setDPickupIndex,
  setDIsRideStartedInSlice,
  setDRidePhaseInSlice,
  setDCurrentLocInSlice,
  setDMessagesInSlice,
  addDMessageInSlice,
  resetDriverRideInSlice,
  setDRideIdInSlice,
  openOTPModal,
  openPaymentModal,
  setInPayment
} = driverRideSlice.actions;

export default driverRideSlice.reducer;
