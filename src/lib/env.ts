type AppEnv = {
  readonly apiUrl: string;
  readonly tokenStorageKey: string;
};

export function getEnv(): AppEnv {
  return {
    apiUrl: import.meta.env.VITE_API_URL,
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY ?? 'auth-tokens',
  };
}
