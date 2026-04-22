import { useAppSelector } from "@/hooks/redux";
import { selectIsAuthenticated } from "@/store/auth/auth-selectors";
import { Navigate, Outlet, useLocation } from "react-router";
import { appRoutePaths } from "./paths";

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return (
      <Navigate to={appRoutePaths.login} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
}
