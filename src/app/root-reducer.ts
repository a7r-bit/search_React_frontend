import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "@/api/base-api";
import { authReducer } from "@/store/auth/auth-slice";
import { treeReducer } from "@/store/tree/tree-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  tree: treeReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
