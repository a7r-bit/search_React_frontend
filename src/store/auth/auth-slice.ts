import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthTokens, AuthUser } from "@/api/model";
import { authStorage } from "@/utils/storage";

export type AuthState = {
  readonly tokens: AuthTokens | null;
  readonly user: AuthUser | null;
};

const EMPTY_AUTH_STATE: AuthState = {
  tokens: null,
  user: null,
};


const initialState: AuthState = {
  tokens: authStorage.read(),
  user: null as AuthUser | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthSession(
      state,
      action: PayloadAction<{ tokens: AuthTokens; user?: AuthUser | null }>
    ) {
      state.tokens = action.payload.tokens;
      state.user = action.payload.user ?? null;
      authStorage.save(action.payload.tokens);
    },
    authTokenChange(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
      authStorage.save(action.payload);
    },
    setCurrentUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    logoutUser() {
      authStorage.clear();
      return EMPTY_AUTH_STATE;
    },
  },
});

export const { authTokenChange, logoutUser, setAuthSession, setCurrentUser } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
