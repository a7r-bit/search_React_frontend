import { useEffect, useState, type PropsWithChildren } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectAuthTokens,
  selectCurrentUser,
} from "@/store/auth/auth-selectors";
import { authApi } from "@/api/modelApi/auth-api";
import { logoutUser } from "@/store/auth/auth-slice";

export function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(selectAuthTokens);
  const currentUser = useAppSelector(selectCurrentUser);
  const [loadCurrentUser] = authApi.useLazyGetCurrentUserQuery();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!tokens) {
        if (!cancelled) setIsAuthReady(true);
        return;
      }

      if (currentUser) {
        if (!cancelled) setIsAuthReady(true);
        return;
      }

      try {
        await loadCurrentUser().unwrap();
      } catch {
        dispatch(logoutUser());
      } finally {
        if (!cancelled) setIsAuthReady(true);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [currentUser, dispatch, tokens, loadCurrentUser]);

  if (!isAuthReady) return <div>Loading...</div>;

  return <>{children}</>;
}
