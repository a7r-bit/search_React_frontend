import type { RootState } from "@/app/root-reducer";

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthTokens = (state: RootState) => state.auth.tokens;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) =>
  state.auth.tokens?.accessToken ?? null;
export const selectRefreshToken = (state: RootState) =>
  state.auth.tokens?.refreshToken ?? null;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.tokens !== null;
