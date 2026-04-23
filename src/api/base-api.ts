import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import {
  toAuthTokens,
  type ApiError,
  type RefreshTokenResponse,
} from "@/api/model";
import type { RootState } from "@/app/root-reducer";
import { getEnv } from "@/lib/env";
import { authTokenChange, logoutUser } from "@/store/auth/auth-slice";

export const apiTagTypes = ["Auth", "Tree"] as const;

export type ApiTagType = (typeof apiTagTypes)[number];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getEnv().apiUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    const accessToken = (getState() as RootState).auth.tokens?.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

function toApiError(error: FetchBaseQueryError): ApiError {
  return {
    message:
      (error.data as { message: string })?.message || "Unexpected API error",
    statusCode: (error.data as { statusCode: number })?.statusCode || 500,
  };
}

const apiBaseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const requestUrl = typeof args === "string" ? args : args.url;
    const refreshToken = (api.getState() as RootState).auth.tokens
      ?.refreshToken;
    const isSignInRequest = requestUrl.includes("/auth/signIn");

    if (
      result.error.status !== 401 ||
      requestUrl.includes("refresh-token") ||
      isSignInRequest ||
      !refreshToken
    ) {
      if (result.error.status === 401 && !isSignInRequest) {
        api.dispatch(logoutUser());
      }

      return { error: toApiError(result.error) };
    }

    const refreshResult = await rawBaseQuery(
      {
        url: "/token/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(logoutUser());
      return { error: toApiError(refreshResult.error) };
    }

    const refreshData = refreshResult.data as RefreshTokenResponse;
    api.dispatch(
      authTokenChange({
        ...toAuthTokens(refreshData.tokens),
        refreshToken,
      })
    );

    const retryResult = await rawBaseQuery(args, api, extraOptions);

    if (retryResult.error) {
      return { error: toApiError(retryResult.error) };
    }

    return {
      data: retryResult.data,
      meta: retryResult.meta,
    };
  }

  return {
    data: result.data,
    meta: result.meta,
  };
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: apiBaseQuery,
  tagTypes: apiTagTypes,
  endpoints: () => ({}),
});
