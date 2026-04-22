import type { AuthTokens } from "@/api/model";

const TOKEN_KEY = "auth-tokens";
export const authStorage = {
  save(tokens: AuthTokens) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },
  read(): AuthTokens | null {
    const storedValue = localStorage.getItem(TOKEN_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
