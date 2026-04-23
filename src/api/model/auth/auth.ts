// API Models
export type SignInRequest = {
  readonly username: string;
  readonly password: string;
};

export type SignInResponse = {
  readonly tokens: AuthTokensApi;
  readonly user?: AuthUser | null;
};

export type RefreshTokenResponse = {
  readonly tokens: AuthTokensApi;
};

// State Models
export type AuthTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export type AuthUser = {
  readonly id: string;
  readonly uidNumber: string;
  readonly firstName: string;
  readonly middleName: string;
  readonly activeRole: string;
  readonly roles: string[];
};

export type AuthTokensApi = {
  readonly access_token: string;
  readonly refresh_token: string;
};

export function toAuthTokens(tokens: AuthTokensApi): AuthTokens {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
}
