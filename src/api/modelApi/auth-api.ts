import { baseApi } from "@/api/base-api";
import {
  toAuthTokens,
  type AuthUser,
  type RefreshTokenResponse,
  type SignInRequest,
  type SignInResponse,
  type SwitchRoleRequest,
  type SwitchRoleResponse,
} from "@/api/model";
import {
  authTokenChange,
  logoutUser,
  setAuthSession,
  setCurrentUser,
} from "@/store/auth/auth-slice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: "/auth/signIn",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setAuthSession({
              tokens: toAuthTokens(data.tokens),
              user: data.user ?? null,
            })
          );
        } catch {
          // Error state is surfaced by RTK Query and rendered below the form.
        }
      },
    }),

    switchRole: build.mutation<SwitchRoleResponse, SwitchRoleRequest>({
      query: (requireRole) => ({
        url: "/auth/switch-role",
        method: "POST",
        body: requireRole,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAuthSession({
              tokens: toAuthTokens(data.tokens),
              user: data.user ?? null,
            })
          );
        } catch (error) {}
      },
    }),

    refreshToken: build.mutation<RefreshTokenResponse, RefreshTokenResponse>({
      query: (refreshToken) => ({
        url: "/token/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authTokenChange(toAuthTokens(data.tokens)));
        } catch (error) {}
      },
    }),
    getCurrentUser: build.query<AuthUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch (error) {}
      },
      providesTags: ["Auth"],
    }),
    signOut: build.mutation<void, void>({
      query: () => ({
        url: "/auth/signOut",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutUser());
        } catch (error) {}
      },
    }),
  }),
});

export const { useSignInMutation, useSignOutMutation, useSwitchRoleMutation } =
  authApi;
