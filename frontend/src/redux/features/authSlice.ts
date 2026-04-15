import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  hydrated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser }>) {
      state.user = action.payload.user;
      state.hydrated = true;
    },
    clearCredentials(state) {
      state.user = null;
      state.hydrated = true;
    },
    hydrateFromCookie(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, hydrateFromCookie } =
  authSlice.actions;

export default authSlice.reducer;
