import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  token: null,
};

// Auth slice
const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogin: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    adminLogout: (state) => {
      state.token = null;
    },
  },
});

// Export actions
export const { adminLogin, adminLogout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
