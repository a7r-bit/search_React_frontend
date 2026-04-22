import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "@/api/base-api";
import { authReducer } from "@/store/auth/auth-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
