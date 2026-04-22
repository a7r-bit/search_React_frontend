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

  let currentTokens = store.getState().auth.tokens;

  store.subscribe(() => {
    const nextTokens = store.getState().auth.tokens;

    if (currentTokens === nextTokens) {
      return;
    }

    currentTokens = nextTokens;
    authStorage.save(nextTokens);
  });

  return store;
}

export const appStore = createAppStore();

export type AppStore = typeof appStore;
export type AppDispatch = AppStore["dispatch"];
