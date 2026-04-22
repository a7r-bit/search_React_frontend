import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { appRoutePaths } from "./paths";
import { LoginLayout } from "@/components/layout/LoginLayout";
import { LoginForm } from "@/components/features/LoginForm";
import { AppShell } from "@/components/layout/AppShell";
import { HomeHero } from "@/components/features/HomeHero";
import { SideBar } from "@/components/features/Sidebar";
export function AppRouter() {
  return (
    <Routes>
      <Route
        path={appRoutePaths.login}
        element={
          <LoginLayout>
            <LoginForm />
          </LoginLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppShell sidebar={<SideBar />}>
              <Outlet />
            </AppShell>
          }
        >
          <Route index element={<HomeHero />} />
          <Route path={appRoutePaths.dashboard.slice(1)} element={<></>} />
          <Route path={appRoutePaths.projects.slice(1)} element={<></>} />
          <Route path={appRoutePaths.analytics.slice(1)} element={<></>} />
          <Route path={appRoutePaths.settings.slice(1)} element={<></>} />
          <Route path={appRoutePaths.archive.slice(1)} element={<></>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={appRoutePaths.home} replace />} />
    </Routes>
  );
}
