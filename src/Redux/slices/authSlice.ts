import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface User {
  _id: string;
  name:string,
  email: string;
  profilePic:string;
  role:string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Export actions
export const { sLogin, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
