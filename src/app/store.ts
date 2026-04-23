import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/api/base-api";
import { rootReducer } from "@/app/root-reducer";
import { authStorage } from "@/utils/storage";

export function createAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  store.subscribe(() => {
    const nextTokens = store.getState().auth.tokens;

    if (nextTokens) {
      authStorage.save(nextTokens);
    } else {
      authStorage.clear();
    }
  });

  return store;
}

export const appStore = createAppStore();

export type AppStore = typeof appStore;
export type AppDispatch = AppStore["dispatch"];
