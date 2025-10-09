import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Driver {
  _id: string;
  name: string;
  email: string;
}

export interface DriverAuthState {
  token?: string | null;
  driver: Driver | null;
}

const initialState: DriverAuthState = {
  token: null,
  driver: null,
};

const driverAuthSlice = createSlice({
  name: "driverAuth",
  initialState,
  reducers: {
    signUpSuccess(state, action: PayloadAction<{ driverInfo: Driver }>) {
      state.driver = action.payload.driverInfo; 
    },
    loginSuccessDriver(state, action: PayloadAction<{ token: string; driverInfo: Driver }>) {
      state.token = action.payload.token;
      state.driver = action.payload.driverInfo;
    },
    logoutDriver(state) {
      state.token = null;
      state.driver = null;
    },
  },
});

export const { signUpSuccess, loginSuccessDriver, logoutDriver } = driverAuthSlice.actions;
export default driverAuthSlice.reducer;
